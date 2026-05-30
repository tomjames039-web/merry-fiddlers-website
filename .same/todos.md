# The Merry Fiddlers - Website Todos

## Completed
- [x] Added SpecialOfferBanner with "Claim Your 50% Off Afternoon Tea" and countdown timer
- [x] Created reusable Header component
- [x] Added "Every Season Has Its Charm - Visit All Year Round" section with seasonal Epping Forest images
- [x] Created Afternoon Tea Offer purchase page (`/afternoon-tea-offer`)
- [x] Updated seasonal images to show proper nature scenes (Spring flowers, Summer forest, Autumn leaves, Winter snow)
- [x] Added mobile hamburger menu with smooth animations
- [x] Integrated Stripe payment for afternoon tea bookings
- [x] Created Gift Vouchers purchase page (`/gift-vouchers`) with 3-step form
- [x] Added Stripe checkout API route (`/api/checkout`)
- [x] Created Stripe webhook handler for email confirmations (`/api/webhook`)
- [x] Created booking success page (`/booking-success`)
- [x] Added Gift Vouchers to navigation
- [x] Implemented lead capture form for brochure download (`/download-brochure`)
- [x] Created leads API endpoint (`/api/leads`) for capturing event enquiries
- [x] Form collects: name, email, phone, event type, expected guests, preferred date, message
- [x] Marketing consent checkbox included
- [x] Download reveals after successful form submission
- [x] Connected brochure download to Google Drive hosted PDF
- [x] Deployed website to Netlify (https://same-shz8zs3aqwq-latest.netlify.app)
- [x] Created Admin Dashboard (`/admin`) for viewing and managing leads
- [x] Added email notification system (sends when leads are captured)
- [x] Added auto-reply emails to leads
- [x] Added lead status tracking (new, contacted, converted, archived)
- [x] Added CSV export for leads
- [x] Added search and filter functionality in admin

## Live Website
**URL:** https://same-shz8zs3aqwq-latest.netlify.app

## Admin Dashboard
**URL:** https://same-shz8zs3aqwq-latest.netlify.app/admin
**Password:** merryfiddlers2025

## To Enable Email Notifications
1. Sign up for Resend (https://resend.com) - free tier available
2. Add your domain and verify it
3. In Netlify dashboard, go to Site Settings > Environment Variables
4. Add: `RESEND_API_KEY=re_your_api_key`
5. Redeploy the site

## To Enable Live Stripe Payments
1. Get Stripe API keys from https://dashboard.stripe.com/apikeys
2. In Netlify, add environment variables:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
3. Set up webhook endpoint in Stripe Dashboard pointing to `your-site.netlify.app/api/webhook`

## Restaurant Bookings
- All restaurant table bookings are handled via SevenRooms
- Link: https://www.sevenrooms.com/reservations/themerryfiddlers
- No additional booking system needed for regular dining

## Future Enhancements (Optional)
- [ ] Add persistent database storage (Supabase recommended)
- [ ] Connect to CRM (HubSpot, Salesforce)
- [ ] Add email marketing integration (Mailchimp, ConvertKit)
- [ ] Implement voucher redemption tracking
- [ ] Add more menu pages with actual menu items
