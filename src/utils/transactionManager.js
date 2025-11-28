/**
 * Transaction Management Utility
 * Handles creation of investments and withdrawals with session tracking
 */

import { supabaseDb } from '../database/supabaseUtils';
import { getCurrentSessionId, extendSession } from './sessionManager';

/**
 * Create an investment with session tracking
 * @param {object} investmentData - Investment data
 * @returns {Promise} Investment creation result
 */
export const createInvestmentWithSession = async (investmentData) => {
  try {
    // Get current session ID
    const sessionId = getCurrentSessionId();

    // Extend session on transaction
    extendSession();

    // Add session ID to investment data
    const investmentWithSession = {
      ...investmentData,
      sessionId
    };

    // Create investment
    const result = await supabaseDb.createInvestment(investmentWithSession);

    if (result.error) {
      console.error('Failed to create investment:', result.error);
    }

    return result;
  } catch (error) {
    console.error('Error in createInvestmentWithSession:', error);
    return { data: null, error };
  }
};

/**
 * Create a withdrawal with session tracking
 * @param {object} withdrawalData - Withdrawal data
 * @returns {Promise} Withdrawal creation result
 */
export const createWithdrawalWithSession = async (withdrawalData) => {
  try {
    // Get current session ID
    const sessionId = getCurrentSessionId();

    // Extend session on transaction
    extendSession();

    // Add session ID to withdrawal data
    const withdrawalWithSession = {
      ...withdrawalData,
      sessionId
    };

    // Create withdrawal
    const result = await supabaseDb.createWithdrawal(withdrawalWithSession);

    if (result.error) {
      console.error('Failed to create withdrawal:', result.error);
    }

    return result;
  } catch (error) {
    console.error('Error in createWithdrawalWithSession:', error);
    return { data: null, error };
  }
};

/**
 * Get all transactions (investments and withdrawals) for a user with session info
 * @param {string} idnum - User ID number
 * @returns {Promise} Combined transaction data
 */
export const getUserTransactionsWithSessions = async (idnum) => {
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
          sessionId: investment.session_id,
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
          sessionId: withdrawal.session_id,
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
    console.error('Error in getUserTransactionsWithSessions:', error);
    return { data: null, error };
  }
};

/**
 * Get session statistics for a user
 * @param {string} idnum - User ID number
 * @returns {Promise} Session statistics
 */
export const getUserSessionStats = async (idnum) => {
  try {
    const transactionsResult = await getUserTransactionsWithSessions(idnum);

    if (transactionsResult.error) {
      return { data: null, error: transactionsResult.error };
    }

    const transactions = transactionsResult.data;
    const sessionStats = {};

    // Group transactions by session
    transactions.forEach(transaction => {
      const sessionId = transaction.sessionId || 'unknown';
      if (!sessionStats[sessionId]) {
        sessionStats[sessionId] = {
          sessionId,
          transactionCount: 0,
          totalInvested: 0,
          totalWithdrawn: 0,
          firstTransaction: transaction.createdAt,
          lastTransaction: transaction.createdAt
        };
      }

      sessionStats[sessionId].transactionCount++;

      if (transaction.type === 'investment') {
        sessionStats[sessionId].totalInvested += transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        sessionStats[sessionId].totalWithdrawn += transaction.amount;
      }

      // Update date range
      if (new Date(transaction.createdAt) < new Date(sessionStats[sessionId].firstTransaction)) {
        sessionStats[sessionId].firstTransaction = transaction.createdAt;
      }
      if (new Date(transaction.createdAt) > new Date(sessionStats[sessionId].lastTransaction)) {
        sessionStats[sessionId].lastTransaction = transaction.createdAt;
      }
    });

    return {
      data: Object.values(sessionStats),
      error: null
    };
  } catch (error) {
    console.error('Error in getUserSessionStats:', error);
    return { data: null, error };
  }
};