import { NextResponse } from 'next/server';
import {
  sendGiftVoucherEmail,
  sendBusinessNotificationEmail,
  generateGiftVoucherCode,
} from '@/lib/email';

/**
 * Voucher-sale notification test.
 *
 * Visiting /api/test-voucher?send=voucher simulates a completed gift voucher
 * purchase by calling the SAME email functions the real fulfillment uses
 * (sendGiftVoucherEmail + sendBusinessNotificationEmail) with sample data.
 * It does NOT create a Stripe payment or charge a card — it verifies that,
 * once a purchase completes, the business notification (and customer voucher
 * email) are delivered.
 *
 * Both emails are sent to the business inbox (BUSINESS_EMAIL) so you can see
 * exactly what you'd receive on a real sale and what the customer receives.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const businessEmail = process.env.BUSINESS_EMAIL || 'info@themerryfiddlers.co.uk';

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') {
    return NextResponse.json(
      { ok: false, message: 'RESEND_API_KEY is not configured.' },
      { status: 500 }
    );
  }

  // Guard so crawlers/accidental hits don't fire emails.
  if (url.searchParams.get('send') !== 'voucher') {
    return NextResponse.json({
      ok: true,
      willSend: false,
      message:
        'This endpoint simulates a gift voucher sale. Add ?send=voucher to actually send the test emails to ' +
        businessEmail +
        '. No card is charged.',
    });
  }

  const amount = 50;
  const code = generateGiftVoucherCode(amount);

  // 1) The email the CUSTOMER receives (sent to your inbox so you can preview it).
  const customerVoucherEmail = await sendGiftVoucherEmail({
    recipientName: 'Test Recipient',
    recipientEmail: businessEmail,
    purchaserName: 'Test Purchaser',
    voucherAmount: amount,
    giftMessage: 'TEST voucher — please ignore. Confirming the email system works.',
    voucherCode: code,
  }).catch((e) => ({ success: false, error: e instanceof Error ? e.message : String(e) }));

  // 2) The BUSINESS sale notification — exactly what you get on every real voucher sale.
  const businessNotification = await sendBusinessNotificationEmail({
    subject: `TEST — New Gift Voucher Sold - GBP ${amount.toFixed(2)}`,
    heading: 'Gift Voucher Purchased (TEST)',
    replyTo: businessEmail,
    rows: [
      { label: 'Amount', value: `GBP ${amount.toFixed(2)}` },
      { label: 'Voucher Code', value: code },
      { label: 'Purchaser', value: 'Test Purchaser (test@example.com)' },
      { label: 'Recipient', value: 'Test Recipient (download/print)' },
      { label: 'Message', value: 'Simulated sale to confirm the business notification works.' },
      { label: 'Note', value: 'This is a TEST — no payment was taken.' },
    ],
  }).catch((e) => ({ success: false, error: e instanceof Error ? e.message : String(e) }));

  return NextResponse.json({
    ok: true,
    willSend: true,
    businessEmail,
    note:
      'Two emails were sent to your business inbox: (1) the customer gift-voucher email, (2) the business "voucher sold" notification. This mirrors a real gift-voucher sale (and afternoon-tea sales use the same mechanism) without charging a card.',
    results: { customerVoucherEmail, businessNotification },
  });
}
