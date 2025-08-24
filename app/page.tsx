import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const user = await currentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-12 max-w-lg w-full text-center relative">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-30 animate-pulse"></div>
        
        {/* Main content */}
        <div className="relative">
          <h1 className="text-5xl font-black mb-6 text-glow">
            AI Memory Bank
          </h1>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            Store, search, and interact with your memories using AI-powered semantic search
          </p>
          
          <div className="space-y-5">
            <SignUpButton mode="modal">
              <Button className="btn-primary w-full h-14 text-lg font-semibold rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105" size="lg">
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </SignUpButton>
            
            <SignInButton mode="modal">
              <Button 
                variant="outline" 
                className="w-full h-14 text-lg font-semibold rounded-xl bg-transparent border-2 border-green-500/30 text-white hover:bg-green-500/10 hover:border-green-500/60 transition-all duration-300"
                size="lg"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mt-12 text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Fast Search</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Smart Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
