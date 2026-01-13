
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // ignore if dotenv not found, assuming env vars might be set
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function listUsers() {
  console.log('Fetching all users from database...');
  
  // Fetch columns relevant for identification
  const { data: users, error } = await supabase
    .from('userlogs')
    .select('id, idnum, name, email, balance, account_status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error.message);
    return;
  }

  if (!users || users.length === 0) {
    console.log('No users found in the database.');
    return;
  }

  console.log(`\nFound ${users.length} users:\n`);
  console.log('------------------------------------------------------------------------------------------------');
  console.log('| ID Number | Name                 | Email                          | Balance    | Status     |');
  console.log('------------------------------------------------------------------------------------------------');

  users.forEach(user => {
    const idNum = (user.idnum || 'N/A').toString().padEnd(9);
    const name = (user.name || 'N/A').substring(0, 20).padEnd(20);
    const email = (user.email || 'N/A').substring(0, 30).padEnd(30);
    const balance = `$${(user.balance || 0).toLocaleString()}`.padEnd(10);
    const status = (user.account_status || 'N/A').padEnd(10);
    
    console.log(`| ${idNum} | ${name} | ${email} | ${balance} | ${status} |`);
    console.log(`  Supabase ID: ${user.id}`); // ID on new line to avoid overly wide table
    console.log('------------------------------------------------------------------------------------------------');
  });
}

listUsers();
