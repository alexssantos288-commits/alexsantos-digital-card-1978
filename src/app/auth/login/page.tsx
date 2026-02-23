"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  const handleCaptcha = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Por favor, confirme que você não é um robô.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-3">
          <Link href="/" className="text-xl font-black uppercase tracking-tighter">
            INTEGRETY<span className="text-[#1ccec8]">TAG</span>
          </Link>
        </div>

        {/* TÍTULO */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">
            ENTRAR NA <span className="text-[#1ccec8]">CONTA</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Para entrar, informe seu e-mail e senha. <br />
            Você já deve ter um <strong className="text-white">Integrety Tag</strong> ativo para fazer o login.
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* ERRO */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            {/* BALÃO DE ATENÇÃO */}
            <div className="mb-2 bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 px-4 py-3 rounded-xl text-xs leading-relaxed relative">
              <span className="font-bold">⚠️ Atenção:</span> Se você ainda não possui senha, aguarde a chegada do seu{" "}
              <strong>Integrety Tag</strong> para ativá-lo e criar uma senha.
              {/* TRIÂNGULO DO BALÃO */}
              <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-yellow-400/40" />
            </div>

            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition text-sm sm:text-base min-h-[48px] text-white placeholder:text-gray-600"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 text-gray-300">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition text-sm sm:text-base min-h-[48px] text-white placeholder:text-gray-600"
              placeholder="••••••••"
              required
            />
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleCaptcha}
              theme="dark"
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-wider py-3 sm:py-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[52px]"
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/reset-password"
            className="block text-sm text-gray-400 hover:text-[#1ccec8] transition"
          >
            Esqueceu a senha?
          </Link>
        </div>

        {/* VOLTAR */}
        <Link
          href="/"
          className="block mt-6 text-center text-sm text-gray-500 hover:text-gray-400 transition"
        >
          ← Voltar para home
        </Link>

      </div>
    </div>
  );
}