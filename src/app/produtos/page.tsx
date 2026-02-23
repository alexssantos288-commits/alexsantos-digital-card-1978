"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";

const products = [
  {
    id: "standard",
    name: "Integrety Standard",
    price: "97",
    description: "Ideal para profissionais autônomos e networking ágil.",
    features: [
      "Cartão NFC em PVC Premium",
      "Perfil Digital Personalizável",
      "Link na Bio Ilimitado",
      "Suporte via E-mail",
    ],
    highlight: false,
    icon: <Zap className="w-6 h-6 text-[#1ccec8]" />,
  },
  {
    id: "premium",
    name: "Integrety Black Edition",
    price: "197",
    description: "O auge da exclusividade. Acabamento fosco e recursos VIP.",
    features: [
      "Cartão NFC Black Matte",
      "Analytics Avançado de Cliques",
      "Galeria de Produtos/Fotos",
      "Suporte Prioritário WhatsApp",
      "Selo de Perfil Verificado",
    ],
    highlight: true,
    icon: <Crown className="w-6 h-6 text-yellow-400" />,
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="pt-32 pb-20 px-4">
        {/* HEADER DA PÁGINA */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24">
          <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            ESCOLHA SUA <br />
            <span className="text-[#1ccec8] drop-shadow-[0_0_20px_rgba(28,206,200,0.4)]">EXPERIÊNCIA</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Selecione a Integrety Tag que mais combina com seu estilo de negócios. 
            Tecnologia NFC de última geração.
          </p>
        </div>

        {/* GRID DE PRODUTOS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={`relative p-8 sm:p-12 rounded-[2.5rem] border transition-all duration-500 group ${
                product.highlight
                  ? "bg-gradient-to-b from-[#1ccec8]/10 to-transparent border-[#1ccec8]/30 shadow-[0_0_50px_rgba(28,206,200,0.1)]"
                  : "bg-[#0a0a0a] border-white/5 hover:border-white/20"
              }`}
            >
              {product.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1ccec8] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  MAIS VENDIDO
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="mb-4">{product.icon}</div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
                    {product.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500 font-bold uppercase">R$</span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tighter ml-1">
                    {product.price}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed">
                {product.description}
              </p>

              <ul className="space-y-4 mb-10">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-[#1ccec8]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#1ccec8]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/checkout" className="block">
                <Button 
                  className={`w-full py-8 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] ${
                    product.highlight
                      ? "bg-[#1ccec8] hover:bg-[#18b5b0] text-black shadow-[0_0_30px_rgba(28,206,200,0.3)]"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  ADQUIRIR AGORA
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FOOTER DE CONFIANÇA */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/5 pt-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Compra 100% Segura</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Zap className="w-6 h-6 text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Ativação Instantânea</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <CreditCard className="w-6 h-6 text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Parcelamento em até 12x</span>
          </div>
        </div>
      </main>
    </div>
  );
}