# Investment Submission Email - Quick Reference

## Summary of Changes

### Issue
Investment submission email was not being delivered because email logic was running on the client-side without access to Mailjet API credentials.

### Solution
Moved email logic to a server-side API endpoint that has access to environment variables.

---

## Key Changes

### 1. NEW FILE: `src/pages/api/investments/create.js`
- Server-side API endpoint
- Creates investment in database
- Sends confirmation email using Mailjet
- Logs all operations for debugging

### 2. MODIFIED: `src/utils/transactionManager.js`
**Before**: Tried to send email client-side (failed)
**After**: Calls `/api/investments/create` endpoint on server

```javascript
// Now simply calls the API endpoint
export const createInvestment = async (investmentData) => {
  const response = await fetch('/api/investments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ investmentData })
  });
  const result = await response.json();
  return response.ok ? { data: result.data, error: null } : { data: null, error: result.error };
};
```

### 3. ENHANCED LOGGING

**`supabaseUtils.js` - `getUserByIdnum()`**
- Validates idnum is provided
- Logs query errors
- Logs when user not found
- Logs when email field missing

**`emailService.js` - `sendTransactionalEmail()`**
- Validates recipient email
- Logs outgoing email with recipient and subject
- Logs success/failure with Mailjet details

**`investments/create.js` - API handler**
- Logs investment creation status
- Logs user lookup process
- Logs email sending attempts

---

## How to Verify It Works

### Method 1: Watch Console Logs
When user submits investment:
```
📊 Calling investment creation API...
📧 Fetching user details for investment email. idnum: [USER_ID]
📨 Sending email to: [USER_EMAIL], subject: Investment Submitted - Grant Union Investment
✅ Investment created successfully: [INVESTMENT_DATA]
```

### Method 2: Check User's Email
- User should receive investment confirmation email immediately after submission
- Email includes investment details (plan, amount, duration, status)
- Email contains button to view dashboard

### Method 3: Dashboard Status
- Investment appears in user's investment list as "Pending"
- In-app notification is created: "Investment Submitted"

---

## Email Template Details

**Subject**: Investment Submitted - Grant Union Investment

**Email includes**:
- Greeting with user's name
- Investment details table (Plan, Amount, Duration, Status)
- What happens next (4-step process)
- Dashboard button
- Professional footer with contact link

---

## Database Notifications

When investment is created, a notification is also created in the `notifications` table:
- Type: `investment_submitted`
- Message: Mentions amount, status, and next steps
- Status: `unseen`
- Links to investment submission

---

## Error Handling

If email sending fails:
- Investment is still created in database (email failure doesn't block investment)
- Error is logged to console with details
- User can see investment in dashboard even if email fails

---

## Testing Checklist

- [ ] Investment created successfully
- [ ] Confirmation email received within 1 minute
- [ ] Email contains correct investment details
- [ ] Dashboard button works
- [ ] In-app notification appears
- [ ] Email subjects/content are appropriate
- [ ] Console shows all logging without errors

---

## Related Endpoints (Using Same Pattern)

- `src/pages/api/withdrawals/create.js` - Withdrawal creation (already working)
- `src/pages/api/admin/investments/approve.js` - Investment approval by admin
- `src/pages/api/admin/withdrawals/approve.js` - Withdrawal approval by admin

---

## If Issues Persist

Check these things:
1. **Mailjet credentials**: Verify `MAILJET_API_KEY` and `MAILJET_API_SECRET` in environment
2. **User email**: Ensure user has email address in `userlogs` table
3. **API endpoint**: Check `/api/investments/create` exists and is accessible
4. **Console logs**: Check browser and server logs for specific error messages
5. **Database**: Verify investment was created even if email failed

---

## Commit Info

This fix was implemented to resolve:
- User reported: "investment submitted didnt deliver please check why"
- Investigation found: Email logic on client-side without env vars
- Solution: Move to server-side API endpoint with full capabilities
