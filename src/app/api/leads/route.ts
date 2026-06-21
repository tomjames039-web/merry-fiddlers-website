import { type NextRequest, NextResponse } from 'next/server';
import {
  sendBrochureEmail,
  sendBusinessNotificationEmail,
} from '@/lib/email';
import {
  type Lead,
  type LeadStatus,
  saveLead,
  getLeads,
  updateLead,
  deleteLead,
} from '@/lib/store';
import { isAuthorized } from '@/lib/auth';

interface LeadInput {
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  eventType?: string;
  expectedGuests?: string;
  preferredDate?: string;
  message?: string;
  agreedToMarketing?: boolean;
  source?: string;
}

const eventTypeLabels: Record<string, string> = {
  wedding: 'Wedding Reception',
  birthday: 'Birthday Party',
  corporate: 'Corporate Event',
  christening: 'Christening',
  anniversary: 'Anniversary',
  other: 'Other',
};

// ---------------------------------------------------------------------------
// POST — capture a new lead (brochure download / enquiry)
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body: LeadInput = await request.json();

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const fullName = body.fullName || body.name || '';
    if (body.source === 'brochure-download' && (!fullName || !body.eventType)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      fullName,
      email: body.email,
      phone: body.phone,
      eventType: body.eventType,
      expectedGuests: body.expectedGuests,
      preferredDate: body.preferredDate,
      message: body.message,
      agreedToMarketing: body.agreedToMarketing,
      source: body.source || 'website',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    await saveLead(lead);

    const eventLabel =
      eventTypeLabels[lead.eventType ?? ''] || lead.eventType || 'Enquiry';

    // Notify the business
    sendBusinessNotificationEmail({
      subject: `New ${eventLabel} Enquiry from ${fullName}`,
      heading: 'New Website Enquiry',
      replyTo: lead.email,
      rows: [
        { label: 'Name', value: fullName },
        { label: 'Email', value: lead.email },
        { label: 'Phone', value: lead.phone || 'Not provided' },
        { label: 'Event Type', value: eventLabel },
        { label: 'Expected Guests', value: lead.expectedGuests || 'Not specified' },
        { label: 'Preferred Date', value: lead.preferredDate || 'Not specified' },
        { label: 'Message', value: lead.message || '-' },
        { label: 'Marketing Consent', value: lead.agreedToMarketing ? 'Yes' : 'No' },
        { label: 'Source', value: lead.source },
      ],
    }).catch((err) => console.error('Business notification error:', err));

    // Send the brochure to the customer
    if (lead.source === 'brochure-download') {
      sendBrochureEmail({
        fullName,
        email: lead.email,
        eventType: lead.eventType ?? '',
        expectedGuests: lead.expectedGuests,
        preferredDate: lead.preferredDate,
      }).catch((err) => console.error('Brochure email error:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET — list leads (admin only)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const leads = await getLeads();
  return NextResponse.json({ leads, total: leads.length });
}

// ---------------------------------------------------------------------------
// PATCH — update a lead's status / notes (admin only)
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { id, status, notes } = body as {
    id?: string;
    status?: LeadStatus;
    notes?: string;
  };
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const updates: Partial<Lead> = {};
  if (status) {
    updates.status = status;
    if (status === 'contacted') updates.lastContactedAt = new Date().toISOString();
  }
  if (typeof notes === 'string') updates.notes = notes;

  const updated = await updateLead(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, lead: updated });
}

// ---------------------------------------------------------------------------
// DELETE — remove a lead (admin only)
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  await deleteLead(id);
  return NextResponse.json({ success: true });
}
