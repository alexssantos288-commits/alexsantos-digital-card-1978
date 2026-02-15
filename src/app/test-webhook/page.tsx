"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function TestWebhookPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!email) {
      alert("Digite um email!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          sessionId: "test_" + Date.now() 
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Erro ao testar webhook" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-black mb-6">
          🧪 TESTAR WEBHOOK
        </h1>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email do pagamento:
            </label>
            <input
              type="email"
              placeholder="email@teste.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#1ccec8]"
            />
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full py-3 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-bold uppercase rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? "GERANDO..." : "SIMULAR WEBHOOK"}
          </button>

          {result && (
            <div className={`p-4 rounded-lg ${result.success ? "bg-green-500/20 border border-green-500/50" : "bg-red-500/20 border border-red-500/50"}`}>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}