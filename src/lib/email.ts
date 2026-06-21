import { Resend } from 'resend';

// Lazy initialize Resend to avoid build-time errors
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
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
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') {
    console.log('⚠️ RESEND_API_KEY not configured - Email not sent');
    console.log('📧 Would send Afternoon Tea voucher to:', details.customerEmail);
    return { success: false, reason: 'no_api_key' };
  }

  const voucherCode = details.voucherCode || generateVoucherCode();

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: 'The Merry Fiddlers <bookings@themerryfiddlers.co.uk>',
      to: details.customerEmail,
      subject: '🎉 Your Afternoon Tea Voucher - The Merry Fiddlers',
      html: getAfternoonTeaVoucherHTML({ ...details, voucherCode }),
    });

    if (error) {
      console.error('❌ Error sending afternoon tea email:', error);
      return { success: false, error };
    }

    console.log('✅ Afternoon Tea voucher email sent to:', details.customerEmail);
    return { success: true, data, voucherCode };
  } catch (error) {
    console.error('❌ Exception sending afternoon tea email:', error);
    return { success: false, error };
  }
}

// Send Brochure Download Email
export async function sendBrochureEmail(details: {
  fullName: string;
  email: string;
  eventType: string;
  expectedGuests?: string;
  preferredDate?: string;
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') {
    console.log('⚠️ RESEND_API_KEY not configured - Email not sent');
    console.log('📧 Would send brochure to:', details.email);
    return { success: false, reason: 'no_api_key' };
  }

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: 'The Merry Fiddlers <info@themerryfiddlers.co.uk>',
      to: details.email,
      subject: 'Your Event Brochure - The Merry Fiddlers',
      html: getBrochureEmailHTML(details),
    });

    if (error) {
      console.error('❌ Error sending brochure email:', error);
      return { success: false, error };
    }

    console.log('✅ Brochure email sent to:', details.email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Exception sending brochure email:', error);
    return { success: false, error };
  }
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
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') {
    console.log('⚠️ RESEND_API_KEY not configured - Email not sent');
    console.log('📧 Would send gift voucher to:', details.recipientEmail);
    return { success: false, reason: 'no_api_key' };
  }

  const voucherCode = details.voucherCode || generateGiftVoucherCode(details.voucherAmount);

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: 'The Merry Fiddlers <bookings@themerryfiddlers.co.uk>',
      to: details.recipientEmail,
      subject: `🎁 You've Received a £${details.voucherAmount} Gift Voucher - The Merry Fiddlers`,
      html: getGiftVoucherHTML({ ...details, voucherCode }),
    });

    if (error) {
      console.error('❌ Error sending gift voucher email:', error);
      return { success: false, error };
    }

    console.log('✅ Gift voucher email sent to:', details.recipientEmail);
    return { success: true, data, voucherCode };
  } catch (error) {
    console.error('❌ Exception sending gift voucher email:', error);
    return { success: false, error };
  }
}

// Send a notification to the business (e.g. a new sale or enquiry)
export async function sendBusinessNotificationEmail(details: {
  subject: string;
  heading: string;
  rows: { label: string; value: string }[];
  replyTo?: string;
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') {
    console.log('⚠️ RESEND_API_KEY not configured - business notification not sent');
    return { success: false, reason: 'no_api_key' };
  }

  const businessEmail = process.env.BUSINESS_EMAIL || 'info@themerryfiddlers.co.uk';
  const rowsHtml = details.rows
    .map(
      (r) =>
        `<p style="margin:8px 0;color:#2d4a4a;"><strong>${r.label}:</strong> ${r.value}</p>`
    )
    .join('');

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: 'The Merry Fiddlers <bookings@themerryfiddlers.co.uk>',
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
    });

    if (error) {
      console.error('❌ Error sending business notification:', error);
      return { success: false, error };
    }
    console.log('✅ Business notification sent to:', businessEmail);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Exception sending business notification:', error);
    return { success: false, error };
  }
}
