-- Add bank details columns to withdrawals table
ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS account_name TEXT;
ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS routing_number TEXT;
