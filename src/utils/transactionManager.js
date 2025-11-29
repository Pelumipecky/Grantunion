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

