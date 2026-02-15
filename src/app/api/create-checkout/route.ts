import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ✅ SEM apiVersion

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Cartão Digital INTEGRETYTAG",
              description: "Acesso vitalício ao seu cartão digital personalizado",
            },
            unit_amount: 7900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/comprar`,
      customer_email: email,
      metadata: {
        customer_email: email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}