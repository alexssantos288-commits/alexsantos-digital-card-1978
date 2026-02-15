import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ✅ SEM apiVersion

export async function POST(request: Request) {
  try {
    const isDevelopment = !process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    if (isDevelopment) {
      const body = await request.json();
      event = body;
      console.log("🧪 Modo teste: webhook recebido");
    } else {
      const body = await request.text();
      const signature = request.headers.get("stripe-signature")!;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Webhook verificado com sucesso");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.metadata?.customer_email;

      if (!customerEmail) {
        console.error("❌ Email não encontrado no checkout");
        return NextResponse.json({ error: "Email não encontrado" }, { status: 400 });
      }

      console.log("💰 Pagamento confirmado para:", customerEmail);

      const { data: keyData, error: keyError } = await supabase
        .rpc("create_access_key", {
          p_email: customerEmail,
          p_nfc_tag_id: null,
          p_order_id: session.id,
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
        email: customerEmail,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}