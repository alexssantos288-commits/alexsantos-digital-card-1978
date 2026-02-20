import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabase } from '@/lib/supabase';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email || session.customer_details?.email;

    if (!customerEmail) {
      console.error('❌ No email found in session');
      return NextResponse.json({ error: 'No email' }, { status: 400 });
    }

    try {
      const supabase = getSupabase();
      let accessKey: string;
      let isNewKey = false;

      // Tentar gerar nova chave
      const { data, error } = await supabase.rpc('create_access_key', {
        p_email: customerEmail,
        p_nfc_tag_id: null,
        p_order_id: session.id,
      });

      if (error) {
        // Se erro for duplicata (código 23505), buscar chave existente
        if (error.code === '23505') {
          console.log('⚠️ Duplicate session detected, fetching existing key:', session.id);
          
          const { data: existingData, error: fetchError } = await supabase
            .from('access_keys')
            .select('access_key')
            .eq('stripe_session_id', session.id)
            .single();

          if (fetchError || !existingData) {
            console.error('❌ Error fetching existing key:', fetchError);
            return NextResponse.json({ error: 'Error retrieving access key' }, { status: 500 });
          }

          accessKey = existingData.access_key;
          console.log('✅ Using existing key:', accessKey);
        } else {
          // Outro erro, retornar erro
          console.error('❌ Error generating key:', error);
          return NextResponse.json({ error: 'Error generating access key' }, { status: 500 });
        }
      } else {
        // Chave gerada com sucesso
        const result = Array.isArray(data) ? data[0] : data;
        accessKey = result.access_key;
        isNewKey = true;
        console.log('✅ New key generated:', accessKey);
      }

      // INSTANCIAR RESEND
      if (!process.env.RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY not configured');
        return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      // ENVIAR EMAIL (sempre, seja chave nova ou existente)
      const emailResult = await resend.emails.send({
        from: 'INTEGRETY TAG <onboarding@resend.dev>',
        to: customerEmail,
        subject: '🎉 Sua chave de acesso chegou!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background: #000; color: #fff; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1ccec8; border-radius: 12px; padding: 40px; }
              .logo { text-align: center; font-size: 32px; font-weight: bold; color: #1ccec8; margin-bottom: 20px; }
              h1 { color: #1ccec8; font-size: 24px; margin-bottom: 10px; }
              p { font-size: 16px; line-height: 1.6; color: #ccc; }
              .key-box { background: #1a1a1a; border: 2px solid #1ccec8; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
              .key { font-size: 28px; font-weight: bold; color: #1ccec8; letter-spacing: 2px; }
              .button { display: inline-block; background: #1ccec8; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
              .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">INTEGRETY TAG</div>
              <h1>🎉 Parabéns pela sua compra!</h1>
              <p>Sua chave de acesso foi gerada com sucesso. Use o código abaixo para ativar sua tag NFC:</p>
              
              <div class="key-box">
                <div class="key">${accessKey}</div>
              </div>
              
              <p>📱 <strong>Como ativar:</strong></p>
              <ol style="color: #ccc;">
                <li>Acesse seu perfil no dashboard</li>
                <li>Vá em "Ativar Tag"</li>
                <li>Insira o código acima</li>
                <li>Pronto! Sua tag está ativa! 🚀</li>
              </ol>
              
              <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" class="button">Acessar Dashboard</a>
              
              <div class="footer">
                <p>Dúvidas? Entre em contato: integretytecnologia@gmail.com</p>
                <p>© 2026 INTEGRETY TAG - Todos os direitos reservados</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log('✅ Email sent to:', customerEmail);
      console.log('✅ Email ID:', emailResult.data?.id);
      console.log('✅ Access key:', accessKey);
      console.log('✅ Is new key:', isNewKey);

      return NextResponse.json({ 
        received: true, 
        key: accessKey, 
        email: customerEmail,
        emailSent: true,
        isNewKey 
      });

    } catch (err: any) {
      console.error('❌ Error processing webhook:', err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}