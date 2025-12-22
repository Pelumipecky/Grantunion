const { createClient } = require('@supabase/supabase-js');

// Use service role key to fix RLS
const supabase = createClient(
  'https://njsrlykklqqanqqcqklo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc3JseWtrbHFxYW5xcWNxa2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMzY5NywiZXhwIjoyMDc4ODg5Njk3fQ.rrv-2_9XPa7bMRbHmbNSpEzIMTCAM8FQv94kRgd6quA'
);

async function fixRLS() {
  console.log('Fixing RLS policies with service role...');

  try {
    // SQL commands to execute
    const sqlCommands = [
      'DROP POLICY IF EXISTS "Allow all operations on userlogs" ON userlogs;',
      'DROP POLICY IF EXISTS "Allow all operations on investments" ON investments;',
      'DROP POLICY IF EXISTS "Allow all operations on notifications" ON notifications;',
      'DROP POLICY IF EXISTS "Allow all operations on kyc" ON kyc;',
      'DROP POLICY IF EXISTS "Allow all operations on loans" ON loans;',
      'DROP POLICY IF EXISTS "Allow all operations on withdrawals" ON withdrawals;',
      'DROP POLICY IF EXISTS "Allow all operations on chats" ON chats;',
      'DROP POLICY IF EXISTS "Allow all operations on withdrawal_codes" ON withdrawal_codes;',
      'DROP POLICY IF EXISTS "Allow all operations on referrals" ON referrals;',
      'DROP POLICY IF EXISTS "Allow all operations on referral_rewards" ON referral_rewards;',
      'CREATE POLICY "userlogs_policy" ON userlogs FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "investments_policy" ON investments FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "notifications_policy" ON notifications FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "kyc_policy" ON kyc FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "loans_policy" ON loans FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "withdrawals_policy" ON withdrawals FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "chats_policy" ON chats FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "withdrawal_codes_policy" ON withdrawal_codes FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "referrals_policy" ON referrals FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);',
      'CREATE POLICY "referral_rewards_policy" ON referral_rewards FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);'
    ];

    for (const sql of sqlCommands) {
      console.log('Executing:', sql.substring(0, 50) + '...');

      try {
        const response = await fetch('https://njsrlykklqqanqqcqklo.supabase.co/rest/v1/rpc/exec_sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc3JseWtrbHFxYW5xcWNxa2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMzY5NywiZXhwIjoyMDc4ODg5Njk3fQ.rrv-2_9XPa7bMRbHmbNSpEzIMTCAM8FQv94kRgd6quA',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc3JseWtrbHFxYW5xcWNxa2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMzY5NywiZXhwIjoyMDc4ODg5Njk3fQ.rrv-2_9XPa7bMRbHmbNSpEzIMTCAM8FQv94kRgd6quA'
          },
          body: JSON.stringify({ sql })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log('SQL execution failed:', response.status, errorText);
        } else {
          console.log('SQL executed successfully');
        }
      } catch (fetchError) {
        console.log('Fetch error:', fetchError.message);
      }
    }

    console.log('RLS policies fixed!');

  } catch (e) {
    console.log('Error fixing RLS:', e.message);
  }
}

fixRLS().catch(console.error);