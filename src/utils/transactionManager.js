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
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #1C0F36 0%, #2d1b4e 100%); padding: 30px 20px; text-align: center;">
              <img src="https://grantunioninvestment.com/logos/grantunionsmall.png" alt="Grant Union Investment" style="max-width: 150px; height: auto; margin-bottom: 10px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Grant Union Investment</h1>
              <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">Your Trusted Investment Partner</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #1C0F36; margin-top: 0; font-size: 22px;">Investment Created Successfully</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${userName},</p>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">Your investment has been successfully created and is now pending approval.</p>

              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1C0F36;">
                <h3 style="color: #1C0F36; margin-top: 0; font-size: 18px;">Investment Details:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Plan:</strong> <span style="color: #495057;">${investmentData.plan}</span></li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Amount:</strong> <span style="color: #495057; font-weight: bold;">$${investmentData.capital}</span></li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Duration:</strong> <span style="color: #495057;">${investmentData.duration} days</span></li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Payment Method:</strong> <span style="color: #495057;">${investmentData.paymentOption}</span></li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending Approval</span></li>
                  <li style="padding: 8px 0;"><strong style="color: #1C0F36;">Date:</strong> <span style="color: #495057;">${new Date(investmentData.date).toLocaleDateString()}</span></li>
                </ul>
              </div>

              <p style="color: #555; font-size: 16px; line-height: 1.6;">You will receive another notification once your investment is approved and becomes active.</p>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">If you have any questions, please contact our support team.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://grantunioninvestment.com" style="background: linear-gradient(135deg, #1C0F36 0%, #2d1b4e 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Visit Dashboard</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">Best regards,<br><strong style="color: #1C0F36;">Grant Union Investment Team</strong></p>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 12px;">© 2025 Grant Union Investment. All rights reserved.</p>
            </div>
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

    // Create withdrawal
    const result = await supabaseDb.createWithdrawal(withdrawalData);

    if (result.error) {
      console.error('Failed to create withdrawal:', result.error);
      return result;
    }

    // Send email notification to user
    try {
      // Get user details for email
      const userResult = await supabaseDb.getUserByIdnum(withdrawalData.idnum);
      if (userResult.data && userResult.data.email) {
        const userEmail = userResult.data.email;
        const userName = userResult.data.name || 'Valued Investor';

        // Prepare email content
        const emailSubject = 'Withdrawal Request Submitted - Grant Union Investment';
        const emailMessage = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #1C0F36 0%, #2d1b4e 100%); padding: 30px 20px; text-align: center;">
              <img src="https://grantunioninvestment.com/logos/grantunionsmall.png" alt="Grant Union Investment" style="max-width: 150px; height: auto; margin-bottom: 10px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Grant Union Investment</h1>
              <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">Your Trusted Investment Partner</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #1C0F36; margin-top: 0; font-size: 22px;">Withdrawal Request Submitted</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${userName},</p>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">Your withdrawal request has been successfully submitted and is now pending approval.</p>

              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1C0F36;">
                <h3 style="color: #1C0F36; margin-top: 0; font-size: 18px;">Withdrawal Details:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Amount:</strong> <span style="color: #495057; font-weight: bold;">$${withdrawalData.amount}</span></li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Payment Method:</strong> <span style="color: #495057;">${withdrawalData.paymentoption}</span></li>
                  ${withdrawalData.wallet_address ? `<li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Wallet Address:</strong> <span style="color: #495057; font-family: monospace; font-size: 14px;">${withdrawalData.wallet_address}</span></li>` : ''}
                  <li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong style="color: #1C0F36;">Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending Approval</span></li>
                  <li style="padding: 8px 0;"><strong style="color: #1C0F36;">Date:</strong> <span style="color: #495057;">${new Date().toLocaleDateString()}</span></li>
                </ul>
              </div>

              <p style="color: #555; font-size: 16px; line-height: 1.6;">You will receive another notification once your withdrawal is approved and processed.</p>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">Please note that withdrawals are typically processed within 24-48 hours after approval.</p>
              <p style="color: #555; font-size: 16px; line-height: 1.6;">If you have any questions, please contact our support team.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://grantunioninvestment.com" style="background: linear-gradient(135deg, #1C0F36 0%, #2d1b4e 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Visit Dashboard</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">Best regards,<br><strong style="color: #1C0F36;">Grant Union Investment Team</strong></p>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 12px;">© 2025 Grant Union Investment. All rights reserved.</p>
            </div>
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
            type: 'withdrawal-created'
          })
        });

        if (emailResponse.ok) {
          console.log('Withdrawal creation email sent successfully to:', userEmail);
        } else {
          console.error('Failed to send withdrawal creation email');
        }
      }
    } catch (emailError) {
      console.error('Error sending withdrawal creation email:', emailError);
      // Don't fail the withdrawal creation if email fails
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

