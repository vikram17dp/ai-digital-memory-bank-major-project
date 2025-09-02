
// app/page.tsx
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        ></div>
        {/* Scattered dots */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-1 h-1 bg-purple-400 rounded-full opacity-40"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-indigo-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-32 left-40 w-1 h-1 bg-purple-400 rounded-full opacity-35"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-indigo-400 rounded-full opacity-40"></div>
          <div className="absolute top-60 left-60 w-1 h-1 bg-purple-400 rounded-full opacity-25"></div>
          <div className="absolute bottom-60 right-60 w-1 h-1 bg-indigo-400 rounded-full opacity-30"></div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-8 min-h-screen">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Digital Memory Bank
              </h1>
              <p className="text-xl text-slate-700 leading-relaxed max-w-lg font-light">
                Store, search, and interact with your memories using advanced AI technology. Transform how you capture and retrieve your most important moments.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                <span className="text-lg font-light">Semantic search powered by AI</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                <span className="text-lg font-light">Secure and private memory storage</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                <span className="text-lg font-light">Intelligent memory organization</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sign In Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-100 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-cyan-700 mb-2">Welcome Back</h2>
                  <p className="text-slate-600 font-light">Access your digital memory bank</p>
                </div>

                <div className="space-y-4">
                  <SignUpButton mode="modal">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] focus:scale-[0.98]"
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-purple-200 hover:border-purple-300 text-slate-700 hover:text-slate-800 font-medium rounded-xl bg-white/50 hover:bg-white/80 shadow-sm hover:shadow-md transform transition-all duration-300 hover:scale-[1.02] focus:scale-[0.98]"
                      size="lg"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500 font-light">Secure • Private • AI-Powered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Logos */}
      <div className="absolute bottom-6 left-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">N</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-700"></div>
      </div>
    </div>
  );
}
