/**
 * Backend API Endpoint: Approve Withdrawal
 * 
 * This endpoint handles withdrawal approval server-side with:
 * - Idempotency (prevents duplicate approvals)
 * - Atomic database operations
 * - Automatic email notifications
 * - Proper error handling
 */

import { supabase } from '../../../../database/supabaseConfig';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { withdrawalId } = req.body;

    if (!withdrawalId) {
      return res.status(400).json({ error: 'Withdrawal ID is required' });
    }

    console.log('📝 Processing withdrawal approval:', withdrawalId);

    // Step 1: Fetch withdrawal record first (for idempotency check)
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      console.error('❌ Withdrawal not found:', fetchError);
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    // Step 2: Idempotency Check - If already approved, return success immediately
    if (withdrawal.status === 'Active' || withdrawal.status === 'Approved' || withdrawal.status === 'Completed') {
      console.log('⚠️ Withdrawal already processed, returning cached result');
      return res.status(200).json({
        success: true,
        record: withdrawal,
        message: 'Withdrawal already approved',
        alreadyProcessed: true
      });
    }

    // Step 3: Get user data for email notification
    const { data: userData, error: userError } = await supabase
      .from('userlogs')
      .select('email, name')
      .eq('idnum', withdrawal.idnum)
      .single();

    if (userError) {
      console.error('⚠️ User not found (continuing anyway):', userError);
    }

    const processedAt = new Date().toISOString();

    // Step 4: Atomic Database Update - Update withdrawal status
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({
        status: 'Active',
        processed_at: processedAt,
        authstatus: 'approved',
        updated_at: processedAt
      })
      .eq('id', withdrawalId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Failed to update withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to approve withdrawal' });
    }

    console.log('✅ Withdrawal status updated to Active');

    // Step 5: Create in-app notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        idnum: withdrawal.idnum,
        title: 'Withdrawal Confirmed',
        message: `Your $${withdrawal.amount} withdrawal has been confirmed and is being processed. Funds will be sent to your ${withdrawal.paymentoption || 'specified'} address.`,
        status: 'unseen',
        type: 'withdrawal_confirmed',
        created_at: processedAt,
        updated_at: processedAt
      }]);

    if (notificationError) {
      console.error('⚠️ Failed to create notification (non-blocking):', notificationError);
    }

    // Step 6: Send email notification (non-blocking)
    try {
      if (userData?.email) {
        console.log('📧 Sending approval email to:', userData.email);
        
        // Use absolute URL for production, fallback to relative path
        const apiUrl = process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}/api/send-email`
          : process.env.NEXT_PUBLIC_APP_URL 
          ? `${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`
          : '/api/send-email';
        
        console.log('📍 Email API URL:', apiUrl);
        
        const emailResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: userData.email,
            subject: 'Withdrawal Confirmed - Grant Union Investment',
            type: 'withdrawal_notification',
            templateData: {
              userName: userData.name || 'User',
              amount: withdrawal.amount,
              status: 'approved',
              method: withdrawal.paymentoption || withdrawal.paymentOption || 'Cryptocurrency'
            }
          })
        });

        const emailResult = await emailResponse.json();
        
        if (emailResponse.ok) {
          console.log('✅ Email sent successfully:', emailResult);
        } else {
          console.error('⚠️ Email API returned error:', emailResult);
        }
      } else {
        console.warn('⚠️ No email address found for user');
      }
    } catch (emailError) {
      console.error('⚠️ Email error (non-blocking):', emailError);
      // Don't fail the approval if email fails
    }

    // Step 7: Return success response with full payment details
    console.log('🎉 Withdrawal approval complete');
    return res.status(200).json({
      success: true,
      record: {
        ...updatedWithdrawal,
        // Include payment details for admin view
        paymentDetails: {
          method: withdrawal.paymentoption || withdrawal.paymentOption,
          bankName: withdrawal.bank_name || withdrawal.bankName,
          accountNumber: withdrawal.account_number || withdrawal.accountNumber,
          accountName: withdrawal.account_name || withdrawal.accountName,
          walletAddress: withdrawal.wallet_address || withdrawal.walletAddress,
          routingNumber: withdrawal.routing_number || withdrawal.routingNumber
        }
      },
      message: 'Withdrawal approved successfully'
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
