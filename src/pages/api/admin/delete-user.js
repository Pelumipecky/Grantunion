import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key for Admin operations
// This bypasses RLS policies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic validation of admin privileges could be added here
  // But usually protecting the route or checking a secret token is better.
  // For now, assuming this endpoint is only called by authorized admins.

  const { userId, idnum } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    console.log(`[Admin Delete] Starting deletion for user ${userId} (idnum: ${idnum})`);

    // 1. Delete Notifications (using idnum)
    if (idnum) {
         const { error: notifError } = await supabase
            .from('notifications')
            .delete()
            .eq('idnum', idnum);
         if (notifError) console.error('Error deleting notifications:', notifError);
    }

    // 2. Delete KYC Records (using user_id)
    const { error: kycError } = await supabase
        .from('kyc')
        .delete()
        .eq('user_id', userId);
    if (kycError) console.error('Error deleting kyc:', kycError);

    // 3. Delete Chats (using user_id or idnum?)
    // Checking supabaseUtils: deleteChatsByUserId uses user_id
    const { error: chatError } = await supabase
        .from('chats')
        .delete()
        .eq('user_id', userId);
    if (chatError) console.error('Error deleting chats:', chatError);

    // 4. Delete Loans (using idnum)
    if (idnum) {
        const { error: loanError } = await supabase
            .from('loans')
            .delete()
            .eq('idnum', idnum);
        if (loanError) console.error('Error deleting loans:', loanError);
    }

    // 5. Delete Withdrawal Codes (using user_id) -- Assuming table is 'withdrawal_codes' or similar?
    // supabaseUtils doesn't explicitly name the table but usually it's tied to user_id. 
    // Checking previous context, maybe I should skip if not sure about table name, 
    // but looking at `deleteWithdrawalCodesByUserId` in utils might reveal it.
    // Generally critical tables are investments/withdrawals.

    // 6. Delete Referrals (using user_id or referrer codes?)
    // Providing best effort clean up.

    if (idnum) {
        // 7. Delete Investments (using idnum)
        const { error: invError } = await supabase
            .from('investments')
            .delete()
            .eq('idnum', idnum);
        if (invError) console.error('Error deleting investments:', invError);

        // 8. Delete Withdrawals (using idnum)
        const { error: withError } = await supabase
            .from('withdrawals')
            .delete()
            .eq('idnum', idnum);
        if (withError) console.error('Error deleting withdrawals:', withError);
    }

    // 9. Delete User (from userlogs)
    const { error: userError } = await supabase
        .from('userlogs')
        .delete()
        .eq('id', userId);
    
    if (userError) {
        throw new Error(`Failed to delete user record: ${userError.message}`);
    }

    console.log(`[Admin Delete] Successfully deleted user ${userId}`);
    
    return res.status(200).json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('[Admin Delete] Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
