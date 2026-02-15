"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";

interface LinkManagerProps {
  profile: Profile;
  onUpdate: () => void;
}

export function LinkManager({ profile, onUpdate }: LinkManagerProps) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        phone: profile.phone || "",
        whatsapp: profile.whatsapp || "",
        address: profile.address || "",
        website: profile.website || "",
        instagram: profile.instagram || "",
        facebook: profile.facebook || "",
        linkedin: profile.linkedin || "",
        twitter: profile.twitter || "",
        youtube: profile.youtube || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          address: formData.address,
          website: formData.website,
          instagram: formData.instagram,
          facebook: formData.facebook,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          youtube: formData.youtube,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      alert("✅ Redes sociais atualizadas com sucesso!");
      onUpdate();
    } catch (error: any) {
      alert("❌ Erro ao atualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          REDES <span className="text-[#06b6d4]">SOCIAIS</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GRID 2 COLUNAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* EMAIL */}
          <div>
            <Label className="text-white text-xs font-normal">Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="seu@email.com"
              type="email"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* TELEFONE */}
          <div>
            <Label className="text-white text-xs font-normal">Telefone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(xx) xxxxx-xxxx"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* WHATSAPP */}
          <div>
            <Label className="text-white text-xs font-normal">WhatsApp</Label>
            <Input
              value={formData.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="(xx) xxxxx-xxxx"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* ENDEREÇO */}
          <div>
            <Label className="text-white text-xs font-normal">Endereço</Label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Rua, número, cidade"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* WEBSITE */}
          <div>
            <Label className="text-white text-xs font-normal">Website</Label>
            <Input
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://seusite.com"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* INSTAGRAM */}
          <div>
            <Label className="text-white text-xs font-normal">Instagram</Label>
            <Input
              value={formData.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="@seuinstagram"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* FACEBOOK */}
          <div>
            <Label className="text-white text-xs font-normal">Facebook</Label>
            <Input
              value={formData.facebook}
              onChange={(e) => handleChange("facebook", e.target.value)}
              placeholder="https://facebook.com/seuperfil"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* LINKEDIN */}
          <div>
            <Label className="text-white text-xs font-normal">LinkedIn</Label>
            <Input
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/seuperfil"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* TWITTER */}
          <div>
            <Label className="text-white text-xs font-normal">Twitter</Label>
            <Input
              value={formData.twitter}
              onChange={(e) => handleChange("twitter", e.target.value)}
              placeholder="@seutwitter"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
            />
          </div>

          {/* YOUTUBE */}
          <div>
            <Label className="text-white text-xs font-normal">YouTube</Label>
            <Input
              value={formData.youtube}
              onChange={(e) => handleChange("youtube", e.target.value)}
              placeholder="https://youtube.com/@seucanal"
              className="mt-1 bg-black text-white placeholder:text-gray-400 border-white/10 focus:border-white/20 focus:ring-white/20"
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