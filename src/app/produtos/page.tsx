"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  CreditCard, Smartphone, Monitor, QrCode, Nfc,
  User, Link as LinkIcon, Circle, Palette, MapPin,
  Zap, ShieldCheck, Check
} from 'lucide-react';

const produtos = [
  {
    id: "cartao",
    nome: "Integrety Tag",
    subtitulo: "Formato Cartão",
    preco: "97",
    highlight: false,
    badge: null,
    desconto: null,
    precoOriginal: null,
    features: [
      { icon: CreditCard, text: "Cartão NFC em PVC Premium preto" },
      { icon: QrCode, text: "QR Code 100% personalizado" },
      { icon: Nfc, text: "Chip NFC integrado" },
      { icon: User, text: "Perfil digital personalizável" },
      { icon: LinkIcon, text: "Link na Bio ilimitado" },
    ],
  },
  {
    id: "celular",
    nome: "Integrety Tag",
    subtitulo: "Para Celular",
    preco: "97",
    highlight: false,
    badge: null,
    desconto: null,
    precoOriginal: null,
    features: [
      { icon: Circle, text: "Tag circular NFC para celular" },
      { icon: Palette, text: "Design exclusivo padrão wave" },
      { icon: User, text: "100% personalizado" },
      { icon: Smartphone, text: "Compatível com todos os smartphones" },
      { icon: MapPin, text: "Fixação premium" },
    ],
  },
  {
    id: "display",
    nome: "Display",
    subtitulo: "Personalizado Premium",
    preco: "167",
    precoOriginal: "197",
    highlight: true,
    badge: "MAIS VENDIDO",
    desconto: "15% OFF",
    features: [
      { icon: Monitor, text: "Display NFC de mesa premium" },
      { icon: Palette, text: "Acabamento dourado nas bordas" },
      { icon: QrCode, text: "QR Code e NFC integrados" },
      { icon: MapPin, text: "Perfeito para balcões e lojas" },
      { icon: Zap, text: "Ativação instantânea" },
    ],
  },
];

export default function ProdutosPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-32 pb-24 px-4">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 border border-[#1ccec8]/20 rounded-full bg-[#1ccec8]/5 backdrop-blur-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1ccec8]">
              Tecnologia NFC de última geração
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            ESCOLHA SUA <br />
            <span className="text-[#1ccec8] drop-shadow-[0_0_30px_rgba(28,206,200,0.4)]">
              EXPERIÊNCIA
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Produtos 100% personalizados. Conecte-se com um toque e impressione onde estiver.
          </p>
        </div>

        {/* GRID DE PRODUTOS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-500 group hover:scale-[1.02] ${
                produto.highlight
                  ? "bg-gradient-to-b from-[#1ccec8]/10 to-transparent border-[#1ccec8]/40 shadow-[0_0_60px_rgba(28,206,200,0.15)]"
                  : "bg-[#0a0a0a] border-white/5 hover:border-[#1ccec8]/30 hover:shadow-[0_0_40px_rgba(28,206,200,0.08)]"
              }`}
            >
              {/* BADGE MAIS VENDIDO */}
              {produto.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1ccec8] text-black text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-full whitespace-nowrap">
                  ⭐ {produto.badge}
                </div>
              )}

              {/* BADGE DESCONTO */}
              {produto.desconto && (
                <div className="absolute top-6 right-6 bg-green-500 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  {produto.desconto}
                </div>
              )}

              {/* NOME */}
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#1ccec8] mb-1">
                  {produto.nome}
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white leading-tight">
                  {produto.subtitulo}
                </h2>
              </div>

              {/* PREÇO */}
              <div className="flex items-end gap-2 mb-8">
                <div>
                  {produto.precoOriginal && (
                    <span className="block text-xs text-gray-500 line-through mb-1">
                      R$ {produto.precoOriginal},00
                    </span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-400 font-bold">R$</span>
                    <span className="text-5xl font-black tracking-tighter text-white">
                      {produto.preco}
                    </span>
                    <span className="text-sm text-gray-400 font-bold">,00</span>
                  </div>
                </div>
              </div>

              {/* FEATURES */}
              <ul className="space-y-3 mb-10 flex-1">
                {produto.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-[#1ccec8]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#1ccec8]" />
                    </div>
                    {feature.text}
                  </li>
                ))}
              </ul>

              {/* BOTÃO */}
              <Link href={`/checkout?produto=${produto.id}`}>
                <button
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] ${
                    produto.highlight
                      ? "bg-[#1ccec8] hover:bg-[#18b5b0] text-black shadow-[0_0_30px_rgba(28,206,200,0.3)]"
                      : "bg-white/5 hover:bg-[#1ccec8] hover:text-black text-white border border-white/10 hover:border-[#1ccec8]"
                  }`}
                >
                  ADQUIRIR AGORA
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* TRUST SIGNALS */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/5 pt-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-[#1ccec8]" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white">Compra 100% Segura</p>
              <p className="text-xs text-gray-500 mt-1">Dados protegidos e criptografados</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Zap className="w-7 h-7 text-[#1ccec8]" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white">Ativação Instantânea</p>
              <p className="text-xs text-gray-500 mt-1">Receba e ative em segundos</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <CreditCard className="w-7 h-7 text-[#1ccec8]" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white">Parcelamento em 12x</p>
              <p className="text-xs text-gray-500 mt-1">Pix, cartão ou boleto</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}