'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function SucessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accessKey, setAccessKey] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const copyKey = async () => {
    if (!accessKey) return;
    try {
      await navigator.clipboard.writeText(accessKey);
      alert('✅ Chave copiada para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar chave');
    }
  };

  const handleContinue = async () => {
    setRedirecting(true);

    if (!email) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.hasAccount) {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      } else {
        router.push(`/ativar?email=${encodeURIComponent(email)}&key=${encodeURIComponent(accessKey)}`);
      }
    } catch {
      router.push('/login');
    } finally {
      setRedirecting(false);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;

    const fetchKey = async () => {
      try {
        const res = await fetch(`/api/get-key?session_id=${sessionId}`);
        const data = await res.json();

        if (data.key) {
          setAccessKey(data.key);
          setEmail(data.email);
          setLoading(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(fetchKey, 2000);
        } else {
          setLoading(false);
        }
      } catch {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(fetchKey, 2000);
        } else {
          setLoading(false);
        }
      }
    };

    fetchKey();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#0a0a0a] border border-cyan-500 rounded-2xl p-8 text-center">

        {/* ÍCONE DE SUCESSO */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border-2 border-cyan-500">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* TÍTULO */}
        <h1 className="text-3xl font-bold text-white mb-2">Parabéns!</h1>
        <p className="text-gray-400 mb-8">Sua compra foi confirmada com sucesso!</p>

        {/* CHAVE DE ACESSO */}
        {accessKey && (
          <div className="bg-[#111] border-2 border-cyan-500 rounded-xl p-6 mb-6">
            <p className="text-gray-400 text-sm mb-2">🔑 Sua chave de acesso:</p>
            <p className="text-cyan-400 text-2xl font-bold tracking-widest mb-4">
              {accessKey}
            </p>
            <button
              onClick={copyKey}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500 px-4 py-2 rounded-lg text-sm transition-all"
            >
              📋 Copiar Chave
            </button>
          </div>
        )}

        {/* AVISO DE EMAIL */}
        {email && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
            <p className="text-green-400 text-sm">
              📧 Email enviado para: <strong>{email}</strong>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Verifique também sua pasta de spam
            </p>
          </div>
        )}

        {/* INSTRUÇÕES */}
        <div className="bg-[#111] rounded-xl p-4 mb-8 text-left">
          <p className="text-white font-semibold mb-3">📱 Como ativar sua tag:</p>
          <ol className="space-y-2">
            {[
              'Acesse seu dashboard',
              'Vá em "Ativar Tag"',
              'Insira o código acima',
              'Pronto! Sua tag está ativa! 🚀',
            ].map((step, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-400 text-sm">
                <span className="w-6 h-6 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleContinue}
            disabled={redirecting}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {redirecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></span>
                Verificando...
              </span>
            ) : (
              '🚀 Acessar Dashboard'
            )}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-transparent hover:bg-white/5 text-gray-400 border border-gray-700 font-medium py-3 px-6 rounded-xl transition-all"
          >
            Voltar para o início
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-gray-600 text-xs mt-6">
          Dúvidas? integretytecnologia@gmail.com
        </p>

      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}