"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { User, Link as LinkIcon, ShoppingBag, FileText, ExternalLink, Palette, Share2, Banknote } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";
import { SocialLinksEditor } from "@/components/dashboard/SocialLinksEditor";
import { LinkManager } from "@/components/dashboard/LinkManager";
import { CustomizationManager } from "@/components/dashboard/CustomizationManager";
import { Button } from "@/components/ui/button";
import { PixManager } from "@/components/dashboard/PixManager";
import { CatalogManager } from "@/components/dashboard/CatalogManager";
import { FormManager } from "@/components/dashboard/FormManager";
import { LinkOrderManager } from "@/components/dashboard/LinkOrderManager";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Erro ao carregar perfil:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1ccec8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Perfil não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
          SEU <span className="text-[#1ccec8]">DASHBOARD</span>
        </h1>
        <p className="text-gray-400 mb-6">Gerencie seu cartão digital</p>
        
        </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
          <User className="w-8 h-8 text-[#1ccec8] mb-3" />
          <p className="text-2xl font-black">{profile.name || "Sem nome"}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Perfil</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
          <LinkIcon className="w-8 h-8 text-[#1ccec8] mb-3" />
          <p className="text-2xl font-black">{profile.links?.length || 0}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Links</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
          <ShoppingBag className="w-8 h-8 text-[#1ccec8] mb-3" />
          <p className="text-2xl font-black">{profile.catalog?.length || 0}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Produtos</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
          <FileText className="w-8 h-8 text-[#1ccec8] mb-3" />
          <p className="text-2xl font-black">{profile.contactform?.fields?.length || 0}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Campos</p>
        </div>
      </div>

      {/* ACCORDIONS */}
      <Accordion type="single" collapsible className="space-y-4">
        
          {/* PERFIL BÁSICO - AMARELO #eab308 */}
          <AccordionItem value="basic" className="border border-white/10 rounded-lg px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eab308' }}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-normal text-white tracking-normal">
                  Perfil Básico
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <ProfileEditor profile={profile} onUpdate={loadProfile} />
            </AccordionContent>
          </AccordionItem>

          {/* REDES SOCIAIS - ROXO #a855f7 */}
          <AccordionItem value="social" className="border border-white/10 rounded-lg px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#a855f7' }}>
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-normal text-white tracking-normal">
                  Redes Sociais
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <SocialLinksEditor profile={profile} onUpdate={loadProfile} />
            </AccordionContent>
          </AccordionItem>

          {/* ORDEM DOS LINKS - ROXO ESCURO #8b5cf6 */}
          <AccordionItem value="order" className="border border-white/10 rounded-lg px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8b5cf6' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <span className="text-base font-normal text-white tracking-normal">
                  Ordem dos Links
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <LinkOrderManager profile={profile} onUpdate={loadProfile} />
            </AccordionContent>
          </AccordionItem>

          {/* PERSONALIZAÇÃO - VERDE #22c55e */}
          <AccordionItem value="theme" className="border border-white/10 rounded-lg px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-normal text-white tracking-normal">
                  Personalização
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <CustomizationManager profile={profile} onUpdate={loadProfile} />
            </AccordionContent>
          </AccordionItem>

          {/* CATÁLOGO - LARANJA #f97316 */}
          <AccordionItem value="catalog" className="border border-white/10 rounded-lg px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-normal text-white tracking-normal">
                  Catálogo
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <CatalogManager profile={profile} onUpdate={loadProfile} />
            </AccordionContent>
          </AccordionItem>

          {/* PIX - CIANO #06b6d4 */}
          <AccordionItem value="pix" className="border border-white/10 rounded-lg px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#06b6d4' }}>
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-normal text-white tracking-normal">
                  PIX
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <PixManager profile={profile} onUpdate={loadProfile} />
            </AccordionContent>
          </AccordionItem>

          {/* FORMULÁRIO DE CONTATO - LARANJA #f97316 */}
          <AccordionItem value="form" className="border border-white/10 rounded-lg px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-normal text-white tracking-normal">
                  Formulário de Contato
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <FormManager profile={profile} onUpdate={loadProfile} />
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
    </div>
  );
}