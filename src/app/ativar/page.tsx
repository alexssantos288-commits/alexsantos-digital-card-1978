"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Key, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function ActivatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accessKey: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"validate" | "activate">("validate");

  // VALIDAR CHAVE DE ACESSO
  const handleValidateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const normalizedKey = formData.accessKey.trim().toUpperCase();
      
      // 🔍 LOG 1: Ver chave
      console.log("🔍 Chave digitada:", formData.accessKey);
      console.log("🔍 Chave normalizada:", normalizedKey);
  
      const { data: keyData, error: keyError } = await supabase
        .from("access_keys")
        .select("*")
        .eq("access_key", normalizedKey)
        .single();
  
      // 🔍 LOG 2: Ver resultado
      console.log("🔍 Dados retornados:", keyData);
      console.log("🔍 Erro retornado:", JSON.stringify(keyError, null, 2));
  
      if (keyError || !keyData) {
        console.error("❌ Erro ao buscar chave:", keyError);
        setError("❌ Chave de acesso inválida. Verifique e tente novamente.");
        setLoading(false);
        return;
      }
  
      // ... resto do código

      if (keyData.is_activated) {
        setError("❌ Esta chave já foi ativada. Entre com suas credenciais.");
        setLoading(false);
        return;
      }

      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        setError("❌ Esta chave de acesso expirou. Entre em contato com o suporte.");
        setLoading(false);
        return;
      }

      if (keyData.email) {
        setFormData((prev) => ({ ...prev, email: keyData.email }));
      }

      setStep("activate");
      setLoading(false);

    } catch (err: any) {
      console.error("Erro ao validar chave:", err);
      setError("❌ Erro ao validar chave. Tente novamente.");
      setLoading(false);
    }
  };

  // ATIVAR CONTA
  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("❌ A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("❌ As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const normalizedKey = formData.accessKey.trim().toUpperCase();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            activated_with_key: normalizedKey,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("❌ Este email já está cadastrado. Faça login normalmente.");
        } else {
          setError(`❌ Erro ao criar conta: ${authError.message}`);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("❌ Erro ao criar usuário.");
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        email: formData.email,
        name: formData.email.split("@")[0],
        username: `user${Date.now()}`,
      });

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
      }

      const { error: updateError } = await supabase
        .from("access_keys")
        .update({
          is_activated: true,
          activated_at: new Date().toISOString(),
          profile_id: authData.user.id,
          email: formData.email,
        })
        .eq("access_key", normalizedKey);

      if (updateError) {
        console.error("Erro ao atualizar chave:", updateError);
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Erro ao fazer login:", signInError);
        router.push("/auth/login?message=Conta criada! Faça login.");
        return;
      }

      router.push("/dashboard");

    } catch (err: any) {
      console.error("Erro ao ativar conta:", err);
      setError("❌ Erro ao ativar conta. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
            INTEGRETY<span className="text-[#1ccec8]">TAG</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Ative seu cartão digital</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-8">
          {step === "validate" && (
            <form onSubmit={handleValidateKey} className="space-y-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-4">
                  INSIRA SUA <span className="text-[#1ccec8]">CHAVE</span>
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Digite a chave de acesso que você recebeu por email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Chave de Acesso
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="INTEG-XXXX-XXXX-XXXX"
                    value={formData.accessKey}
                    onChange={(e) =>
                      setFormData({ ...formData, accessKey: e.target.value.toUpperCase() })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
                    required
                    maxLength={20}  // ✅ DEVE SER 20!
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Formato: INTEG-XXXX-XXXX-XXXX
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.accessKey}
                className="w-full py-3 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-bold uppercase tracking-wider rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "VALIDANDO..." : "VALIDAR CHAVE"}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Já tem uma conta?{" "}
                  <Link href="/auth/login" className="text-[#1ccec8] hover:underline">
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          )}

          {step === "activate" && (
            <form onSubmit={handleActivateAccount} className="space-y-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2">
                  CRIE SUA <span className="text-[#1ccec8]">CONTA</span>
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Chave validada! Agora crie sua senha de acesso
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-bold uppercase tracking-wider rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "ATIVANDO..." : "ATIVAR CONTA"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("validate")}
                  disabled={loading}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider rounded-lg transition disabled:opacity-50"
                >
                  VOLTAR
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}