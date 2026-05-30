# 📊 IMPORTANT: Data Storage & Tracking

## ⚠️ Current Situation

Your website is **capturing all leads and purchases** but using **temporary in-memory storage**. This means:

### What's Working ✅
- Brochure downloads ARE being captured
- Afternoon tea purchases ARE being tracked
- Gift voucher purchases ARE being tracked
- **ALL submissions send email notifications to: info@themerryfiddlers.co.uk**

### The Problem ❌
- Data is stored in **memory only** (not a database)
- **All data is lost every time the site redeploys** (happens frequently on Netlify)
- You can't view historical data beyond the last deployment

---

## 📧 How You're Currently Receiving Data

### Every Brochure Download Sends Email To:
**info@themerryfiddlers.co.uk** with:
- Customer name
- Customer email
- Customer phone
- Event type
- Expected guests
- Preferred date
- Message
- Marketing consent
- Timestamp

### Every Afternoon Tea Purchase Sends Email To:
**info@themerryfiddlers.co.uk** with:
- Customer name
- Customer email
- Customer phone
- Number of guests
- Prosecco upgrade (Yes/No)
- Special dietary requirements
- Total paid

### Every Gift Voucher Purchase Sends Email To:
**info@themerryfiddlers.co.uk** with:
- Purchaser name & email
- Voucher amount
- Recipient name & email
- Gift message
- Total paid

---

## ✅ Solution: Check Your Email

**All brochure downloads and purchases are being emailed to you at info@themerryfiddlers.co.uk**

### To Track Downloads:
1. Check your **info@themerryfiddlers.co.uk** inbox
2. Search for: "New Event Enquiry"
3. Each email contains full customer details
4. Create a folder/label to organize them

### To Track Payments:
1. Check your **PayPal account** for payment notifications
2. Check **info@themerryfiddlers.co.uk** for customer details
3. Match PayPal payments with email notifications

---

## 🔧 Resend API Key Status

For emails to work, you need to:

1. **Have a Resend account** (free plan works fine)
2. **Add RESEND_API_KEY to Netlify environment variables**:
   - Go to: https://app.netlify.com
   - Select your site
   - Go to: Site configuration → Environment variables
   - Add variable: `RESEND_API_KEY` with your Resend API key

### Get Your Resend API Key:
1. Go to: https://resend.com/api-keys
2. Create a new API key
3. Copy it and add to Netlify

**Without the Resend API key, emails won't be sent and you'll lose all data!**

---

## 📱 How to Check if Emails Are Working

### Test the Brochure Download:
1. Go to: https://themerryfiddlers.co.uk/download-brochure
2. Fill in the form with **YOUR email address**
3. Submit
4. Check your inbox for:
   - Auto-reply from The Merry Fiddlers (sent to YOUR email)
   - Notification to info@themerryfiddlers.co.uk
   - Brochure download email

If you don't receive emails = Resend API key is not configured!

---

## 🚀 Future Improvement (Optional)

To avoid losing data between deployments, you would need:
- A database (e.g., Supabase, PostgreSQL, Airtable)
- Or a spreadsheet integration (e.g., Google Sheets)
- Or use a CRM tool

**But for now, emails to info@themerryfiddlers.co.uk are your backup!**
