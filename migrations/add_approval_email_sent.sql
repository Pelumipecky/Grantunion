-- Migration: add approval_email_sent flag to investments
-- Run on production Supabase SQL editor or via psql
ALTER TABLE investments
  ADD COLUMN IF NOT EXISTS approval_email_sent BOOLEAN DEFAULT FALSE;

-- (Optional) If you want to mark existing Active investments as already emailed,
-- uncomment the following line to set the flag for non-pending investments:
-- UPDATE investments SET approval_email_sent = TRUE WHERE status IN ('Active','Approved');
