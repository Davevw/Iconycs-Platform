import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  const getTier = (priceId: string): string => {
    const tierMap: Record<string, string> = {
      'price_1TIbbH9CvaSs0o4ACH7uaAGG': 'analyst',     // $98/mo
      'price_1TIbbI9CvaSs0o4An8tfp1fS': 'professional', // $398/mo
      'price_1TIbbJ9CvaSs0o4A4wpO81yP': 'enterprise',   // $20k/mo
    };
    return tierMap[priceId] || 'free';
  };

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        await supabase.from('iconycs_users').upsert({
          email: customerEmail,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id;
      const tier = getTier(priceId);

      await supabase.from('iconycs_users')
        .update({
          tier,
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', sub.customer as string);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('iconycs_users')
        .update({
          tier: 'free',
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', sub.customer as string);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await supabase.from('iconycs_users')
        .update({ subscription_status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', invoice.customer as string);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
