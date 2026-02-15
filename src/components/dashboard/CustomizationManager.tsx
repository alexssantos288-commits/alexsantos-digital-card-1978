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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `background-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("backgrounds")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("backgrounds")
        .getPublicUrl(fileName);

      handleChange("backgroundImage", publicUrl);
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    handleChange("backgroundImage", "");
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
            opacity: formData.opacity,
            borderRadius: formData.borderRadius,
            backgroundColor: formData.backgroundColor,
            gradientColor1: formData.gradientColor1,
            gradientColor2: formData.gradientColor2,
            backgroundImage: formData.backgroundImage,
            blur: formData.blur,
          },
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;
      onUpdate();
    } catch (err) {
      console.error("Erro ao salvar tema:", err);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* LAYOUT DE 2 COLUNAS */}
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
              style={{ border: 'none', background: 'transparent' }}
            />
          </div>

          {/* OPACIDADE */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">
              Opacidade ({formData.opacity}%)
            </Label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.opacity}
              onChange={(e) => handleChange("opacity", e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
            />
          </div>

          {/* COR DO TEXTO */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Cor do texto</Label>
            <input
              type="color"
              value={formData.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
              style={{ border: 'none', background: 'transparent' }}
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
                  onClick={() => handleChange("backgroundColor", color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.backgroundColor === color
                      ? "border-[#22c55e] scale-110"
                      : "border-white/10"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* GRADIENTE PERSONALIZADO */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Gradiente Personalizado</Label>
            <div className="flex gap-2">
            <input
                type="color"
                value={formData.gradientColor1}
                onChange={(e) => handleChange("gradientColor1", e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
                style={{ border: 'none', background: 'transparent' }}
              />
              <input
                type="color"
                value={formData.gradientColor2}
                onChange={(e) => handleChange("gradientColor2", e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
                style={{ border: 'none', background: 'transparent' }}
              />
            </div>
          </div>

          {/* IMAGEM DE FUNDO */}
          <div>
            <Label className="text-gray-400 text-xs font-normal mb-2 block">Imagem de fundo</Label>
            {formData.backgroundImage ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={formData.backgroundImage}
                  alt="Background"
                  className="w-full h-full object-cover"
                  style={{ filter: `blur(${formData.blur}px)` }}
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-[#22c55e]/50 transition-all">
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <span className="text-xs text-gray-500">Clique para carregar</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* BLUR */}
          {formData.backgroundImage && (
            <div>
              <Label className="text-gray-400 text-xs font-normal mb-2 block">
                Desfoque ({formData.blur}px)
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

      {/* BOTÃO SALVAR - VERDE E À DIREITA */}
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