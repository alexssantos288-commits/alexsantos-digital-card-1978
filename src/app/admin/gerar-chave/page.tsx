"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Key, Mail, Hash, Package, Copy, Check, ArrowLeft } from "lucide-react";

export default function GerarChavePage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nfcTagId: "",
    orderId: "",
  });
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [keys, setKeys] = useState<any[]>([]);

  // VERIFICAR SE É ADMIN
  useEffect(() => {
    checkAdmin();
    loadKeys();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: adminData, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !adminData) {
        alert("❌ Acesso negado. Você não é administrador.");
        router.push("/dashboard");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao verificar admin:", err);
      router.push("/dashboard");
    }
  };

  // CARREGAR CHAVES GERADAS
  const loadKeys = async () => {
    try {
      const { data, error } = await supabase
        .from("access_keys")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setKeys(data);
      }
    } catch (err) {
      console.error("Erro ao carregar chaves:", err);
    }
  };

  // GERAR CHAVE
  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedKey("");

    try {
      const { data, error } = await supabase.rpc("create_access_key", {
        p_email: formData.email,
        p_nfc_tag_id: formData.nfcTagId || null,
        p_order_id: formData.orderId || null,
      });

      if (error) throw error;

      const newKey = data[0].access_key;
      setGeneratedKey(newKey);

      // Limpar formulário
      setFormData({ email: "", nfcTagId: "", orderId: "" });

      // Recarregar lista
      loadKeys();

      alert("✅ Chave gerada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao gerar chave:", err);
      alert(`❌ Erro ao gerar chave: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // COPIAR CHAVE
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Verificando acesso...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-lg font-black uppercase tracking-tighter">
            INTEGRETY<span className="text-[#1ccec8]">TAG</span>
          </Link>
          <span className="text-sm text-gray-400">Admin: Gerar Chaves</span>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* BOTÃO VOLTAR */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
          GERAR <span className="text-[#1ccec8]">CHAVE DE ACESSO</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Crie chaves de acesso para novos clientes
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* FORMULÁRIO */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Key className="w-6 h-6 text-[#1ccec8]" />
              Gerar Nova Chave
            </h2>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              {/* EMAIL */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email do Cliente *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
                    required
                  />
                </div>
              </div>

              {/* NFC TAG ID */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  ID da Tag NFC (Opcional)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="NFC-12345"
                    value={formData.nfcTagId}
                    onChange={(e) => setFormData({ ...formData, nfcTagId: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
                  />
                </div>
              </div>

              {/* ORDER ID */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  ID do Pedido (Opcional)
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="PEDIDO-789"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
                  />
                </div>
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-bold uppercase rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? "GERANDO..." : "GERAR CHAVE"}
              </button>
            </form>

            {/* CHAVE GERADA */}
            {generatedKey && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">✅ Chave Gerada:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-base sm:text-lg font-mono text-green-500 break-all">
                    {generatedKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(generatedKey)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                    title="Copiar chave"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Envie esta chave para o cliente por email ou WhatsApp
                </p>
              </div>
            )}
          </div>

          {/* LISTA DE CHAVES */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Últimas Chaves Geradas</h2>

            {keys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Nenhuma chave gerada ainda
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className="p-4 bg-black/50 border border-white/5 rounded-lg hover:border-white/10 transition"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <code className="text-sm font-mono text-[#1ccec8] break-all">
                        {key.access_key}
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.access_key)}
                        className="p-1 hover:bg-white/5 rounded transition flex-shrink-0"
                        title="Copiar chave"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{key.email}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          key.is_activated
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {key.is_activated ? "✅ Ativada" : "⏳ Pendente"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(key.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {key.nfc_tag_id && (
                        <span className="text-xs text-gray-600">
                          NFC: {key.nfc_tag_id}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}