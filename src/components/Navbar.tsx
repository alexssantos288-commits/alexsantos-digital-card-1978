import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
          INTEGRETY<span className="text-[#1ccec8]">TAG</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#recursos" className="text-sm font-bold uppercase tracking-wider hover:text-[#1ccec8] transition">
            Recursos
          </Link>
          <Link href="#precos" className="text-sm font-bold uppercase tracking-wider hover:text-[#1ccec8] transition">
            Preços
          </Link>
          <Link href="/auth/login" className="text-sm font-bold uppercase tracking-wider hover:text-[#1ccec8] transition">
            Login
          </Link>
          <Link 
            href="/auth/register" 
            className="bg-[#1ccec8] hover:bg-[#18b5b0] text-black text-xs font-black uppercase tracking-wider px-6 py-3 rounded-full transition-all hover:scale-105"
          >
            Cadastrar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};