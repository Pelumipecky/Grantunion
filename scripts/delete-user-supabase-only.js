/**
 * Script to delete a specific user and all associated data from Supabase
 * 
 * NOTE: Use delete-users-by-email.js instead for a more flexible, reusable script
 */

try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('No .env.local found, using environment variables');
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TARGET_EMAIL = 'test@example.com'; // Change to target email

async function deleteUserFromSupabase() {
  console.log('🗄️ Deleting user from Supabase...');
  console.log(`Target email: ${TARGET_EMAIL}`);

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase credentials');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? 'SET' : 'NOT SET');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // 1. Find user by email
  console.log(`🔍 Finding user with email: ${TARGET_EMAIL}`);
  const { data: userData, error: findError } = await supabase
    .from('userlogs')
    .select('*')
    .eq('email', TARGET_EMAIL)
    .single();

  if (findError || !userData) {
    console.error('❌ User not found in Supabase:', findError?.message);
    return;
  }

  console.log(`✅ Found user: ${userData.name} (ID: ${userData.id}, IDNum: ${userData.idnum})`);
  console.log(`   Balance: $${userData.balance}, Status: ${userData.account_status}`);

  const userId = userData.id;
  const userIdNum = userData.idnum;

  // 2. Delete from all related tables in correct order (foreign key constraints)
  const deleteOperations = [
    { table: 'notifications', field: 'idnum', value: userIdNum, description: 'notifications' },
    { table: 'investments', field: 'idnum', value: userIdNum, description: 'investments' },
    { table: 'withdrawals', field: 'idnum', value: userIdNum, description: 'withdrawals' },
    { table: 'loans', field: 'idnum', value: userIdNum, description: 'loans' },
    { table: 'kyc', field: 'idnum', value: userIdNum, description: 'KYC records' },
    { table: 'chats', field: 'user_id', value: userId, description: 'chat messages' },
    { table: 'withdrawal_codes', field: 'user_id', value: userId, description: 'withdrawal codes' },
    { table: 'deletion_requests', field: 'user_id', value: userId, description: 'deletion requests' }
  ];

  console.log('\n🗑️ Starting deletion process...');

  for (const op of deleteOperations) {
    try {
      const { data, error, count } = await supabase
        .from(op.table)
        .delete({ count: 'exact' })
        .eq(op.field, op.value);

      if (error) {
        console.error(`❌ Error deleting from ${op.table}:`, error.message);
      } else {
        console.log(`✅ Deleted ${count || 0} records from ${op.table}`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error deleting from ${op.table}:`, error.message);
    }
  }

  // 3. Delete from Supabase Auth (if user exists there)
  console.log('\n🔐 Deleting from Supabase Auth...');
  try {
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.log('⚠️ Supabase Auth deletion failed (user may not exist in auth):', authError.message);
    } else {
      console.log('✅ Deleted from Supabase Auth');
    }
  } catch (error) {
    console.error('❌ Error deleting from Supabase Auth:', error.message);
  }

  // 4. Finally, delete from userlogs
  console.log('\n👤 Deleting user record from userlogs...');
  try {
    const { error } = await supabase
      .from('userlogs')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ Error deleting from userlogs:', error.message);
      console.log('⚠️ User record may still exist!');
    } else {
      console.log('✅ Deleted user record from userlogs');
    }
  } catch (error) {
    console.error('❌ Unexpected error deleting from userlogs:', error.message);
  }

  console.log('\n🎉 SUPABASE DELETION COMPLETED');
  console.log(`Successfully deleted user ${TARGET_EMAIL} and all associated data from Supabase`);
}

async function main() {
  console.log('🚨 STARTING USER DELETION PROCESS 🚨');
  console.log(`Target: ${TARGET_EMAIL}`);
  console.log('This will permanently delete all user data from Supabase!');
  console.log('Note: Firebase deletion skipped (not installed)');
  console.log('');

  try {
    await deleteUserFromSupabase();
    console.log('');
    console.log('🎉 USER DELETION COMPLETED SUCCESSFULLY 🎉');

  } catch (error) {
    console.error('❌ CRITICAL ERROR during deletion:', error);
    process.exit(1);
  }
}

// Run the deletion
main().catch(console.error);