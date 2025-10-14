// test-connection.js - Verify Supabase database setup
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Testing Supabase Database Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('   ✅ Connected to database');
    console.log('   📅 Server time:', result[0].current_time);

    // Test 2: Check Memory table exists
    console.log('\n2️⃣ Checking Memory table...');
    const count = await prisma.memory.count();
    console.log(`   ✅ Memory table found with ${count} records`);

    // Test 3: Test creating a memory (then delete it)
    console.log('\n3️⃣ Testing memory creation...');
    const testMemory = await prisma.memory.create({
      data: {
        userId: 'test-user-' + Date.now(),
        content: 'Test memory to verify database setup',
        tags: ['test', 'setup'],
        mood: 'neutral',
      }
    });
    console.log('   ✅ Successfully created test memory:', testMemory.id);

    // Clean up test memory
    await prisma.memory.delete({
      where: { id: testMemory.id }
    });
    console.log('   🧹 Cleaned up test memory');

    // Test 4: Database info
    console.log('\n4️⃣ Database information:');
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `;
    console.log('   📊 Database:', dbInfo[0].database);
    console.log('   👤 User:', dbInfo[0].user);
    console.log('   🔧 Version:', dbInfo[0].version.split(' ')[0] + ' ' + dbInfo[0].version.split(' ')[1]);

    console.log('\n✅ All tests passed! Your database is ready to use.');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Open: http://localhost:3000');
    console.log('   3. Start creating memories!\n');

  } catch (error) {
    console.error('\n❌ Database test failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Check if your Supabase project is active');
      console.error('   - Verify DATABASE_URL and DIRECT_URL in .env');
      console.error('   - Make sure your database password is correct');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
