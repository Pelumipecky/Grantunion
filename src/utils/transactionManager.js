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

        // Prepare email content using standardized template
        const emailSubject = 'Investment Submitted - Grant Union Investment';
        
        // Structure data for the email template
        const templateData = {
          userName: userName,
          plan: investmentData.plan,
          amount: investmentData.capital,
          duration: investmentData.duration,
          transactionHash: investmentData.transactionHash || investmentData.transaction_hash,
          // ROI and Expected Return are not calculated yet for pending investments
          dailyROI: 0,
          expectedReturn: 0
        };

        // Send email notification
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: userEmail,
            subject: emailSubject,
            type: 'investment_created',
            templateData: templateData
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

