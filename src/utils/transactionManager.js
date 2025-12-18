/**
 * Transaction Management Utility
 * Handles creation of investments and withdrawals
 */

import { supabaseDb } from '../database/supabaseUtils';

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

        // Prepare email content
        const emailSubject = 'Investment Created - Grant Union Investment';
        const emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1C0F36;">Investment Created Successfully</h2>
            <p>Dear ${userName},</p>
            <p>Your investment has been successfully created and is now pending approval.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Investment Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Plan:</strong> ${investmentData.plan}</li>
                <li><strong>Amount:</strong> $${investmentData.capital}</li>
                <li><strong>Duration:</strong> ${investmentData.duration} days</li>
                <li><strong>Payment Method:</strong> ${investmentData.paymentOption}</li>
                <li><strong>Status:</strong> Pending Approval</li>
                <li><strong>Date:</strong> ${new Date(investmentData.date).toLocaleDateString()}</li>
              </ul>
            </div>
            <p>You will receive another notification once your investment is approved and becomes active.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>Grant Union Investment Team</p>
          </div>
        `;

        // Send email notification
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: userEmail,
            subject: emailSubject,
            message: emailMessage,
            type: 'investment-created'
          })
        });

        if (emailResponse.ok) {
          console.log('Investment creation email sent successfully to:', userEmail);
        } else {
          console.error('Failed to send investment creation email');
        }
      }
    } catch (emailError) {
      console.error('Error sending investment creation email:', emailError);
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
    // Create withdrawal
    const result = await supabaseDb.createWithdrawal(withdrawalData);

    if (result.error) {
      console.error('Failed to create withdrawal:', result.error);
    }

    return result;
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

