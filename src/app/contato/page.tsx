"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Send, MessageCircle, Mail, User, Phone } from "lucide-react";

export default function ContatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mensagem = `Olá! Vim pelo site da Integrety Tag! 👋

*Nome:* ${nome}
*E-mail:* ${email}
*Telefone:* ${telefone}

*Mensagem:*
${descricao}`;

    const url = `https://wa.me/5532991806474?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="pt-32 pb-24 px-4">

        {/* HEADER */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-block px-4 py-1.5 mb-6 border border-[#1ccec8]/20 rounded-full bg-[#1ccec8]/5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1ccec8]">
              Atendimento Personalizado
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            FALE <br />
            <span className="text-[#1ccec8] drop-shadow-[0_0_30px_rgba(28,206,200,0.4)]">
              CONOSCO
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Preencha o formulário abaixo e entraremos em contato via WhatsApp o mais rápido possível.
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 sm:p-12 space-y-6"
        >

          {/* NOME */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              <User className="w-3 h-3" /> Nome completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome"
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:border-[#1ccec8] transition text-sm text-white placeholder:text-gray-600 min-h-[48px]"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              <Mail className="w-3 h-3" /> E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:border-[#1ccec8] transition text-sm text-white placeholder:text-gray-600 min-h-[48px]"
            />
          </div>

          {/* TELEFONE */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              <Phone className="w-3 h-3" /> Telefone / WhatsApp
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              placeholder="(32) 99999-9999"
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:border-[#1ccec8] transition text-sm text-white placeholder:text-gray-600 min-h-[48px]"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              <MessageCircle className="w-3 h-3" /> Mensagem
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={5}
              placeholder="Como podemos te ajudar?"
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:border-[#1ccec8] transition text-sm text-white placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bc59] text-black font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:scale-[1.02] text-sm min-h-[52px]"
          >
            <Send className="w-4 h-4" />
            ENVIAR VIA WHATSAPP
          </button>

          <p className="text-center text-xs text-gray-600">
            Ao enviar, você será redirecionado para o WhatsApp com a mensagem preenchida.
          </p>
        </form>

      </main>
    </div>
  );
}