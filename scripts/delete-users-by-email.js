/**
 * Script to delete users and all associated data by email
 * Usage: node delete-users-by-email.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Users to delete
const USERS_TO_DELETE = [
  'pelumipecky@gmail.com',
  'opeblazee.ot@gmail.com'
];

async function deleteUserByEmail(email) {
  try {
    console.log(`\n🔍 Processing user: ${email}`);

    // 1. Get user by email
    const { data: userData, error: userError } = await supabase
      .from('userlogs')
      .select('id, idnum, name')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error(`❌ User not found: ${email}`);
      return { success: false, error: 'User not found' };
    }

    console.log(`✅ Found user: ${userData.name} (ID: ${userData.id}, IDNUM: ${userData.idnum})`);

    const userId = userData.id;
    const idnum = userData.idnum;

    // 2. Delete all related data in order
    const deletions = [
      { name: 'notifications', query: () => supabase.from('notifications').delete().eq('idnum', idnum) },
      { name: 'kyc records', query: () => supabase.from('kyc').delete().eq('user_id', userId) },
      { name: 'chats', query: () => supabase.from('chats').delete().eq('user_id', userId) },
      { name: 'loans', query: () => supabase.from('loans').delete().eq('idnum', idnum) },
      { name: 'withdrawal codes', query: () => supabase.from('withdrawal_codes').delete().eq('user_id', userId) },
      { name: 'referrals', query: () => supabase.from('referrals').delete().or(`referrer_id.eq.${userId},referred_user_id.eq.${userId}`) },
      { name: 'investments', query: () => supabase.from('investments').delete().eq('idnum', idnum) },
      { name: 'withdrawals', query: () => supabase.from('withdrawals').delete().eq('idnum', idnum) },
      { name: 'deletion requests', query: () => supabase.from('deletion_requests').delete().eq('user_id', userId) }
    ];

    for (const deletion of deletions) {
      try {
        const { error } = await deletion.query();
        if (error) {
          console.warn(`  ⚠️  Could not delete ${deletion.name}: ${error.message}`);
        } else {
          console.log(`  ✅ Deleted ${deletion.name}`);
        }
      } catch (err) {
        console.warn(`  ⚠️  Error deleting ${deletion.name}: ${err.message}`);
      }
    }

    // 3. Delete user from userlogs
    const { error: deleteUserError } = await supabase
      .from('userlogs')
      .delete()
      .eq('id', userId);

    if (deleteUserError) {
      console.error(`  ❌ Failed to delete user record: ${deleteUserError.message}`);
      return { success: false, error: deleteUserError };
    }

    console.log(`  ✅ Deleted user from userlogs`);

    // 4. Try to delete from Auth (if exists)
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) {
        console.warn(`  ⚠️  Could not delete from auth: ${authError.message}`);
      } else {
        console.log(`  ✅ Deleted user from auth`);
      }
    } catch (err) {
      console.warn(`  ⚠️  Auth deletion skipped: ${err.message}`);
    }

    console.log(`\n✅ SUCCESSFULLY DELETED: ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`\n❌ ERROR deleting ${email}:`, error);
    return { success: false, error };
  }
}

async function main() {
  console.log('🗑️  USER DELETION SCRIPT');
  console.log('========================\n');
  console.log(`Deleting ${USERS_TO_DELETE.length} users with all their data...\n`);

  const results = [];
  for (const email of USERS_TO_DELETE) {
    const result = await deleteUserByEmail(email);
    results.push({ email, ...result });
  }

  console.log('\n\n📊 DELETION SUMMARY');
  console.log('===================');
  results.forEach((result) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.email}`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n${successCount}/${USERS_TO_DELETE.length} users deleted successfully`);

  process.exit(successCount === USERS_TO_DELETE.length ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
