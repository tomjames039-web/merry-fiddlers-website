import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendAfternoonTeaVoucherEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

// Email sending function
async function sendConfirmationEmail(
  type: string,
  customerEmail: string,
  details: Record<string, string>
) {
  console.log('📧 Sending confirmation email...');
  console.log('Type:', type);
  console.log('To:', customerEmail);

  if (type === 'afternoon-tea') {
    return await sendAfternoonTeaVoucherEmail({
      customerName: details.customerName,
      customerEmail: customerEmail,
      quantity: details.quantity,
      addProsecco: details.addProsecco,
      specialRequests: details.specialRequests,
    });
  }

  // For other types (gift vouchers, etc.) - keep existing behavior for now
  console.log('Details:', details);
  return true;
}

function generateAfternoonTeaEmailHTML(details: Record<string, string>): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Georgia, serif; color: #2d4a4a; }
        .header { background: #2d4a4a; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .details { background: #f8f6f1; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .highlight { color: #c9a55c; font-weight: bold; }
        .footer { background: #f8f6f1; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>The Merry Fiddlers</h1>
        <p>Booking Confirmation</p>
      </div>
      <div class="content">
        <h2>Dear ${details.customerName},</h2>
        <p>Thank you for booking your 50% Off Afternoon Tea experience with us!</p>

        <div class="details">
          <h3>Booking Details</h3>
          <p><strong>Date:</strong> ${details.date}</p>
          <p><strong>Time:</strong> ${details.time}</p>
          <p><strong>Guests:</strong> ${details.quantity}</p>
          ${details.addProsecco === 'true' ? '<p><strong>Upgrade:</strong> Prosecco included</p>' : ''}
          ${details.specialRequests ? `<p><strong>Special Requests:</strong> ${details.specialRequests}</p>` : ''}
        </div>

        <h3>Find Us</h3>
        <p>4 Fiddlers Hamlet, Epping CM16 7PY</p>
        <p>Phone: +44 1992 572142</p>

        <p>We look forward to welcoming you!</p>
        <p class="highlight">The Merry Fiddlers Team</p>
      </div>
      <div class="footer">
        <p>The Merry Fiddlers - Country Pub & Restaurant</p>
        <p>Proudly serving Epping since the 1600s</p>
      </div>
    </body>
    </html>
  `;
}

function generateGiftVoucherEmailHTML(details: Record<string, string>): string {
  const voucherCode = `MF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Georgia, serif; color: #2d4a4a; }
        .header { background: #2d4a4a; color: white; padding: 30px; text-align: center; }
        .voucher { background: linear-gradient(135deg, #c9a55c 0%, #b8944b 100%); color: white; padding: 40px; text-align: center; margin: 20px; border-radius: 12px; }
        .voucher-amount { font-size: 48px; font-weight: bold; }
        .voucher-code { background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 6px; font-family: monospace; font-size: 18px; margin-top: 15px; display: inline-block; }
        .content { padding: 30px; }
        .message { background: #f8f6f1; padding: 20px; border-radius: 8px; font-style: italic; margin: 20px 0; }
        .footer { background: #f8f6f1; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>The Merry Fiddlers</h1>
        <p>Gift Voucher</p>
      </div>

      <div class="voucher">
        <p>Gift Voucher for</p>
        <h2>${details.recipientName}</h2>
        <div class="voucher-amount">£${details.voucherAmount}</div>
        <div class="voucher-code">${voucherCode}</div>
        <p style="margin-top: 20px; font-size: 12px;">Valid for 12 months from issue date</p>
      </div>

      <div class="content">
        ${details.giftMessage ? `
          <div class="message">
            <p>"${details.giftMessage}"</p>
            <p style="text-align: right; font-style: normal;">- ${details.purchaserName}</p>
          </div>
        ` : ''}

        <h3>How to Redeem</h3>
        <p>Simply present this voucher (printed or on your phone) when paying at The Merry Fiddlers.</p>

        <h3>Find Us</h3>
        <p>4 Fiddlers Hamlet, Epping CM16 7PY</p>
        <p>Phone: +44 1992 572142</p>

        <p>We look forward to welcoming you!</p>
      </div>
      <div class="footer">
        <p>The Merry Fiddlers - Country Pub & Restaurant</p>
        <p>Proudly serving Epping since the 1600s</p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const customerEmail = session.customer_email || metadata.customerEmail || metadata.purchaserEmail;

      if (customerEmail) {
        await sendConfirmationEmail(
          metadata.type || 'unknown',
          customerEmail,
          metadata
        );

        // If it's a gift voucher with recipient email, send to recipient too
        if (metadata.type === 'gift-voucher' && metadata.recipientEmail) {
          await sendConfirmationEmail(
            'gift-voucher-recipient',
            metadata.recipientEmail,
            metadata
          );
        }
      }

      console.log('✅ Payment completed:', session.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('❌ Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
