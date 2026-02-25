import { Navbar } from "@/components/Navbar";
import { Nfc, Shield, Zap, Heart } from "lucide-react";

const valores = [
  {
    icon: Nfc,
    titulo: "Inovação",
    texto: "Usamos a tecnologia NFC mais avançada para conectar pessoas de forma simples e elegante.",
  },
  {
    icon: Shield,
    titulo: "Confiança",
    texto: "Cada produto é testado e aprovado antes de chegar às suas mãos. Qualidade é inegociável.",
  },
  {
    icon: Zap,
    titulo: "Agilidade",
    texto: "Da compra à ativação, tudo acontece de forma rápida e sem complicação.",
  },
  {
    icon: Heart,
    titulo: "Propósito",
    texto: "Acreditamos que uma boa primeira impressão pode abrir portas que nenhum currículo abre.",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="pt-32 pb-24 px-4">

        {/* HERO */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 border border-[#1ccec8]/20 rounded-full bg-[#1ccec8]/5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1ccec8]">
              Nossa história
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            SOBRE A <br />
            <span className="text-[#1ccec8] drop-shadow-[0_0_30px_rgba(28,206,200,0.4)]">
              INTEGRETY
            </span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Nascemos em Juiz de Fora com um objetivo simples: transformar a forma como profissionais
            e empresas se apresentam ao mundo. Com tecnologia e Soluções que funcionam de verdade!,
            criamos conexões que ficam na memória. 
            
            A Integrety acredita que a internet oferece um leque de oportunidades para empresas de 
            todos os portes e para profissionais de todas as áreas. Com a evolução natural do ambiente digital,
            abre-se uma ampla gama de possibilidades para quem deseja expandir seus negócios, 
            fortalecer sua presença online e captar novos leads de forma estratégica. 
            Pensando nisso, a Integrety propõe soluções inovadoras alinhadas a esse novo cenário, 
            desenvolvendo estratégias personalizadas para quem busca crescimento consistente e melhoria contínua.
          </p>
        </div>
          
        {/* MISSÃO */}
        <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10 sm:p-16 text-center mb-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#1ccec8] mb-4">
            Nossa Missão
          </p>
          <blockquote className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-tight text-white">
            "Fazer com que cada profissional tenha uma{" "}
            <span className="text-[#1ccec8]">presença digital poderosa</span>{" "}
            ao alcance de um toque."
          </blockquote>
        </div>

        {/* VALORES */}
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-10">
            Nossos Valores
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {valores.map((valor, idx) => (
              <div
                key={idx}
                className="bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 rounded-[1.5rem] p-8 transition-all hover:shadow-[0_0_30px_rgba(28,206,200,0.08)] group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1ccec8]/10 flex items-center justify-center mb-5 group-hover:bg-[#1ccec8]/20 transition">
                  <valor.icon className="w-5 h-5 text-[#1ccec8]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter mb-2">
                  {valor.titulo}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {valor.texto}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center mt-20">
          <p className="text-gray-400 text-base mb-6">
            Pronto para fazer parte dessa revolução?
          </p>
          <a
            href="/produtos"
            className="inline-block bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-widest px-10 py-4 rounded-full transition-all hover:scale-105 text-sm"
          >
            CONHECER OS PRODUTOS
          </a>
        </div>

      </main>
    </div>
  );
}