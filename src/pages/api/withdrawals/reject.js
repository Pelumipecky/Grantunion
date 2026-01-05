/**
 * API endpoint to reject a withdrawal
 * This must run on the server to safely use the service role key
 */

import { supabase } from '../../../database/supabaseConfig';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { withdrawalId, withdrawal, reason } = req.body;

    if (!withdrawalId || !withdrawal) {
      return res.status(400).json({ error: 'Withdrawal ID and data required' });
    }

    // Update withdrawal status to Rejected
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({
        status: 'Rejected',
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', withdrawalId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to reject withdrawal' });
    }

    // Refund the amount to user balance
    const { data: userData, error: fetchError } = await supabase
      .from('userlogs')
      .select('balance')
      .eq('idnum', withdrawal.idnum)
      .single();

    if (!fetchError && userData) {
      const refundAmount = parseFloat(withdrawal.amount) || 0;
      const newBalance = parseFloat(userData.balance || 0) + refundAmount;

      const { error: refundError } = await supabase
        .from('userlogs')
        .update({ balance: newBalance })
        .eq('idnum', withdrawal.idnum);

      if (refundError) {
        console.error('❌ Error refunding balance:', refundError);
        // Don't fail the rejection if refund fails, as withdrawal is already marked as rejected
      }
    }

    // Create rejection notification for user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        idnum: withdrawal.idnum,
        title: 'Withdrawal Rejected',
        message: `Your $${withdrawal.amount} withdrawal request has been rejected. The amount has been refunded to your account. ${reason ? 'Reason: ' + reason : ''}`,
        status: 'unseen',
        type: 'withdrawal_rejected',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (notificationError) {
      console.error('❌ Error creating notification:', notificationError);
      // Don't fail the rejection if notification fails
    }

    // Send email notification
    try {
      const { data: emailUserData } = await supabase
        .from('userlogs')
        .select('email, name')
        .eq('idnum', withdrawal.idnum)
        .single();

      if (emailUserData?.email) {
        const emailSubject = 'Withdrawal Request - Unable to Process';
        const emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">❌ Withdrawal Request Rejected</h2>
            <p>Dear ${emailUserData.name || 'User'},</p>
            <p>Unfortunately, we were unable to process your withdrawal request at this time.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Withdrawal Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Amount:</strong> $${withdrawal.amount}</li>
                <li><strong>Payment Method:</strong> ${withdrawal.paymentoption || withdrawal.paymentOption || 'N/A'}</li>
                ${reason ? `<li><strong>Reason:</strong> ${reason}</li>` : ''}
              </ul>
            </div>
            <p><strong style="color: #28a745;">✓ Good News:</strong> The $${withdrawal.amount} has been refunded to your account balance and is available for future use.</p>
            <p>If you have any questions or concerns, please contact our support team.</p>
            <p>Best regards,<br>Grant Union Investment Team</p>
          </div>
        `;

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: emailUserData.email,
            subject: emailSubject,
            message: emailMessage,
            type: 'withdrawal_rejected'
          })
        });
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the rejection if email fails
    }

    console.log('✅ Withdrawal rejected successfully:', withdrawalId);
    return res.status(200).json({
      success: true,
      data: updatedWithdrawal,
      refund: {
        amount: withdrawal.amount,
        message: 'Amount refunded to user balance'
      },
      message: 'Withdrawal rejected successfully'
    });

  } catch (error) {
    console.error('❌ API Error in withdrawal rejection:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred'
    });
  }
}
