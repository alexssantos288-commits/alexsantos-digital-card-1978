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

    if (password.length < 6) {
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            CRIE SUA <span className="text-[#1ccec8]">CONTA</span>
          </h1>
         </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg text-sm">
              Conta criada! Redirecionando...
            </div>
          )}

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#1ccec8] transition"
              placeholder="seunome"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
                          </p>
          </div>

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

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "CRIANDO CONTA..." : "CRIAR CONTA"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-[#1ccec8] hover:underline">
            Fazer login
          </Link>
        </p>

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