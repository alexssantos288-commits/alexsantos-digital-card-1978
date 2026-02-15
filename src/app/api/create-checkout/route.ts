import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Initialize Stripe inside the function
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    
    const stripe = new Stripe(stripeKey);

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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
              name: "INTEGRETYTAG - Cartao Digital NFC",
              description: "Acesso vitalicio ao sistema de cartao digital",
            },
            unit_amount: 9900,
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
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}