"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { User, Link as LinkIcon, ShoppingBag, FileText, Save, Palette, Share2, Banknote, LogOut } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";
import { SocialLinksEditor } from "@/components/dashboard/SocialLinksEditor";
import { CustomizationManager } from "@/components/dashboard/CustomizationManager";
import { PixManager } from "@/components/dashboard/PixManager";
import { CatalogManager } from "@/components/dashboard/CatalogManager";
import { FormManager } from "@/components/dashboard/FormManager";
import { LinkOrderManager } from "@/components/dashboard/LinkOrderManager";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactSavesCount, setContactSavesCount] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/auth/login");
          return;
        }
        setUser(session.user);
        await loadProfile(session.user.id);
        await loadContactSaves(session.user.id);
      } catch (err: any) {
        console.error("❌ Erro crítico:", err);
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!session) {
        router.push("/auth/login");
      } else {
        setUser(session.user);
        loadProfile(session.user.id);
        loadContactSaves(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("❌ Erro ao carregar perfil:", error);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ Erro ao carregar perfil:", err);
      setLoading(false);
    }
  };

  const loadContactSaves = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from("contact_saves")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", userId);

      if (error) throw error;
      setContactSavesCount(count || 0);
    } catch (error) {
      console.error("Erro ao carregar contagem de salvamentos:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleProfileUpdate = () => {
    if (user) {
      loadProfile(user.id);
      loadContactSaves(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1ccec8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <p className="text-white text-lg mb-4">⚠️ Perfil não encontrado</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-500/20 text-red-500 font-bold rounded-lg"
        >
          Voltar ao Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

     

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* HEADER DO DASHBOARD */}
<div className="bg-black/90 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
    
    {/* LOGO */}
    <Link href="/" className="text-base sm:text-xl font-black uppercase tracking-tighter shrink-0">
      INTEGRETY<span className="text-[#1ccec8]">TAG</span>
    </Link>

    {/* BOTÕES */}
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href={`/p/${profile.username}`}
        target="_blank"
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#1ccec8] text-[#1ccec8] text-xs font-bold uppercase tracking-wide hover:bg-[#1ccec8]/10 transition whitespace-nowrap"
      >
        <Share2 className="w-3 h-3 shrink-0" />
        <span>Ver Perfil</span>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wide hover:bg-red-500/10 transition whitespace-nowrap"
      >
        <LogOut className="w-3 h-3 shrink-0" />
        <span>Sair</span>
      </button>
    </div>

  </div>
</div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">

          <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#1ccec8] mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-black truncate">{profile.name || "Sem nome"}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1">Perfil</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <LinkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#1ccec8] mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-black">{profile.links?.length || 0}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1">Links</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-[#1ccec8] mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-black">{profile.catalog?.length || 0}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1">Produtos</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#1ccec8] mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-black">{profile.contactform?.fields?.length || 0}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1">Campos</p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <Save className="w-6 h-6 sm:w-8 sm:h-8 text-[#1ccec8] mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-black">{contactSavesCount}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1">Contatos Salvos</p>
          </div>

        </div>

        {/* ACCORDIONS */}
        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">

          {/* PERFIL BÁSICO */}
          <AccordionItem value="basic" className="border border-white/10 rounded-lg px-3 sm:px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#eab308' }}>
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-normal text-white">Perfil Básico</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 sm:pt-4">
              <ProfileEditor profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>

          {/* REDES SOCIAIS */}
          <AccordionItem value="social" className="border border-white/10 rounded-lg px-3 sm:px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#a855f7' }}>
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-normal text-white">Redes Sociais</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 sm:pt-4">
              <SocialLinksEditor profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>

          {/* ORDEM DOS LINKS */}
          <AccordionItem value="order" className="border border-white/10 rounded-lg px-3 sm:px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8b5cf6' }}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-normal text-white">Ordem dos Links</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 sm:pt-4">
              <LinkOrderManager profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>

          {/* PERSONALIZAÇÃO */}
          <AccordionItem value="theme" className="border border-white/10 rounded-lg px-3 sm:px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#22c55e' }}>
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-normal text-white">Personalização</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 sm:pt-4">
              <CustomizationManager profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>

          {/* CATÁLOGO */}
          <AccordionItem value="catalog" className="border border-white/10 rounded-lg px-3 sm:px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f97316' }}>
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-normal text-white">Catálogo</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 sm:pt-4">
              <CatalogManager profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>

          {/* PIX */}
          <AccordionItem value="pix" className="border border-white/10 rounded-lg px-3 sm:px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#06b6d4' }}>
                  <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-normal text-white">PIX</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 sm:pt-4">
              <PixManager profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>

          {/* FORMULÁRIO DE CONTATO */}
          <AccordionItem value="form" className="border border-white/10 rounded-lg px-3 sm:px-4 bg-black/20">
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f97316' }}>
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-normal text-white">Formulário de Contato</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 sm:pt-4">
              <FormManager profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}