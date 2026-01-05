/**
 * API endpoint to approve a withdrawal
 * This must run on the server to safely use the service role key
 */

import { supabase } from '../../../database/supabaseConfig';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { withdrawalId, withdrawal } = req.body;

    if (!withdrawalId || !withdrawal) {
      return res.status(400).json({ error: 'Withdrawal ID and data required' });
    }

    // Update withdrawal status to Active
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({
        status: 'Active',
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', withdrawalId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to approve withdrawal' });
    }

    // Create notification for user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        idnum: withdrawal.idnum,
        title: 'Withdrawal Confirmed',
        message: `Your $${withdrawal.amount} withdrawal transaction has been confirmed. $${withdrawal.amount} is on its way to your wallet address now`,
        status: 'unseen',
        type: 'withdrawal_confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (notificationError) {
      console.error('❌ Error creating notification:', notificationError);
      // Don't fail the approval if notification fails
    }

    // Send email notification
    try {
      const { data: userData } = await supabase
        .from('userlogs')
        .select('email, name')
        .eq('idnum', withdrawal.idnum)
        .single();

      if (userData?.email) {
        const emailSubject = 'Withdrawal Confirmed - Grant Union Investment';
        const emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">💰 Withdrawal Confirmed!</h2>
            <p>Dear ${userData.name || 'User'},</p>
            <p>Great news! Your withdrawal request has been processed and confirmed.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Withdrawal Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Amount:</strong> $${withdrawal.amount}</li>
                <li><strong>Fee:</strong> $${withdrawal.withdrawal_fee || '0.00'}</li>
                <li><strong>Payment Method:</strong> ${withdrawal.paymentoption || withdrawal.paymentOption || 'N/A'}</li>
              </ul>
            </div>
            <p>Your funds are now being processed and will be sent to your wallet shortly.</p>
            <p>Best regards,<br>Grant Union Investment Team</p>
          </div>
        `;

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: userData.email,
            subject: emailSubject,
            message: emailMessage,
            type: 'withdrawal_confirmation'
          })
        });
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the approval if email fails
    }

    console.log('✅ Withdrawal approved successfully:', withdrawalId);
    return res.status(200).json({
      success: true,
      data: updatedWithdrawal,
      message: 'Withdrawal approved successfully'
    });

  } catch (error) {
    console.error('❌ API Error in withdrawal approval:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred'
    });
  }
}
