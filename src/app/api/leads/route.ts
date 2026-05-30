import { NextRequest, NextResponse } from 'next/server';
import { sendBrochureEmail } from '@/lib/email';

interface LeadData {
  fullName: string;
  email: string;
  phone?: string;
  eventType: string;
  expectedGuests?: string;
  preferredDate?: string;
  message?: string;
  agreedToMarketing: boolean;
  source: string;

  // Optional fields carried by afternoon tea and gift voucher purchases
  type?: 'afternoon-tea-purchase' | 'gift-voucher-purchase' | 'lead';
  name?: string;
  quantity?: string;
  addProsecco?: boolean;
  specialRequests?: string;
  purchaserName?: string;
  purchaserEmail?: string;
  voucherAmount?: string;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
}

// In-memory storage for development (replace with database in production)
const leadsStore: Array<LeadData & { id: string; createdAt: string; status: string }> = [];

// Email notification function using Resend
async function sendNotificationEmail(lead: LeadData) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_ewzqA5Aq_9oqazM795FGAYwpArDL7oM9K';

  if (!RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY not set - skipping email notification');
    console.log('To enable emails, add RESEND_API_KEY to your environment variables');
    return false;
  }

  try {
    const eventTypeLabels: Record<string, string> = {
      wedding: 'Wedding Reception',
      birthday: 'Birthday Party',
      corporate: 'Corporate Event',
      christening: 'Christening',
      anniversary: 'Anniversary',
      other: 'Other',
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Merry Fiddlers <onboarding@resend.dev>',
        to: ['info@themerryfiddlers.co.uk'], // Change to your actual email
        subject: `New Event Enquiry: ${eventTypeLabels[lead.eventType] || lead.eventType} from ${lead.fullName}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2d4a4a; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">New Event Enquiry</h1>
            </div>
            <div style="padding: 30px; background: #f8f6f1;">
              <h2 style="color: #2d4a4a; margin-top: 0;">Contact Details</h2>
              <p><strong>Name:</strong> ${lead.fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
              <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>

              <h2 style="color: #2d4a4a;">Event Details</h2>
              <p><strong>Event Type:</strong> ${eventTypeLabels[lead.eventType] || lead.eventType}</p>
              <p><strong>Expected Guests:</strong> ${lead.expectedGuests || 'Not specified'}</p>
              <p><strong>Preferred Date:</strong> ${lead.preferredDate || 'Not specified'}</p>

              ${lead.message ? `
                <h2 style="color: #2d4a4a;">Message</h2>
                <p style="background: white; padding: 15px; border-radius: 8px;">${lead.message}</p>
              ` : ''}

              <p style="margin-top: 20px;">
                <strong>Marketing Consent:</strong> ${lead.agreedToMarketing ? 'Yes' : 'No'}
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <a href="mailto:${lead.email}?subject=Your Event Enquiry at The Merry Fiddlers"
                   style="display: inline-block; padding: 12px 24px; background: #c9a55c; color: white; text-decoration: none; border-radius: 6px;">
                  Reply to Enquiry
                </a>
              </div>
            </div>
            <div style="background: #2d4a4a; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">Lead captured from: ${lead.source}</p>
              <p style="margin: 5px 0 0;">The Merry Fiddlers - 4 Fiddlers Hamlet, Epping CM16 7PY</p>
            </div>
          </div>
        `,
      }),
    });

    if (response.ok) {
      console.log('✅ Notification email sent successfully');
      return true;
    } else {
      const error = await response.json();
      console.error('❌ Failed to send notification email:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    return false;
  }
}

// Send auto-reply to the lead
async function sendAutoReply(lead: LeadData) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_ewzqA5Aq_9oqazM795FGAYwpArDL7oM9K';

  if (!RESEND_API_KEY) {
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Merry Fiddlers <onboarding@resend.dev>',
        to: [lead.email],
        subject: 'Thank you for your enquiry - The Merry Fiddlers',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2d4a4a; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Thank You, ${lead.fullName.split(' ')[0]}!</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">We've received your event enquiry</p>
            </div>
            <div style="padding: 30px; background: #f8f6f1;">
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Thank you for considering The Merry Fiddlers for your ${lead.eventType.replace('-', ' ')}.
                We're thrilled that you're interested in hosting your special event with us.
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                A member of our events team will be in touch within 24-48 hours to discuss your requirements
                and answer any questions you may have.
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                In the meantime, you can reach us directly at:
              </p>
              <ul style="color: #333; line-height: 1.8;">
                <li>Phone: <a href="tel:+441992572142" style="color: #c9a55c;">+44 1992 572142</a></li>
                <li>Email: <a href="mailto:info@themerryfiddlers.co.uk" style="color: #c9a55c;">info@themerryfiddlers.co.uk</a></li>
              </ul>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                We look forward to making your event unforgettable!
              </p>
              <p style="font-size: 16px; margin-top: 30px; color: #2d4a4a;">
                Warm regards,<br>
                <strong>The Merry Fiddlers Team</strong>
              </p>
            </div>
            <div style="background: #2d4a4a; color: white; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">The Merry Fiddlers - Country Pub & Restaurant</p>
              <p style="margin: 5px 0 0;">4 Fiddlers Hamlet, Epping CM16 7PY</p>
              <p style="margin: 10px 0 0;">
                <a href="https://themerryfiddlers.co.uk" style="color: #c9a55c;">www.themerryfiddlers.co.uk</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (response.ok) {
      console.log('✅ Auto-reply sent to lead');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error sending auto-reply:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();

    // Validate required fields
    if (!body.fullName || !body.email || !body.eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create lead record
    const lead = {
      ...body,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Store lead (in-memory for now - replace with database)
    leadsStore.push(lead);

    // Log the lead
    console.log('📧 New lead captured:');
    console.log('-------------------');
    console.log('ID:', lead.id);
    console.log('Name:', body.fullName);
    console.log('Email:', body.email);
    console.log('Phone:', body.phone || 'Not provided');
    console.log('Event Type:', body.eventType);
    console.log('Expected Guests:', body.expectedGuests || 'Not specified');
    console.log('Preferred Date:', body.preferredDate || 'Not specified');
    console.log('Message:', body.message || 'None');
    console.log('Marketing Consent:', body.agreedToMarketing ? 'Yes' : 'No');
    console.log('Source:', body.source);
    console.log('Timestamp:', lead.createdAt);
    console.log('-------------------');

    // Send email notifications (non-blocking)
    Promise.all([
      sendNotificationEmail(body),
      sendAutoReply(body),
    ]).catch(err => console.error('Email notification error:', err));

    // If this is from brochure download, send the brochure email separately
    if (body.source === 'brochure-download') {
      sendBrochureEmail({
        fullName: body.fullName,
        email: body.email,
        eventType: body.eventType,
        expectedGuests: body.expectedGuests,
        preferredDate: body.preferredDate,
      }).catch(err => console.error('Brochure email error:', err));
    }

    // Also send to afternoon tea purchases and gift voucher purchases
    if (body.type === 'afternoon-tea-purchase') {
      // Send notification for afternoon tea purchase
      sendNotificationEmail({
        fullName: body.name || body.fullName,
        email: body.email,
        phone: body.phone,
        eventType: 'Afternoon Tea Purchase',
        expectedGuests: body.quantity,
        message: `Afternoon Tea for ${body.quantity} people. ${body.addProsecco ? 'With Prosecco upgrade. ' : ''}Special requests: ${body.specialRequests || 'None'}`,
        agreedToMarketing: false,
        source: 'afternoon-tea-purchase',
      }).catch(err => console.error('Email notification error:', err));
    }

    if (body.type === 'gift-voucher-purchase') {
      // Send notification for gift voucher purchase
      sendNotificationEmail({
        fullName: body.purchaserName || body.fullName,
        email: body.purchaserEmail || body.email,
        phone: '',
        eventType: 'Gift Voucher Purchase',
        expectedGuests: `£${body.voucherAmount}`,
        message: `Gift voucher for £${body.voucherAmount} for ${body.recipientName}. ${body.recipientEmail ? `Recipient email: ${body.recipientEmail}. ` : ''}Message: ${body.giftMessage || 'None'}`,
        agreedToMarketing: false,
        source: 'gift-voucher-purchase',
      }).catch(err => console.error('Email notification error:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      leadId: lead.id,
    });

  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve leads (for admin dashboard)
export async function GET(request: NextRequest) {
  // Simple auth check via header
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY || 'merryfiddlers2025'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    leads: leadsStore,
    total: leadsStore.length,
  });
}
