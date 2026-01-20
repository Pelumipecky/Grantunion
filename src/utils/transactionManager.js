/**
 * Transaction Management Utility
 * Handles creation of investments and withdrawals
 */

import { supabaseDb } from '../database/supabaseUtils';
import { sendTransactionalEmail } from '../lib/emailService';

/**
 * Create an investment
 * @param {object} investmentData - Investment data
 * @returns {Promise} Investment creation result
 */
export const createInvestment = async (investmentData) => {
  try {
    // Create investment
    const result = await supabaseDb.createInvestment(investmentData);

    if (result.error) {
      console.error('Failed to create investment:', result.error);
      return result;
    }

    // Send email notification to user
    try {
      // Get user details for email
      const userResult = await supabaseDb.getUserByIdnum(investmentData.idnum);
      if (userResult.data && userResult.data.email) {
        const userEmail = userResult.data.email;
        const userName = userResult.data.name || 'Valued Investor';
        const plan = investmentData.plan || 'Investment Plan';
        const capitalAmount = parseFloat(investmentData.capital).toFixed(2);
        const duration = investmentData.duration || 'N/A';

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
    .info-box { background: rgba(255, 152, 55, 0.1); border-left: 4px solid #FF9837; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF8C37; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Investment Submitted Successfully</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Your investment has been successfully submitted and is now pending approval.</p>

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #1C0F36; margin-bottom: 15px;">Investment Details</h3>
        <table>
          <tr>
            <td>Investment Plan</td>
            <td style="color: #FF8C37;">${plan}</td>
          </tr>
          <tr>
            <td>Amount</td>
            <td>$${capitalAmount}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>${typeof duration === 'number' ? duration + ' days' : duration}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td style="color: #FF9837;">PENDING APPROVAL</td>
          </tr>
        </table>
      </div>

      <div class="info-box">
        <strong>What Happens Next:</strong><br>
        1. Our team will review your investment request<br>
        2. You'll receive email notification once approved<br>
        3. Your ROI will begin accruing after approval<br>
        4. Check your dashboard for status updates
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Dashboard</a>
      </p>

      <p>Thank you for choosing Grant Union Investment! We're excited to help you grow your wealth.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
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

        const textBody = `Investment Submitted Successfully

Dear ${userName},

Your investment has been successfully submitted and is now pending approval.

Investment Details:
Plan: ${plan}
Amount: $${capitalAmount}
Duration: ${typeof duration === 'number' ? duration + ' days' : duration}
Status: PENDING APPROVAL

What Happens Next:
1. Our team will review your investment request
2. You'll receive email notification once approved
3. Your ROI will begin accruing after approval
4. Check your dashboard for status updates

Thank you for choosing Grant Union Investment!

Best regards,
The Grant Union Investment Team`;

        await sendTransactionalEmail({
          to: userEmail,
          subject: 'Investment Submitted - Grant Union Investment',
          htmlBody,
          textBody
        });

        console.log('✅ Investment submission email sent successfully to:', userEmail);
      }
    } catch (emailError) {
      console.error('⚠️ Error sending investment submission email:', emailError);
      // Don't fail the investment creation if email fails
    }

    return result;
  } catch (error) {
    console.error('Error in createInvestment:', error);
    return { data: null, error };
  }
};

/**
 * Create a withdrawal
 * @param {object} withdrawalData - Withdrawal data
 * @returns {Promise} Withdrawal creation result
 */
export const createWithdrawal = async (withdrawalData) => {
  try {
    // Validate withdrawal data before processing
    if (!withdrawalData) {
      const error = new Error('Withdrawal data is required');
      console.error('❌ Withdrawal data validation failed:', error);
      return { data: null, error };
    }

    const idnum = Number(withdrawalData.idnum);
    if (isNaN(idnum) || idnum <= 0) {
      const error = new Error(`Invalid user account ID: ${withdrawalData.idnum}`);
      console.error('❌ Invalid idnum:', error);
      return { data: null, error };
    }

    const amount = Number(withdrawalData.amount);
    if (!amount || isNaN(amount) || amount < 200) {
      const error = new Error(`Invalid withdrawal amount: ${withdrawalData.amount}. Minimum is $200.`);
      console.error('❌ Invalid amount:', error);
      return { data: null, error };
    }

    // Call the API endpoint to create withdrawal (runs on server with service role key)
    const apiResponse = await fetch('/api/withdrawals/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ withdrawalData })
    });

    const result = await apiResponse.json();

    if (!apiResponse.ok) {
      const error = new Error(result.error || 'Failed to create withdrawal');
      console.error('❌ Withdrawal creation error:', error);
      return { data: null, error };
    }

    if (result.error) {
      console.error('Failed to create withdrawal:', result.error);
      return { data: null, error: new Error(result.error) };
    }

    // Email notification is handled by the API endpoint
    console.log('✅ Withdrawal created successfully');
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error in createWithdrawal:', error);
    return { data: null, error };
  }
};

/**
 * Get all transactions (investments and withdrawals) for a user
 * @param {string} idnum - User ID number
 * @returns {Promise} Combined transaction data
 */
export const getUserTransactions = async (idnum) => {
  try {
    const [investmentsResult, withdrawalsResult] = await Promise.all([
      supabaseDb.getInvestmentsByIdnum(idnum),
      supabaseDb.getWithdrawalsByIdnum(idnum)
    ]);

    const transactions = [];

    // Process investments
    if (investmentsResult.data) {
      investmentsResult.data.forEach(investment => {
        transactions.push({
          id: investment.id,
          type: 'investment',
          amount: investment.capital,
          status: investment.status,
          createdAt: investment.created_at,
          plan: investment.plan,
          paymentOption: investment.paymentOption,
          roi: investment.roi,
          bonus: investment.bonus,
          duration: investment.duration
        });
      });
    }

    // Process withdrawals
    if (withdrawalsResult.data) {
      withdrawalsResult.data.forEach(withdrawal => {
        transactions.push({
          id: withdrawal.id,
          type: 'withdrawal',
          amount: withdrawal.amount,
          status: withdrawal.status,
          createdAt: withdrawal.created_at,
          walletAddress: withdrawal.wallet_address,
          paymentOption: withdrawal.payment_option
        });
      });
    }

    // Sort by creation date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      data: transactions,
      error: investmentsResult.error || withdrawalsResult.error
    };
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return { data: null, error };
  }
};

