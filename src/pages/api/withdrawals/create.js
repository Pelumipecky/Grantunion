/**
 * API endpoint to create a withdrawal
 * This must run on the server to safely use the service role key
 */

import { supabase } from '../../../database/supabaseConfig';

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
