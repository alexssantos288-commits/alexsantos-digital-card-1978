"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Smartphone, Palette, Share2, Zap, ShieldCheck, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      <Navbar />

      <main className="relative pt-24 sm:pt-32">

        {/* HERO */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 sm:mb-8 border border-[#1ccec8]/20 rounded-full bg-[#1ccec8]/5 backdrop-blur-sm animate-bounce cursor-default">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1ccec8]">
              Networking Inteligente
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 sm:mb-8">
            O FUTURO DO <br />
            <span className="text-[#1ccec8] drop-shadow-[0_0_30px_rgba(28,206,200,0.3)]">
              NETWORKING
            </span>{" "}
            <br />
            É DIGITAL
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 font-medium leading-relaxed px-2">
            Substitua cartões de papel por uma experiência tecnológica única.
            Conecte-se com um toque e impressione seus clientes.
          </p>

          <a
            href="https://api.whatsapp.com/send?phone=5532991806474"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-12 sm:mb-20"
          >
            <Button className="bg-[#1ccec8] hover:bg-[#18b5b0] text-black text-xs sm:text-sm font-black uppercase tracking-[0.2em] px-8 py-5 sm:px-12 sm:py-8 rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(28,206,200,0.2)]">
              QUERO MEU INTEGRETY TAG
            </Button>
          </a>

              {/* VIDEO */}
              <div className="w-full max-w-3xl mx-auto mb-12 sm:mb-20 px-2">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(28,206,200,0.15)]">
              <video
                src="/video.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-auto rounded-[2rem]"
              />
            </div>
          </div>

          {/* SLIDER MARQUEE */}
          <div className="relative flex overflow-x-hidden border-y border-white/5 py-6 sm:py-10 bg-black/20 backdrop-blur-sm">
            <div className="flex animate-marquee whitespace-nowrap gap-10 sm:gap-20 items-center">
              {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((i, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 sm:gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#1ccec8]/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#1ccec8] rounded-full" />
                  </div>
                  <span className="font-black text-base sm:text-xl tracking-tighter uppercase">
                    Parceiro {i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CARDS DE RECURSOS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

            <div className="p-6 sm:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 transition-all group">
              <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-[#1ccec8] mb-4 sm:mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-2 sm:mb-3">Mobile First</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Design otimizado para todos os dispositivos.</p>
            </div>

            <div className="p-6 sm:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 transition-all group">
              <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-[#1ccec8] mb-4 sm:mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-2 sm:mb-3">Personalização</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Cores, fontes e layouts com a sua cara.</p>
            </div>

            <div className="p-6 sm:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 transition-all group">
              <Share2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#1ccec8] mb-4 sm:mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-2 sm:mb-3">Compartilhe Fácil</h3>
              <p className="text-gray-500 text-sm leading-relaxed">NFC, QR Code ou link direto.</p>
            </div>

            <div className="p-6 sm:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 transition-all group">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-[#1ccec8] mb-4 sm:mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-2 sm:mb-3">Atualização Real</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Mudou os dados? Atualize em segundos.</p>
            </div>

            <div className="p-6 sm:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 transition-all group">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#1ccec8] mb-4 sm:mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-2 sm:mb-3">Seguro e Privado</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Você controla quem vê suas informações.</p>
            </div>

            <div className="p-6 sm:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 transition-all group">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-[#1ccec8] mb-4 sm:mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-2 sm:mb-3">Analytics</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Saiba quantos salvaram seu contato.</p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}