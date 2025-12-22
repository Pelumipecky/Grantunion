# 🔧 How to Fix Data Not Loading Issue

## Problem
Balance and user data are showing as empty because **Row Level Security (RLS) policies** have infinite recursion issues preventing data access.

## Solution - Disable RLS Policies

Follow these steps to fix the issue:

### Step 1: Go to Supabase Dashboard
Visit: **https://supabase.com/dashboard/project/inofcvykmbovozqwehin**

### Step 2: Open SQL Editor
- Click on **SQL Editor** in the left sidebar
- Click **New Query** (or the + button)

### Step 3: Run This SQL
Copy and paste the following SQL and click **Run**:

```sql
-- Disable RLS on all tables to fix infinite recursion
ALTER TABLE userlogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE kyc DISABLE ROW LEVEL SECURITY;
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals DISABLE ROW LEVEL SECURITY;
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards DISABLE ROW LEVEL SECURITY;
ALTER TABLE deletion_requests DISABLE ROW LEVEL SECURITY;
```

### Step 4: Refresh Your Website
- Go back to your app
- Refresh the page (Ctrl+R or Cmd+R)
- **Data should now load!** ✅

---

## What This Does
This disables Row Level Security (RLS) on all tables, which was blocking data access due to infinite recursion in policies. In development, this is fine. In production, you should set up proper RLS policies.

## Verify It Works
After running the SQL:
1. Check the **admin dashboard** - users list should populate
2. Check **user balance** - should show actual balance amounts
3. Check **investments** - should display investment records

---

## ⚠️ Important Notes

- **Development**: Disabling RLS is OK for development/testing
- **Production**: Set up proper RLS policies before deploying to production
- **Service Role Key**: We're using the service role key which bypasses RLS anyway, but this ensures the client-side code also works

---

## Still Having Issues?

If data still doesn't load:

1. **Check Supabase Status Page** - Verify services are running
2. **Check Browser Console** - Look for `[supabaseConfig]` and `[supabaseDb.xxx]` log messages
3. **Verify Environment Variables** - Make sure `.env.local` has correct Supabase credentials
4. **Check Table Names** - Verify tables exist in Supabase (should be: userlogs, investments, etc.)

---

## Next Steps

Once data is loading:
1. Set up proper RLS policies for security
2. Test admin features
3. Test user features

Need help with RLS policies? Contact support or check Supabase documentation.
