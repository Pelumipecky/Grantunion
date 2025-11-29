-- Add transaction_hash column to investments table
ALTER TABLE investments ADD COLUMN IF NOT EXISTS transaction_hash TEXT;