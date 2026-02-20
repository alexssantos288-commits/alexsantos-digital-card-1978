import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'No session_id' }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('access_keys')
    .select('access_key, email')
    .eq('stripe_session_id', sessionId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  }

  return NextResponse.json({
    key: data.access_key,
    email: data.email,
  });
}