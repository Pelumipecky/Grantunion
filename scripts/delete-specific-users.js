
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // ignore
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const IDS_TO_DELETE = [
  61016648,
  75935740
];

async function deleteUser(idNum) {
  console.log(`\nProcessing user with IDNum: ${idNum}...`);

  // 1. Find the user ID (UUID)
  const { data: userLogs, error: findError } = await supabase
    .from('userlogs')
    .select('id, email, name')
    .eq('idnum', idNum)
    .maybeSingle();

  if (findError) {
    console.error(`Error finding user ${idNum}:`, findError.message);
    return;
  }

  if (!userLogs) {
    console.log(`User with IDNum ${idNum} not found in userlogs.`);
    // Even if not in userlogs, we might want to clean up other tables by idnum if possible?
    // But relying on UUID for many tables makes it hard.
    // For now, assume if not in userlogs, they are effectively gone or inconsistent.
    return;
  }

  const userId = userLogs.id;
  console.log(`Found user: ${userLogs.name} (${userLogs.email}) - UUID: ${userId}`);

  // 2. Delete Relational Data
  console.log('Deleting related records...');
  
  // Arrays of promises for parallel deletion? Or sequential for safety and logging?
  // Sequential is fine for script.

  // Notifications
  const { error: notifError } = await supabase.from('notifications').delete().eq('idnum', idNum);
  if (notifError) console.error(`Failed to delete notifications: ${notifError.message}`);

  // KYC
  const { error: kycError } = await supabase.from('kyc').delete().eq('user_id', userId);
  if (kycError) console.error(`Failed to delete KYC: ${kycError.message}`);

  // Chats
  const { error: chatError } = await supabase.from('chats').delete().eq('user_id', userId);
  if (chatError) console.error(`Failed to delete Chats: ${chatError.message}`);

  // Loans
  const { error: loanError } = await supabase.from('loans').delete().eq('idnum', idNum);
  if (loanError) console.error(`Failed to delete Loans: ${loanError.message}`);

  // Investments
  const { error: invError } = await supabase.from('investments').delete().eq('idnum', idNum);
  if (invError) console.error(`Failed to delete Investments: ${invError.message}`);

  // Withdrawals
  const { error: withError } = await supabase.from('withdrawals').delete().eq('idnum', idNum);
  if (withError) console.error(`Failed to delete Withdrawals: ${withError.message}`);

  // Handle Self-Referencing Foreign Key in userlogs
  // Update users who were referred by this user to remove the reference
  const { error: refUpdateError } = await supabase
    .from('userlogs')
    .update({ referred_by_idnum: null })
    .eq('referred_by_idnum', idNum);
    
  if (refUpdateError) {
    console.error(`Failed to update referrals pointing to ${idNum}: ${refUpdateError.message}`);
  } else {
    console.log('Updated users referred by this user (set referred_by_idnum to null).');
  }

  // 3. Delete from Userlogs
  const { error: logError } = await supabase.from('userlogs').delete().eq('id', userId);
  if (logError) {
    console.error(`Failed to delete from userlogs: ${logError.message}`);
  } else {
    console.log(`Deleted from userlogs.`);
  }

  // 4. Delete from Auth Users (Super Admin Only)
  // The service role key allows admin.deleteUser
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    console.error(`Failed to delete from auth.users (User might not exist in Auth or permission denied): ${authError.message}`);
  } else {
    console.log(`Deleted from auth.users.`);
  }

  console.log(`Passed deletion steps for ${idNum}.`);
}

async function main() {
  console.log('Starting bulk deletion...');
  
  for (const id of IDS_TO_DELETE) {
    await deleteUser(id);
  }

  console.log('\nBulk deletion complete.');
}

main();
