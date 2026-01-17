-- Add missing columns to withdrawals table
-- Run this in Supabase SQL Editor to fix the withdrawal approval 500 error

ALTER TABLE withdrawals
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS authstatus TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS bankname TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS account_name TEXT,
ADD COLUMN IF NOT EXISTS routing_number TEXT,
ADD COLUMN IF NOT EXISTS swift_code TEXT,
ADD COLUMN IF NOT EXISTS iban TEXT;

-- Update existing records to have proper default values
UPDATE withdrawals
SET authstatus = 'pending'
WHERE authstatus IS NULL;

UPDATE withdrawals
SET status = 'pending'
WHERE status IS NULL OR status = '';