# Grant Union Email Styling & Mailjet Configuration Guide

## 🎨 Email Styling Features

Your emails are now **fully branded** with Grant Union styling:

### Design Elements:
- ✅ **Primary Color**: Deep Purple (`#1C0F36`) with Orange accent (`#FF8C37`)
- ✅ **Gradient Headers**: Linear gradient matching website design
- ✅ **Professional Typography**: Alegreya Sans font family
- ✅ **Responsive Design**: Mobile-optimized email templates
- ✅ **Statistics Boxes**: Highlighted earnings/investment details
- ✅ **Call-to-Action Buttons**: Interactive buttons with hover effects
- ✅ **Success Badges**: Green success indicators
- ✅ **Info & Warning Boxes**: Color-coded information sections

---

## 📧 Email API Usage

### Basic Implementation (with Styled Templates)

```javascript
// Send ROI Daily Credit Email
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Daily ROI Credit - $50 Earned',
    type: 'roi_daily_credit',
    templateData: {
      userName: 'John Doe',
      dailyROI: 50,
      totalROI: 150,
      totalExpected: 500,
      plan: '7-Day Plan',
      progress: 30.5
    }
  })
});
```

---

## 📋 Available Email Templates

### 1. **roi_daily_credit** - Daily ROI Notifications
Used when daily ROI is credited to active investments.

**Required Data:**
```javascript
templateData: {
  userName: string,      // User's name
  dailyROI: number,      // Today's ROI amount
  totalROI: number,      // Total ROI credited to date
  totalExpected: number, // Total expected ROI for plan
  plan: string,          // Investment plan name
  progress: number       // Completion percentage (0-100)
}
```

**Example:**
```javascript
{
  type: 'roi_daily_credit',
  templateData: {
    userName: 'Sarah',
    dailyROI: 25.50,
    totalROI: 76.50,
    totalExpected: 255,
    plan: '3-Month Plan',
    progress: 30
  }
}
```

---

### 2. **investment_approval** - Investment Approved
Sent when an investment request is approved.

**Required Data:**
```javascript
templateData: {
  userName: string,      // User's name
  plan: string,          // Investment plan name
  capital: number,       // Capital invested
  roi: number,           // Expected ROI
  bonus: number,         // Optional bonus amount
  duration: string       // Duration label (e.g., "7 days", "3 months")
}
```

**Example:**
```javascript
{
  type: 'investment_approval',
  templateData: {
    userName: 'Michael',
    plan: '15-Day Plan',
    capital: 5000,
    roi: 3000,
    bonus: 500,
    duration: '15 days'
  }
}
```

---

### 3. **kyc_verification** - KYC Status Update
Sent when KYC verification status changes.

**Required Data:**
```javascript
templateData: {
  userName: string,  // User's name
  status: string     // 'Verified', 'Pending', 'Rejected'
}
```

**Example:**
```javascript
{
  type: 'kyc_verification',
  templateData: {
    userName: 'Emma',
    status: 'Verified'
  }
}
```

---

### 4. **withdrawal_notification** - Withdrawal Status
Sent for withdrawal request updates.

**Required Data:**
```javascript
templateData: {
  userName: string,    // User's name
  amount: number,      // Withdrawal amount
  status: string,      // 'approved', 'pending', 'rejected'
  method: string       // Payment method (Bitcoin, Bank, etc.)
}
```

**Example:**
```javascript
{
  type: 'withdrawal_notification',
  templateData: {
    userName: 'David',
    amount: 500,
    status: 'approved',
    method: 'Bitcoin'
  }
}
```

---

### 5. **password_reset** - Password Reset Link
Sent for password reset requests.

**Required Data:**
```javascript
templateData: {
  userName: string,    // User's name
  resetLink: string    // Reset link URL
}
```

**Example:**
```javascript
{
  type: 'password_reset',
  templateData: {
    userName: 'James',
    resetLink: 'https://grantunion583.com/reset-password?token=...'
  }
}
```

---

## 🔧 Mailjet Configuration Steps

### Step 1: Access Mailjet Dashboard
1. Go to https://www.mailjet.com
2. Sign in with your account
3. Navigate to **Account Settings → API Keys**

### Step 2: Verify Your From Email
1. Go to **Sender Domains & Addresses**
2. Add/verify: `grantunion583@gmail.com`
3. Complete the verification process (check inbox for confirmation link)

### Step 3: Create Email Templates (Optional but Recommended)
1. Go to **Design Studio**
2. Click **New Template**
3. Create templates for each email type
4. Copy the Template ID for use in your code

### Step 4: Configure Tracking (Optional)
1. Go to **Settings → Email Settings**
2. Enable:
   - ✅ Open Tracking
   - ✅ Click Tracking
   - ✅ Bounce Tracking
3. This helps monitor email deliverability

### Step 5: Set Up Webhook Events (Optional but Useful)
1. Go to **Settings → Webhooks**
2. Add webhook URL for events:
   - Email Opened
   - Link Clicked
   - Bounce
   - Complaint
3. This allows you to track engagement in your database

---

## 📊 Mailjet Dashboard Features

### Monitoring Email Performance:
1. **Overview Tab**: See sent/delivered/opened counts
2. **Contacts Tab**: Manage email lists
3. **Contacts Management**: Create segments and lists
4. **Logs**: View individual email delivery details
5. **Analytics**: Track opens, clicks, bounces, complaints

### Creating Segments for Targeted Campaigns:
```
Example: Send special offers to users with completed KYC
1. Segment → New Segment
2. Rules: KYC Status = 'Verified'
3. Use this segment for promotional campaigns
```

---

## 💾 Environment Variables

Make sure these are set in your `.env.local`:

```env
MAILJET_API_KEY=afcfe4f212d8b2e218fc8104f42df9e8
MAILJET_API_SECRET=5bcc272d46d8cbbad2429b9a6114068c
MAILJET_FROM_EMAIL=grantunion583@gmail.com
MAILJET_FROM_NAME=Grant Union Investment
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For local testing
```

---

## 🎯 Implementation Examples in Your Code

### ROI Update Script (scripts/update-daily-roi.js):
```javascript
// Fetch user and send styled ROI email
const { data: userData } = await supabase
  .from('userlogs')
  .select('email, name')
  .eq('idnum', investment.idnum)
  .single();

if (userData && userData.email) {
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: userData.email,
      subject: `Daily ROI Credit - $${dailyAmount.toFixed(2)} Earned`,
      type: 'roi_daily_credit',
      templateData: {
        userName: userData.name,
        dailyROI: dailyAmount,
        totalROI: newCredited,
        totalExpected: totalExpectedROI,
        plan: investment.plan,
        progress: (newCredited / totalExpectedROI) * 100
      }
    })
  });
}
```

### Investment Approval (InvestAdminSect.jsx):
```javascript
// Send approval email with styled template
const emailResponse = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: userData.email,
    subject: 'Investment Approved - Earnings Now Active',
    type: 'investment_approval',
    templateData: {
      userName: userData.name,
      plan: elem.plan,
      capital: capital,
      roi: calculatedROI,
      bonus: calculatedBonus,
      duration: planConfig?.durationLabel || '30 days'
    }
  })
});
```

---

## 🚀 Testing Your Emails

### Test 1: Send a Test Email
```bash
# Using curl
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "youremail@example.com",
    "subject": "Test Email",
    "type": "roi_daily_credit",
    "templateData": {
      "userName": "Test User",
      "dailyROI": 50,
      "totalROI": 150,
      "totalExpected": 500,
      "plan": "7-Day Plan",
      "progress": 30
    }
  }'
```

### Test 2: Check Mailjet Logs
1. Go to Mailjet Dashboard → Logs
2. Look for recent sent emails
3. Click on email to see delivery status
4. Check opens and clicks tracking

### Test 3: Verify Email HTML Rendering
1. Send test email to yourself
2. Check in inbox for proper styling
3. Test on mobile devices if possible
4. Verify images and links are working

---

## ⚠️ Important Notes

1. **Email Domain**: Use only verified domains/emails in Mailjet
2. **Rate Limiting**: Mailjet has rate limits - monitor usage
3. **Spam Prevention**: Always include unsubscribe option (Mailjet adds automatically)
4. **Testing**: Use test emails before sending to production
5. **Credentials**: Keep API keys secure - never commit to git
6. **Headers**: Mailjet automatically adds authentication headers

---

## 🔐 Security Best Practices

1. ✅ Never expose API keys in client-side code
2. ✅ Use environment variables for sensitive data
3. ✅ Validate email addresses before sending
4. ✅ Rate limit email sending to prevent spam
5. ✅ Log all email send attempts for audit trail
6. ✅ Use HTTPS for all email API calls

---

## 📞 Support & Resources

- **Mailjet Documentation**: https://dev.mailjet.com/
- **Mailjet API Reference**: https://dev.mailjet.com/reference/send
- **Email Validation**: Mailjet Dashboard → Contacts
- **Deliverability Guide**: https://mailjet.com/resources

---

## 🎨 Customizing Email Styling

To modify email colors/styling, edit `/src/pages/api/send-email.js`:

### Key CSS Variables to Customize:
```css
/* Primary Colors */
background: linear-gradient(120deg, #1C0F36, #FF8C37); /* Header gradient */
color: #FEF9FF;                                        /* Text color */

/* Accent Colors */
color: #FF8C37;                                        /* Orange accent */
color: #2DC194;                                        /* Green success */
color: #FF9837;                                        /* Orange warning */
```

Simply modify these color codes in the template styles to match your brand preferences.

---

**Last Updated**: December 21, 2025
**Version**: 1.0
**Status**: Production Ready ✅
