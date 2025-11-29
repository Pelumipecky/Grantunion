-- Add session_id column to withdrawals table
-- This is needed for transaction tracking functionality

ALTER TABLE withdrawals
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Update existing records to have null session_id (they were created before session tracking)
UPDATE withdrawals
SET session_id = NULL
WHERE session_id IS NULL;