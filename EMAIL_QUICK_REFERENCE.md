# 📧 Email Templates Quick Reference

## Color Scheme (Matches Your Website)
- **Primary**: `#1C0F36` (Deep Purple)
- **Accent**: `#FF8C37` (Orange)
- **Success**: `#2DC194` (Green)
- **Text**: `#FEF9FF` (Light Purple)
- **Background**: `#120524` (Dark)

---

## 5 Email Templates Available

### 1️⃣ ROI Daily Credit
```javascript
// When daily ROI is credited
{
  type: 'roi_daily_credit',
  templateData: {
    userName: 'John',
    dailyROI: 50,
    totalROI: 150,
    totalExpected: 500,
    plan: '7-Day Plan',
    progress: 30
  }
}
```

### 2️⃣ Investment Approved
```javascript
// When investment is approved
{
  type: 'investment_approval',
  templateData: {
    userName: 'John',
    plan: '15-Day Plan',
    capital: 5000,
    roi: 3000,
    bonus: 500,
    duration: '15 days'
  }
}
```

### 3️⃣ KYC Verification
```javascript
// When KYC status changes
{
  type: 'kyc_verification',
  templateData: {
    userName: 'John',
    status: 'Verified'  // or 'Pending', 'Rejected'
  }
}
```

### 4️⃣ Withdrawal Notification
```javascript
// When withdrawal status changes
{
  type: 'withdrawal_notification',
  templateData: {
    userName: 'John',
    amount: 500,
    status: 'approved',  // or 'pending', 'rejected'
    method: 'Bitcoin'
  }
}
```

### 5️⃣ Password Reset
```javascript
// When user requests password reset
{
  type: 'password_reset',
  templateData: {
    userName: 'John',
    resetLink: 'https://yourdomain.com/reset?token=...'
  }
}
```

---

## Complete Fetch Example

```javascript
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Your Subject Here',
    type: 'roi_daily_credit',  // Template type
    templateData: {
      // Data for this template type
      userName: 'John Doe',
      dailyROI: 50,
      totalROI: 150,
      totalExpected: 500,
      plan: '7-Day Plan',
      progress: 30
    }
  })
});
```

---

## Mailjet Setup Checklist

- [ ] Account created at https://mailjet.com
- [ ] API Keys obtained from Account Settings
- [ ] From email `grantunion583@gmail.com` verified
- [ ] Environment variables set in `.env.local`
- [ ] Test email sent successfully
- [ ] Email styling verified in inbox
- [ ] Links and buttons tested
- [ ] Mobile view tested

---

## Environment Variables Required

```env
MAILJET_API_KEY=afcfe4f212d8b2e218fc8104f42df9e8
MAILJET_API_SECRET=5bcc272d46d8cbbad2429b9a6114068c
MAILJET_FROM_EMAIL=grantunion583@gmail.com
MAILJET_FROM_NAME=Grant Union Investment
```

---

## 🎨 Design Features

✅ **Responsive** - Works on mobile & desktop  
✅ **Branded** - Matches website colors/fonts  
✅ **Professional** - Clean, modern layout  
✅ **Interactive** - Hover effects on buttons  
✅ **Accessible** - Good contrast ratios  
✅ **Fast Loading** - Optimized CSS/images  

---

## Testing

```bash
# Send test email via command line
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email",
    "type": "roi_daily_credit",
    "templateData": {
      "userName": "Test",
      "dailyROI": 25,
      "totalROI": 75,
      "totalExpected": 250,
      "plan": "7-Day Plan",
      "progress": 30
    }
  }'
```

---

## Files Modified

- ✅ `src/pages/api/send-email.js` - Added styled templates
- ✅ `scripts/update-daily-roi.js` - Added email sending
- ✅ `src/pages/api/cron/update-roi.js` - Added email sending
- ✅ `EMAIL_STYLING_GUIDE.md` - Complete documentation

---

**Status**: Ready for Production ✅
