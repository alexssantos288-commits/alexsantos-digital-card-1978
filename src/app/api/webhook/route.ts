import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    
    const stripe = new Stripe(stripeKey);
    const supabase = getSupabase();

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET not configured');
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Payment confirmed:', session.id);
      console.log('Customer email:', session.customer_details?.email);

      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        try {
          const { data: keyData, error: keyError } = await supabase.rpc(
            'create_access_key',
            {
              p_email: customerEmail,
              p_nfc_tag_id: null,
              p_order_id: session.id,
            }
          );

          if (keyError) {
            console.error('Error generating key:', keyError);
            return NextResponse.json(
              { error: 'Error generating access key' },
              { status: 500 }
            );
          }

          const generatedKey = keyData[0]?.access_key;
          console.log('Key generated:', generatedKey);
          console.log('Email would be sent to:', customerEmail);
          console.log('With key:', generatedKey);

          return NextResponse.json({
            received: true,
            key: generatedKey,
            email: customerEmail,
          });
        } catch (error: any) {
          console.error('Error processing payment:', error);
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error in webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}