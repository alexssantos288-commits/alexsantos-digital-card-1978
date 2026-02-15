"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Link de recuperação enviado! Verifique seu e-mail.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            RECUPERAR <span className="text-[#1ccec8]">SENHA</span>
          </h1>
          <p className="text-gray-400">Digite seu e-mail para receber o link</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg text-sm">
              {message}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-wider py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "ENVIANDO..." : "ENVIAR LINK"}
          </button>
        </form>

        <Link
          href="/auth/login"
          className="block mt-6 text-center text-sm text-gray-400 hover:text-[#1ccec8] transition"
        >
          ← Voltar para login
        </Link>
      </div>
    </div>
  );
}