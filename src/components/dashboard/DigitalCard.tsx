"use client";

import { Profile } from "@/types/profile";
import { Share2, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DigitalCardProps {
  profile: Profile;
}

function hexToRgba(hex: string, alpha: number): string {
  if (hex.startsWith("rgb")) return hex;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

export function DigitalCard({ profile }: DigitalCardProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/${profile.username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: profile.bio || `Confira o perfil de ${profile.name}`,
          url: url,
        });
      } catch (error) {
        console.log("Compartilhamento cancelado");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("✅ Link copiado para a área de transferência!");
    }
  };

  const handleSaveContact = async () => {
    // ✅ REGISTRAR CLIQUE NO BANCO DE DADOS
    try {
      await supabase.from("contact_saves").insert({
        profile_id: profile.user_id,
        ip_address: null,
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
      });
      console.log("✅ Clique registrado com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao registrar clique:", err);
      // Continua mesmo se falhar o registro
    }

    // CÓDIGO ORIGINAL DE SALVAR CONTATO
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
${profile.email ? `EMAIL:${profile.email}` : ''}
${profile.phone ? `TEL:${profile.phone}` : ''}
${profile.website ? `URL:${profile.website}` : ''}
${profile.bio ? `NOTE:${profile.bio}` : ''}
END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.username}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("✅ Contato salvo com sucesso!");
  };

  const theme = profile.theme || {};
  const itemColor = theme.itemColor || "#1ccec8";
  const textColor = theme.textColor || "#ffffff";
  const backgroundColor = theme.backgroundColor || "#000000";
  const borderRadius = theme.borderRadius || "24";
  const opacity = theme.opacity ? Number(theme.opacity) / 100 : 1;
  const itemColorWithOpacity = hexToRgba(itemColor, opacity);
  
  // Verificar se PIX está habilitado (FORÇAR BOOLEAN)
  const pixEnabled = !!(profile.pix_enabled && profile.pix_key);

  // 👇 DEBUG
  console.log("=== DEBUG PIX ===");
  console.log("pix_enabled:", profile.pix_enabled);
  console.log("pix_key:", profile.pix_key);
  console.log("pix_type:", profile.pix_type);
  console.log("pixEnabled:", pixEnabled);
  console.log("pixEnabled TYPE:", typeof pixEnabled);
  console.log("================");

  return (
    <div 
      className="relative overflow-visible shadow-2xl"
      style={{ 
        backgroundColor: itemColorWithOpacity, // ← aqui
        borderRadius: `${borderRadius}px`,
        padding: '32px 24px',
        paddingTop: '80px',
        marginTop: '80px',
      }}
    >
      {/* AVATAR CENTRALIZADO - METADE FORA */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2">
        <div 
          className="w-40 h-40 rounded-full overflow-hidden shadow-2xl"
          style={{
            backgroundColor: itemColor,
          }}
        >
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-4xl font-black"
              style={{
                backgroundColor: itemColorWithOpacity, // ← aqui
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
  
      {/* NOME */}
      {profile.name && (
        <h1 
          className="text-2xl font-black uppercase tracking-wider text-center mb-3"
          style={{ color: textColor }}
        >
          {profile.name}
        </h1>
      )}
  
      {/* BIO */}
      {profile.bio && (
        <p 
          className="text-sm leading-relaxed text-center px-4 mb-6"
          style={{ color: textColor, opacity: 0.9 }}
        >
          {profile.bio}
        </p>
      )}
  
      {/* BOTÕES DE AÇÃO - VAZIOS SEM BORDA */}
      <div className="grid grid-cols-2 gap-3">
        {/* BOTÃO COMPARTILHAR */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-2 transition-all hover:scale-105 active:scale-95"
          style={{ 
            background: "transparent",
            border: `1px solid ${textColor}`,
            borderRadius: `${parseInt(borderRadius) / 2}px`,
          }}
        >
          <Share2 size={18} style={{ color: textColor }} />
          <span className="text-xs font-bold leading-tight" style={{ color: textColor }}>
            Compartilhar
          </span>
        </button>

        {/* BOTÃO SALVAR CONTATO */}
        <button
          onClick={handleSaveContact}
          className="flex items-center justify-center gap-2 py-3 px-2 transition-all hover:scale-105 active:scale-95"
          style={{ 
            background: "transparent",
            border: `1px solid ${textColor}`,
            borderRadius: `${parseInt(borderRadius) / 2}px`,
          }}
        >
          <Download size={18} style={{ color: textColor }} />
          <span className="text-xs font-bold leading-tight" style={{ color: textColor }}>
            Salvar Contato
          </span>
        </button>
      </div>
    </div>
  );
}