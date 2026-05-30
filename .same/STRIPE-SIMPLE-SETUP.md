# ✅ Simple Stripe Setup (No Technical Skills Needed!)

This is the **EASY** way to accept payments - no complex API setup, no webhooks, no environment variables in code.

## Step 1: Create a Payment Link in Stripe (2 minutes)

1. **Log into your Stripe Dashboard**: https://dashboard.stripe.com/
2. **Click "Payment Links"** in the left sidebar (or go to https://dashboard.stripe.com/payment-links)
3. **Click "+ New"** button
4. **Fill in the product details**:
   - **Name**: `50% Off Afternoon Tea Voucher`
   - **Price**: `£17.50`
   - **Description**: `Afternoon Tea for 2 people - We'll contact you to arrange booking`
5. **Click "Create link"**
6. **Copy the Payment Link URL** - it looks like:
   ```
   https://buy.stripe.com/XXXXXXXXX
   ```

## Step 2: Add the Link to Netlify (1 minute)

1. **Go to Netlify**: https://app.netlify.com
2. **Open your site** (themerryfiddlers.co.uk)
3. **Go to**: Site configuration → Environment variables
4. **Add a new variable**:
   - **Key**: `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`
   - **Value**: Paste your Payment Link URL from Step 1
5. **Click "Save"**
6. **Redeploy your site** (Deploys → Trigger deploy → Deploy site)

## Step 3: Test It! 🎉

1. Visit your site: https://themerryfiddlers.co.uk/afternoon-tea-offer
2. Fill in the form
3. Click "Proceed to Payment"
4. You'll be taken to Stripe's secure checkout
5. Use test card: `4242 4242 4242 4242`, any future expiry, any CVC

## That's It!

✅ No complex API setup
✅ No webhook configuration
✅ No code deployment
✅ Works immediately

---

## Optional: Get Email Notifications

If you want to receive an email when someone purchases:

1. In your Stripe Dashboard, go to **Developers → Webhooks**
2. Turn on **"Email me about successful payments"**
3. Done!

You can also view all payments in: **Payments** → **All payments** in your Stripe dashboard.
