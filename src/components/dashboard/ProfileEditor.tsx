"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";

interface ProfileEditorProps {
  profile: Profile;
  onUpdate: () => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || "",
    bio: profile.bio || "",
  });

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      alert("✅ Perfil atualizado com sucesso!");
      onUpdate();
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      alert(`❌ Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-6 space-y-4">
        {/* NOME */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Nome Completo
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Digite seu nome completo"
            className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20"
          />
        </div>

        {/* BIO */}
        <div>
          <Label className="text-white text-xs font-bold uppercase mb-2 block">
            Bio
          </Label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Conte um pouco sobre você..."
            rows={4}
            className="bg-black text-white placeholder:text-gray-500 border-white/10 focus:border-white/20 focus:ring-white/20 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            A bio aparecerá no seu cartão digital
          </p>
        </div>

        {/* BOTÃO SALVAR */}
        <StandardButton
          onClick={handleSave}
          icon={Save}
          text="SALVAR"
          color="#eab308"
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}