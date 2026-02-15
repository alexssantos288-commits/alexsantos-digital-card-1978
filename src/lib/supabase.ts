import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      }
    });
  }

  return supabaseInstance;
}

// Para compatibilidade com código antigo
export const supabase = {
  get auth() { return getSupabase().auth; },
  get from() { return getSupabase().from.bind(getSupabase()); },
  get rpc() { return getSupabase().rpc.bind(getSupabase()); },
  get storage() { return getSupabase().storage; },
};