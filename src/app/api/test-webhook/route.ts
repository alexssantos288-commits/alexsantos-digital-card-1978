import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const { email, sessionId } = await request.json();

    console.log("Test webhook - Email:", email);

    const { data: keyData, error: keyError } = await supabase
      .rpc("create_access_key", {
        p_email: email,
        p_nfc_tag_id: null,
        p_order_id: sessionId || "test_" + Date.now(),
      });

    if (keyError) {
      console.error("Error generating key:", keyError);
      return NextResponse.json(
        { error: "Error generating access key" },
        { status: 500 }
      );
    }

    const generatedKey = keyData[0]?.access_key;
    console.log("Generated key:", generatedKey);

    return NextResponse.json({
      success: true,
      key: generatedKey,
      email: email,
    });
  } catch (error: any) {
    console.error("Error in test webhook:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}