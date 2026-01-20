/**
 * API endpoint for KYC verification status updates with email notifications
 * This endpoint is server-side to safely use Mailjet credentials
 */

import { supabase } from '../../../../database/supabaseConfig';
import { sendTransactionalEmail } from '../../../../lib/emailService';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { kycId, newStatus } = req.body;

    // Validate inputs
    if (!kycId || !newStatus) {
      return res.status(400).json({
        error: 'Missing required fields: kycId, newStatus',
      });
    }

    if (!['Verified', 'Rejected', 'pending'].includes(newStatus)) {
      return res.status(400).json({
        error: 'Invalid status. Must be: Verified, Rejected, or pending',
      });
    }

    console.log(`📋 Updating KYC ${kycId} to status: ${newStatus}`);

    // First get the KYC record
    const { data: kycData, error: kycError } = await supabase
      .from('kyc')
      .select('*')
      .eq('id', kycId)
      .single();

    if (kycError || !kycData) {
      console.error('❌ KYC record not found:', kycId);
      return res.status(404).json({
        error: 'KYC record not found',
      });
    }

    // Update KYC status
    const { error: updateKycError } = await supabase
      .from('kyc')
      .update({ status: newStatus })
      .eq('id', kycId);

    if (updateKycError) {
      console.error('❌ Failed to update KYC status:', updateKycError);
      return res.status(400).json({
        error: 'Failed to update KYC status',
        details: updateKycError.message,
      });
    }

    console.log('✅ KYC status updated');

    // Update user KYC status if userId exists
    if (kycData.user_id) {
      console.log(`👤 Updating user KYC status to: ${newStatus}`);
      const { error: updateUserError } = await supabase
        .from('userlogs')
        .update({ kyc_status: newStatus })
        .eq('id', kycData.user_id);

      if (updateUserError) {
        console.error('⚠️ Warning: Failed to update user KYC status:', updateUserError);
        // Don't throw - continue with notifications and email
      }
    }

    // Create notification for user
    const notificationMessage =
      newStatus === 'Verified'
        ? '🎉 Congratulations! Your KYC verification has been approved. You can now make withdrawals and access all platform features.'
        : '❌ Your KYC verification has been rejected. Please check your submitted documents and try again, or contact support for assistance.';

    const notificationPush = {
      title: `KYC ${newStatus}`,
      message: notificationMessage,
      idnum: kycData.idnum,
      status: 'unseen',
      type: newStatus === 'Verified' ? 'success' : 'error',
    };

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([notificationPush]);

    if (notificationError) {
      console.error('⚠️ Warning: Notification creation failed:', notificationError);
      // Don't throw - continue with email
    } else {
      console.log('✅ Notification created');
    }

    // Send email notification to user
    try {
      // Get user email from userlogs table
      const { data: userData, error: userError } = await supabase
        .from('userlogs')
        .select('email, name')
        .eq('idnum', kycData.idnum)
        .single();

      if (userError) {
        console.error('⚠️ Warning: Could not fetch user data:', userError);
        return res.status(200).json({
          success: true,
          message: 'KYC updated but email not sent - user email not found',
        });
      }

      if (!userData?.email) {
        console.warn('⚠️ Warning: User has no email on file');
        return res.status(200).json({
          success: true,
          message: 'KYC updated but email not sent - no email on file',
        });
      }

      const userName = userData.name || 'Valued User';
      const statusText =
        newStatus === 'Verified'
          ? 'APPROVED'
          : newStatus === 'Rejected'
            ? 'REJECTED'
            : newStatus;

      // Build HTML content for KYC email
      const htmlBody =
        newStatus === 'Verified'
          ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Alegreya Sans', Arial, sans-serif; background-color: #f5f5f5; color: #333333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; }
    .header { background: #2DC194; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 10px 0 0 0; font-weight: 600; }
    .content { padding: 30px 25px; }
    .content p { margin: 15px 0; line-height: 1.6; font-size: 15px; }
    .success-box { background: rgba(45, 193, 148, 0.1); border-left: 4px solid #2DC194; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #2DC194; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>KYC Verification Approved ✓</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Congratulations! Your KYC verification has been approved.</p>

      <div class="success-box">
        <strong>Verification Complete!</strong><br>
        Your account is now fully verified and you have access to all platform features:
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li style="padding: 5px 0;">✓ Full investment access</li>
          <li style="padding: 5px 0;">✓ Unlimited withdrawals</li>
          <li style="padding: 5px 0;">✓ Priority support</li>
          <li style="padding: 5px 0;">✓ Enhanced security</li>
        </ul>
      </div>

      <p>You can now:</p>
      <ul style="padding-left: 20px;">
        <li>Choose from our investment plans</li>
        <li>Make deposits and start earning</li>
        <li>Withdraw your funds anytime</li>
        <li>Access all premium features</li>
      </ul>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">Go to Dashboard</a>
      </p>

      <p>Thank you for completing the verification process.</p>
      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
      <p><a href="https://grantunion.vercel.app/contact" style="color: #2DC194; text-decoration: none;">Contact Support</a></p>
      <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`
          : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Alegreya Sans', Arial, sans-serif; background-color: #f5f5f5; color: #333333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; }
    .header { background: #FF9837; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 10px 0 0 0; font-weight: 600; }
    .content { padding: 30px 25px; }
    .content p { margin: 15px 0; line-height: 1.6; font-size: 15px; }
    .warning-box { background: rgba(255, 152, 55, 0.1); border-left: 4px solid #FF9837; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF9837; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>KYC Verification Update</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Your KYC verification status has been updated to: <strong style="color: #FF9837;">${statusText}</strong></p>

      <div class="warning-box">
        <strong>Next Steps:</strong><br>
        Please review your submitted documents and contact our support team if you need assistance or have questions about the decision.
      </div>

      <p>To resubmit your KYC application or get more information:</p>
      
      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard/kyc" class="button">KYC Dashboard</a>
      </p>

      <p>Our support team is here to help if you have any questions.</p>
      <p>Best regards,<br><strong style="color: #1C0F36;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
      <p><a href="https://grantunion.vercel.app/contact" style="color: #FF9837; text-decoration: none;">Contact Support</a></p>
      <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

      const textBody =
        newStatus === 'Verified'
          ? `Dear ${userName},

Congratulations! Your KYC verification has been approved.

Your account is now fully verified and you have access to all platform features:
✓ Full investment access
✓ Unlimited withdrawals
✓ Priority support
✓ Enhanced security

You can now:
- Choose from our investment plans
- Make deposits and start earning
- Withdraw your funds anytime
- Access all premium features

Thank you for completing the verification process.

Best regards,
The Grant Union Investment Team`
          : `Dear ${userName},

Your KYC verification status has been updated to: ${statusText}

Please review your submitted documents and contact our support team if you need assistance or have questions about the decision.

Our support team is here to help if you have any questions.

Best regards,
The Grant Union Investment Team`;

      // Send email
      await sendTransactionalEmail({
        to: userData.email,
        subject: `KYC Verification ${statusText}`,
        htmlBody,
        textBody,
      });

      console.log(`✅ KYC email sent to ${userData.email}`);
    } catch (emailError) {
      console.error('⚠️ Error sending KYC email:', emailError);
      // Don't throw - KYC was still updated successfully
      return res.status(200).json({
        success: true,
        message: 'KYC updated but email sending failed',
        emailError: emailError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `KYC updated to ${newStatus} and email notification sent`,
    });
  } catch (err) {
    console.error('❌ KYC update error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
}
