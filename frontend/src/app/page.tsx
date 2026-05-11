import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 p-4 h-full items-center justify-center relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
          Instant.<span className="text-[var(--brand-blue)]">Utilities</span>
        </h1>
        <p className="text-sm font-medium text-[var(--text3)] mt-1">Platform migration starting...</p>
      </div>
      
      <div className="w-full max-w-sm flex flex-col gap-3">
        <Link href="/login" className="w-full">
          <button className="w-full p-3 text-sm font-semibold border-none rounded-[var(--radius)] cursor-pointer transition-all duration-150 bg-[var(--text)] text-white hover:opacity-90">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}
