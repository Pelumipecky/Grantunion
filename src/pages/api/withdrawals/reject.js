/**
 * API endpoint to reject a withdrawal
 * This must run on the server to safely use the service role key
 */

import { supabase } from '../../../database/supabaseConfig';
import { sendTransactionalEmail } from '../../../lib/emailService';

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
        console.log('📧 Sending withdrawal rejection email to:', emailUserData.email);
        
        const userName = emailUserData.name || 'Valued Investor';
        const withdrawalAmount = parseFloat(withdrawal.amount).toFixed(2);
        const paymentMethod = withdrawal.paymentoption || withdrawal.paymentOption || 'Cryptocurrency';

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Alegreya Sans', Arial, sans-serif; background-color: #f5f5f5; color: #333333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; }
    .header { background: #FF4444; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 10px 0 0 0; font-weight: 600; }
    .content { padding: 30px 25px; }
    .content p { margin: 15px 0; line-height: 1.6; font-size: 15px; }
    .stats-box { background: #ffffff; border: 1px solid #e0e0e0; border-left: 4px solid #1C0F36; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stats-box table { width: 100%; border-collapse: collapse; }
    .stats-box td { padding: 15px; border-bottom: 1px solid #e0e0e0; }
    .stats-box td:first-child { color: #666666; width: 40%; }
    .stats-box td:last-child { text-align: right; font-weight: 600; width: 60%; }
    .warning-box { background: rgba(255, 68, 68, 0.1); border-left: 4px solid #FF4444; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; color: #333333; }
    .info-box { background: rgba(45, 193, 148, 0.1); border-left: 4px solid #2DC194; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; color: #333333; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF4444; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Withdrawal Unable to Process</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>We regret to inform you that your withdrawal request could not be processed at this time.</p>

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #1C0F36; margin-bottom: 15px;">Withdrawal Details</h3>
        <table>
          <tr>
            <td>Amount</td>
            <td>$${withdrawalAmount}</td>
          </tr>
          <tr>
            <td>Payment Method</td>
            <td>${paymentMethod}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td style="color: #FF4444;">REJECTED</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
      </div>

      <div class="warning-box">
        <strong>What Happened:</strong><br>
        Your withdrawal request has been rejected. The amount of $${withdrawalAmount} has been refunded to your account balance and is available for use immediately.
      </div>

      <div class="info-box">
        <strong>What Happens Next:</strong><br>
        1. Your refund of $${withdrawalAmount} is now in your account<br>
        2. You can check your balance in your dashboard<br>
        3. Feel free to submit a new withdrawal request<br>
        4. If you need assistance, contact our support team
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Dashboard</a>
      </p>

      <p>If you have questions about this decision or believe this is in error, please contact our support team.</p>
      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
      <p><a href="https://grantunion.vercel.app/contact" style="color: #FF4444; text-decoration: none;">Contact Support</a></p>
      <p style="color: #999999; margin-bottom: 0;">© 2026 Grant Union Investment. All rights reserved.</p>
      <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

        const textBody = `Dear ${userName},

We regret to inform you that your withdrawal request could not be processed at this time.

Withdrawal Details:
Amount: $${withdrawalAmount}
Payment Method: ${paymentMethod}
Status: REJECTED
Date: ${new Date().toLocaleDateString()}

What Happened:
Your withdrawal request has been rejected. The amount of $${withdrawalAmount} has been refunded to your account balance and is available for use immediately.

What Happens Next:
1. Your refund of $${withdrawalAmount} is now in your account
2. You can check your balance in your dashboard
3. Feel free to submit a new withdrawal request
4. If you need assistance, contact our support team

If you have questions about this decision, please contact our support team.

Best regards,
The Grant Union Investment Team`;

        await sendTransactionalEmail({
          to: emailUserData.email,
          subject: 'Withdrawal Request - Unable to Process',
          htmlBody,
          textBody
        });

        console.log('✅ Withdrawal rejection email sent to:', emailUserData.email);
      }
    } catch (emailError) {
      console.error('⚠️ Error sending withdrawal rejection email:', emailError);
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
