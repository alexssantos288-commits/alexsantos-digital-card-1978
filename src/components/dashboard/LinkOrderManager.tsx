"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Save, GripVertical, Eye, EyeOff } from "lucide-react";
import { StandardButton } from "@/components/dashboard/StandardButton";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Star,
  Music,
} from "lucide-react";

interface LinkOrderManagerProps {
  profile: Profile;
  onUpdate: () => void;
}

interface ContactItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// COMPONENTE ITEM ARRASTÁVEL
function SortableItem({
  id,
  item,
  isActive,
  isIconOnly,
  onToggleActive,
  onToggleIconOnly,
}: {
  id: string;
  item: ContactItem;
  isActive: boolean;
  isIconOnly: boolean;
  onToggleActive: (id: string) => void;
  onToggleIconOnly: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-lg bg-black/40 border border-white/10 transition"
     >
      {/* GRIP PARA ARRASTAR */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-gray-500" />
      </div>
  
      
      {/* ÍCONE + LABEL */}
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center">
          {item.icon}
        </div>
        <span className="font-bold text-white">{item.label}</span>
      </div>

      {/* TOGGLE ÍCONE APENAS */}
      <button
        onClick={() => onToggleIconOnly(id)}
        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
          isIconOnly
            ? "bg-[#8b5cf6] text-white"
            : "bg-white/5 text-gray-400 hover:bg-white/10"
        }`}
      >
        {isIconOnly ? "Ícone" : "Nome"}
      </button>

      {/* TOGGLE VISIBILIDADE */}
      <button
        onClick={() => onToggleActive(id)}
        className={`p-2 rounded-lg transition ${
          isActive
            ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
            : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
        }`}
      >
        {isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
    </div>
  );
}

export function LinkOrderManager({ profile, onUpdate }: LinkOrderManagerProps) {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [contactActive, setContactActive] = useState<Record<string, boolean>>({});
  const [contactIconOnly, setContactIconOnly] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // LISTA DE TODOS OS CONTATOS DISPONÍVEIS (INCLUINDO PIX)
  const availableContacts: ContactItem[] = [
    { id: "whatsapp", label: "WhatsApp", icon: <MessageCircle className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "email", label: "E-mail", icon: <Mail className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "phone", label: "Telefone", icon: <Phone className="w-5 h-5 text-[#8b5cf6]" /> },
    {
      id: "pix",
      label: "Cobre com PIX",
      icon: (
        <svg className="w-5 h-5 text-[#8b5cf6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      ),
    },
    { id: "instagram", label: "Instagram", icon: <Instagram className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "facebook", label: "Facebook", icon: <Facebook className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "twitter", label: "Twitter", icon: <Twitter className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "youtube", label: "YouTube", icon: <Youtube className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "spotify", label: "Spotify", icon: <Music className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "address", label: "Localização", icon: <MapPin className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "website", label: "Website", icon: <Globe className="w-5 h-5 text-[#8b5cf6]" /> },
    { id: "google_reviews", label: "Avaliações Google", icon: <Star className="w-5 h-5 text-[#8b5cf6]" /> },
  ];

  useEffect(() => {
    if (profile) {
      // ORDEM DOS CONTATOS
      const order = profile.contact_order || [
        "whatsapp",
        "email",
        "phone",
        "pix",
        "instagram",
        "facebook",
        "linkedin",
        "twitter",
        "youtube",
        "spotify",
        "address",
        "website",
        "google_reviews",
      ];

      // CRIAR LISTA DE ITEMS NA ORDEM SALVA
      const orderedItems = order
        .map((id) => availableContacts.find((c) => c.id === id))
        .filter(Boolean) as ContactItem[];

      setItems(orderedItems);
      setContactActive(profile.contact_active || {});
      setContactIconOnly(profile.contact_icon_only || {});
    }
  }, [profile]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleToggleActive = (id: string) => {
    setContactActive((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleIconOnly = (id: string) => {
    setContactIconOnly((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveOrder = async () => {
    try {
      setLoading(true);
      
      console.log("💾 SALVANDO ORDEM DOS LINKS...");
      
      // EXTRAIR APENAS OS IDs NA NOVA ORDEM
      const newOrder = items.map(item => item.id);
      
      console.log("📋 Nova ordem:", newOrder);
      console.log("👁️ Visibilidade:", contactActive);
      console.log("🎨 Ícone apenas:", contactIconOnly);
  
      // SALVAR TUDO NO PERFIL
      const { error } = await supabase
        .from("profiles")
        .update({
          contact_order: newOrder,
          contact_active: contactActive,
          contact_icon_only: contactIconOnly,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);
  
      if (error) {
        console.error("❌ Erro ao salvar:", error);
        throw error;
      }
  
      console.log("✅ ORDEM SALVA COM SUCESSO!");
      alert("✅ Ordem dos links salva com sucesso!");
      
      // FORÇAR ATUALIZAÇÃO DO PERFIL
      onUpdate();
      
    } catch (error: any) {
      console.error("❌ ERRO AO SALVAR ORDEM:", error);
      alert("❌ Erro ao salvar ordem: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-400">
          Arraste os itens para reorganizar a ordem em que aparecem no seu perfil. 
          Use os botões para alternar entre exibição completa/ícone e visibilidade.
        </p>

        {/* LISTA ARRASTÁVEL */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  isActive={contactActive[item.id] !== false}
                  isIconOnly={contactIconOnly[item.id] === true}
                  onToggleActive={handleToggleActive}
                  onToggleIconOnly={handleToggleIconOnly}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* BOTÃO SALVAR */}
        <StandardButton
          onClick={handleSaveOrder}
          icon={Save}
          text="SALVAR ORDEM"
          color="#8b5cf6"
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}