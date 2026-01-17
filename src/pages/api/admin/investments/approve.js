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
import { sendTransactionalEmail } from '../../../../lib/emailService';

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

    // Step 7: Send email notification via EmailService (direct Mailjet)
    let emailSendResult = null;
    let emailSendError = null;
    try {
      console.log('[INVESTMENT APPROVAL] Attempting to send approval email via EmailService...');
      console.log('[INVESTMENT APPROVAL] Investment ID:', investment.id);
      console.log('[INVESTMENT APPROVAL] User email:', userData.email);

      if (!userData.email) {
        console.warn('[INVESTMENT APPROVAL] ⚠️ No email address found for user');
      } else {
        const subject = 'Investment Approved - Grant Union Investment';

        // Build HTML content similar to the template
        const userName = userData.name || 'Valued Investor';
        const plan = investment.plan || 'Standard Plan';
        const amount = capital;
        const roiValue = calculatedROI;
        const roiLabel = 'Projected Total Profit';
        const duration = termLabel;

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Alegreya Sans', Arial, sans-serif; background-color: #f5f5f5; color: #333333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; }
    .header { background: #FF8C37; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 10px 0 0 0; font-weight: 600; }
    .content { padding: 30px 25px; }
    .content p { margin: 15px 0; line-height: 1.6; font-size: 15px; }
    .stats-box { background: #ffffff; border: 1px solid #e0e0e0; border-left: 4px solid #1C0F36; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stats-box table { width: 100%; border-collapse: collapse; }
    .stats-box td { padding: 15px; border-bottom: 1px solid #e0e0e0; }
    .stats-box td:first-child { color: #666666; width: 40%; }
    .stats-box td:last-child { text-align: right; font-weight: 600; width: 60%; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; border: 2px solid #1C0F36; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF8C37; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Investment Approved</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Great news! Your investment has been approved and activated.</p>

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #2DC194; margin-bottom: 15px;">Investment Active</h3>
        <table>
          <tr>
            <td>Plan</td>
            <td>${plan}</td>
          </tr>
          <tr>
            <td>Capital</td>
            <td style="color: #2DC194;">$${amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td>${roiLabel}</td>
            <td style="color: #2DC194;">$${roiValue.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>${duration}</td>
          </tr>
        </table>
      </div>

      <p>Your daily ROI credits will begin immediately. You can track your earnings in real-time on your dashboard.</p>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Your Earnings</a>
      </p>

      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Grant Union Investment. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

        const textBody = `Dear ${userName},\n\nGreat news! Your investment has been approved and activated.\n\nPlan: ${plan}\nCapital: $${amount.toFixed(2)}\n${roiLabel}: $${roiValue.toFixed(2)}\nDuration: ${duration}\n\nYour daily ROI credits will begin immediately.\n\nBest regards,\nThe Grant Union Investment Team`;

        emailSendResult = await sendTransactionalEmail({
          to: userData.email,
          subject,
          textBody,
          htmlBody
        });

        console.log('[INVESTMENT APPROVAL] ✅ EmailService send result:', emailSendResult);

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
          } else {
            console.log('[INVESTMENT APPROVAL] ✅ approval_email_sent flag set on investment');
          }
        } catch (flagErr) {
          console.error('[INVESTMENT APPROVAL] ❌ Error setting approval_email_sent flag:', flagErr);
        }
      }
    } catch (emailErr) {
      emailSendError = emailErr;
      console.error('[INVESTMENT APPROVAL] ⚠️ EmailService error:', emailErr);
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
      },
      emailSent: !!emailSendResult
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
