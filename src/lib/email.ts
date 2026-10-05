import { Resend } from 'resend';
import QRCode from 'qrcode';
import type { TicketEvent, TicketBooking } from './tickets';

// Lazy initialize Resend to avoid build-time errors
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

// ---------------------------------------------------------------------------
// Senders
// ---------------------------------------------------------------------------
// Branded senders (require the domain to be VERIFIED in Resend).
const SENDER_BOOKINGS = 'The Merry Fiddlers <bookings@themerryfiddlers.co.uk>';
const SENDER_INFO = 'The Merry Fiddlers <info@themerryfiddlers.co.uk>';
// Resend's shared sender. Works with any valid API key even when the custom
// domain is NOT verified. Used as an automatic fallback so business-critical
// emails (enquiries, brochures, vouchers) are never silently dropped.
const FALLBACK_SENDER = 'The Merry Fiddlers <onboarding@resend.dev>';

/**
 * Send an email with an automatic fallback.
 *
 * It tries the branded `from` address first. If Resend rejects it (typically
 * because the domain isn't verified) it retries from `onboarding@resend.dev`,
 * which always works with a valid API key. This guarantees the business keeps
 * receiving notifications even if domain verification lapses.
 */
async function sendEmailResilient(opts: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  label?: string;
  attachments?: Array<{ filename: string; content: Buffer | string }>;
}): Promise<
  | { success: true; data: unknown; from: string }
  | { success: false; reason: 'no_api_key' }
  | { success: false; error: unknown }
> {
  const label = opts.label || 'email';

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') {
    console.log(`⚠️ RESEND_API_KEY not configured - ${label} NOT sent to`, opts.to);
    return { success: false, reason: 'no_api_key' };
  }

  const resend = getResendClient();
  // Try the branded sender first, then the reliable fallback (avoid duplicates).
  const senders = opts.from === FALLBACK_SENDER ? [opts.from] : [opts.from, FALLBACK_SENDER];
  let lastError: unknown = null;

  for (const from of senders) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: opts.to,
        replyTo: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
        attachments: opts.attachments,
      });

      if (error) {
        lastError = error;
        console.error(`❌ ${label}: send from ${from} failed:`, error);
        continue; // fall through to the fallback sender
      }

      if (from !== opts.from) {
        console.warn(
          `⚠️ ${label}: branded sender failed, delivered via fallback (${from}). Verify your domain in Resend to send from your own address.`
        );
      }
      console.log(`✅ ${label} sent to`, opts.to, `from ${from}`);
      return { success: true, data, from };
    } catch (err) {
      lastError = err;
      console.error(`❌ ${label}: exception sending from ${from}:`, err);
    }
  }

  return { success: false, error: lastError };
}

// Generate a unique voucher code
export function generateVoucherCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AFTTEA-${timestamp}-${random}`;
}

// Afternoon Tea Voucher Email Template
function getAfternoonTeaVoucherHTML(details: {
  customerName: string;
  quantity: string;
  addProsecco: string;
  specialRequests?: string;
  voucherCode: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Georgia, 'Times New Roman', serif;
          color: #2d4a4a;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #2d4a4a 0%, #3a5656 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: normal;
        }
        .content {
          padding: 40px 30px;
        }
        .voucher-box {
          background: linear-gradient(135deg, #c9a55c 0%, #b8944b 100%);
          color: white;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          border-radius: 12px;
        }
        .voucher-title {
          font-size: 24px;
          margin: 0 0 15px 0;
          font-weight: normal;
        }
        .voucher-code {
          background: rgba(255,255,255,0.2);
          padding: 15px 25px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 20px;
          font-weight: bold;
          margin: 15px 0;
          display: inline-block;
          letter-spacing: 1px;
        }
        .details-box {
          background: #f8f6f1;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .details-box h3 {
          margin: 0 0 15px 0;
          color: #2d4a4a;
        }
        .details-box p {
          margin: 8px 0;
        }
        .highlight {
          color: #c9a55c;
          font-weight: bold;
        }
        .booking-info {
          background: #e8f4f8;
          border-left: 4px solid #c9a55c;
          padding: 20px;
          margin: 25px 0;
        }
        .footer {
          background: #f8f6f1;
          padding: 30px;
          text-align: center;
          font-size: 13px;
          color: #666;
        }
        .footer p {
          margin: 5px 0;
        }
        .btn {
          display: inline-block;
          background: #2d4a4a;
          color: white !important;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The Merry Fiddlers</h1>
          <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9);">Afternoon Tea Voucher</p>
        </div>

        <div class="content">
          <h2 style="color: #2d4a4a; margin-top: 0;">Congratulations, ${details.customerName}!</h2>

          <p style="font-size: 16px;">Thank you for purchasing our 50% Off Afternoon Tea voucher. Here is your exclusive voucher:</p>

          <div class="voucher-box">
            <h3 class="voucher-title">Your Afternoon Tea Voucher</h3>
            <p style="margin: 10px 0; font-size: 18px;">Valid for ${details.quantity} ${Number.parseInt(details.quantity) === 1 ? 'person' : 'people'}</p>
            ${details.addProsecco === 'true' ? '<p style="margin: 5px 0; font-size: 14px;">✨ Including Prosecco Upgrade</p>' : ''}
            <div class="voucher-code">${details.voucherCode}</div>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.9;">Valid for 12 months from purchase date</p>
          </div>

          <div class="booking-info">
            <h3 style="margin: 0 0 15px 0; color: #2d4a4a;">How to Book Your Afternoon Tea</h3>
            <p style="margin: 10px 0;"><strong>All Afternoon Tea bookings are made by email.</strong> To arrange your visit, please email <a href="mailto:info@themerryfiddlers.co.uk" style="color: #c9a55c;">info@themerryfiddlers.co.uk</a> quoting your voucher code and preferred date.</p>
            <p style="margin: 10px 0;"><strong>Afternoon Tea is served:</strong><br>
            Wednesday to Saturday<br>
            12:00 PM &ndash; 4:00 PM</p>
          </div>

          <div class="details-box">
            <h3>Your Voucher Details</h3>
            <p><strong>Voucher Code:</strong> ${details.voucherCode}</p>
            <p><strong>Valid for:</strong> ${details.quantity} ${Number.parseInt(details.quantity) === 1 ? 'person' : 'people'}</p>
            ${details.addProsecco === 'true' ? '<p><strong>Upgrade:</strong> Prosecco included</p>' : ''}
            ${details.specialRequests ? `<p><strong>Dietary Requirements:</strong> ${details.specialRequests}</p>` : ''}
          </div>

          <h3 style="color: #2d4a4a;">What's Included</h3>
          <ul style="color: #555;">
            <li>Selection of finger sandwiches</li>
            <li>Freshly baked scones with clotted cream & jam</li>
            <li>Assortment of cakes & pastries</li>
            <li>Pot of premium loose-leaf tea or coffee</li>
            ${details.addProsecco === 'true' ? '<li><strong>Glass of Prosecco</strong></li>' : ''}
          </ul>

          <h3 style="color: #2d4a4a;">Find Us</h3>
          <p>
            <strong>The Merry Fiddlers</strong><br>
            4 Fiddlers Hamlet<br>
            Epping CM16 7PY<br>
            <br>
            📞 <a href="tel:+441992572142" style="color: #c9a55c;">+44 1992 572142</a><br>
            ✉️ <a href="mailto:info@themerryfiddlers.co.uk" style="color: #c9a55c;">info@themerryfiddlers.co.uk</a>
          </p>

          <p style="margin-top: 30px;">We look forward to welcoming you!</p>
          <p class="highlight" style="font-size: 18px;">The Merry Fiddlers Team</p>
        </div>

        <div class="footer">
          <p><strong>The Merry Fiddlers</strong></p>
          <p>Country Pub & Restaurant</p>
          <p>Proudly serving Epping since the 1600s</p>
          <p style="margin-top: 15px; color: #999; font-size: 11px;">
            Please keep this email safe as proof of purchase.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Brochure Download Email Template
function getBrochureEmailHTML(details: {
  fullName: string;
  eventType: string;
  expectedGuests?: string;
  preferredDate?: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Georgia, 'Times New Roman', serif;
          color: #2d4a4a;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #2d4a4a 0%, #3a5656 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: normal;
        }
        .content {
          padding: 40px 30px;
        }
        .btn {
          display: inline-block;
          background: #c9a55c;
          color: white !important;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 16px;
          font-weight: bold;
        }
        .details-box {
          background: #f8f6f1;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .footer {
          background: #f8f6f1;
          padding: 30px;
          text-align: center;
          font-size: 13px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The Merry Fiddlers</h1>
          <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9);">Event Brochure</p>
        </div>

        <div class="content">
          <h2 style="color: #2d4a4a; margin-top: 0;">Thank you, ${details.fullName}!</h2>

          <p style="font-size: 16px;">We're delighted you're interested in hosting your ${details.eventType} with us at The Merry Fiddlers.</p>

          <p>Your event brochure is attached to this email, and you can also view it online:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://drive.google.com/file/d/1ZvLlQeVPo2ksjHns8q014LfCTaeCBsLg/view?usp=sharing" class="btn">View Brochure Online</a>
          </div>

          ${details.expectedGuests || details.preferredDate ? `
          <div class="details-box">
            <h3 style="margin: 0 0 15px 0;">Your Event Details</h3>
            <p><strong>Event Type:</strong> ${details.eventType}</p>
            ${details.expectedGuests ? `<p><strong>Expected Guests:</strong> ${details.expectedGuests}</p>` : ''}
            ${details.preferredDate ? `<p><strong>Preferred Date:</strong> ${details.preferredDate}</p>` : ''}
          </div>
          ` : ''}

          <h3 style="color: #2d4a4a;">Ready to Book?</h3>
          <p>Our team is here to help you plan the perfect event. Get in touch:</p>
          <p>
            📞 <strong><a href="tel:+441992572142" style="color: #c9a55c;">+44 1992 572142</a></strong><br>
            ✉️ <strong><a href="mailto:info@themerryfiddlers.co.uk" style="color: #c9a55c;">info@themerryfiddlers.co.uk</a></strong><br>
            📍 4 Fiddlers Hamlet, Epping CM16 7PY
          </p>

          <p style="margin-top: 30px;">We look forward to making your event unforgettable!</p>
          <p style="color: #c9a55c; font-size: 18px; font-weight: bold;">The Merry Fiddlers Team</p>
        </div>

        <div class="footer">
          <p><strong>The Merry Fiddlers</strong></p>
          <p>Country Pub & Restaurant</p>
          <p>Proudly serving Epping since the 1600s</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send Afternoon Tea Voucher Email
export async function sendAfternoonTeaVoucherEmail(details: {
  customerName: string;
  customerEmail: string;
  quantity: string;
  addProsecco: string;
  specialRequests?: string;
  voucherCode?: string;
}) {
  const voucherCode = details.voucherCode || generateVoucherCode();

  const result = await sendEmailResilient({
    from: SENDER_BOOKINGS,
    to: details.customerEmail,
    subject: '🎉 Your Afternoon Tea Voucher - The Merry Fiddlers',
    html: getAfternoonTeaVoucherHTML({ ...details, voucherCode }),
    label: 'Afternoon Tea voucher',
  });

  return { ...result, voucherCode };
}

// Send Brochure Download Email
export async function sendBrochureEmail(details: {
  fullName: string;
  email: string;
  eventType: string;
  expectedGuests?: string;
  preferredDate?: string;
}) {
  return sendEmailResilient({
    from: SENDER_INFO,
    to: details.email,
    subject: 'Your Event Brochure - The Merry Fiddlers',
    html: getBrochureEmailHTML(details),
    label: 'Brochure',
  });
}

// Generate gift voucher code
export function generateGiftVoucherCode(amount: number): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '').slice(2); // DDMMYY format
  return `GIFT${amount}-${date}-${random}${timestamp.slice(-2)}`;
}

// Gift Voucher Email Template
function getGiftVoucherHTML(details: {
  recipientName: string;
  purchaserName: string;
  voucherAmount: number;
  giftMessage?: string;
  voucherCode: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Georgia, 'Times New Roman', serif;
          color: #2d4a4a;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #2d4a4a 0%, #3a5656 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: normal;
        }
        .content {
          padding: 40px 30px;
        }
        .voucher-box {
          background: linear-gradient(135deg, #c9a55c 0%, #b8944b 100%);
          color: white;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          border-radius: 12px;
        }
        .voucher-title {
          font-size: 24px;
          margin: 0 0 15px 0;
          font-weight: normal;
        }
        .voucher-code {
          background: rgba(255,255,255,0.2);
          padding: 15px 25px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 20px;
          font-weight: bold;
          margin: 15px 0;
          display: inline-block;
          letter-spacing: 1px;
        }
        .message-box {
          background: #f8f6f1;
          padding: 20px;
          border-left: 4px solid #c9a55c;
          margin: 25px 0;
          font-style: italic;
        }
        .footer {
          background: #f8f6f1;
          padding: 30px;
          text-align: center;
          font-size: 13px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎁 The Merry Fiddlers</h1>
          <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9);">Gift Voucher</p>
        </div>

        <div class="content">
          <h2 style="color: #2d4a4a; margin-top: 0;">Dear ${details.recipientName},</h2>

          <p style="font-size: 16px;">${details.purchaserName} has sent you a gift voucher for The Merry Fiddlers!</p>

          ${details.giftMessage ? `
          <div class="message-box">
            <p style="margin: 0; color: #555;"><strong>Personal message from ${details.purchaserName}:</strong></p>
            <p style="margin: 10px 0 0; color: #555;">"${details.giftMessage}"</p>
          </div>
          ` : ''}

          <div class="voucher-box">
            <h3 class="voucher-title">Your Gift Voucher</h3>
            <p style="margin: 10px 0; font-size: 24px; font-weight: bold;">£${details.voucherAmount.toFixed(2)}</p>
            <div class="voucher-code">${details.voucherCode}</div>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.9;">Valid for 12 months from purchase date</p>
          </div>

          <h3 style="color: #2d4a4a;">How to Redeem</h3>
          <p>Simply present this voucher code when booking or paying at The Merry Fiddlers. Your voucher can be used for:</p>
          <ul style="color: #555;">
            <li>Delicious food from our seasonal menu</li>
            <li>Drinks at the bar</li>
            <li>Afternoon Tea experience</li>
            <li>Sunday Roast</li>
            <li>Any other dining experience</li>
          </ul>

          <h3 style="color: #2d4a4a;">Important Information</h3>
          <ul style="color: #555; font-size: 14px;">
            <li>Valid for 12 months from purchase date</li>
            <li>Quote your voucher code when booking or at payment</li>
            <li>Cannot be redeemed for cash</li>
            <li>Please keep this email safe as proof of purchase</li>
          </ul>

          <h3 style="color: #2d4a4a;">Book Your Visit</h3>
          <p>
            <strong>The Merry Fiddlers</strong><br>
            4 Fiddlers Hamlet, Epping CM16 7PY<br>
            <br>
            📞 <a href="tel:+441992572142" style="color: #c9a55c;">+44 1992 572142</a><br>
            ✉️ <a href="mailto:info@themerryfiddlers.co.uk" style="color: #c9a55c;">info@themerryfiddlers.co.uk</a><br>
            🌐 <a href="https://themerryfiddlers.co.uk" style="color: #c9a55c;">www.themerryfiddlers.co.uk</a>
          </p>

          <p style="margin-top: 30px; color: #2d4a4a;">
            <strong>Opening Hours:</strong><br>
            Wednesday - Saturday: 12:00 - 00:00<br>
            Sunday: 12:00 - 20:00<br>
            Monday - Tuesday: Closed
          </p>

          <p style="margin-top: 30px;">We look forward to welcoming you!</p>
          <p style="color: #c9a55c; font-size: 18px; font-weight: bold;">The Merry Fiddlers Team</p>
        </div>

        <div class="footer">
          <p><strong>The Merry Fiddlers</strong></p>
          <p>Country Pub & Restaurant</p>
          <p>Proudly serving Epping since the 1600s</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send Gift Voucher Email to Recipient
export async function sendGiftVoucherEmail(details: {
  recipientName: string;
  recipientEmail: string;
  purchaserName: string;
  voucherAmount: number;
  giftMessage?: string;
  voucherCode?: string;
}) {
  const voucherCode = details.voucherCode || generateGiftVoucherCode(details.voucherAmount);

  const result = await sendEmailResilient({
    from: SENDER_BOOKINGS,
    to: details.recipientEmail,
    subject: `🎁 You've Received a £${details.voucherAmount} Gift Voucher - The Merry Fiddlers`,
    html: getGiftVoucherHTML({ ...details, voucherCode }),
    label: 'Gift voucher',
  });

  return { ...result, voucherCode };
}

// ---------------------------------------------------------------------------
// Event ticket confirmation (England v Argentina)
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getEventTicketHTML(details: {
  event: TicketEvent;
  booking: TicketBooking;
  menuUrl: string;
}): string {
  const { event, booking } = details;
  const attendees = booking.attendees
    .map(
      (name, i) =>
        `<tr><td style="padding:6px 0;color:#7a8a8a;width:34px;">${i + 1}.</td><td style="padding:6px 0;color:#2d4a4a;font-weight:bold;">${esc(name)}</td></tr>`
    )
    .join('');

  const rules = [
    'No outside food or drink is permitted, including takeaways and food deliveries.',
    'Anyone found bringing or consuming outside food or drink may be asked to leave.',
    'Tickets are non-refundable.',
    'Each ticket is valid only for the named attendee.',
    'Seating and viewing-area requests are not guaranteed.',
    'Please follow staff instructions during the event.',
  ]
    .map(
      (r) =>
        `<li style="margin:6px 0;color:#5a3a1a;">${esc(r)}</li>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Georgia, 'Times New Roman', serif; color:#2d4a4a; line-height:1.6; margin:0; padding:0; background:#eef1ef;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1d3a3a 0%,#2d4a4a 100%);color:#fff;padding:40px 30px;text-align:center;">
          <h1 style="margin:0 0 6px;font-size:30px;font-weight:normal;">The Merry Fiddlers</h1>
          <p style="margin:0;font-size:15px;color:#c9a55c;letter-spacing:2px;text-transform:uppercase;">England v Argentina · Live on the Big Screen</p>
        </div>

        <div style="padding:36px 30px;">
          <h2 style="color:#2d4a4a;margin-top:0;">You're booked in, ${esc(booking.purchaserName)}!</h2>
          <p style="font-size:16px;">Thank you for booking your tickets for <strong>England v Argentina</strong> at The Merry Fiddlers. We can't wait to welcome you to the garden.</p>

          <div style="background:linear-gradient(135deg,#c9a55c 0%,#b8944b 100%);color:#fff;padding:26px;text-align:center;margin:28px 0;border-radius:12px;">
            <p style="margin:0 0 6px;text-transform:uppercase;letter-spacing:2px;font-size:12px;opacity:.9;">Your Booking Reference</p>
            <p style="margin:0;font-family:'Courier New',monospace;font-size:32px;font-weight:bold;letter-spacing:3px;">${esc(booking.ref)}</p>
            <p style="margin:10px 0 0;font-size:13px;opacity:.9;">Please have this ready when you arrive.</p>
          </div>

          <div style="background:#f8f6f1;padding:24px;border-radius:8px;margin:24px 0;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr><td style="padding:6px 0;color:#7a8a8a;">Lead booker</td><td style="padding:6px 0;color:#2d4a4a;font-weight:bold;text-align:right;">${esc(booking.purchaserName)}</td></tr>
              <tr><td style="padding:6px 0;color:#7a8a8a;">Total tickets</td><td style="padding:6px 0;color:#2d4a4a;font-weight:bold;text-align:right;">${booking.quantity}</td></tr>
              <tr><td style="padding:6px 0;color:#7a8a8a;">Amount paid</td><td style="padding:6px 0;color:#2d4a4a;font-weight:bold;text-align:right;">£${booking.amount.toFixed(2)}</td></tr>
              <tr><td style="padding:6px 0;color:#7a8a8a;">Preferred area</td><td style="padding:6px 0;color:#2d4a4a;font-weight:bold;text-align:right;">${esc(booking.viewingAreaLabel)}</td></tr>
            </table>
          </div>

          <h3 style="color:#2d4a4a;margin-bottom:8px;">Who's coming</h3>
          <table style="width:100%;border-collapse:collapse;font-size:15px;margin-bottom:8px;">${attendees}</table>
          <p style="font-size:12px;color:#9aa;margin-top:0;">Each ticket is valid only for the named attendee above.</p>

          <div style="background:#2d4a4a;color:#fff;border-radius:10px;padding:22px;margin:24px 0;">
            <h3 style="margin:0 0 12px;color:#c9a55c;">Match Day</h3>
            <p style="margin:6px 0;"><strong>${esc(event.dateLabel)}</strong></p>
            <p style="margin:6px 0;">DJ from <strong>${esc(event.djFrom)}</strong></p>
            <p style="margin:6px 0;">Kick-off at <strong>${esc(event.kickoff)}</strong></p>
            <p style="margin:6px 0;">Last food orders at <strong>${esc(event.lastFood)}</strong></p>
            <p style="margin:14px 0 0;color:#cfe;">${esc(event.venue)}</p>
          </div>
          ${
            booking.bookingNotes
              ? `<div style="background:#f1ede4;border-left:4px solid #c9a55c;padding:16px 18px;margin:20px 0;border-radius:6px;">
                   <p style="margin:0 0 4px;font-size:13px;color:#9c7e3f;text-transform:uppercase;letter-spacing:1px;">Your booking note</p>
                   <p style="margin:0;color:#4a4a4a;font-style:italic;">"${esc(booking.bookingNotes)}"</p>
                   <p style="margin:8px 0 0;font-size:12px;color:#a99;">We'll do our best, but requests can't be guaranteed.</p>
                 </div>`
              : ''
          }

          <div style="border:2px solid #e6b800;background:#fff9e6;border-radius:10px;padding:20px 22px;margin:26px 0;">
            <h3 style="margin:0 0 10px;color:#8a6a00;">Important event rules</h3>
            <ul style="margin:0;padding-left:20px;">${rules}</ul>
          </div>

          <div style="text-align:center;margin:30px 0;">
            <a href="${esc(details.menuUrl)}" style="display:inline-block;background:#2d4a4a;color:#fff;padding:14px 34px;text-decoration:none;border-radius:8px;font-weight:bold;">View the Food Menu</a>
            <p style="font-size:12px;color:#9aa;margin-top:10px;">Last food orders 9:30pm · full bar all evening</p>
          </div>

          <p style="margin-top:26px;">See you in the garden,</p>
          <p style="color:#c9a55c;font-size:18px;font-weight:bold;margin:4px 0;">The Merry Fiddlers Team</p>
        </div>

        <div style="background:#f8f6f1;padding:26px;text-align:center;font-size:12px;color:#888;">
          <p style="margin:4px 0;"><strong>The Merry Fiddlers</strong></p>
          <p style="margin:4px 0;">4 Fiddlers Hamlet, Epping CM16 7PY · +44 1992 572142</p>
          <p style="margin:10px 0 0;color:#aaa;font-size:11px;">Please keep this email safe as proof of purchase.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends the England v Argentina ticket confirmation, reusing the branded style
 * of the afternoon tea email. Attaches a QR code (an opaque check-in token — no
 * customer data) so staff can scan the party in on the door.
 */
export async function sendEventTicketEmail(details: {
  event: TicketEvent;
  booking: TicketBooking;
  siteUrl: string;
}) {
  const { event, booking, siteUrl } = details;
  const base = siteUrl.replace(/\/$/, '');
  const menuUrl = event.menuUrl.startsWith('http')
    ? event.menuUrl
    : `${base}${event.menuUrl.startsWith('/') ? '' : '/'}${event.menuUrl}`;
  const checkinUrl = `${base}/admin/checkin?token=${encodeURIComponent(booking.token)}`;

  let attachments:
    | Array<{ filename: string; content: Buffer | string }>
    | undefined;
  try {
    const buf = await QRCode.toBuffer(checkinUrl, { width: 320, margin: 1 });
    attachments = [{ filename: `ticket-${booking.ref}.png`, content: buf }];
  } catch (e) {
    console.error('QR generation failed (email still sent):', e);
  }

  return sendEmailResilient({
    from: SENDER_BOOKINGS,
    to: booking.purchaserEmail,
    subject: 'Your England v Argentina Tickets — The Merry Fiddlers',
    html: getEventTicketHTML({ event, booking, menuUrl }),
    label: 'Event ticket',
    attachments,
  });
}

// Send a notification to the business (e.g. a new sale or enquiry)
export async function sendBusinessNotificationEmail(details: {
  subject: string;
  heading: string;
  rows: { label: string; value: string }[];
  replyTo?: string;
}) {
  const businessEmail = process.env.BUSINESS_EMAIL || 'info@themerryfiddlers.co.uk';
  const rowsHtml = details.rows
    .map(
      (r) =>
        `<p style="margin:8px 0;color:#2d4a4a;"><strong>${r.label}:</strong> ${r.value}</p>`
    )
    .join('');

  return sendEmailResilient({
    from: SENDER_BOOKINGS,
    to: businessEmail,
    replyTo: details.replyTo,
    subject: details.subject,
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto;">
        <div style="background:#2d4a4a;color:#ffffff;padding:24px;text-align:center;">
          <h1 style="margin:0;font-size:22px;">${details.heading}</h1>
        </div>
        <div style="padding:28px;background:#f8f6f1;">${rowsHtml}</div>
        <div style="background:#2d4a4a;color:#ffffff;padding:14px;text-align:center;font-size:12px;">
          The Merry Fiddlers — 4 Fiddlers Hamlet, Epping CM16 7PY
        </div>
      </div>
    `,
    label: 'Business notification',
  });
}

// ---------------------------------------------------------------------------
// Festive enquiries & Christmas Day reservations
// ---------------------------------------------------------------------------

function getFestiveConfirmationHTML(details: {
  firstName: string;
  heading: string;
  dateLine: string;
  intro: string;
  summaryRows: { label: string; value: string }[];
  whatHappensNext: string[];
  siteUrl: string;
  ctaLabel: string;
  ctaPath: string;
}): string {
  const rows = details.summaryRows
    .filter((r) => r.value)
    .map(
      (r) =>
        `<tr><td style="padding:7px 0;color:#7a8a8a;">${esc(r.label)}</td><td style="padding:7px 0;color:#2d4a4a;font-weight:bold;text-align:right;">${esc(r.value)}</td></tr>`
    )
    .join('');

  const next = details.whatHappensNext
    .map((s) => `<li style="margin:7px 0;color:#5c5343;">${esc(s)}</li>`)
    .join('');

  const base = details.siteUrl.replace(/\/$/, '');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Georgia, 'Times New Roman', serif; color:#2d4a4a; line-height:1.6; margin:0; padding:0; background:#efeae0;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#3c1418 0%,#1d3a3a 100%);color:#fff;padding:38px 30px;text-align:center;">
          <h1 style="margin:0 0 8px;font-size:28px;font-weight:normal;">The Merry Fiddlers</h1>
          <p style="margin:0;font-size:13px;color:#c9a55c;letter-spacing:3px;text-transform:uppercase;">${esc(details.heading)}</p>
        </div>

        <div style="padding:34px 30px;">
          <h2 style="color:#2d4a4a;margin-top:0;font-weight:normal;">Thank you, ${esc(details.firstName)}</h2>
          <p style="font-size:16px;color:#5c5343;">${esc(details.intro)}</p>

          <div style="background:#8c2f39;color:#f8f1e3;padding:18px 22px;border-radius:10px;margin:24px 0;text-align:center;">
            <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85;">Your date</p>
            <p style="margin:6px 0 0;font-size:20px;font-weight:bold;">${esc(details.dateLine)}</p>
          </div>

          ${
            rows
              ? `<div style="background:#f8f6f1;padding:20px 22px;border-radius:8px;margin:22px 0;">
                   <table style="width:100%;border-collapse:collapse;font-size:15px;">${rows}</table>
                 </div>`
              : ''
          }

          <h3 style="color:#2d4a4a;margin-bottom:8px;font-weight:normal;">What happens next</h3>
          <ul style="margin:0 0 22px;padding-left:20px;">${next}</ul>

          <div style="text-align:center;margin:28px 0;">
            <a href="${esc(base)}${esc(details.ctaPath)}" style="display:inline-block;background:#2d4a4a;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:bold;">${esc(details.ctaLabel)}</a>
          </div>

          <p style="color:#5c5343;margin-top:26px;">Anything at all, just call us on <strong>01992 572142</strong> — we are happy to talk it through.</p>
          <p style="color:#c9a55c;font-size:17px;font-weight:bold;margin:12px 0 0;">The Merry Fiddlers Team</p>
        </div>

        <div style="background:#f8f6f1;padding:24px;text-align:center;font-size:12px;color:#888;">
          <p style="margin:4px 0;"><strong>The Merry Fiddlers</strong> — Country Pub &amp; Restaurant</p>
          <p style="margin:4px 0;">4 Fiddlers Hamlet, Epping CM16 7PY · +44 1992 572142</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Customer confirmation for a Christmas Day reservation, Christmas party
 * enquiry or a festive-date interest registration.
 */
export async function sendFestiveConfirmationEmail(details: {
  to: string;
  name: string;
  /** e.g. 'Christmas Day Reservation' */
  heading: string;
  subject: string;
  dateLine: string;
  intro: string;
  summaryRows: { label: string; value: string }[];
  whatHappensNext: string[];
  siteUrl: string;
  ctaLabel: string;
  ctaPath: string;
}) {
  const firstName = (details.name || '').trim().split(/\s+/)[0] || 'there';

  return sendEmailResilient({
    from: SENDER_BOOKINGS,
    to: details.to,
    subject: details.subject,
    html: getFestiveConfirmationHTML({ ...details, firstName }),
    label: 'Festive confirmation',
  });
}
