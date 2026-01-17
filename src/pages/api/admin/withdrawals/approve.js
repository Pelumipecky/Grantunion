/**
 * Backend API Endpoint: Approve Withdrawal
 * 
 * This endpoint handles withdrawal approval server-side with:
 * - Idempotency (prevents duplicate approvals)
 * - Atomic database operations
 * - Automatic email notifications
 * - Proper error handling
 */

import { supabase } from '../../../../database/supabaseConfig';
import { sendTransactionalEmail } from '../../../../lib/emailService';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { withdrawalId } = req.body;

    if (!withdrawalId) {
      return res.status(400).json({ error: 'Withdrawal ID is required' });
    }

    console.log('📝 Processing withdrawal approval:', withdrawalId);

    // Step 1: Fetch withdrawal record first (for idempotency check)
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      console.error('❌ Withdrawal not found:', fetchError);
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    // Step 2: Idempotency Check - If already approved, return success immediately
    if (withdrawal.status === 'Active' || withdrawal.status === 'Approved' || withdrawal.status === 'Completed') {
      console.log('⚠️ Withdrawal already processed, returning cached result');
      return res.status(200).json({
        success: true,
        record: withdrawal,
        message: 'Withdrawal already approved',
        alreadyProcessed: true
      });
    }

    // Step 3: Get user data for email notification
    const { data: userData, error: userError } = await supabase
      .from('userlogs')
      .select('email, name')
      .eq('idnum', withdrawal.idnum)
      .single();

    if (userError) {
      console.error('⚠️ User not found (continuing anyway):', userError);
    }

    const processedAt = new Date().toISOString();

    // Step 4: Atomic Database Update - Update withdrawal status
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({
        status: 'Active',
        processed_at: processedAt,
        authstatus: 'approved',
        updated_at: processedAt
      })
      .eq('id', withdrawalId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Failed to update withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to approve withdrawal' });
    }

    console.log('✅ Withdrawal status updated to Active');

    // Step 5: Create in-app notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        idnum: withdrawal.idnum,
        title: 'Withdrawal Confirmed',
        message: `Your $${withdrawal.amount} withdrawal has been confirmed and is being processed. Funds will be sent to your ${withdrawal.paymentoption || 'specified'} address.`,
        status: 'unseen',
        type: 'withdrawal_confirmed',
        created_at: processedAt,
        updated_at: processedAt
      }]);

    if (notificationError) {
      console.error('⚠️ Failed to create notification (non-blocking):', notificationError);
    }

    // Step 6: Send email notification via EmailService (direct Mailjet)
    let emailSendResult = null;
    let emailSendError = null;
    try {
      console.log('[WITHDRAWAL APPROVAL] Attempting to send approval email via EmailService...');
      console.log('[WITHDRAWAL APPROVAL] Withdrawal ID:', withdrawal.id);
      console.log('[WITHDRAWAL APPROVAL] User email:', userData.email);

      if (!userData.email) {
        console.warn('[WITHDRAWAL APPROVAL] ⚠️ No email address found for user');
      } else {
        const subject = 'Withdrawal Confirmed - Grant Union Investment';

        // Build HTML content similar to the template
        const userName = userData.name || 'Valued Investor';
        const statusText = 'APPROVED';
        const statusColor = '#2DC194';
        const withdrawalAmount = parseFloat(withdrawal.amount).toFixed(2);
        const paymentMethod = withdrawal.paymentoption || withdrawal.paymentOption || 'Cryptocurrency';

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Alegreya Sans', Arial, sans-serif; background-color: #f5f5f5; color: #333333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; }
    .header { background: #FF8C37; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 10px 0 0 0; font-weight: 600; }
    .content { padding: 30px 25px; }
    .content p { margin: 15px 0; line-height: 1.6; font-size: 15px; }
    .stats-box { background: #ffffff; border: 1px solid #e0e0e0; border-left: 4px solid #1C0F36; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stats-box table { width: 100%; border-collapse: collapse; }
    .stats-box td { padding: 15px; border-bottom: 1px solid #e0e0e0; }
    .stats-box td:first-child { color: #666666; width: 40%; }
    .stats-box td:last-child { text-align: right; font-weight: 600; width: 60%; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; border: 2px solid #1C0F36; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF8C37; font-size: 12px; color: #666666; }
    .info-box { background: rgba(45, 193, 148, 0.1); border-left: 4px solid #2DC194; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; color: #333333; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Withdrawal Confirmed</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Your withdrawal request has been <strong style="color: ${statusColor};">${statusText}</strong>.</p>

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #1C0F36; margin-bottom: 15px;">Withdrawal Details</h3>
        <table>
          <tr>
            <td>Withdrawal Amount</td>
            <td>$${withdrawalAmount}</td>
          </tr>
          <tr>
            <td>Payment Method</td>
            <td>${paymentMethod}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td style="color: ${statusColor};">${statusText}</td>
          </tr>
        </table>
      </div>

      <div class="info-box">
        <strong>What Happens Next:</strong><br>
        1. Your withdrawal will be processed within 24-48 hours<br>
        2. Funds will be sent to your specified address<br>
        3. You'll receive a confirmation once funds are sent<br>
        4. Track your withdrawal status in your dashboard
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Dashboard</a>
      </p>

      <p>Thank you for your patience.</p>
      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Grant Union Investment. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

        const textBody = `Dear ${userName},\n\nYour withdrawal request has been ${statusText}.\n\nWithdrawal Amount: $${withdrawalAmount}\nPayment Method: ${paymentMethod}\nStatus: ${statusText}\n\nWhat Happens Next:\n1. Your withdrawal will be processed within 24-48 hours\n2. Funds will be sent to your specified address\n3. You'll receive a confirmation once funds are sent\n4. Track your withdrawal status in your dashboard\n\nBest regards,\nThe Grant Union Investment Team`;

        emailSendResult = await sendTransactionalEmail({
          to: userData.email,
          subject,
          textBody,
          htmlBody
        });

        console.log('[WITHDRAWAL APPROVAL] ✅ EmailService send result:', emailSendResult);
      }
    } catch (emailErr) {
      emailSendError = emailErr;
      console.error('[WITHDRAWAL APPROVAL] ⚠️ EmailService error:', emailErr);
    }

    // Step 7: Return success response with full payment details
    console.log('🎉 Withdrawal approval complete');
    return res.status(200).json({
      success: true,
      record: {
        ...updatedWithdrawal,
        // Include payment details for admin view
        paymentDetails: {
          method: withdrawal.paymentoption || withdrawal.paymentOption,
          bankName: withdrawal.bank_name || withdrawal.bankName,
          accountNumber: withdrawal.account_number || withdrawal.accountNumber,
          accountName: withdrawal.account_name || withdrawal.accountName,
          walletAddress: withdrawal.wallet_address || withdrawal.walletAddress,
          routingNumber: withdrawal.routing_number || withdrawal.routingNumber
        }
      },
      message: 'Withdrawal approved successfully'
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
