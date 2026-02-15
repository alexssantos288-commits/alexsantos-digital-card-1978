"use client";

import { useState } from "react";
import { CreditCard, Check } from "lucide-react";

export default function ComprarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email) {
      alert("❌ Digite seu email!");
      return;
    }

    setLoading(true);

    try {
      // Chamar API para criar checkout
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        alert("❌ " + data.error);
        setLoading(false);
        return;
      }

      // Redirecionar para o Stripe Checkout (FORMA MODERNA)
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro ao processar pagamento!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4">
            SEU CARTÃO <span className="text-[#1ccec8]">DIGITAL</span>
          </h1>
          <p className="text-xl text-gray-400">
            Compartilhe suas informações com um toque
          </p>
        </div>

        {/* PREÇO */}
        <div className="max-w-lg mx-auto">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Pagamento único
              </p>
              <div className="text-6xl font-black mb-2">
                R$ <span className="text-[#1ccec8]">79</span>
              </div>
              <p className="text-gray-500">Acesso vitalício</p>
            </div>

            {/* BENEFÍCIOS */}
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

            {/* FORMULÁRIO */}
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
    </div>
  );
}