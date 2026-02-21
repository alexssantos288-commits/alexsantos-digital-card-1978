"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length &lt; 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase().replace(/\s+/g, ""),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-2">
          <span className="text-xl font-black uppercase tracking-tighter">
            INTEGRETY<span className="text-[#1ccec8]">TAG</span>
          </span>
        </div>

        {/* TÍTULO */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">
            CRIE SUA <span className="text-[#1ccec8]">CONTA</span>
          </h1>
          <p className="text-gray-500 text-sm">Preencha os dados abaixo para começar</p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">

          {/* ERRO */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          {/* SUCESSO */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
              ✅ Conta criada! Redirecionando...
            </div>
          )}

          {/* USERNAME */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition text-sm sm:text-base text-white placeholder:text-gray-600 min-h-[48px]"
              placeholder="seunome"
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              Será usado no link do seu perfil
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition text-sm sm:text-base text-white placeholder:text-gray-600 min-h-[48px]"
              placeholder="seu@email.com"
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
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition text-sm sm:text-base text-white placeholder:text-gray-600 min-h-[48px]"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-600 mt-1">Mínimo 6 caracteres</p>
          </div>

          {/* CONFIRMAR SENHA */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 text-gray-300">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition text-sm sm:text-base text-white placeholder:text-gray-600 min-h-[48px]"
              placeholder="••••••••"
              required
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-wider py-3 sm:py-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[52px]"
          >
            {loading ? "CRIANDO CONTA..." : "CRIAR CONTA"}
          </button>
        </form>

        {/* LINKS */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-[#1ccec8] hover:underline font-semibold">
            Fazer login
          </Link>
        </p>

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