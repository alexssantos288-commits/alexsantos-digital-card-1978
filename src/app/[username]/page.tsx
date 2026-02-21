"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { DigitalCard } from "@/components/dashboard/DigitalCard";
import { ContactFormComponent } from "../../components/ContactFormComponent";
import { PixModal } from "@/components/PixModal";
import { ImageSlider } from "@/components/ImageSlider";
import { 
  FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn,
  FaTwitter, FaYoutube, FaSpotify, FaPix
} from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn, MdLanguage } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";

interface ProfilePageProps {
  params: { username: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pixModalOpen, setPixModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return;
      }

      setProfile(data);
    };

    fetchProfile();
  }, [username]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const theme = profile.theme || {};
  const itemColor = theme.itemColor || "#1ccec8";
  const textColor = theme.textColor || "#ffffff";
  const backgroundColor = theme.backgroundColor || "#000000";
  const borderRadius = theme.borderRadius || "24";
  const backgroundImage = theme.backgroundImage;
  const backgroundType = theme.backgroundType || "solid";
  const gradientColor1 = theme.gradientColor1;
  const gradientColor2 = theme.gradientColor2;
  const blur = theme.blur || "0";

  // ✅ OPACIDADE - aplicada APENAS nos botões de ação
  const opacity = theme.opacity ? Number(theme.opacity) / 100 : 1;

  // ✅ BACKGROUND
  let backgroundStyle: React.CSSProperties = {};

  if (
    (backgroundType === "gradient" || backgroundType === "gradient-custom") &&
    gradientColor1 &&
    gradientColor2
  ) {
    backgroundStyle.background = `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;
  } else if (
    backgroundType === "gradient" &&
    backgroundColor?.startsWith("linear-gradient")
  ) {
    backgroundStyle.background = backgroundColor;
  } else if (backgroundType === "image" && backgroundImage) {
    backgroundStyle.backgroundImage = `url(${backgroundImage})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
    backgroundStyle.backgroundRepeat = "no-repeat";
  } else {
    backgroundStyle.backgroundColor = backgroundColor;
  }

  const contactOrder = profile.contact_order || [
    "whatsapp", "email", "phone", "pix", "instagram",
    "facebook", "linkedin", "twitter", "youtube",
    "spotify", "address", "website", "google_reviews",
  ];

  const contactActive = profile.contact_active || {};
  const contactIconOnly = profile.contact_icon_only || {};

  // ✅ OPACIDADE APENAS NOS BOTÕES DE AÇÃO
  const renderContactButton = (
    id: string,
    href: string,
    icon: React.ReactNode,
    label: string,
    external: boolean = false
  ) => {
    if (contactActive[id] === false) return null;

    const isIconOnly = contactIconOnly[id];

    if (isIconOnly) {
      return (
        <a
          key={id}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="flex items-center justify-center transition-all hover:scale-110 shadow-lg"
          style={{
            backgroundColor: itemColor,
            color: textColor,
            borderRadius: `${parseInt(borderRadius) / 3}px`,
            width: "48px",
            height: "48px",
            opacity: opacity, // ✅ OPACIDADE NO BOTÃO
          }}
          title={label}
        >
          <div style={{ width: "20px", height: "20px" }}>{icon}</div>
        </a>
      );
    }

    return (
      <a
        key={id}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center justify-center gap-3 p-4 transition-all hover:scale-105 shadow-lg w-full"
        style={{
          backgroundColor: itemColor,
          color: textColor,
          borderRadius: `${borderRadius}px`,
          opacity: opacity, // ✅ OPACIDADE NO BOTÃO
        }}
      >
        {icon}
        <span className="font-bold uppercase tracking-wide text-sm">{label}</span>
      </a>
    );
  };

  const contactMethods: Record<string, React.ReactNode> = {
    email: profile.email && renderContactButton("email", `mailto:${profile.email}`, <MdEmail size={22} />, "E-MAIL"),
    phone: profile.phone && renderContactButton("phone", `tel:${profile.phone}`, <MdPhone size={22} />, "TELEFONE"),
    whatsapp: profile.whatsapp && renderContactButton(
      "whatsapp",
      `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
      <FaWhatsapp size={22} />, "WHATSAPP", true
    ),

    // ✅ OPACIDADE NO BOTÃO PIX
    pix: profile.pix_enabled && profile.pix_key ? (
      <button
        key="pix"
        onClick={() => setPixModalOpen(true)}
        className="flex items-center justify-center gap-3 p-4 transition-all hover:scale-105 shadow-lg w-full"
        style={{
          backgroundColor: itemColor,
          color: textColor,
          borderRadius: `${borderRadius}px`,
          opacity: opacity, // ✅ OPACIDADE NO BOTÃO PIX
        }}
      >
        <FaPix size={22} />
        <span className="font-bold uppercase tracking-wide text-sm">COBRE COM PIX</span>
      </button>
    ) : null,

    address: profile.address && renderContactButton(
      "address",
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`,
      <MdLocationOn size={22} />, "LOCALIZAÇÃO", true
    ),
    website: profile.website && renderContactButton("website", profile.website, <MdLanguage size={22} />, "SITE", true),
    instagram: profile.instagram && renderContactButton(
      "instagram", `https://instagram.com/${profile.instagram}`, <FaInstagram size={22} />, "INSTAGRAM", true
    ),
    facebook: profile.facebook && renderContactButton(
      "facebook", `https://facebook.com/${profile.facebook}`, <FaFacebookF size={22} />, "FACEBOOK", true
    ),
    linkedin: profile.linkedin && renderContactButton(
      "linkedin", `https://linkedin.com/in/${profile.linkedin}`, <FaLinkedinIn size={22} />, "LINKEDIN", true
    ),
    twitter: profile.twitter && renderContactButton(
      "twitter", `https://twitter.com/${profile.twitter}`, <FaTwitter size={22} />, "TWITTER", true
    ),
    youtube: profile.youtube && renderContactButton(
      "youtube", `https://youtube.com/@${profile.youtube}`, <FaYoutube size={22} />, "YOUTUBE", true
    ),
    spotify: profile.spotify && renderContactButton(
      "spotify", profile.spotify, <FaSpotify size={22} />, "SPOTIFY", true
    ),
    google_reviews: profile.google_reviews && renderContactButton(
      "google_reviews", profile.google_reviews, <AiFillStar size={22} />, "AVALIAÇÕES", true
    ),
  };

  const hasIconOnlyContacts = contactOrder.some((key) => contactIconOnly[key]);
  const iconOnlyContacts = contactOrder.filter((key) => contactIconOnly[key]).map((key) => contactMethods[key]).filter(Boolean);
  const fullContacts = contactOrder.filter((key) => !contactIconOnly[key]).map((key) => contactMethods[key]).filter(Boolean);

  return (
    <div className="min-h-screen relative" style={backgroundStyle}>

      {/* BLUR NA IMAGEM */}
      {backgroundType === "image" && backgroundImage && parseInt(blur) > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
          }}
        />
      )}

      <div className="max-w-md mx-auto px-6 py-12 relative z-10">

        {/* CARTÃO DIGITAL */}
        <DigitalCard profile={profile} />

        {/* BOTÕES DE CONTATO */}
        {(iconOnlyContacts.length > 0 || fullContacts.length > 0) && (
          <div className="mt-8 mb-12 space-y-4">
            {hasIconOnlyContacts && (
              <div className="flex justify-center w-full mb-4">
                <div style={{
                  display: "flex", flexWrap: "wrap", justifyContent: "center",
                  alignItems: "center", gap: "10px", maxWidth: "220px", margin: "0 auto"
                }}>
                  {iconOnlyContacts}
                </div>
              </div>
            )}
            {fullContacts.length > 0 && (
              <div className="space-y-4">{fullContacts}</div>
            )}
          </div>
        )}

        {/* CATÁLOGO - SEM OPACIDADE */}
        {profile.catalog && profile.catalog.length > 0 && (
          <div className="mt-8 mb-12">
            <div className="grid grid-cols-1 gap-6">
              {profile.catalog.map((product: any) => {
                const showImageAbove = product.showImageAbove !== false;
                const productImages = product.images || (product.image ? [product.image] : []);

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden shadow-xl transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: itemColor,
                      borderRadius: `${borderRadius}px`,
                      // ✅ SEM OPACIDADE NO CATÁLOGO
                    }}
                  >
                    {showImageAbove && productImages.length > 0 && (
                      <ImageSlider images={productImages} alt={product.name} borderRadius={borderRadius} />
                    )}
                    <div className="p-5 space-y-3">
                      <h4 className="font-bold text-lg uppercase tracking-wide" style={{ color: textColor }}>
                        {product.name}
                      </h4>
                      {product.description && (
                        <p className="text-sm opacity-90" style={{ color: textColor }}>{product.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black" style={{ color: textColor }}>
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price || 0)}
                        </span>
                        {product.link && (
                          <a
                            href={product.link} target="_blank" rel="noopener noreferrer"
                            className="px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all hover:scale-105 shadow-lg"
                            style={{ backgroundColor: textColor, color: itemColor }}
                          >
                            {product.buttonText || "COMPRAR"}
                          </a>
                        )}
                      </div>
                    </div>
                    {!showImageAbove && productImages.length > 0 && (
                      <ImageSlider images={productImages} alt={product.name} borderRadius={borderRadius} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FORMULÁRIO - SEM OPACIDADE, BORDA COM OPACIDADE HEX */}
        {profile.contactform?.enabled && (
          <div
            className="overflow-hidden shadow-lg mb-12"
            style={{
              backgroundColor: itemColor,
              borderRadius: `${borderRadius}px`,
              border: `2px solid ${textColor}40`, // ✅ BORDA COM OPACIDADE HEX
              padding: "24px",
              // ✅ SEM OPACIDADE NO CONTAINER
            }}
          >
            <h3 className="text-center font-black uppercase text-lg mb-6 tracking-wider" style={{ color: textColor }}>
              {profile.contactform.title || "ENTRE EM CONTATO"}
            </h3>
            <ContactFormComponent profile={profile} />
          </div>
        )}
      </div>

      {/* RODAPÉ */}
      <div className="mt-2 pb-8 flex justify-center px-4">
        <a href="/" className="block transition-all hover:scale-105" title="INTEGRETY TAG">
          <img
            src="/integrety.png" alt="INTEGRETY" width={991} height={131}
            className="w-auto h-auto opacity-80 hover:opacity-100"
            style={{ maxWidth: "400px" }}
          />
        </a>
      </div>

      {/* MODAL PIX */}
      {profile.pix_enabled && profile.pix_key && (
        <PixModal
          isOpen={pixModalOpen}
          onClose={() => setPixModalOpen(false)}
          pixKey={profile.pix_key || ""}
          pixType={profile.pix_type || "cpf"}
          beneficiaryName={profile.pix?.beneficiaryName || profile.name}
          city={profile.pix?.city || "Sao Paulo"}
          avatarUrl={profile.avatar}
        />
      )}
    </div>
  );
}