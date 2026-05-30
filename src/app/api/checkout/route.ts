import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type, // 'afternoon-tea' or 'gift-voucher'
      quantity,
      addProsecco,
      selectedDate,
      selectedTime,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      voucherAmount, // For gift vouchers
      recipientName,
      recipientEmail,
      giftMessage,
    } = body;

    let lineItems: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
          images?: string[];
        };
        unit_amount: number;
      };
      quantity: number;
    }> = [];
    let metadata: Record<string, string> = {};

    if (type === 'afternoon-tea') {
      // Afternoon Tea offer - 50% off
      const teaPrice = 1750; // £17.50 in pence (50% off £35)
      const proseccoPrice = 750; // £7.50 in pence

      lineItems = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: '50% Off Afternoon Tea Voucher',
              description: `Afternoon Tea voucher for ${quantity} ${quantity === 1 ? 'person' : 'people'} - We'll contact you to arrange booking`,
              images: ['https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400'],
            },
            unit_amount: teaPrice,
          },
          quantity: quantity,
        },
      ];

      if (addProsecco) {
        lineItems.push({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Prosecco Upgrade',
              description: 'Glass of Prosecco per person',
            },
            unit_amount: proseccoPrice,
          },
          quantity: quantity,
        });
      }

      metadata = {
        type: 'afternoon-tea',
        quantity: String(quantity),
        customerName,
        customerEmail,
        customerPhone,
        specialRequests: specialRequests || '',
        addProsecco: String(addProsecco),
      };
    } else if (type === 'gift-voucher') {
      // Gift voucher
      const voucherAmountPence = Math.round(voucherAmount * 100);

      lineItems = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'The Merry Fiddlers Gift Voucher',
              description: `Gift voucher worth £${voucherAmount} for ${recipientName}`,
              images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'],
            },
            unit_amount: voucherAmountPence,
          },
          quantity: 1,
        },
      ];

      metadata = {
        type: 'gift-voucher',
        voucherAmount: String(voucherAmount),
        recipientName,
        recipientEmail: recipientEmail || '',
        giftMessage: giftMessage || '',
        purchaserName: customerName,
        purchaserEmail: customerEmail,
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${request.headers.get('origin')}/${type === 'afternoon-tea' ? 'afternoon-tea-offer' : 'gift-vouchers'}`,
      customer_email: customerEmail,
      metadata,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
