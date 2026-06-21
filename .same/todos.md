## The Merry Fiddlers — Back Office & Payments Upgrade

### Build progress
1. [x] PERSISTENCE FOUNDATION — `src/lib/store.ts` (Netlify Blobs + fs fallback).
2. [x] PAYMENTS — Stripe Embedded Checkout (on-site, fixed price). Vouchers recorded + emailed on PAID (idempotent fulfillment).
3. [x] ADMIN REBUILD — server-verified login, Overview, Leads pipeline (New/Contacted/Booked/Lost), Vouchers (redeem-by-code, unredeemed/redeemed).
4. [ ] CONTENT CMS (menus / what's-on uploads) — DEFERRED per user ("then we will create a backend so it can be uploaded from there").
5. [x] WHAT'S ON page (curated events) — live in preview.
6. [x] SOCIAL FEED — live Facebook page feed + Instagram card (slot for free IG widget).

### Verified
- Production build passes (21 routes). tsc clean. No hardcoded secrets.
- Leads + vouchers APIs round-trip via local store; admin login works.
- Sample data seeded in .data/ (dev-only, gitignored) for preview demo.

### Remaining / needs user
- [ ] Stripe keys: user to add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY + STRIPE_SECRET_KEY (test first) for checkout to work. Guide provided.
- [ ] Deploy decision: pushing/deploying switches live voucher payments to Stripe; until keys added, checkout shows graceful "call us" fallback. Local .git is empty this session — re-link before push.
- [ ] Later: build CMS (#4) for uploading seasonal menus / what's-on PDFs+images, editable from admin.

### Gotchas for future me
- Don't run `bun run build` while `next dev` is running — corrupts .next. Kill dev, rm -rf .next, restart.
- Start dev with: setsid nohup bun run dev > /tmp/dev.log 2>&1 < /dev/null & disown  (survives between bash calls).
