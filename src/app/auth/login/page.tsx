"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            BEM-VINDO DE <span className="text-[#1ccec8]">VOLTA</span>
          </h1>
          <p className="text-gray-400">Entre na sua conta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-wider py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/auth/reset-password"
            className="block text-sm text-gray-400 hover:text-[#1ccec8] transition"
          >
            Esqueceu a senha?
          </Link>
          <p className="text-sm text-gray-400">
            Não tem conta?{" "}
            <Link href="/auth/register" className="text-[#1ccec8] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="block mt-8 text-center text-sm text-gray-500 hover:text-gray-400 transition"
        >
          ← Voltar para home
        </Link>
      </div>
    </div>
  );
}