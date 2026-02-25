import { Navbar } from "@/components/Navbar";
import { Nfc, QrCode, Smartphone, BarChart2, Link2, Palette, Globe, ShieldCheck } from "lucide-react";

const recursos = [
  {
    icon: Nfc,
    titulo: "Tecnologia NFC",
    texto: "Compartilhe seu perfil com um simples toque. Sem apps, sem complicação. Basta aproximar o celular.",
  },
  {
    icon: QrCode,
    titulo: "QR Code Exclusivo",
    texto: "Cada cartão possui um QR Code único e personalizado que direciona diretamente ao seu perfil digital.",
  },
  {
    icon: Smartphone,
    titulo: "Perfil Digital",
    texto: "Monte seu perfil com foto, links, redes sociais, produtos e muito mais. Tudo em uma única página.",
  },
  {
    icon: BarChart2,
    titulo: "Analytics de Cliques",
    texto: "Saiba quantas pessoas acessaram seu perfil, quais links clicaram e de onde vieram.",
  },
  {
    icon: Link2,
    titulo: "Link na Bio Ilimitado",
    texto: "Adicione quantos links quiser: redes sociais, portfólio, loja, WhatsApp e muito mais.",
  },
  {
    icon: Palette,
    titulo: "Personalização Total",
    texto: "Escolha cores, fundos, layout e deixe seu cartão com a sua identidade visual.",
  },
  {
    icon: Globe,
    titulo: "Acesso Universal",
    texto: "Seu perfil funciona em qualquer dispositivo, navegador e sistema operacional.",
  },
  {
    icon: ShieldCheck,
    titulo: "Segurança Garantida",
    texto: "Dados protegidos com criptografia. Você tem controle total sobre o que é exibido.",
  },
];

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="pt-32 pb-24 px-4">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 border border-[#1ccec8]/20 rounded-full bg-[#1ccec8]/5 backdrop-blur-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1ccec8]">
              Tudo que você precisa
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            NOSSOS <br />
            <span className="text-[#1ccec8] drop-shadow-[0_0_30px_rgba(28,206,200,0.4)]">
              RECURSOS
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Ferramentas poderosas para você se conectar, impressionar e crescer profissionalmente.
          </p>
        </div>

        {/* GRID */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recursos.map((recurso, idx) => (
            <div
              key={idx}
              className="bg-[#0a0a0a] border border-white/5 hover:border-[#1ccec8]/30 rounded-[1.5rem] p-8 transition-all hover:shadow-[0_0_30px_rgba(28,206,200,0.08)] group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1ccec8]/10 flex items-center justify-center mb-5 group-hover:bg-[#1ccec8]/20 transition">
                <recurso.icon className="w-5 h-5 text-[#1ccec8]" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tighter mb-2">
                {recurso.titulo}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {recurso.texto}
              </p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}