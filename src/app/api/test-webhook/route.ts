import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, sessionId } = await request.json();

    console.log("🧪 Teste de webhook - Email:", email);

    // GERAR CHAVE AUTOMATICAMENTE
    const { data: keyData, error: keyError } = await supabase
      .rpc("create_access_key", {
        p_email: email,
        p_nfc_tag_id: null,
        p_order_id: sessionId || "test_" + Date.now(),
      });

    if (keyError) {
      console.error("❌ Erro ao gerar chave:", keyError);
      return NextResponse.json({ error: "Erro ao gerar chave" }, { status: 500 });
    }

    const generatedKey = keyData[0].access_key;
    console.log("🔑 Chave gerada:", generatedKey);

    return NextResponse.json({
      success: true,
      key: generatedKey,
      email: email,
    });
  } catch (error: any) {
    console.error("❌ Erro:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}