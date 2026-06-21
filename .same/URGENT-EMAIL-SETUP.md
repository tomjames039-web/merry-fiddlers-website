# 🚨 URGENT: Set Up Email System NOW

## The Problem
Your website is NOT sending emails because Resend is not configured. This means:
- ❌ You don't get notifications when someone purchases a voucher
- ❌ Customers don't get their voucher emails
- ❌ You don't get brochure download notifications

## Fix This in 5 Minutes (FREE)

### Step 1: Create Resend Account (2 minutes)
1. Go to: https://resend.com/signup
2. Sign up with your email (FREE - 100 emails/day)
3. Verify your email address

### Step 2: Get Your API Key (1 minute)
1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: "Merry Fiddlers Website"
4. Click "Create"
5. **COPY THE API KEY** (starts with `re_...`) - you only see this once!

### Step 3: Add to Netlify (2 minutes)
1. Go to: https://app.netlify.com
2. Click on your site: **themerryfiddlers**
3. Go to: **Site configuration** → **Environment variables**
4. Click **Add a variable** → **Add a single variable**
5. **Key:** `RESEND_API_KEY`
6. **Value:** Paste the API key you copied (starts with `re_...`)
7. Click **Create variable**
8. Click **Trigger deploy** to redeploy your site

### Step 4: Test It (1 minute)
1. Wait 2-3 minutes for deploy to finish
2. Go to: https://themerryfiddlers.co.uk/api/test-email
3. Check your inbox at **info@themerryfiddlers.co.uk**
4. You should receive a test email!

---

## What Happens Once This Is Set Up?

### For Gift Voucher Purchases:
✅ **You get an email** to info@themerryfiddlers.co.uk with:
- Customer name & email
- Voucher amount (£50)
- Recipient details
- Gift message
- Full purchase details

✅ **Customer gets an email** with:
- Voucher code
- How to redeem
- Your contact info

### For Brochure Downloads:
✅ **You get an email** with lead details
✅ **Customer gets an email** with brochure link

### For Afternoon Tea Purchases:
✅ **You get an email** with booking details
✅ **Customer gets an email** with voucher code

---

## After You Set This Up

You'll be able to track EVERYTHING via email!

**Check these inboxes:**
- **info@themerryfiddlers.co.uk** - All website notifications
- **PayPal email** - Payment confirmations

---

## ⚠️ For the £50 Voucher Purchase That Just Happened

**Once you set up Resend, you WON'T be able to recover that customer's details.**

**What to do:**
1. Check PayPal for the payment
2. If you find it, you'll see the customer's name and email
3. Manually email them:
   - Apologize for the delay
   - Send them their voucher
   - Offer a small discount/upgrade as an apology

**Sample email to send:**
```
Subject: Your £50 Gift Voucher - The Merry Fiddlers

Dear [Customer Name],

Thank you so much for purchasing a £50 gift voucher from The Merry Fiddlers!

We apologize for the delay in sending your voucher - we had a technical issue with our email system, but it's now resolved.

Your voucher code is: GIFT50-[DATE]-[RANDOM]

This voucher is valid for 12 months and can be redeemed for any food or drinks at The Merry Fiddlers.

As an apology for the delay, we'd like to offer you a complimentary glass of Prosecco when you visit us!

If you have any questions, please don't hesitate to contact us at info@themerryfiddlers.co.uk or call +44 1992 572142.

We look forward to welcoming you!

Best regards,
The Merry Fiddlers Team
```

---

## Need Help?

If you're stuck, reply with:
- "I've created my Resend account"
- "I have my API key"
- "I'm stuck at step X"

And I'll guide you through!
