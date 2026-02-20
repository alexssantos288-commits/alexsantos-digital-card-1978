import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'No email' }, { status: 400 });
  }

  const supabase = getSupabase();

  // Verificar se email já tem conta
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('email', email)
    .single();

  return NextResponse.json({
    hasAccount: !!data && !error,
  });
}