import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 h-[100dvh] w-full items-center justify-center overflow-hidden bg-black">
      
      {/* Background Hero Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src="/hero.png" 
          alt="Smart Building Complex"
          fill
          priority
          className="object-cover opacity-60"
        />
        {/* Deep vignette/overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto p-8 rounded-[var(--radius-lg)] bg-black/40 backdrop-blur-xl border border-solid border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center">
        
        <div className="text-center mb-8">
          <h1 className="text-[40px] md:text-[48px] font-extrabold tracking-tight text-white mb-2 leading-none">
            Instant.<span className="bg-gradient-to-r from-[var(--brand-blue)] to-[#00f0ff] bg-clip-text text-transparent">Utilities</span>
          </h1>
          <p className="text-[16px] font-medium text-[var(--text2)] mt-3 max-w-[300px] mx-auto leading-relaxed">
            The intelligent operating system for modern property management.
          </p>
        </div>
        
        <div className="w-full flex flex-col gap-4 mt-4">
          <Link href="/login" className="w-full group">
            <button className="w-full p-4 text-[15px] font-bold tracking-wide border border-solid border-[var(--brand-blue)] rounded-[var(--radius)] cursor-pointer transition-all duration-300 bg-[var(--brand-blue)] text-white shadow-[0_0_20px_rgba(0,122,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] group-hover:scale-[1.02] active:scale-[0.98]">
              Sign In to Dashboard
            </button>
          </Link>
          
          <div className="w-full text-center mt-4">
            <div className="text-[12px] text-[var(--text3)] uppercase tracking-widest font-bold">Secure • Real-Time • Seamless</div>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}
