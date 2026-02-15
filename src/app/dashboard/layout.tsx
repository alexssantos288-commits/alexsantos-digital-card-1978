"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/auth/login");
    } else {
      setUser(user);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1ccec8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
     
     
      {/* NAVBAR DO DASHBOARD */}
<nav className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <Link href="/dashboard" className="text-xl font-black uppercase tracking-tighter">
      INTEGRETY<span className="text-[#1ccec8]">TAG</span>
    </Link>

    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-400 hidden md:block">
        {user?.email}
      </span>
      
      <Link
        href={`/${user?.user_metadata?.username || 'preview'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#1ccec8] hover:bg-[#1ccec8]/10 border border-white/10 hover:border-[#1ccec8]/30 rounded-lg transition text-sm font-bold uppercase tracking-wider"
      >
        <User className="w-4 h-4" />
        Ver Perfil
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition text-sm font-bold uppercase tracking-wider text-red-500"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    </div>
  </div>
</nav>

      {/* CONTEÚDO DO DASHBOARD */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}