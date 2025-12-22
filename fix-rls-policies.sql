-- Fix RLS Policies to prevent infinite recursion
-- Run this in Supabase SQL Editor

-- Drop problematic policies
DROP POLICY IF EXISTS "Allow all operations on userlogs" ON userlogs;
DROP POLICY IF EXISTS "Allow all operations on investments" ON investments;
DROP POLICY IF EXISTS "Allow all operations on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow all operations on kyc" ON kyc;
DROP POLICY IF EXISTS "Allow all operations on loans" ON loans;
DROP POLICY IF EXISTS "Allow all operations on withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Allow all operations on chats" ON chats;
DROP POLICY IF EXISTS "Allow all operations on withdrawal_codes" ON withdrawal_codes;
DROP POLICY IF EXISTS "Allow all operations on referrals" ON referrals;
DROP POLICY IF EXISTS "Allow all operations on referral_rewards" ON referral_rewards;

-- Create new permissive policies
CREATE POLICY "userlogs_policy" ON userlogs FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "investments_policy" ON investments FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "notifications_policy" ON notifications FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "kyc_policy" ON kyc FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "loans_policy" ON loans FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "withdrawals_policy" ON withdrawals FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "chats_policy" ON chats FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "withdrawal_codes_policy" ON withdrawal_codes FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "referrals_policy" ON referrals FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "referral_rewards_policy" ON referral_rewards FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- Keep the deletion_requests policies as they were (more restrictive)
-- They should still work