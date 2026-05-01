import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-200">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      
      <div className="z-10 flex flex-col items-center justify-center p-8 max-w-3xl text-center space-y-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 backdrop-blur-3xl">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          Next.js + Prisma + PostgreSQL
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Build Faster. <br /> Scale Better.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Your full-stack application is ready. We have pre-configured Next.js App Router, Prisma ORM, and PostgreSQL for you. 
          Start building your amazing product right away.
        </p>
        
        <div className="flex gap-4 pt-4">
          <Link 
            href="/api/users"
            className="group relative inline-flex items-center justify-center rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-400 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]"
          >
            Test API Route
            <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <a
            href="https://www.prisma.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-8 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800"
          >
            Prisma Docs
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-sm text-slate-500">
        Engineered with ❤️ using Antigravity
      </div>
    </main>
  );
}
