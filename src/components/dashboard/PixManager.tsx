"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, QrCode, Copy, Check } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";
import QRCodeLib from "qrcode";

interface PixManagerProps {
  profile: Profile;
  onUpdate: () => void;
}

type PixType = "cpf" | "cnpj" | "email" | "phone" | "random";

export function PixManager({ profile, onUpdate }: PixManagerProps) {
  const [formData, setFormData] = useState({
    pixKey: "",
    pixType: "cpf" as PixType,
    beneficiaryName: "",
    city: "",
  });

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixPayload, setPixPayload] = useState("");

  useEffect(() => {
    const pixData = profile?.pix || {
      pixKey: profile?.pix_key || "",
      pixType: profile?.pix_type || "cpf",
      beneficiaryName: profile?.name || "",
      city: "",
    };

    setFormData({
      pixKey: pixData.pixKey || profile?.pix_key || "",
      pixType: (pixData.pixType || profile?.pix_type || "cpf") as PixType,
      beneficiaryName: pixData.beneficiaryName || profile?.name || "",
      city: pixData.city || "",
    });
  }, [profile]);

  useEffect(() => {
    if (formData.pixKey && formData.beneficiaryName && formData.city) {
      generateQRCode();
    }
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePixKey = (key: string, type: PixType): boolean => {
    switch (type) {
      case "cpf":
        const cpf = key.replace(/\D/g, "");
        return cpf.length === 11;
      case "cnpj":
        const cnpj = key.replace(/\D/g, "");
        return cnpj.length === 14;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
      case "phone":
        const phone = key.replace(/\D/g, "");
        return phone.length >= 10 && phone.length <= 11;
      case "random":
        return key.length === 32;
      default:
        return false;
    }
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

    const pixKey = formData.pixKey.replace(/\D/g, "");
    const merchantInfo = `0014br.gov.bcb.pix01${pixKey.length.toString().padStart(2, "0")}${pixKey}`;
    payloadItems.push(`26${merchantInfo.length.toString().padStart(2, "0")}${merchantInfo}`);

    payloadItems.push("52040000");
    payloadItems.push("5303986");
    payloadItems.push("5802BR");

    const name = formData.beneficiaryName.slice(0, 25);
    payloadItems.push(`59${name.length.toString().padStart(2, "0")}${name}`);

    const city = formData.city.slice(0, 15);
    payloadItems.push(`60${city.length.toString().padStart(2, "0")}${city}`);

    const payload = payloadItems.join("") + "6304";
    const checksum = crc16(payload);
    
    return payload + checksum;
  };

  const generateQRCode = async () => {
    try {
      if (!validatePixKey(formData.pixKey, formData.pixType)) {
        setQrCodeUrl("");
        setPixPayload("");
        return;
      }

      const payload = generatePixPayload();
      setPixPayload(payload);

      const qrUrl = await QRCodeLib.toDataURL(payload, {
        errorCorrectionLevel: "M",
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      setQrCodeUrl("");
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!validatePixKey(formData.pixKey, formData.pixType)) {
        alert("❌ Chave PIX inválida para o tipo selecionado!");
        return;
      }

      console.log("🔹 SALVANDO PIX:", {
        pix_enabled: true,
        pix_key: formData.pixKey,
        pix_type: formData.pixType,
        user_id: profile.user_id
      });

      const { error } = await supabase
        .from("profiles")
        .update({
          pix_enabled: true,
          pix_key: formData.pixKey,
          pix_type: formData.pixType,
          pix: {
            pixKey: formData.pixKey,
            pixType: formData.pixType,
            beneficiaryName: formData.beneficiaryName,
            city: formData.city,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      console.log("✅ PIX SALVO COM SUCESSO!");

      alert("✅ Configurações PIX salvas com sucesso!");
      onUpdate();
    } catch (error: any) {
      console.error("❌ ERRO AO SALVAR PIX:", error);
      alert("❌ Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cobrar com Pix</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* APENAS CAMPOS CENTRALIZADOS - SEM QR CODE */}
        <div className="max-w-md mx-auto space-y-4">
          {/* TIPO DE CHAVE PIX */}
          <div>
            <Label className="text-white text-xs font-normal block text-center mb-2">
              Tipo de Chave PIX
            </Label>
            <select
              value={formData.pixType}
              onChange={(e) => handleChange("pixType", e.target.value)}
              className="w-full px-3 py-2 bg-black text-white border-white/10 focus:border-white/20 focus:ring-white/20 rounded-lg focus:outline-none focus:ring-2 transition text-center"
            >
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefone</option>
              <option value="random">Chave Aleatória</option>
            </select>
          </div>

          {/* CHAVE PIX */}
          <div>
            <Label className="text-white text-xs font-normal block text-center mb-2">
              Chave PIX
            </Label>
            <Input
              value={formData.pixKey}
              onChange={(e) => handleChange("pixKey", e.target.value)}
              placeholder={
                formData.pixType === "cpf"
                  ? "000.000.000-00"
                  : formData.pixType === "cnpj"
                  ? "00.000.000/0000-00"
                  : formData.pixType === "email"
                  ? "seu@email.com"
                  : formData.pixType === "phone"
                  ? "(00) 00000-0000"
                  : "Chave aleatória"
              }
              className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20 text-center"
            />
            {formData.pixKey && !validatePixKey(formData.pixKey, formData.pixType) && (
              <p className="text-xs text-red-500 mt-1 text-center">
                ⚠️ Chave inválida para o tipo selecionado
              </p>
            )}
          </div>

          {/* NOME DO BENEFICIÁRIO */}
          <div>
            <Label className="text-white text-xs font-normal block text-center mb-2">
              Nome do Beneficiário
            </Label>
            <Input
              value={formData.beneficiaryName}
              onChange={(e) => handleChange("beneficiaryName", e.target.value)}
              placeholder="Nome completo"
              maxLength={25}
              className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20 text-center"
            />
          </div>

          {/* CIDADE */}
          <div>
            <Label className="text-white text-xs font-normal block text-center mb-2">
              Cidade
            </Label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Sua cidade"
              maxLength={15}
              className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20 text-center"
            />
          </div>
        </div>

        {/* BOTÃO SALVAR */}
        <StandardButton
          onClick={handleSave}
          icon={Save}
          text="SALVAR"
          color="#06b6d4"
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}