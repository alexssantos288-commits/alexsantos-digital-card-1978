"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";

interface SocialLinksEditorProps {
  profile: Profile;
  onUpdate: () => void;
}

export function SocialLinksEditor({ profile, onUpdate }: SocialLinksEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    google_reviews: (profile as any).google_reviews || "",
    spotify: (profile as any).spotify || "",
  });

  const handleSave = async () => {
    try {
      setLoading(true);

      console.log("📝 Salvando redes sociais...");
      console.log("👤 Profile user_id:", profile.user_id);
      console.log("📋 Dados:", formData);

      // Verificar usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("❌ Erro de autenticação:", authError);
        throw new Error(`Erro de autenticação: ${authError.message}`);
      }

      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      console.log("✅ Usuário autenticado:", user.id);

      const { data, error } = await supabase
        .from("profiles")
        .update({
          email: formData.email || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          address: formData.address || null,
          website: formData.website || null,
          instagram: formData.instagram || null,
          facebook: formData.facebook || null,
          linkedin: formData.linkedin || null,
          twitter: formData.twitter || null,
          youtube: formData.youtube || null,
          google_reviews: formData.google_reviews || null,
          spotify: formData.spotify || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id)
        .select();

      if (error) {
        console.error("❌ Erro ao salvar:", error);
        throw error;
      }

      console.log("✅ Dados salvos:", data);

      alert("✅ Redes sociais atualizadas com sucesso!");
      onUpdate();
    } catch (error: any) {
      console.error("❌ Erro completo:", error);
      alert(`❌ Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EMAIL */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            E-mail
          </Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="seu@email.com"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* TELEFONE */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Telefone
          </Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(00) 00000-0000"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* WHATSAPP */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            WhatsApp
          </Label>
          <Input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
            placeholder="5511999999999"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
          <p className="text-xs text-gray-400 mt-1">
            Formato: código do país + DDD + número
          </p>
        </div>

        {/* LOCALIZAÇÃO */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Localização
          </Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Rua, número, bairro, cidade"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* WEBSITE */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Website
          </Label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://seusite.com"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* INSTAGRAM */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Instagram
          </Label>
          <Input
            value={formData.instagram}
            onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
            placeholder="@seuusuario ou URL completa"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* FACEBOOK */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Facebook
          </Label>
          <Input
            type="url"
            value={formData.facebook}
            onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
            placeholder="https://facebook.com/seuusuario"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* LINKEDIN */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            LinkedIn
          </Label>
          <Input
            type="url"
            value={formData.linkedin}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
            placeholder="https://linkedin.com/in/seuusuario"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* TWITTER */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Twitter/X
          </Label>
          <Input
            value={formData.twitter}
            onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
            placeholder="@seuusuario ou URL completa"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* YOUTUBE */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            YouTube
          </Label>
          <Input
            type="url"
            value={formData.youtube}
            onChange={(e) => setFormData(prev => ({ ...prev, youtube: e.target.value }))}
            placeholder="https://youtube.com/@seucanal"
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
        </div>

        {/* GOOGLE REVIEWS */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Avaliações no Google
          </Label>
          <Input
            type="url"
            value={formData.google_reviews}
            onChange={(e) => setFormData(prev => ({ ...prev, google_reviews: e.target.value }))}
            placeholder="https://g.page/r/..."
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
          <p className="text-xs text-gray-400 mt-1">
            Cole o link do seu perfil de avaliações do Google
          </p>
        </div>

        {/* SPOTIFY */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Spotify
          </Label>
          <Input
            type="url"
            value={formData.spotify}
            onChange={(e) => setFormData(prev => ({ ...prev, spotify: e.target.value }))}
            placeholder="https://open.spotify.com/artist/..."
            className="bg-black text-white placeholder:text-gray-500 border-white/10"
          />
          <p className="text-xs text-gray-400 mt-1">
            Cole o link do seu perfil ou playlist do Spotify
          </p>
        </div>
      </div>

      {/* BOTÃO SALVAR - ROXO E À DIREITA */}
      <div className="mt-6 flex justify-end">
        <StandardButton
          onClick={handleSave}
          icon={Save}
          text="SALVAR"
          color="#a855f7"
          loading={loading}
          fullWidth={false}
        />
      </div>
    </CardContent>
    </Card>
  );
}