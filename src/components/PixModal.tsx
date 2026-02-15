"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Copy, Check } from "lucide-react";
import QRCodeLib from "qrcode";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixKey: string;
  pixType: string;
  beneficiaryName: string;
  city: string;
  avatarUrl?: string;
}

export function PixModal({
  isOpen,
  onClose,
  pixKey,
  pixType,
  beneficiaryName,
  city,
  avatarUrl,
}: PixModalProps) {
  const [amount, setAmount] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [pixPayload, setPixPayload] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState("");


  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseFloat(numbers) / 100;
    return `R$ ${amount.toFixed(2).replace(".", ",")}`;
  };

  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return 0;
    return parseFloat(numbers) / 100;
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setAmount(formatted);
    console.log("💰 DIGITOU:", value);
    console.log("💰 FORMATADO:", formatted);
  };

  const crc16 = (str: string): string => {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc = crc << 1;
        }
      }
    }
    return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  };

  const generatePixPayload = (): string => {
    const payloadItems: string[] = [];
    payloadItems.push("000201");

    const key = pixKey.replace(/\D/g, "");
    const merchantInfo = `0014br.gov.bcb.pix01${key.length
      .toString()
      .padStart(2, "0")}${key}`;
    payloadItems.push(
      `26${merchantInfo.length.toString().padStart(2, "0")}${merchantInfo}`
    );

    payloadItems.push("52040000");
    payloadItems.push("5303986");

    const amountValue = parseCurrency(amount);
    if (amountValue > 0) {
      const formattedAmount = amountValue.toFixed(2);
      payloadItems.push(
        `54${formattedAmount.length.toString().padStart(2, "0")}${formattedAmount}`
      );
    }

    payloadItems.push("5802BR");

    const name = beneficiaryName.slice(0, 25);
    payloadItems.push(
      `59${name.length.toString().padStart(2, "0")}${name}`
    );

    const cityName = city.slice(0, 15);
    payloadItems.push(
      `60${cityName.length.toString().padStart(2, "0")}${cityName}`
    );

    const payload = payloadItems.join("") + "6304";
    const checksum = crc16(payload);
    return payload + checksum;
  };

  const generateQRCode = async () => {
    try {
      console.log("🔹 GERANDO QR CODE...");
      const payload = generatePixPayload();
      console.log("🔹 PAYLOAD GERADO:", payload);
      setPixPayload(payload);

      const qrUrl = await QRCodeLib.toDataURL(payload, {
        errorCorrectionLevel: "M",
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      console.log("✅ QR CODE GERADO COM SUCESSO!");
      setQrCodeUrl(qrUrl);
      setShowQR(true);
    } catch (error) {
      console.error("❌ ERRO AO GERAR QR CODE:", error);
      alert("Erro ao gerar QR Code. Tente novamente.");
    }
  };

  const handleGenerateQR = () => {
    console.log("🔹 CLICOU NO BOTÃO");
    console.log("🔹 VALOR ATUAL:", amount);
    
    // Limpar erro anterior
    setError("");
    
    // Extrair números do valor
    const numbers = amount.replace(/\D/g, "");
    const numericValue = parseFloat(numbers) / 100;
    
    if (!numbers || numericValue <= 0) {
      console.log("❌ VALIDAÇÃO FALHOU");
      setError("* Obrigatório Digitar Valor");
      return;
    }
    
    console.log("✅ VALIDAÇÃO PASSOU - GERANDO QR CODE");
    generateQRCode();
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `💰 *Pagamento PIX*\n\n*Para:* ${beneficiaryName}\n*Valor:* ${amount}\n\n*PIX Copia e Cola:*\n${pixPayload}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setShowQR(false);
      setQrCodeUrl("");
      setPixPayload("");
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[420px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {!showQR ? (
          <div className="px-8 py-10">
            <button
              onClick={onClose}
              className="mb-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex justify-center mb-6">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={beneficiaryName}
                  className="w-32 h-32 rounded-full object-cover shadow-xl"
                  style={{ border: "4px solid #f3f4f6" }}
                />
              ) : (
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    border: "4px solid #f3f4f6",
                  }}
                >
                  {beneficiaryName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="text-center text-gray-500 text-base mb-2 font-normal">
              Pague com PIX para
            </h2>
            <h3 className="text-center text-black text-2xl font-bold mb-12">
              {beneficiaryName}
            </h3>

            <label className="block text-left text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Digite o valor do PIX
            </label>

            <input
              type="text"
              value={amount}
              onChange={(e) => {
                console.log("⌨️ USUÁRIO DIGITOU:", e.target.value);
                const value = e.target.value;
                const formatted = formatCurrency(value);
                setAmount(formatted);
                setError("");
                console.log("💰 VALOR FORMATADO:", formatted);
              }}
              placeholder="R$ 0,00"
              autoFocus
              className={`w-full px-5 py-4 text-2xl font-semibold text-black bg-white border-2 rounded-xl focus:outline-none transition mb-2 ${
                error ? "border-red-500" : "border-gray-300 focus:border-black"
              }`}
            />

            {/* MENSAGEM DE ERRO */}
            {error && (
              <p className="text-red-500 text-sm font-semibold mb-6">
                {error}
              </p>
            )}

            {/* BOTÃO GERAR QR CODE */}
            <button
              onClick={handleGenerateQR}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold text-base uppercase py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Gerar QR Code
            </button>
          </div>
        ) : (
          <div className="px-8 py-10">
            <button
              onClick={() => setShowQR(false)}
              className="mb-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex justify-center mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={beneficiaryName}
                  className="w-24 h-24 rounded-full object-cover shadow-lg"
                  style={{ border: "4px solid #f3f4f6" }}
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    border: "4px solid #f3f4f6",
                  }}
                >
                  {beneficiaryName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="text-center text-gray-500 text-base mb-1 font-normal">
              Pague com PIX para
            </h2>
            <h3 className="text-center text-black text-xl font-bold mb-2">
              {beneficiaryName}
            </h3>
            <p className="text-center text-gray-500 text-sm mb-8">
              Valor: <span className="font-bold text-black">{amount}</span>
            </p>

            {qrCodeUrl && (
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-white border-4 border-black rounded-2xl shadow-xl">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-56 h-56"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center items-center gap-2 mb-6">
              <svg className="w-8 h-8" viewBox="0 0 512 512">
                <defs>
                  <linearGradient id="pixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#32BCAD", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#00A868", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#pixGrad)"
                  d="M238.8,265.6L90.9,413.5c-11.3,11.3-29.6,11.3-40.9,0l-31.6-31.6c-11.3-11.3-11.3-29.6,0-40.9l147.9-147.9c6.2-6.2,6.2-16.4,0-22.6L18.4,22.6C7.1,11.3,7.1-7,18.4-18.3L50-49.9c11.3-11.3,29.6-11.3,40.9,0l147.9,147.9c6.2,6.2,16.4,6.2,22.6,0L409.3-49.9c11.3-11.3,29.6-11.3,40.9,0l31.6,31.6c11.3,11.3,11.3,29.6,0,40.9L333.9,170.5c-6.2,6.2-6.2,16.4,0,22.6l147.9,147.9c11.3,11.3,11.3,29.6,0,40.9l-31.6,31.6c-11.3,11.3-29.6,11.3-40.9,0L261.4,265.6C255.2,259.4,245,259.4,238.8,265.6z"
                />
              </svg>
              <span className="text-2xl font-bold text-gray-400">pix</span>
            </div>

            <p className="text-center text-sm text-gray-600 mb-6 leading-relaxed">
              Abra o app do seu banco e pague através do QR Code ou Pix Copia e Cola
            </p>

            <button
              onClick={handleCopyPayload}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold text-sm uppercase py-4 rounded-xl transition-all mb-3 shadow-lg"
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={18} />
                  Copiado!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Copy size={18} />
                  Copiar código PIX Copia e Cola
                </span>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full bg-white border-2 border-black hover:bg-gray-50 text-black font-bold text-sm uppercase py-4 rounded-xl transition-all shadow-md"
            >
              Compartilhar link de pagamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}