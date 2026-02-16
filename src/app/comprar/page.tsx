"use client";

import { useState } from "react";
import { CreditCard, Check } from "lucide-react";

export default function ComprarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email) {
      alert("Por favor, insira seu email!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        alert("Erro: " + data.error);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro: URL de checkout não encontrada");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar pagamento");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              INTEGRETYTAG
            </h1>
            <p className="text-gray-400">Cartão Digital NFC</p>
          </div>

          <div className="bg-[#1ccec8]/10 border border-[#1ccec8]/30 rounded-xl p-6 mb-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Pagamento Único</p>
              <p className="text-5xl font-bold text-white mb-2">
                R$ 99<span className="text-2xl">,00</span>
              </p>
              <p className="text-[#1ccec8] text-sm font-semibold">
                Acesso Vitalício
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "Cartão digital personalizado",
              "QR Code único",
              "Links para redes sociais",
              "Formulário de contato",
              "Estatísticas de visualizações",
              "Atualizações gratuitas",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#1ccec8] flex-shrink-0" />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Seu melhor email:
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8] transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                📧 Você receberá a chave de acesso neste email
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-bold uppercase tracking-wider rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {loading ? "PROCESSANDO..." : "COMPRAR AGORA"}
            </button>

            <p className="text-xs text-center text-gray-500">
              🔒 Pagamento seguro via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}