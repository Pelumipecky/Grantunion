-- COMPLETE FIX: Admin login and user data access
-- Run this in Supabase SQL Editor

-- Step 1: Delete the old admin record completely
DELETE FROM userlogs WHERE email = 'admin@grantunioninvestment.com';

-- Step 2: Create fresh admin record with CORRECT auth ID
INSERT INTO userlogs (
  id,
  email,
  name,
  user_name,
  admin,
  idnum,
  authstatus,
  account_status,
  balance,
  bonus,
  avatar
) VALUES (
  'fcbd9d81-a52d-4402-902f-eddefd4c38b7',
  'admin@grantunioninvestment.com',
  'System Administrator',
  'admin',
  true,
  99999999,
  'verified',
  'active',
  0,
  0,
  'avatar_1'
);

-- Step 3: Drop ALL existing RLS policies
DROP POLICY IF EXISTS "Allow all operations on userlogs" ON userlogs;
DROP POLICY IF EXISTS "Allow SELECT on userlogs" ON userlogs;
DROP POLICY IF EXISTS "Allow UPDATE on userlogs for own record" ON userlogs;
DROP POLICY IF EXISTS "Allow INSERT on userlogs for own record" ON userlogs;
DROP POLICY IF EXISTS "Allow admin operations on userlogs" ON userlogs;
DROP POLICY IF EXISTS "Users can view their own profile" ON userlogs;
DROP POLICY IF EXISTS "Users can update their own profile" ON userlogs;
DROP POLICY IF EXISTS "Users can create their profile" ON userlogs;
DROP POLICY IF EXISTS "Admin can manage all users" ON userlogs;
DROP POLICY IF EXISTS "Allow all authenticated users full access" ON userlogs;

-- Step 4: Create ONE simple policy for everyone
CREATE POLICY "Allow all authenticated users full access" ON userlogs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 5: Verify setup
SELECT 'Admin User Check:' as status;
SELECT id, email, admin, idnum, authstatus FROM userlogs WHERE email = 'admin@grantunioninvestment.com';

SELECT '' as separator;
SELECT 'RLS Policy Check:' as status;
SELECT policyname FROM pg_policies WHERE tablename = 'userlogs';
