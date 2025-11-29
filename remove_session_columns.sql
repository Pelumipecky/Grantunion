-- Remove session_id columns from database tables
-- Run this SQL in your Supabase SQL Editor

-- Remove session_id column from investments table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'investments'
               AND column_name = 'session_id'
               AND table_schema = 'public') THEN
        ALTER TABLE investments DROP COLUMN session_id;
        RAISE NOTICE 'Removed session_id column from investments table';
    ELSE
        RAISE NOTICE 'session_id column does not exist in investments table';
    END IF;
END $$;

-- Remove session_id column from withdrawals table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'withdrawals'
               AND column_name = 'session_id'
               AND table_schema = 'public') THEN
        ALTER TABLE withdrawals DROP COLUMN session_id;
        RAISE NOTICE 'Removed session_id column from withdrawals table';
    ELSE
        RAISE NOTICE 'session_id column does not exist in withdrawals table';
    END IF;
END $$;

-- Verify the columns were removed
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('investments', 'withdrawals')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;