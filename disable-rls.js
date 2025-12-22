const { createClient } = require('@supabase/supabase-js');

// Use service role key to disable RLS temporarily
const supabase = createClient(
  'https://njsrlykklqqanqqcqklo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc3JseWtrbHFxYW5xcWNxa2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMzY5NywiZXhwIjoyMDc4ODg5Njk3fQ.rrv-2_9XPa7bMRbHmbNSpEzIMTCAM8FQv94kRgd6quA'
);

async function disableRLS() {
  console.log('Disabling RLS on all tables for development...');

  const tables = [
    'userlogs',
    'investments',
    'notifications',
    'kyc',
    'loans',
    'withdrawals',
    'chats',
    'withdrawal_codes',
    'referrals',
    'referral_rewards',
    'deletion_requests'
  ];

  for (const table of tables) {
    try {
      console.log(`Disabling RLS on ${table}...`);

      // Use raw SQL execution via service role
      // Since exec_sql doesn't exist, let's try a different approach
      // We'll use the fact that service role bypasses RLS to execute DDL

      const { error } = await supabase.rpc('exec', {
        sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
      });

      if (error) {
        console.log(`Error disabling RLS on ${table}:`, error.message);
      } else {
        console.log(`RLS disabled on ${table}`);
      }

    } catch (e) {
      console.log(`Failed to disable RLS on ${table}:`, e.message);
    }
  }

  console.log('RLS disabling process completed.');
}

disableRLS().catch(console.error);