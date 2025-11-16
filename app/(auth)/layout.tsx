import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode;
}

const Authlayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050816] via-[#050816] to-[#111827] text-slate-50 flex items-center justify-center px-4 py-10">
      {/* Background grid + orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] bg-[size:24px_24px] opacity-40" />
        <div className="absolute -left-40 top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Hero section */}
        <section className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            AI Digital Memory Bank
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Store your mind.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
                Search your memories.
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Store, search, and interact with your memories using advanced AI technology.
              Transform how you capture and retrieve the moments that matter most.
            </p>
          </div>

          <ul className="space-y-3 text-sm text-slate-200">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-emerald-400" />
              <span>
                <span className="font-medium text-slate-50">Semantic search powered by AI</span>
                <span className="block text-slate-300">Find memories by meaning, not just keywords.</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-400" />
              <span>
                <span className="font-medium text-slate-50">Secure & private memory storage</span>
                <span className="block text-slate-300">Backed by modern auth and encrypted cloud storage.</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-violet-400" />
              <span>
                <span className="font-medium text-slate-50">Intelligent organization</span>
                <span className="block text-slate-300">Tags, sentiment, and trends auto-generated for you.</span>
              </span>
            </li>
          </ul>

          <div className="hidden text-xs text-slate-400 sm:flex sm:items-center sm:gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-[10px] font-semibold">N</span>
            <span>Secure • Private • AI‑powered</span>
          </div>
        </section>

        {/* Auth card (Clerk children) */}
        <section className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-6">
            <div className="mb-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Welcome Back</p>
              <p className="mt-1 text-sm text-slate-300">Access your digital memory bank.</p>
            </div>
            {children}
            <p className="mt-4 text-center text-[11px] text-slate-500">
              Secure • Private • AI‑powered
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Authlayout
