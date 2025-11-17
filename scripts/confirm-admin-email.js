import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  console.error('');
  console.error('To get your service role key:');
  console.error('1. Go to https://supabase.com/dashboard/project/inofcvykmbovozqwehin');
  console.error('2. Go to Settings → API');
  console.error('3. Copy the "service_role" key (starts with eyJ...)');
  console.error('4. Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  process.exit(1);
}

// Initialize Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function confirmAdminEmail() {
  const adminEmail = "admin@grantunioninvestment.com";
  const userUID = "cf58da49-f2cd-4028-bf06-cf28881c3d55";

  try {
    console.log("🔄 Confirming admin email...");
    console.log(`Email: ${adminEmail}`);
    console.log(`User ID: ${userUID}`);
    console.log("");

    // Confirm the user's email
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userUID, {
      email_confirm: true
    });

    if (error) {
      console.error("❌ Error confirming email:", error);
      return;
    }

    console.log("✅ Email confirmed successfully!");
    console.log("");
    console.log("🎉 You can now log in to the admin dashboard:");
    console.log("   URL: http://localhost:3000/signin_admin");
    console.log("   Email: admin@grantunioninvestment.com");
    console.log("   Password: GrantUnion@123");
    console.log("");
    console.log("⚠️  Remember to change the default password after login!");

  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the function
confirmAdminEmail();