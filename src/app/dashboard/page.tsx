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

  // VERIFICAÇÃO DE AUTENTICAÇÃO
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

    // LISTENER para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  // CARREGAR PERFIL
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

  // CARREGAR CONTAGEM DE SALVAMENTOS
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

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // ATUALIZAR PERFIL
  const handleProfileUpdate = () => {
    if (user) {
      loadProfile(user.id);
      loadContactSaves(user.id);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1ccec8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // SE NÃO TEM PERFIL
  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="text-white text-xl mb-4">
          ⚠️ Perfil não encontrado
        </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* CARDS DE ESTATÍSTICAS - 5 COLUNAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <User className="w-8 h-8 text-[#1ccec8] mb-3" />
            <p className="text-2xl font-black truncate">{profile.name || "Sem nome"}</p>
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

          <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <Save className="w-8 h-8 text-[#1ccec8] mb-3" />
            <p className="text-2xl font-black">{contactSavesCount}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Contatos Salvos</p>
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
              <ProfileEditor profile={profile} onUpdate={handleProfileUpdate} />
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
              <SocialLinksEditor profile={profile} onUpdate={handleProfileUpdate} />
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
              <LinkOrderManager profile={profile} onUpdate={handleProfileUpdate} />
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
              <CustomizationManager profile={profile} onUpdate={handleProfileUpdate} />
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
              <CatalogManager profile={profile} onUpdate={handleProfileUpdate} />
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
              <PixManager profile={profile} onUpdate={handleProfileUpdate} />
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
              <FormManager profile={profile} onUpdate={handleProfileUpdate} />
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
      </div>
    </div>
  );
}