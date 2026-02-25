"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/recursos", label: "Recursos" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/produtos", label: "Produtos" },
  { href: "/contato", label: "Fale Conosco" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

        <Link href="/" className="text-lg sm:text-2xl font-black uppercase tracking-tighter">
          INTEGRETY<span className="text-[#1ccec8]">TAG</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-wider hover:text-[#1ccec8] transition"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="bg-[#1ccec8] hover:bg-[#18b5b0] text-black text-xs font-black uppercase tracking-wider px-6 py-3 rounded-full transition-all hover:scale-105"
          >
            Entrar
          </Link>
        </div>

        <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-wider hover:text-[#1ccec8] transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="bg-[#1ccec8] text-black text-xs font-black uppercase tracking-wider px-6 py-3 rounded-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            Entrar
          </Link>
        </div>
      )}
    </nav>
  );
};