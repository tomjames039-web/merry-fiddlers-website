import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Email diagnostics.
 * Visiting /api/test-email sends TWO test emails to the business inbox:
 *  1) from Resend's built-in test sender (onboarding@resend.dev) — always works if the API key is valid
 *  2) from the REAL domain sender (bookings@themerryfiddlers.co.uk) — only works if the domain is VERIFIED in Resend
 * The response shows exactly which one worked and the precise Resend error if not.
 */
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const businessEmail = process.env.BUSINESS_EMAIL || 'info@themerryfiddlers.co.uk';

  const diagnostics = {
    resendKeyExists: !!apiKey,
    resendKeyPrefix: apiKey ? `${apiKey.substring(0, 5)}…` : 'NOT SET',
    businessEmail,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  if (!apiKey || apiKey === 're_your_api_key') {
    return NextResponse.json(
      {
        ok: false,
        message: 'RESEND_API_KEY is not configured in the environment.',
        diagnostics,
      },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  async function trySend(from: string, label: string) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: businessEmail,
        subject: `Email diagnostic — ${label}`,
        html: `<div style="font-family:Arial,sans-serif;padding:16px;">
          <h2>Email diagnostic — ${label}</h2>
          <p>Sent from: <strong>${from}</strong></p>
          <p>If you received this, sending from this address works.</p>
          <p>${new Date().toISOString()}</p>
        </div>`,
      });
      if (error) {
        return { from, ok: false, error };
      }
      return { from, ok: true, id: data?.id };
    } catch (err) {
      return { from, ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  const baseline = await trySend('The Merry Fiddlers <onboarding@resend.dev>', 'baseline (resend.dev)');
  const domainSender = await trySend(
    'The Merry Fiddlers <bookings@themerryfiddlers.co.uk>',
    'your domain (bookings@themerryfiddlers.co.uk)'
  );

  const domainVerified = domainSender.ok;

  return NextResponse.json({
    ok: true,
    domainVerified,
    diagnostics,
    results: { baseline, domainSender },
    advice: domainVerified
      ? 'Your domain sender works. Enquiry/voucher/brochure emails should be delivering. If you still do not see them, check the spam folder of ' +
        businessEmail +
        ' and make sure BUSINESS_EMAIL points to the inbox you actually check.'
      : 'Your domain sender FAILED (see results.domainSender.error). You must verify "themerryfiddlers.co.uk" in Resend (https://resend.com/domains) and add the DNS records it gives you. Until then, all emails sent from @themerryfiddlers.co.uk will silently fail.',
  });
}
