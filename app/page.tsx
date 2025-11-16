"use client"

import { useEffect } from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050816] via-[#050816] to-[#020617] text-slate-50">
      {/* Background grid + glow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] bg-[size:28px_28px] opacity-40" />
        <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10 lg:px-10">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Left: Hero copy */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              AI Digital Memory Bank
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
                  Store, search & relive
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  your smartest memories.
                </span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base">
                <span className="text-violet-200">Store, search, and interact</span> with your memories using advanced AI technology.
                Transform how you capture and retrieve your most important moments.
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-100">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-emerald-400" />
                <span>
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent font-semibold">
                    Semantic search powered by AI
                  </span>
                  <span className="block text-slate-200">Find memories by meaning & mood, not just keywords.</span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-400" />
                <span>
                  <span className="bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent font-semibold">
                    Secure and private memory storage
                  </span>
                  <span className="block text-slate-200">Protected by modern authentication and encrypted cloud storage.</span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-violet-400" />
                <span>
                  <span className="bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent font-semibold">
                    Intelligent memory organization
                  </span>
                  <span className="block text-slate-200">AI-generated tags, sentiment and trends keep everything organised.</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-[10px] font-semibold">
                N
              </span>
              <span>Secure • Private • AI‑powered</span>
            </div>
          </motion.section>

          {/* Right: Auth CTA (Clerk buttons unchanged) */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md">
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.85)] backdrop-blur-2xl sm:p-7">
                <div className="mb-6 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Welcome Back</p>
                  <p className="mt-2 text-sm text-slate-300">Access your digital memory bank.</p>
                </div>

                <div className="space-y-4">
                  <SignUpButton mode="modal">
                    <Button
                      className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 text-sm font-medium text-white shadow-[0_18px_45px_rgba(88,28,135,0.8)] transition-all duration-300 hover:shadow-[0_22px_60px_rgba(88,28,135,0.95)] hover:brightness-110 focus:scale-[0.98]"
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-900/60 text-sm font-medium text-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.8)] transition-all duration-300 hover:border-slate-500 hover:bg-slate-900 hover:text-slate-50 focus:scale-[0.98]"
                      size="lg"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </div>

                <div className="mt-5 text-center text-[11px] text-slate-500">
                  Secure • Private • AI‑Powered
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
