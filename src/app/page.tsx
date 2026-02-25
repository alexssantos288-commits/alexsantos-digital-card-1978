"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Palette, Link2, QrCode, ShoppingBag, FileText, BarChart3,
  Nfc, WifiOff, FileDown,
} from "lucide-react";

// ─── SEÇÃO: POSSIBILIDADES ───────────────────────────
const funcionalidades = [
  {
    id: "personalizacao",
    icone: Palette,
    label: "Livre Personalização",
    titulo: "Livre Personalização",
    descricao: "Personalize seu perfil digital com cores, fontes, fundos e layouts exclusivos. Deixe seu cartão com a sua identidade visual e impressione quem receber seu contato.",
    imagem: "/preview-personalizacao.png",
  },
  {
    id: "links",
    icone: Link2,
    label: "Links Ilimitados",
    titulo: "Links Ilimitados",
    descricao: "Compartilhe e cadastre quantos links desejar — redes sociais, sites ou botões de direcionamento. Reordene conforme sua preferência e muito mais.",
    imagem: "/preview-links.png",
  },
  {
    id: "pix",
    icone: QrCode,
    label: "Cobre com PIX",
    titulo: "Cobre com PIX",
    descricao: "Com a ferramenta de PIX você pode gerar cobranças instantâneas através do seu perfil e compartilhar de forma ilimitada. Seja por QR Code ou chave PIX.",
    imagem: "/preview-pix.png",
  },
  {
    id: "catalogo",
    icone: ShoppingBag,
    label: "Criação de Catálogo",
    titulo: "Criação de Catálogo",
    descricao: "Cadastre quantos produtos ou serviços quiser. Defina título, descrição, preço, fotos e um botão de ação. Todos os campos são opcionais.",
    imagem: "/preview-catalogo.png",
  },
  {
    id: "formulario",
    icone: FileText,
    label: "Formulário de Contato",
    titulo: "Formulário de Contato",
    descricao: "Crie e gerencie formulários de captação de contatos diretamente pelo sistema. Visualize datas, filtre registros por data e exporte dados para planilha.",
    imagem: "/preview-formulario.png",
  },
  {
    id: "painel",
    icone: BarChart3,
    label: "Painel para Empresas",
    titulo: "Painel para Empresas",
    descricao: "Gerencie múltiplos perfis, acompanhe métricas, visualize acessos e tenha controle total da sua equipe e presença digital em um só lugar.",
    imagem: "/preview-painel.png",
  },
];

// ─── SEÇÃO: FORMAS DE COMPARTILHAR ──────────────────
const compartilhar = [
  {
    id: "aproximacao",
    icone: Nfc,
    label: "Aproximação",
    titulo: "Aproximação",
    descricao: "O chip dentro do Integrety Tag é responsável pelo funcionamento da aproximação. Funciona tanto para Android quanto para iPhone e não é necessário baixar nenhum aplicativo.",
    imagem: "/share-aproximacao.png",
  },
  {
    id: "qrcode",
    icone: QrCode,
    label: "QR Code",
    titulo: "QR Code",
    descricao: "Gere um QR Code exclusivo do seu perfil e utilize ele sempre que quiser — em cartões impressos, banners, apresentações e muito mais.",
    imagem: "/share-qrcode.png",
  },
  {
    id: "offline",
    icone: WifiOff,
    label: "QR Code Offline",
    titulo: "QR Code Offline",
    descricao: "O QR Code offline, ao ser lido, salva o contato direto na agenda com nome, e-mail, telefone e o link do seu perfil. Funciona sem internet em eventos superlotados.",
    imagem: "/share-offline.png",
  },
  {
    id: "pdf",
    icone: FileDown,
    label: "PDF",
    titulo: "PDF",
    descricao: "Baixe uma versão em PDF do seu perfil e compartilhe o arquivo mesmo off-line. Perfeito para enviar por e-mail ou apresentar em reuniões.",
    imagem: "/share-pdf.png",
  },
];

export default function Home() {
  const [ativo, setAtivo] = useState(funcionalidades[0]);
  const [ativoCompartilhar, setAtivoCompartilhar] = useState(compartilhar[0]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      <Navbar />

      <main className="relative pt-24 sm:pt-32">

        {/* ─── HERO ─────────────────────────────────── */}
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
            className="inline-block mb-10 sm:mb-14"
          >
            <Button className="bg-[#1ccec8] hover:bg-[#18b5b0] text-black text-xs sm:text-sm font-black uppercase tracking-[0.2em] px-8 py-5 sm:px-12 sm:py-8 rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(28,206,200,0.2)]">
              QUERO MEU INTEGRETY TAG
            </Button>
          </a>

          {/* VIDEO */}
          <div className="w-full max-w-md mx-auto mb-16 sm:mb-24 px-2">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(28,206,200,0.15)]">
              <video
                src="/video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto rounded-[2rem]"
              />
            </div>
          </div>
        </section>

        {/* ─── POSSIBILIDADES ───────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              OPÇÕES DE MUDANÇA <br />
              <span className="text-[#1ccec8]">NO PERFIL</span>
            </h2>
            <p className="text-gray-400 text-base">Interaja com os botões abaixo:</p>
          </div>

          <div className="border border-white/10 rounded-[2rem] bg-[#0a0a0a] p-4 sm:p-6 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {funcionalidades.map((item) => {
                const Icon = item.icone;
                const isAtivo = ativo.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAtivo(item)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                      isAtivo
                        ? "bg-[#1ccec8] text-black"
                        : "bg-white/5 hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-white/10 rounded-[2rem] bg-[#0a0a0a] p-8 sm:p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-auto flex-shrink-0 flex justify-center">
                <div className="w-[220px] sm:w-[260px] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(28,206,200,0.15)]">
                  <img
                    src={ativo.imagem}
                    alt={ativo.titulo}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/cartao.png";
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-4">
                  {ativo.titulo}
                </h3>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                  {ativo.descricao}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SLIDER MARQUEE ───────────────────────── */}
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

        {/* ─── FORMAS DE COMPARTILHAR ───────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">

          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-3">
              OPÇÕES PARA  <span className="text-[#1ccec8]">COMPARTILHAR</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Interaja com os botões abaixo:
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden">

            {/* BOTÕES */}
            <div className="flex flex-wrap gap-2 p-4 sm:p-6 border-b border-white/5">
              {compartilhar.map((item) => {
                const Icon = item.icone;
                const isAtivo = ativoCompartilhar.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAtivoCompartilhar(item)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isAtivo
                        ? "bg-[#1ccec8] text-black"
                        : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* PREVIEW */}
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 p-8 sm:p-12">

              {/* CELULAR */}
              <div className="flex-shrink-0 flex justify-center">
                <div className="w-[200px] sm:w-[240px] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(28,206,200,0.12)]">
                  <img
                    src={ativoCompartilhar.imagem}
                    alt={ativoCompartilhar.titulo}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/cartao.png";
                    }}
                  />
                </div>
              </div>

              {/* TEXTO */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-4 text-white">
                  {ativoCompartilhar.titulo}
                </h3>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg">
                  {ativoCompartilhar.descricao}
                </p>
              </div>

            </div>
          </div>

        </section>

      </main>
    </div>
  );
}