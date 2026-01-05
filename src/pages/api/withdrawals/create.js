/**
 * API endpoint to create a withdrawal
 * This must run on the server to safely use the service role key
 */

import { supabaseDb } from '../../../database/supabaseUtils';

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

    // Validate required fields
    const idnum = Number(withdrawalData.idnum);
    if (!idnum || isNaN(idnum) || idnum <= 0) {
      return res.status(400).json({ 
        error: `Invalid user account ID: ${withdrawalData.idnum}. Please ensure you are logged in correctly.`
      });
    }

    const amount = Number(withdrawalData.amount);
    if (!amount || isNaN(amount) || amount < 200) {
      return res.status(400).json({ 
        error: `Invalid withdrawal amount: $${amount}. Minimum withdrawal is $200.`
      });
    }

    const paymentOption = withdrawalData.paymentoption ?? withdrawalData.paymentOption;
    if (!paymentOption) {
      return res.status(400).json({ 
        error: 'Payment method (Bitcoin, Ethereum, or Bank Transfer) is required'
      });
    }

    if (paymentOption !== 'Bank Transfer' && paymentOption !== 'Bitcoin' && paymentOption !== 'Ethereum') {
      return res.status(400).json({ 
        error: `Invalid payment method: ${paymentOption}`
      });
    }

    // Validate wallet address for crypto payments
    if (paymentOption !== 'Bank Transfer') {
      const walletAddress = withdrawalData.wallet_address ?? withdrawalData.walletAddress;
      if (!walletAddress || !walletAddress.trim()) {
        return res.status(400).json({ 
          error: `Wallet address is required for ${paymentOption} payments`
        });
      }
    }

    // Call the database function to create the withdrawal
    const result = await supabaseDb.createWithdrawal(withdrawalData);

    if (result.error) {
      console.error('❌ Withdrawal creation error:', result.error);
      return res.status(500).json({ 
        error: result.error.message || 'Failed to create withdrawal. Please try again later.'
      });
    }

    console.log('✅ Withdrawal created successfully:', result.data);
    
    return res.status(200).json({ 
      data: result.data,
      success: true
    });

  } catch (error) {
    console.error('❌ API Error in withdrawal creation:', error);
    return res.status(500).json({ 
      error: error.message || 'An unexpected error occurred while creating the withdrawal.'
    });
  }
}
