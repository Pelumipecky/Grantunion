import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminDirect() {
  try {
    console.log('🔧 Creating admin account directly...\n');

    const adminEmail = 'admin@grantunioninvestment.com';
    const adminPassword = 'GrantUnion@123';

    // First, check if auth user exists
    console.log('1️⃣ Checking for existing auth user...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    let authUserId = null;
    if (!listError && existingUsers) {
      const existing = existingUsers.users.find(u => u.email === adminEmail);
      if (existing) {
        authUserId = existing.id;
        console.log('✅ Auth user already exists:', authUserId);
      }
    }

    // If no existing user, create one
    if (!authUserId) {
      console.log('Creating new auth user...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm email
      });

      if (authError) {
        console.error('❌ Auth user creation failed:', authError);
        process.exit(1);
      }

      authUserId = authData.user.id;
      console.log('✅ Auth user created:', authUserId);
    }

    // Create admin record in userlogs table
    console.log('\n2️⃣ Creating admin record in database...');
    
    // First check if admin record already exists
    const { data: existingAdmin } = await supabase
      .from('userlogs')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingAdmin) {
      console.log('✅ Admin record already exists in database');
    } else {
      const { data: adminRecord, error: dbError } = await supabase
        .from('userlogs')
        .insert([{
          id: authUserId,
          email: adminEmail,
          name: 'Admin',
          admin: true,
          idnum: '99999999',
          avatar: 'avatar_1',
          balance: 0,
          bonus: 0,
          authstatus: 'seen',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database record creation failed:', dbError);
        process.exit(1);
      }

      console.log('✅ Admin record created in database');
    }

    console.log('🎉 SUCCESS! Admin account created!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@grantunioninvestment.com');
    console.log('🔐 Password: GrantUnion@123');
    console.log('🌐 Login:    http://localhost:3000/signin_admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  Please change the password after first login!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

createAdminDirect();
