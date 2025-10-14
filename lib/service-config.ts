// Enhanced service configuration and utilities
export const SERVICE_CONFIG = {
  // API timeouts
  ML_BACKEND_TIMEOUT: 10000, // 10 seconds
  HUGGING_FACE_TIMEOUT: 15000, // 15 seconds
  S3_UPLOAD_TIMEOUT: 30000, // 30 seconds
  OCR_TIMEOUT: 20000, // 20 seconds
  
  // Retry configurations
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 second base delay
  
  // Circuit breaker settings
  FAILURE_THRESHOLD: 3,
  RECOVERY_TIMEOUT: 60000, // 1 minute
  
  // Feature flags
  ENABLE_ML_BACKEND: process.env.NODE_ENV !== 'production' || process.env.ENABLE_ML_BACKEND === 'true',
  ENABLE_HUGGING_FACE: true,
  ENABLE_FALLBACKS: true,
  
  // Service URLs
  ML_BACKEND_URL: process.env.ML_BACKEND_URL || 'http://localhost:8000',
  
  // Database settings
  MAX_DB_RETRY_ATTEMPTS: 3,
  DB_RETRY_DELAY: 2000,
}

// Service health tracking
export class ServiceHealthTracker {
  private static instance: ServiceHealthTracker;
  private healthStatus = new Map<string, { healthy: boolean; lastCheck: number; failureCount: number }>();
  
  static getInstance(): ServiceHealthTracker {
    if (!ServiceHealthTracker.instance) {
      ServiceHealthTracker.instance = new ServiceHealthTracker();
    }
    return ServiceHealthTracker.instance;
  }
  
  isServiceHealthy(serviceName: string): boolean {
    const status = this.healthStatus.get(serviceName);
    if (!status) return true; // Assume healthy if no data
    
    const now = Date.now();
    if (now - status.lastCheck > SERVICE_CONFIG.RECOVERY_TIMEOUT) {
      // Reset after recovery timeout
      status.failureCount = 0;
      status.healthy = true;
    }
    
    return status.healthy && status.failureCount < SERVICE_CONFIG.FAILURE_THRESHOLD;
  }
  
  recordSuccess(serviceName: string) {
    const status = this.healthStatus.get(serviceName) || { healthy: true, lastCheck: 0, failureCount: 0 };
    status.healthy = true;
    status.failureCount = 0;
    status.lastCheck = Date.now();
    this.healthStatus.set(serviceName, status);
  }
  
  recordFailure(serviceName: string) {
    const status = this.healthStatus.get(serviceName) || { healthy: true, lastCheck: 0, failureCount: 0 };
    status.failureCount++;
    status.lastCheck = Date.now();
    
    if (status.failureCount >= SERVICE_CONFIG.FAILURE_THRESHOLD) {
      status.healthy = false;
      console.warn(`Service ${serviceName} marked as unhealthy after ${status.failureCount} failures`);
    }
    
    this.healthStatus.set(serviceName, status);
  }
  
  getServiceStatus(serviceName: string) {
    return this.healthStatus.get(serviceName) || { healthy: true, lastCheck: 0, failureCount: 0 };
  }
}

// Enhanced error handling utilities
export class ServiceError extends Error {
  constructor(
    message: string,
    public serviceName: string,
    public errorCode?: string,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  serviceName: string,
  maxRetries: number = SERVICE_CONFIG.MAX_RETRIES
): Promise<T> {
  const healthTracker = ServiceHealthTracker.getInstance();
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      healthTracker.recordSuccess(serviceName);
      return result;
    } catch (error) {
      console.warn(`${serviceName} attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt === maxRetries) {
        healthTracker.recordFailure(serviceName);
        throw new ServiceError(
          `${serviceName} failed after ${maxRetries + 1} attempts: ${error.message}`,
          serviceName,
          error.code,
          false
        );
      }
      
      // Exponential backoff
      const delay = SERVICE_CONFIG.RETRY_DELAY * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Retry loop completed without success or failure');
}

// Validation utilities
export function validateEnvironment() {
  const required = ['DATABASE_URL', 'CLERK_SECRET_KEY'];
  const optional = ['HUGGING_FACE_API_KEY', 'ML_BACKEND_URL', 'AWS_ACCESS_KEY_ID'];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  const warnings = optional.filter(key => !process.env[key]);
  if (warnings.length > 0) {
    console.warn(`Optional environment variables not set: ${warnings.join(', ')}`);
    console.warn('Some features may not work as expected.');
  }
  
  return {
    mlBackendAvailable: !!process.env.ML_BACKEND_URL,
    huggingFaceAvailable: !!process.env.HUGGING_FACE_API_KEY,
    awsAvailable: !!process.env.AWS_ACCESS_KEY_ID,
    databaseAvailable: !!process.env.DATABASE_URL
  };
}

// Request logging utility
export function createRequestLogger(requestId: string) {
  return {
    info: (message: string, data?: any) => {
      console.log(`[${requestId}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    },
    warn: (message: string, data?: any) => {
      console.warn(`[${requestId}] WARNING: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    },
    error: (message: string, error?: any) => {
      console.error(`[${requestId}] ERROR: ${message}`, error);
    }
  };
}

// Startup health check
export async function performStartupHealthChecks() {
  console.log('Performing startup health checks...');
  
  const env = validateEnvironment();
  const healthTracker = ServiceHealthTracker.getInstance();
  
  // Check database connection
  try {
    const { prisma } = await import('./prisma');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    healthTracker.recordFailure('database');
  }
  
  // Check ML backend if available
  if (env.mlBackendAvailable && SERVICE_CONFIG.ENABLE_ML_BACKEND) {
    try {
      const response = await fetch(`${SERVICE_CONFIG.ML_BACKEND_URL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        console.log('✅ ML backend service available');
      } else {
        throw new Error(`ML backend returned ${response.status}`);
      }
    } catch (error) {
      console.warn('⚠️ ML backend service unavailable:', error.message);
      healthTracker.recordFailure('ml-backend');
    }
  }
  
  console.log('Health checks completed');
  return env;
}
