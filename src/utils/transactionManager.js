/**
 * Transaction Management Utility
 * Handles creation of investments and withdrawals
 */

import { supabaseDb } from '../database/supabaseUtils';

/**
 * Create an investment
 * Calls the server-side API endpoint which handles:
 * - Database creation
 * - Sending confirmation email
 * @param {object} investmentData - Investment data
 * @returns {Promise} Investment creation result
 */
export const createInvestment = async (investmentData) => {
  try {
    console.log('📊 Calling investment creation API...');
    
    const response = await fetch('/api/investments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ investmentData })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Investment creation failed:', result);
      return { 
        data: null, 
        error: { message: result.error || 'Failed to create investment' }
      };
    }

    console.log('✅ Investment created successfully:', result.data);
    return { data: result.data, error: null };

  } catch (error) {
    console.error('❌ Error in createInvestment:', error);
    return { 
      data: null, 
      error: { message: error.message }
    };
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

