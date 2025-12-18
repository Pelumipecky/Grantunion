import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // Security check: Ensure only authorized calls (optional but recommended)
  // You can add a secret query param like ?key=MY_SECRET_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('Starting Daily KYC Reminder via API...');

    // 1. Fetch all users who haven't completed KYC (status is null, pending, or rejected)
    const { data: users, error: fetchError } = await supabase
      .from('userlogs')
      .select('id, idnum, name, email, kyc_status, created_at')
      .or('kyc_status.is.null,kyc_status.eq.pending,kyc_status.eq.rejected')
      .neq('admin', true); // Exclude admin users

    if (fetchError) throw fetchError;

    console.log(`Found ${users.length} users who need KYC reminders`);

    let reminderCount = 0;
    const logs = [];

    for (const user of users) {
      try {
        // Check if user already has a KYC reminder notification today
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const { data: existingReminder, error: checkError } = await supabase
          .from('notifications')
          .select('id')
          .eq('idnum', user.idnum)
          .eq('type', 'kyc_reminder')
          .gte('created_at', today + ' 00:00:00')
          .lte('created_at', today + ' 23:59:59')
          .limit(1);

        if (checkError) {
          logs.push(`Error checking existing reminders for user ${user.idnum}: ${checkError.message}`);
          continue;
        }

        // Skip if user already received a reminder today
        if (existingReminder && existingReminder.length > 0) {
          logs.push(`User ${user.idnum} already received KYC reminder today`);
          continue;
        }

        // Create KYC reminder notification
        const reminderMessage = user.kyc_status === 'rejected'
          ? '⚠️ Your KYC verification was rejected. Please review your documents and submit again to enable withdrawals.'
          : '📋 Complete your KYC verification to unlock withdrawals and access all platform features.';

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert([{
            idnum: user.idnum,
            title: 'KYC Verification Reminder',
            message: reminderMessage,
            status: 'unseen',
            type: 'kyc_reminder',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (notificationError) {
          logs.push(`Failed to create KYC reminder for user ${user.idnum}: ${notificationError.message}`);
        } else {
          reminderCount++;
          logs.push(`KYC reminder sent to user ${user.idnum} (${user.name})`);
        }

      } catch (userError) {
        logs.push(`Error processing user ${user.idnum}: ${userError.message}`);
      }
    }

    console.log(`KYC Reminder process completed. Sent ${reminderCount} reminders.`);

    return res.status(200).json({
      success: true,
      message: `KYC reminders sent to ${reminderCount} users`,
      totalUsers: users.length,
      remindersSent: reminderCount,
      logs: logs
    });

  } catch (error) {
    console.error('KYC Reminder API Error:', error);
    return res.status(500).json({
      error: 'Failed to send KYC reminders',
      details: error.message
    });
  }
}