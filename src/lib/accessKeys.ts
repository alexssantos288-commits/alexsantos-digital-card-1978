import { supabase } from "./supabase";

/**
 * Criar nova chave de acesso
 */
export async function createAccessKey(data: {
  email: string;
  nfcTagId?: string;
  orderId?: string;
}) {
  try {
    const { data: result, error } = await supabase.rpc("create_access_key", {
      p_email: data.email,
      p_nfc_tag_id: data.nfcTagId || null,
      p_order_id: data.orderId || null,
    });

    if (error) throw error;

    return {
      success: true,
      accessKey: result[0].access_key,
      id: result[0].id,
    };
  } catch (error: any) {
    console.error("Erro ao criar chave:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Validar chave de acesso
 */
export async function validateAccessKey(accessKey: string) {
  try {
    const normalizedKey = accessKey.trim().toUpperCase();

    const { data, error } = await supabase
      .from("access_keys")
      .select("*")
      .eq("access_key", normalizedKey)
      .single();

    if (error || !data) {
      return { valid: false, error: "Chave não encontrada" };
    }

    if (data.is_activated) {
      return { valid: false, error: "Chave já ativada" };
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: "Chave expirada" };
    }

    return { valid: true, data };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}