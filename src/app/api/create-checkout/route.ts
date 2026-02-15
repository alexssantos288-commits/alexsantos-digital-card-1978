import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Inicializar Stripe DENTRO da função
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY não configurada');
    }
    
    const stripe = new Stripe(stripeKey);

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "INTEGRETYTAG - Cartão Digital NFC",
              description: "Acesso vitalício ao sistema de cartão digital",
            },
            unit_amount: 9900, // R$ 99,00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/comprar`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}