/**
 * API endpoint to create a withdrawal
 * This must run on the server to safely use the service role key
 */

import { supabase } from '../../../database/supabaseConfig';
import { sendTransactionalEmail } from '../../../lib/emailService';

// Normalize withdrawal payload (same logic as in supabaseUtils)
const normalizeWithdrawalPayload = (withdrawalData = {}) => {
  console.log('🔧 Normalizing withdrawal payload:', withdrawalData);
  
  // Handle empty or null data
  if (!withdrawalData || typeof withdrawalData !== 'object') {
    throw new Error('Withdrawal data must be a valid object');
  }

  const idnum = Number(withdrawalData.idnum);
  console.log('🔧 Parsed idnum:', idnum, 'isNaN:', isNaN(idnum), 'idnum <= 0:', idnum <= 0);
  
  if (isNaN(idnum) || idnum <= 0) {
    throw new Error(`Invalid user account ID: ${withdrawalData.idnum}. Please ensure you are logged in correctly.`);
  }

  const amount = Number(withdrawalData.amount);
  if (isNaN(amount) || amount < 200) {
    throw new Error(`Invalid withdrawal amount: $${amount}. Minimum withdrawal is $200.`);
  }
  
  const paymentOption = withdrawalData.paymentoption ?? withdrawalData.paymentOption;
  if (!paymentOption) {
    throw new Error('Payment method (Bitcoin, Ethereum, USDT, or Bank Transfer) is required');
  }

  if (paymentOption !== 'Bank Transfer' && paymentOption !== 'Bitcoin' && paymentOption !== 'Ethereum' && paymentOption !== 'USDT') {
    throw new Error(`Invalid payment method: ${paymentOption}`);
  }

  // Validate wallet address for crypto payments
  if (paymentOption !== 'Bank Transfer') {
    const walletAddress = withdrawalData.wallet_address ?? withdrawalData.walletAddress;
    if (!walletAddress || !walletAddress.trim()) {
      throw new Error(`Wallet address is required for ${paymentOption} payments`);
    }
  }
  
  const normalized = {
    idnum,
    amount,
    status: withdrawalData.status || 'pending',
    paymentoption: paymentOption,
    wallet_address: withdrawalData.wallet_address ?? withdrawalData.walletAddress ?? null,
    bank_name: withdrawalData.bank_name ?? withdrawalData.bankName ?? null,
    account_number: withdrawalData.account_number ?? withdrawalData.accountNumber ?? withdrawalData.bankAccountNumber ?? null,
    account_name: withdrawalData.account_name ?? withdrawalData.accountName ?? withdrawalData.bankAccountName ?? null,
    routing_number: withdrawalData.routing_number ?? withdrawalData.routingNumber ?? withdrawalData.bankRoutingSwift ?? null,
  };
  console.log('🔧 Normalized withdrawal data:', normalized);
  return normalized;
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { withdrawalData } = req.body;

    // Validate withdrawal data is provided
    if (!withdrawalData) {
      return res.status(400).json({ 
        error: 'Withdrawal data is required'
      });
    }

    // Normalize and validate withdrawal data
    const cleanData = normalizeWithdrawalPayload(withdrawalData);

    // Create withdrawal record in database
    console.log('💰 Creating withdrawal with clean data:', cleanData);
    const { data, error } = await supabase
      .from('withdrawals')
      .insert([{
        ...cleanData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error creating withdrawal:', error);
      return res.status(500).json({ 
        error: error.message || 'Failed to create withdrawal. Please try again later.'
      });
    }

    console.log('✅ Withdrawal created successfully:', data);

    // Create notification for user about withdrawal request
    try {
      const notificationMessage = `📤 Your withdrawal request of $${cleanData.amount} has been submitted and is pending review. You will be notified once it's processed.`;
      
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          idnum: cleanData.idnum,
          title: 'Withdrawal Request Submitted',
          message: notificationMessage,
          status: 'unseen',
          type: 'withdrawal_submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

        if (notificationError) {
          console.error('Failed to create withdrawal notification:', notificationError);
        }
    } catch (notificationError) {
      console.error('Error creating withdrawal notification:', notificationError);
      // Don't fail the withdrawal if notification fails
    }

    // Send pending/submitted withdrawal email to user
    try {
      const { data: userData, error: userError } = await supabase
        .from('userlogs')
        .select('email, name')
        .eq('idnum', cleanData.idnum)
        .single();

      if (userError) {
        console.error('⚠️ Could not fetch user data for email:', userError);
      } else if (userData?.email) {
        console.log('📧 Sending withdrawal pending email to:', userData.email);
        
        const userName = userData.name || 'Valued Investor';
        const withdrawalAmount = parseFloat(cleanData.amount).toFixed(2);
        const paymentMethod = cleanData.paymentoption || 'Cryptocurrency';

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
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
    .warning-box { background: rgba(255, 152, 55, 0.1); border-left: 4px solid #FF9837; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; color: #333333; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF8C37; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Withdrawal Request Received</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Thank you for submitting your withdrawal request. We have received it and it is currently <strong style="color: #FF9837;">PENDING REVIEW</strong>.</p>

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
            <td style="color: #FF9837;">PENDING</td>
          </tr>
          <tr>
            <td>Requested On</td>
            <td>${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
      </div>

      <div class="warning-box">
        <strong>Processing Timeline:</strong><br>
        • Review: Within 24 hours<br>
        • Approval: 1-2 business days<br>
        • Transfer: 3-5 business days<br>
        • You'll be notified at each stage
      </div>

      <p>We will review your withdrawal request and notify you of the outcome shortly. You can track the status of your withdrawal in your dashboard.</p>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Dashboard</a>
      </p>

      <p>Thank you for your patience.</p>
      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
      <p><a href="https://grantunion.vercel.app/contact" style="color: #FF8C37; text-decoration: none;">Contact Support</a></p>
      <p style="color: #999999; margin-bottom: 0;">© 2026 Grant Union Investment. All rights reserved.</p>
      <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

        const textBody = `Dear ${userName},

Thank you for submitting your withdrawal request. We have received it and it is currently pending review.

Withdrawal Details:
Amount: $${withdrawalAmount}
Payment Method: ${paymentMethod}
Status: PENDING
Requested: ${new Date().toLocaleDateString()}

Processing Timeline:
- Review: Within 24 hours
- Approval: 1-2 business days
- Transfer: 3-5 business days
- You'll be notified at each stage

We will review your withdrawal request and notify you of the outcome shortly.

Best regards,
The Grant Union Investment Team`;

        await sendTransactionalEmail({
          to: userData.email,
          subject: 'Withdrawal Request Received - Pending Review',
          htmlBody,
          textBody
        });
        
        console.log('✅ Withdrawal pending email sent successfully to:', userData.email);
      } else {
        console.warn('⚠️ No email found for user - skipping email notification');
      }
    } catch (emailError) {
      console.error('⚠️ Error sending withdrawal pending email (non-blocking):', emailError);
      // Don't fail the withdrawal if email fails
    }
    
    return res.status(200).json({ 
      data: data,
      success: true
    });

  } catch (error) {
    console.error('❌ API Error in withdrawal creation:', error);
    return res.status(500).json({ 
      error: error.message || 'An unexpected error occurred while creating the withdrawal.'
    });
  }
}
