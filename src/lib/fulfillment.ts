import { getStripe } from './stripe';
import {
  type Voucher,
  type Lead,
  saveVoucher,
  saveLead,
  findVoucherBySession,
} from './store';
import {
  sendGiftVoucherEmail,
  sendAfternoonTeaVoucherEmail,
  sendBusinessNotificationEmail,
  generateGiftVoucherCode,
  generateVoucherCode,
} from './email';

export interface FulfillResult {
  status: 'paid' | 'unpaid' | 'not_configured' | 'error';
  voucher?: Voucher;
  alreadyFulfilled?: boolean;
  type?: string;
  error?: string;
}

/**
 * Verifies a Stripe Checkout session is paid, then records the voucher,
 * sends the customer voucher email + a business notification, and stores a
 * lead. Safe to call multiple times for the same session (idempotent).
 */
export async function fulfillCheckout(sessionId: string): Promise<FulfillResult> {
  const stripe = getStripe();
  if (!stripe) return { status: 'not_configured' };

  const existing = await findVoucherBySession(sessionId);
  if (existing) {
    return { status: 'paid', voucher: existing, alreadyFulfilled: true, type: existing.type };
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return { status: 'error', error: 'session_not_found' };
  }

  if (session.payment_status !== 'paid') {
    return { status: 'unpaid' };
  }

  const md = (session.metadata || {}) as Record<string, string>;
  const now = new Date().toISOString();
  const amountTotal = (session.amount_total ?? 0) / 100;
  const paymentRef =
    typeof session.payment_intent === 'string' ? session.payment_intent : undefined;

  if (md.type === 'gift-voucher') {
    const amount = Number(md.voucherAmount) || amountTotal;
    const code = generateGiftVoucherCode(amount);

    const voucher: Voucher = {
      code,
      type: 'gift-voucher',
      amount,
      status: 'unredeemed',
      createdAt: now,
      purchaserName: md.purchaserName || undefined,
      purchaserEmail: md.purchaserEmail || session.customer_email || undefined,
      recipientName: md.recipientName || undefined,
      recipientEmail: md.recipientEmail || undefined,
      giftMessage: md.giftMessage || undefined,
      sessionId,
      paymentRef,
    };
    await saveVoucher(voucher);

    const sendTo = voucher.recipientEmail || voucher.purchaserEmail;
    if (sendTo) {
      await sendGiftVoucherEmail({
        recipientName: voucher.recipientName || 'Friend',
        recipientEmail: sendTo,
        purchaserName: voucher.purchaserName || 'A friend',
        voucherAmount: amount,
        giftMessage: voucher.giftMessage,
        voucherCode: code,
      }).catch((e) => console.error('gift email error', e));
    }

    await sendBusinessNotificationEmail({
      subject: `New Gift Voucher Sold - GBP ${amount.toFixed(2)}`,
      heading: 'Gift Voucher Purchased',
      replyTo: voucher.purchaserEmail,
      rows: [
        { label: 'Amount', value: `GBP ${amount.toFixed(2)}` },
        { label: 'Voucher Code', value: code },
        { label: 'Purchaser', value: `${voucher.purchaserName || '-'} (${voucher.purchaserEmail || '-'})` },
        { label: 'Recipient', value: `${voucher.recipientName || '-'} (${voucher.recipientEmail || 'download/print'})` },
        { label: 'Message', value: voucher.giftMessage || '-' },
      ],
    }).catch((e) => console.error('business notify error', e));

    await saveLead(
      buildLead({
        source: 'gift-voucher-purchase',
        fullName: voucher.purchaserName || 'Gift Voucher Customer',
        email: voucher.purchaserEmail || sendTo || 'unknown@unknown',
        eventType: 'Gift Voucher',
        message: `Bought a GBP ${amount.toFixed(2)} gift voucher for ${voucher.recipientName || 'someone'}. Code: ${code}`,
        now,
      })
    );

    return { status: 'paid', voucher, type: 'gift-voucher' };
  }

  if (md.type === 'afternoon-tea') {
    const quantity = Number(md.quantity) || 1;
    const code = generateVoucherCode();

    const voucher: Voucher = {
      code,
      type: 'afternoon-tea',
      amount: amountTotal,
      status: 'unredeemed',
      createdAt: now,
      purchaserName: md.customerName || undefined,
      purchaserEmail: md.customerEmail || session.customer_email || undefined,
      quantity,
      addProsecco: md.addProsecco === 'true',
      specialRequests: md.specialRequests || undefined,
      sessionId,
      paymentRef,
    };
    await saveVoucher(voucher);

    if (voucher.purchaserEmail) {
      await sendAfternoonTeaVoucherEmail({
        customerName: voucher.purchaserName || 'Guest',
        customerEmail: voucher.purchaserEmail,
        quantity: String(quantity),
        addProsecco: String(voucher.addProsecco),
        specialRequests: voucher.specialRequests,
        voucherCode: code,
      }).catch((e) => console.error('afternoon tea email error', e));
    }

    await sendBusinessNotificationEmail({
      subject: `New Afternoon Tea Voucher Sold - GBP ${amountTotal.toFixed(2)}`,
      heading: 'Afternoon Tea Purchased',
      replyTo: voucher.purchaserEmail,
      rows: [
        { label: 'Total Paid', value: `GBP ${amountTotal.toFixed(2)}` },
        { label: 'Voucher Code', value: code },
        { label: 'Guests', value: String(quantity) },
        { label: 'Prosecco', value: voucher.addProsecco ? 'Yes' : 'No' },
        { label: 'Customer', value: `${voucher.purchaserName || '-'} (${voucher.purchaserEmail || '-'})` },
        { label: 'Requests', value: voucher.specialRequests || '-' },
      ],
    }).catch((e) => console.error('business notify error', e));

    await saveLead(
      buildLead({
        source: 'afternoon-tea-purchase',
        fullName: voucher.purchaserName || 'Afternoon Tea Customer',
        email: voucher.purchaserEmail || 'unknown@unknown',
        eventType: 'Afternoon Tea',
        message: `Afternoon tea for ${quantity}${voucher.addProsecco ? ' with Prosecco' : ''}. Code: ${code}`,
        now,
      })
    );

    return { status: 'paid', voucher, type: 'afternoon-tea' };
  }

  return { status: 'error', error: 'unknown_type' };
}

function buildLead(args: {
  source: string;
  fullName: string;
  email: string;
  eventType: string;
  message: string;
  now: string;
}): Lead {
  return {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    fullName: args.fullName,
    email: args.email,
    eventType: args.eventType,
    message: args.message,
    source: args.source,
    status: 'new',
    createdAt: args.now,
  };
}
