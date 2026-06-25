## The Merry Fiddlers — Back Office & Payments Upgrade

### Build progress
1. [x] PERSISTENCE FOUNDATION — `src/lib/store.ts` (Netlify Blobs + fs fallback).
2. [x] PAYMENTS — Stripe Embedded Checkout (on-site, fixed price). Vouchers recorded + emailed on PAID (idempotent fulfillment).
3. [x] ADMIN REBUILD — server-verified login, Overview, Leads pipeline (New/Contacted/Booked/Lost), Vouchers (redeem-by-code, unredeemed/redeemed).
4. [ ] CONTENT CMS (menus / what's-on uploads) — DEFERRED per user ("then we will create a backend so it can be uploaded from there").
5. [x] WHAT'S ON page (curated events) — live in preview.
6. [x] SOCIAL FEED — rebuilt (24 Jun): robust live FB Page Plugin (skeleton + graceful fallback so never blank). Now on Home + Upcoming. Setup: .same/SOCIAL-FEED-SETUP.md.
   - [x] INSTAGRAM LIVE: LightWidget feed for @themerryfiddlers wired as built-in default (DEFAULT_INSTAGRAM_EMBED in SocialFeed.tsx = https://lightwidget.com/widgets/f16a9764a50f50719f77383080088076.html). Verified inlined into / HTML. Works on prod once code is pushed (no Netlify var needed). Override via NEXT_PUBLIC_INSTAGRAM_EMBED_URL if ever needed.
   - [ ] NOT YET LIVE on themerryfiddlers.co.uk — needs the code pushed to GitHub (tomjames039-web/merry-fiddlers-website) → Netlify. Awaiting user go-ahead to push.

### Resumed session (21 Jun) — verified healthy
- tsc --noEmit clean (exit 0). All key pages return 200 (/, /afternoon-tea-offer, /gift-vouchers, /admin, /menu).
- /api/checkout returns 503 stripe_not_configured in preview (expected — keys live only in Netlify). Graceful "call us" fallback shows.
- ui_mode `embedded_page` IS correct for the installed Stripe API (2026-04-22.dahlia → UiMode = 'elements'|'embedded_page'|'form'|'hosted_page'). NOT a bug.
- Live preview screenshot reviewed — design intact (teal/gold, Cinzel). Version 92 created.

### GO-LIVE (Stripe) — LIVE-TESTED 22 Jun against themerryfiddlers.co.uk
- [x] LIVE checkout WORKS: POST /api/checkout returned a real `cs_live_...` clientSecret (HTTP 200).
      => STRIPE_SECRET_KEY (restricted "TMF WEBSITE VOUCHER KEY") is set, LIVE, and HAS Checkout Sessions = WRITE.
      => NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set (browser renders embedded checkout).
- [x] NEXT_PUBLIC_SITE_URL fallback OK (return_url accepted) — explicit set still nice-to-have, low priority.
- [ ] STRIPE_WEBHOOK_SECRET = MISSING (confirmed: webhook returns "No signature" even WITH a signature header).
      => /api/webhook 400s on every real event; the backup fulfillment path is OFF.
      Fix: add whsec_... from the live webhook endpoint (https://themerryfiddlers.co.uk/api/webhook, event checkout.session.completed), redeploy.
- [ ] ⚠️ UNVERIFIED + CRITICAL: does the restricted key have Checkout Sessions = READ?
      fulfillCheckout() calls stripe.checkout.sessions.retrieve(). Write is confirmed; Read is NOT.
      If Read is missing: payment succeeds BUT /booking-success errors, no voucher, no email. MUST confirm.
- [ ] RESEND_API_KEY reported set by prior run — confirm a real test email actually arrives.
- DEFINITIVE TEST: one real £17.50 purchase → success page shows a code → customer + business emails arrive.

### RE-TEST after user updated keys (22 Jun, second round)
- [x] STRIPE_WEBHOOK_SECRET now SET correctly — webhook returns "Invalid signature" (was "No signature"). Backup path live.
- [ ] ❌ STRIPE_SECRET_KEY now BROKEN — checkout 500s: detail "Invalid API Key provided: mk_1Tl5w***************N2dj".
      The pasted value starts `mk_` and ends `N2dj` — NOT a valid Stripe key. Valid = sk_live_ (standard) or rk_live_ (restricted).
      Screenshot's TMF key = sk_live_...Yqgf (ends Yqgf) — so the WRONG value was copied into Netlify.
      IMPACT: live card payments are DOWN right now (customers get the "call us" fallback). Was working before this change.
      FIX: Stripe → API keys → reveal "TMF WEBSITE VOUCHER KEY" → copy the sk_live_... value → paste into Netlify STRIPE_SECRET_KEY → redeploy.
      NOTE: that key shows "Access policy: None" = FULL access, so it has Checkout Sessions read+write (earlier Read concern resolved once correct value is in).

### ✅ RESOLVED 22 Jun ~1:16 PM — user rotated TMF key, all live tests green
- [x] Checkout WRITE: POST /api/checkout → real cs_live_ session (HTTP 200). New sk_live_ key valid.
- [x] Fulfillment READ: /api/checkout/confirm?session_id=<live> → {"status":"unpaid"} (retrieve succeeded → key has Checkout Sessions Read).
- [x] Webhook: returns "Invalid signature" → STRIPE_WEBHOOK_SECRET correctly set.
- [x] Resend: /api/test-email → success, key prefix re_Z1, got Resend id. (Sends from onboarding@resend.dev.)
- [ ] ⚠️ DOMAIN VERIFY: real voucher emails use bookings@themerryfiddlers.co.uk + info@themerryfiddlers.co.uk (email.ts L331/367/570/612).
      Resend must have themerryfiddlers.co.uk VERIFIED or those customer emails fail (error caught → voucher still created, but customer gets nothing).
      Confirm in Resend → Domains = Verified. Definitive proof = one real purchase → customer voucher email actually arrives from bookings@.

### ❌ BLANK CHECKOUT FORM — ROOT CAUSE FOUND 22 Jun ~1:20 PM
- Embedded Stripe form renders blank. Server /api/checkout works (cs_live_), so it's client-side.
- Read the DEPLOYED bundle (app/afternoon-tea-offer/page chunk):
    let m="mk_1Tkn1rG2XnzYSINbLseCFS3w" → that's NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
  => Publishable key is ALSO an mk_ value (invalid). Must be pk_live_. Stripe.js can't init → blank form.
- So BOTH keys were mk_: secret (mk_1Tl5w…N2dj, now fixed to sk_live_) AND publishable (mk_1Tkn1rG2…, STILL WRONG).
- FIX: Netlify → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_51Gz7XhG2… (account stub 51Gz7XhG2 must match the secret key's account).
  From the very first Stripe screenshot the full value is:
  pk_live_51Gz7XhG2XnzYSINbIDKror3xVdAndpPnbMnoa8taDRNsa1IqCBEIhStih9G42ZXkhMWyLEPvQUQuVzzGsVUszTKK00H3QqXS4v
  (copy fresh from Stripe to avoid screenshot misread).
- CRITICAL: NEXT_PUBLIC_* are inlined at BUILD time. Must use "Clear cache and deploy site" (plain redeploy reuses cache → "All files already uploaded" → key won't update).
- VERIFY after: re-grep page chunk → expect pk_live_51Gz7XhG2… ; then the form should render; then one real test purchase.
- Mystery: mk_1T… keys (both pk+sk fields) — not Stripe format. Likely copied from wrong place/sandbox. Need pk_live_ + sk_live_ from same account 51Gz7XhG2.

### ✅ BLANK CHECKOUT FIXED 22 Jun ~1:30 PM (clean rebuild)
- Page chunk hash changed (b30443d8→2f8f77f3) = fresh build ran.
- Deployed bundle now: m="pk_live_51Gz7XhG2Xnz…khMWyLEPvQUQuVzzGsVUszTKK00H3QqXS4v" → publishable key CORRECT, mk_ gone.
- Checkout still creates cs_live_ (HTTP 200). Publishable + secret both account 51Gz7XhG2 → embedded form should render.
- ALL GREEN: checkout(write), confirm(read), webhook secret, resend, publishable key. Remaining = user hard-refresh + 1 real test purchase + confirm Resend domain (bookings@themerryfiddlers.co.uk) for customer email delivery.

### "No changes to preview" on the env-var commit
- Expected/normal: changing Netlify env vars doesn't change code, so the preview diff is empty. NOT an error.
- BUT: NEXT_PUBLIC_* are inlined at BUILD time → must trigger a fresh deploy for them to reach the browser.

### Deployment path (IMPORTANT)
- Live site deploys via user's GitHub repo (tomjames039-web/merry-fiddlers-website) → Netlify auto-deploy.
- THIS workspace's local .git is EMPTY this session. Must re-link remote before any push. DO NOT push without explicit user go-ahead.

### Gotchas for future me
- Don't run `bun run build` while `next dev` is running — corrupts .next. Kill dev, rm -rf .next, restart.
- Start dev with: setsid nohup bun run dev > /tmp/dev.log 2>&1 < /dev/null & disown  (survives between bash calls).
- Netlify secrets-scan: netlify.toml already omits NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY + STRIPE_WEBHOOK_SECRET. If a deploy fails on secrets scan for another key, add it to SECRETS_SCAN_OMIT_KEYS.
