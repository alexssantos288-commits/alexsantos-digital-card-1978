"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="max-w-md w-full text-center">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
        {/* ÍCONE DE SUCESSO */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-500" />
        </div>

        {/* TÍTULO */}
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
          PAGAMENTO <span className="text-[#1ccec8]">CONFIRMADO!</span>
        </h1>

        {/* MENSAGEM */}
        <p className="text-gray-400 mb-6">
          Seu pagamento foi processado com sucesso! 🎉
        </p>

        {/* AVISO IMPORTANTE */}
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-200 mb-2">
            ⚠️ <strong>IMPORTANTE:</strong>
          </p>
          <p className="text-xs text-gray-300">
            Por enquanto, você precisa ir ao <strong>admin</strong> para gerar a chave manualmente.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            (O envio automático será configurado no deploy!)
          </p>
        </div>

        {/* EMAIL */}
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-6">
          <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-300">
            📧 Em produção, você receberá sua <strong className="text-white">chave de acesso</strong> por email!
          </p>
        </div>

        {/* PRÓXIMOS PASSOS */}
        <div className="text-left bg-white/5 rounded-lg p-4 mb-6">
          <p className="text-sm font-bold text-white mb-3">Para testar agora:</p>
          <ol className="text-sm text-gray-400 space-y-2">
            <li>1️⃣ Acesse o painel admin</li>
            <li>2️⃣ Gere uma chave com seu email</li>
            <li>3️⃣ Ative sua conta</li>
            <li>4️⃣ Comece a usar!</li>
          </ol>
        </div>

        {/* BOTÕES */}
        <div className="space-y-3">
          <Link
            href="/admin/gerar-chave"
            className="block w-full py-3 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-bold uppercase rounded-lg transition flex items-center justify-center gap-2"
          >
            IR PARA ADMIN
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/ativar"
            className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase rounded-lg transition"
          >
            IR PARA ATIVAÇÃO
          </Link>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-500 mt-4">
            ID da Transação: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1ccec8] mx-auto mb-4"></div>
          <p className="text-xl">Carregando...</p>
        </div>
      }>
        <SucessoContent />
      </Suspense>
    </div>
  );
}