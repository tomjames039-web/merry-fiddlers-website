import { type NextRequest, NextResponse } from 'next/server';
import {
  sendBrochureEmail,
  sendBusinessNotificationEmail,
  sendFestiveConfirmationEmail,
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
// Festive confirmations (Christmas Day / parties / festive dates)
// ---------------------------------------------------------------------------

interface FestiveConfig {
  heading: string;
  subject: string;
  dateLine: string;
  intro: string;
  whatHappensNext: string[];
  ctaLabel: string;
  ctaPath: string;
  /** prefix for the business notification subject */
  notify: string;
}

const FESTIVE_CONFIG: Record<string, FestiveConfig> = {
  'christmas-day-reservation': {
    heading: 'Christmas Day Reservation',
    subject: 'Your Christmas Day reservation — The Merry Fiddlers',
    dateLine: 'Friday 25 December 2026',
    intro:
      'Your place is now held in our Christmas Day book. Sittings are staggered through the day so every table gets cooked for properly, with the fires lit and the old place dressed for it.',
    whatHappensNext: [
      'No deposit is required at this stage.',
      'We will contact you as soon as the final menu, sitting times and booking terms are released.',
      'You will hear from us before those details go out publicly.',
      'Your booking is fully confirmed once you have agreed those details with us.',
    ],
    ctaLabel: 'See all our Christmas dates',
    ctaPath: '/christmas',
    notify: 'CHRISTMAS DAY RESERVATION',
  },
  'christmas-party-enquiry': {
    heading: 'Christmas Party Enquiry',
    subject: 'Your Christmas party enquiry — The Merry Fiddlers',
    dateLine: 'December 2026',
    intro:
      'Thank you for your Christmas party enquiry. We will look at your dates and numbers and come back to you with the right space and options.',
    whatHappensNext: [
      'A member of the team will contact you to talk through spaces and availability.',
      'Festive party menus and drinks options follow as soon as they are finalised.',
      'The best December dates go early, so we will hold a provisional slot where we can.',
    ],
    ctaLabel: 'See our Christmas party page',
    ctaPath: '/christmas/christmas-parties',
    notify: 'CHRISTMAS PARTY ENQUIRY',
  },
  'festive-christmas-eve': {
    heading: 'Christmas Eve',
    subject: 'Your Christmas Eve enquiry — The Merry Fiddlers',
    dateLine: 'Thursday 24 December 2026',
    intro:
      'Thank you — we have your Christmas Eve enquiry. We are open for lunch and dinner, with the fires lit and the bar running on into the evening.',
    whatHappensNext: [
      'We will come back to you shortly to get your table booked in.',
      'If you would rather sort it now, ring us on 01992 572142.',
    ],
    ctaLabel: 'See all our Christmas dates',
    ctaPath: '/christmas',
    notify: 'CHRISTMAS EVE ENQUIRY',
  },
  'festive-boxing-day': {
    heading: 'Boxing Day',
    subject: 'Your Boxing Day enquiry — The Merry Fiddlers',
    dateLine: 'Saturday 26 December 2026',
    intro:
      'Thank you — we have your Boxing Day enquiry. We are open for lunch and dinner with a proper Boxing Day menu, not Christmas dinner all over again.',
    whatHappensNext: [
      'We will come back to you shortly to get your table booked in.',
      'If you would rather sort it now, ring us on 01992 572142.',
    ],
    ctaLabel: 'See all our Christmas dates',
    ctaPath: '/christmas',
    notify: 'BOXING DAY ENQUIRY',
  },
  'festive-new-years-eve': {
    heading: "New Year's Eve",
    subject: "Your New Year's Eve enquiry — The Merry Fiddlers",
    dateLine: 'Thursday 31 December 2026',
    intro:
      'Thank you — we have your New Year\u2019s Eve enquiry. We are open on the 31st with food served through the evening, no compulsory set menu and the bar open late.',
    whatHappensNext: [
      'We will come back to you shortly to get your table booked in.',
      'New Year\u2019s Eve is our busiest night, so the sooner the better — ring us on 01992 572142 if you would like to confirm straight away.',
    ],
    ctaLabel: 'See all our Christmas dates',
    ctaPath: '/christmas',
    notify: "NEW YEAR'S EVE ENQUIRY",
  },
  'festive-new-years-day': {
    heading: "New Year's Day",
    subject: "Your New Year's Day enquiry — The Merry Fiddlers",
    dateLine: 'Friday 1 January 2027',
    intro:
      'Thank you — we have your New Year\u2019s Day enquiry. We are open from midday, fires lit, with Epping Forest on the doorstep for the walk beforehand.',
    whatHappensNext: [
      'We will come back to you shortly to get your table booked in.',
      'If you would rather sort it now, ring us on 01992 572142.',
    ],
    ctaLabel: 'See all our Christmas dates',
    ctaPath: '/christmas',
    notify: "NEW YEAR'S DAY ENQUIRY",
  },
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

    // A brochure request can come from the main download page ("brochure-download")
    // or from any event landing page ("brochure-<event>"). Treat all of them as
    // brochure requests so the customer always gets the brochure AND we get notified.
    const isBrochure = (lead.source || '').startsWith('brochure');
    const festive = FESTIVE_CONFIG[lead.source || ''];

    // Notify the business (awaited so failures surface in the response/logs)
    await sendBusinessNotificationEmail({
      subject: festive
        ? `${festive.notify} — ${fullName}${lead.expectedGuests ? ` (${lead.expectedGuests} guests)` : ''}`
        : isBrochure
          ? `New Brochure Download — ${eventLabel} from ${fullName}`
          : `New ${eventLabel} Enquiry from ${fullName}`,
      heading: festive
        ? festive.heading
        : isBrochure
          ? 'New Brochure Download'
          : 'New Website Enquiry',
      replyTo: lead.email,
      rows: [
        { label: 'Name', value: fullName },
        { label: 'Email', value: lead.email },
        { label: 'Phone', value: lead.phone || 'Not provided' },
        { label: 'Event Type', value: eventLabel },
        { label: 'Expected Guests', value: lead.expectedGuests || 'Not specified' },
        { label: 'Preferred Date', value: lead.preferredDate || 'Not specified' },
        {
          label: 'Details',
          value: (lead.message || '-').replace(/\n/g, '<br>'),
        },
        { label: 'Marketing Consent', value: lead.agreedToMarketing ? 'Yes' : 'No' },
        { label: 'Source', value: lead.source },
      ],
    }).catch((err) => console.error('Business notification error:', err));

    // Send the brochure to the customer (any brochure source)
    if (isBrochure) {
      await sendBrochureEmail({
        fullName,
        email: lead.email,
        eventType: lead.eventType ?? '',
        expectedGuests: lead.expectedGuests,
        preferredDate: lead.preferredDate,
      }).catch((err) => console.error('Brochure email error:', err));
    }

    // Christmas Day reservations, party enquiries and festive interest all get
    // a branded confirmation so the customer knows exactly what happens next.
    if (festive) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || 'https://themerryfiddlers.co.uk';
      await sendFestiveConfirmationEmail({
        to: lead.email,
        name: fullName,
        heading: festive.heading,
        subject: festive.subject,
        dateLine: lead.preferredDate || festive.dateLine,
        intro: festive.intro,
        summaryRows: [
          { label: 'Name', value: fullName },
          { label: 'Guests', value: lead.expectedGuests || '' },
          { label: 'Phone', value: lead.phone || '' },
        ],
        whatHappensNext: festive.whatHappensNext,
        siteUrl,
        ctaLabel: festive.ctaLabel,
        ctaPath: festive.ctaPath,
      }).catch((err) => console.error('Festive confirmation error:', err));
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
