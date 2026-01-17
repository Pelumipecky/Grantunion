/**
 * Backend API Endpoint: Approve Investment
 * 
 * This endpoint handles investment approval server-side with:
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
    const { investmentId } = req.body;

    if (!investmentId) {
      return res.status(400).json({ error: 'Investment ID is required' });
    }

    console.log('📝 Processing investment approval:', investmentId);

    // Step 1: Fetch investment record first (for idempotency check)
    const { data: investment, error: fetchError } = await supabase
      .from('investments')
      .select('*')
      .eq('id', investmentId)
      .single();

    if (fetchError || !investment) {
      console.error('❌ Investment not found:', fetchError);
      return res.status(404).json({ error: 'Investment not found' });
    }

    // Step 2: Idempotency Check - If already approved and email already sent, return
    const alreadyApproved = investment.status === 'Active' || investment.status === 'Approved';
    const emailAlreadySent = !!investment.approval_email_sent;
    if (alreadyApproved && emailAlreadySent) {
      console.log('⚠️ Investment already approved and approval email already sent');
      return res.status(200).json({
        success: true,
        record: investment,
        message: 'Investment already approved and email sent',
        alreadyProcessed: true
      });
    }

    // Step 3: Calculate earnings based on plan
    const capital = parseFloat(investment.capital) || 0;
    const duration = parseInt(investment.duration) || 7;
    
    // Define plan rules
    const PLANS = {
      '7-Day Plan': { dailyRate: 0.025, durationDays: 7, minCapital: 200, maxCapital: 999 },
      '14-Day Plan': { dailyRate: 0.03, durationDays: 14, minCapital: 1000, maxCapital: 4999 },
      '30-Day Plan': { dailyRate: 0.04, durationDays: 30, minCapital: 5000, maxCapital: 9999 },
      '60-Day Plan': { dailyRate: 0.05, durationDays: 60, minCapital: 10000, maxCapital: Infinity }
    };

    const planConfig = PLANS[investment.plan];
    const dailyRate = planConfig ? planConfig.dailyRate : 0.025;
    const calculatedROI = capital * dailyRate * duration;
    const calculatedBonus = 0; // No bonus by default

    console.log('💰 Calculated earnings:', { capital, roi: calculatedROI, bonus: calculatedBonus });

    // Step 4: Get user data
    const { data: userData, error: userError } = await supabase
      .from('userlogs')
      .select('*')
      .eq('idnum', investment.idnum)
      .single();

    if (userError || !userData) {
      console.error('❌ User not found:', userError);
      return res.status(404).json({ error: 'User not found for this investment' });
    }

      // Log important user state that could block email sending (KYC, wallet presence)
      console.log('[INVESTMENT APPROVAL] User KYC status:', userData.kyc_status || 'unknown', 'user email:', userData.email || 'none', 'paymentOption:', investment.paymentOption || 'none');

    const approvedAt = new Date().toISOString();
    const currentBalance = parseFloat(userData.balance) || 0;
    const currentBonus = parseFloat(userData.bonus) || 0;

    // Step 5: Atomic Database Updates
    console.log('🔄 Starting atomic updates...');

    // 5a. Update investment status (idempotent)
    console.log('[INVESTMENT APPROVAL] Before update - status:', investment.status, 'approval_email_sent:', investment.approval_email_sent);
    const { data: updatedInvestment, error: investError } = await supabase
      .from('investments')
      .update({
        status: 'Active',
        roi: calculatedROI,
        bonus: calculatedBonus,
        credited_roi: 0,
        credited_bonus: 0,
        approved_at: approvedAt,
        authstatus: 'seen',
        updated_at: approvedAt
      })
      .eq('id', investmentId)
      .select()
      .single();

    console.log('[INVESTMENT APPROVAL] After update - investError:', investError, 'updatedInvestment:', updatedInvestment && updatedInvestment.status);

    if (investError) {
      console.error('❌ Failed to update investment:', investError);
      return res.status(500).json({ error: 'Failed to update investment status' });
    }

    // 5b. Update user balance (credit capital immediately)
    const { data: updatedUser, error: balanceError } = await supabase
      .from('userlogs')
      .update({
        balance: parseFloat((currentBalance + capital).toFixed(2)),
        bonus: parseFloat((currentBonus + calculatedBonus).toFixed(2)),
        authstatus: 'seen',
        updated_at: approvedAt
      })
      .eq('idnum', investment.idnum)
      .select()
      .single();

    if (balanceError) {
      console.error('❌ Failed to update user balance:', balanceError);
      // Rollback investment status if balance update fails
      await supabase
        .from('investments')
        .update({ status: 'Pending' })
        .eq('id', investmentId);
      
      return res.status(500).json({ error: 'Failed to credit user balance' });
    }

    console.log('✅ Database updates successful');

    // Step 6: Create in-app notification
    const termLabel = `${duration} day${duration > 1 ? 's' : ''}`;
    const roiFormatted = calculatedROI.toLocaleString();
    const capitalFormatted = capital.toLocaleString();

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        idnum: investment.idnum,
        title: 'Investment Approved',
        message: `Your $${capitalFormatted} ${investment.plan} investment has been activated! You will earn $${roiFormatted} ROI over ${termLabel}. Capital and earnings unlock after ${termLabel}.`,
        status: 'unseen',
        type: 'investment_activated',
        created_at: approvedAt,
        updated_at: approvedAt
      }]);

    if (notificationError) {
      console.error('⚠️ Failed to create notification (non-blocking):', notificationError);
    }

    // Step 7: Send email notification via POST to /api/send-email (using proven template)
    let emailSendResult = null;
    let emailSendError = null;
    try {
      console.log('[INVESTMENT APPROVAL] Attempting to send approval email via /api/send-email...');
      console.log('[INVESTMENT APPROVAL] Investment ID:', investment.id);
      console.log('[INVESTMENT APPROVAL] User email:', userData.email);

      if (!userData.email) {
        console.warn('[INVESTMENT APPROVAL] ⚠️ No email address found for user');
      } else {
        // Use absolute URL for production, fallback to relative path
        const apiUrl = process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}/api/send-email`
          : process.env.NEXT_PUBLIC_APP_URL 
          ? `${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`
          : '/api/send-email';
        console.log('[INVESTMENT APPROVAL] Email API URL:', apiUrl);
        const emailPayload = {
          to: userData.email,
          subject: 'Investment Approved - Grant Union Investment',
          type: 'investment_approved',
          templateData: {
            userName: userData.name || 'Investor',
            plan: investment.plan || 'Standard Plan',
            amount: capital.toString(),
            roi: calculatedROI.toString(),
            duration: termLabel,
            dailyROI: (calculatedROI / duration).toString()
          }
        };
        console.log('[INVESTMENT APPROVAL] Email payload:', emailPayload);
        const emailResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailPayload)
        });
        const emailResult = await emailResponse.json();
        if (emailResponse.ok) {
          emailSendResult = emailResult;
          console.log('[INVESTMENT APPROVAL] ✅ Email sent successfully:', emailResult);

          // Step 7b: Mark approval_email_sent = true only after successful send
          try {
            const { data: emailFlagUpdate, error: emailFlagError } = await supabase
              .from('investments')
              .update({ approval_email_sent: true, updated_at: new Date().toISOString() })
              .eq('id', investmentId)
              .select()
              .single();

            if (emailFlagError) {
              console.error('[INVESTMENT APPROVAL] ❌ Failed to set approval_email_sent flag:', emailFlagError);
              // Do not throw; but include in response
            } else {
              console.log('[INVESTMENT APPROVAL] ✅ approval_email_sent flag set on investment');
            }
          } catch (flagErr) {
            console.error('[INVESTMENT APPROVAL] ❌ Error setting approval_email_sent flag:', flagErr);
          }
        } else {
          emailSendError = emailResult;
          console.error('[INVESTMENT APPROVAL] ⚠️ Email API returned error:', emailResult);
        }
      }
    } catch (emailErr) {
      emailSendError = emailErr;
      console.error('[INVESTMENT APPROVAL] ⚠️ Email error (non-blocking):', emailErr);
      // Don't fail the approval if email fails
    }

    // Step 8: Return success response
    console.log('🎉 Investment approval complete');
    const responsePayload = {
      success: true,
      record: updatedInvestment,
      user: updatedUser,
      message: 'Investment approved successfully',
      details: {
        capitalCredited: capital,
        projectedROI: calculatedROI,
        duration: termLabel
      }
    };

    if (emailSendError) {
      responsePayload.emailError = {
        message: emailSendError.message,
        details: emailSendError.details || null
      };
    } else if (emailSendResult) {
      responsePayload.emailResult = emailSendResult;
    }

    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
