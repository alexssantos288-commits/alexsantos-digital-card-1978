"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Save, Trash2, Upload } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";

interface CustomizationManagerProps {
  profile: Profile;
  onUpdate: () => void;
}

type BackgroundType = "solid" | "gradient" | "image";

export function CustomizationManager({ profile, onUpdate }: CustomizationManagerProps) {
  const [formData, setFormData] = useState({
    itemColor: profile?.theme?.itemColor || "#22c55e",
    textColor: profile?.theme?.textColor || "#ffffff",
    opacity: profile?.theme?.opacity || "100",
    borderRadius: profile?.theme?.borderRadius || "24",
    backgroundColor: profile?.theme?.backgroundColor || "#000000",
    gradientColor1: profile?.theme?.gradientColor1 || "#667eea",
    gradientColor2: profile?.theme?.gradientColor2 || "#764ba2",
    backgroundImage: profile?.theme?.backgroundImage || "",
    blur: profile?.theme?.blur || "0",
    backgroundType: (profile?.theme?.backgroundType as BackgroundType) || "solid",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const solidColors = [
    "#000000", "#1a1a1a", "#2d2d2d", "#404040",
    "#ff0000", "#ff6b00", "#ffd500", "#00ff00",
    "#00ffff", "#0066ff", "#6600ff", "#ff00ff"
  ];

  // ✅ UPLOAD CORRIGIDO
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      alert("Apenas imagens são permitidas!");
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem muito grande! Máximo 5MB.");
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/background-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("backgrounds")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("backgrounds")
        .getPublicUrl(fileName);

      handleChange("backgroundImage", publicUrl);
      handleChange("backgroundType", "image");

    } catch (err: any) {
      console.error("Erro ao fazer upload:", err);
      alert(`Erro ao fazer upload: ${err.message || "Verifique as permissões do bucket no Supabase."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    handleChange("backgroundImage", "");
    handleChange("backgroundType", "solid");
  };

  // ✅ APLICAR COR SÓLIDA
  const handleSolidColor = (color: string) => {
    handleChange("backgroundColor", color);
    handleChange("backgroundType", "solid");
  };

  // ✅ APLICAR GRADIENTE CORRIGIDO
  const handleApplyGradient = () => {
    const gradient = `linear-gradient(135deg, ${formData.gradientColor1}, ${formData.gradientColor2})`;
    handleChange("backgroundColor", gradient);
    handleChange("backgroundType", "gradient");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          theme: {
            itemColor: formData.itemColor,
            textColor: formData.textColor,
            opacity: String(formData.opacity), // ✅ Garantir string
            borderRadius: formData.borderRadius,
            backgroundColor: formData.backgroundColor,
            gradientColor1: formData.gradientColor1,
            gradientColor2: formData.gradientColor2,
            backgroundImage: formData.backgroundImage,
            backgroundType: formData.backgroundType,
            blur: formData.blur,
          },
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;
      onUpdate();
      alert("✅ Tema salvo com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar tema:", err);
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Preview do background atual
  const getBackgroundPreview = () => {
    if (formData.backgroundType === "image" && formData.backgroundImage) {
      return { backgroundImage: `url(${formData.backgroundImage})`, backgroundSize: "cover" };
    }
    if (formData.backgroundType === "gradient") {
      return { background: `linear-gradient(135deg, ${formData.gradientColor1}, ${formData.gradientColor2})` };
    }
    return { backgroundColor: formData.backgroundColor };
  };

  return (
    <div className="space-y-6">
      
      {/* PREVIEW */}
      <div
        className="w-full h-20 rounded-xl border border-white/10 transition-all duration-300 flex items-center justify-center"
        style={getBackgroundPreview()}
      >
        <span
          className="text-sm font-bold px-4 py-2 rounded-lg"
          style={{
            color: formData.textColor,
            backgroundColor: formData.itemColor,
            opacity: Number(formData.opacity) / 100,
            borderRadius: `${formData.borderRadius}px`,
          }}
        >
          Preview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===== COLUNA ESQUERDA - EDITAR ESTILO ===== */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Editar Estilo</h3>

          {/* COR DOS ITENS */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Cor dos itens</Label>
            <input
              type="color"
              value={formData.itemColor}
              onChange={(e) => handleChange("itemColor", e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
              style={{ background: "transparent", border: "none" }}
            />
          </div>

          {/* ✅ OPACIDADE CORRIGIDA */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">
              Opacidade dos botões ({formData.opacity}%)
            </Label>
            <input
              type="range"
              min="10"
              max="100"
              value={Number(formData.opacity)}
              onChange={(e) => handleChange("opacity", e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
            />
            {/* Preview de opacidade */}
            <div className="mt-2 flex gap-2">
              <div
                className="h-6 flex-1 rounded"
                style={{
                  backgroundColor: formData.itemColor,
                  opacity: Number(formData.opacity) / 100,
                }}
              />
              <span className="text-xs text-gray-500">{formData.opacity}%</span>
            </div>
          </div>

          {/* COR DO TEXTO */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Cor do texto</Label>
            <input
              type="color"
              value={formData.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
              style={{ background: "transparent", border: "none" }}
            />
          </div>

          {/* ARREDONDAMENTO */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">
              Arredondamento ({formData.borderRadius}px)
            </Label>
            <input
              type="range"
              min="0"
              max="50"
              value={formData.borderRadius}
              onChange={(e) => handleChange("borderRadius", e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
            />
          </div>
        </div>

        {/* ===== COLUNA DIREITA - EDITAR FUNDO ===== */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Editar Fundo</h3>

          {/* CORES SÓLIDAS */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Cores sólidas</Label>
            <div className="grid grid-cols-6 gap-2">
              {solidColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleSolidColor(color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.backgroundColor === color && formData.backgroundType === "solid"
                      ? "border-[#22c55e] scale-110"
                      : "border-white/10"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* ✅ GRADIENTE CORRIGIDO */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Gradiente Personalizado</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <span className="text-xs text-gray-600 mb-1 block">Cor 1</span>
                  <input
                    type="color"
                    value={formData.gradientColor1}
                    onChange={(e) => handleChange("gradientColor1", e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                    style={{ background: "transparent", border: "none" }}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-600 mb-1 block">Cor 2</span>
                  <input
                    type="color"
                    value={formData.gradientColor2}
                    onChange={(e) => handleChange("gradientColor2", e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                    style={{ background: "transparent", border: "none" }}
                  />
                </div>
              </div>

              {/* Preview do gradiente */}
              <div
                className="w-full h-8 rounded-lg border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${formData.gradientColor1}, ${formData.gradientColor2})`
                }}
              />

              {/* Botão aplicar gradiente */}
              <button
                onClick={handleApplyGradient}
                className={`w-full py-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                  formData.backgroundType === "gradient"
                    ? "bg-[#22c55e] text-black border-[#22c55e]"
                    : "bg-white/5 text-gray-300 border-white/10 hover:border-[#22c55e]/50"
                }`}
              >
                {formData.backgroundType === "gradient" ? "✅ Gradiente Aplicado" : "Aplicar Gradiente"}
              </button>
            </div>
          </div>

          {/* ✅ IMAGEM DE FUNDO CORRIGIDA */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Imagem de fundo</Label>
            {formData.backgroundImage ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={formData.backgroundImage}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                  ✅ Imagem carregada
                </div>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-[#22c55e]/50 transition-all">
                <div className="text-center">
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  )}
                  <span className="text-xs text-gray-500">
                    {loading ? "Enviando..." : "Clique para carregar (máx 5MB)"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            )}
          </div>

          {/* BLUR */}
          {formData.backgroundImage && (
            <div>
              <Label className="text-gray-400 text-xs font-normal mb-2 block">
                Desfoque da imagem ({formData.blur}px)
              </Label>
              <input
                type="range"
                min="0"
                max="20"
                value={formData.blur}
                onChange={(e) => handleChange("blur", e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
              />
            </div>
          )}
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end">
        <StandardButton
          onClick={handleSave}
          icon={Save}
          text="SALVAR"
          color="#22c55e"
          loading={loading}
          fullWidth={false}
        />
      </div>
    </div>
  );
}