# Email Setup Guide

## Overview

The website uses **Resend** to send emails for:
1. **Afternoon Tea Vouchers** - Sent automatically after payment with booking instructions
2. **Brochure Downloads** - Sent when someone downloads the event brochure
3. **Lead Notifications** - Internal notifications when enquiries come in

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day, 3,000/month)
3. Verify your email address

### 2. Domain Setup (Important!)

**Option A: Use your own domain (RECOMMENDED)**
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `themerryfiddlers.co.uk`)
3. Add the DNS records shown to your domain provider
4. Wait for verification (usually 15-30 minutes)
5. Once verified, you can send from addresses like:
   - `bookings@themerryfiddlers.co.uk`
   - `info@themerryfiddlers.co.uk`

**Option B: Use Resend's test domain (for testing only)**
- You can send from `onboarding@resend.dev`
- Limited to verified recipient addresses only
- Good for testing but not for production

### 3. Get Your API Key

1. In Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Give it a name (e.g., "Merry Fiddlers Production")
4. Copy the API key (starts with `re_`)

### 4. Add to Environment Variables

**For Local Development:**
Create a `.env.local` file in the project root:
```env
RESEND_API_KEY=re_your_actual_api_key_here
```

**For Production (Netlify):**
1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" > "Environment variables"
4. Add `RESEND_API_KEY` with your API key

### 5. Update Email Addresses

Once your domain is verified, update these files:

**`src/lib/email.ts`** - Update the "from" addresses:
```typescript
from: 'The Merry Fiddlers <bookings@themerryfiddlers.co.uk>',
```

**`src/app/api/leads/route.ts`** - Update notification email address:
```typescript
to: ['info@themerryfiddlers.co.uk'], // Your actual email
```

## Email Templates

### 1. Afternoon Tea Voucher Email

**Sent when:** Customer completes payment for afternoon tea
**To:** Customer email
**Includes:**
- Congratulations message
- Unique voucher code
- Instructions: "Someone will be in touch OR reply with your preferred date/time"
- Afternoon tea times: Wed-Sat, 12-4pm
- What's included
- Contact details

### 2. Brochure Download Email

**Sent when:** Someone downloads the event brochure
**To:** Lead email
**Includes:**
- Thank you message
- Link to view brochure online
- Their event details
- Contact information

### 3. Internal Notifications

**Sent when:** New lead or enquiry comes in
**To:** `info@themerryfiddlers.co.uk`
**Includes:**
- Lead contact details
- Event information
- Quick reply button

## Testing

To test emails without setting up Resend:
1. The system will log email details to console
2. Check your server logs to see what would be sent
3. Once ready, add your RESEND_API_KEY to start sending real emails

## Troubleshooting

**Emails not sending:**
- Check RESEND_API_KEY is set correctly
- Verify domain is verified in Resend dashboard
- Check server logs for error messages

**"From" address rejected:**
- Make sure you've verified your domain
- Update email addresses in code to match verified domain
- Or use `onboarding@resend.dev` for testing

**Emails going to spam:**
- Verify your domain properly (all DNS records)
- Add SPF, DKIM, and DMARC records as shown in Resend
- Avoid spammy language in email content

## Support

- Resend docs: https://resend.com/docs
- Resend support: support@resend.com
