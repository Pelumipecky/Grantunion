/**
 * API endpoint to create an investment and send confirmation email
 * This must run on the server to safely send emails
 */

import { supabaseDb } from '../../../database/supabaseUtils';
import { sendTransactionalEmail } from '../../../lib/emailService';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { investmentData } = req.body;

    // Validate investment data is provided
    if (!investmentData) {
      return res.status(400).json({ 
        error: 'Investment data is required'
      });
    }

    console.log('📊 Creating investment for user:', investmentData.idnum);

    // Create investment in database
    const result = await supabaseDb.createInvestment(investmentData);

    if (result.error) {
      console.error('❌ Failed to create investment:', result.error);
      return res.status(400).json({ 
        error: 'Failed to create investment',
        details: result.error.message
      });
    }

    // Send email notification to user
    try {
      console.log('📧 Fetching user details for investment email. idnum:', investmentData.idnum);
      const userResult = await supabaseDb.getUserByIdnum(investmentData.idnum);
      
      if (userResult.error) {
        console.error('⚠️ Error fetching user for investment email:', userResult.error);
      }
      
      if (!userResult.data) {
        console.warn('⚠️ No user data found for idnum:', investmentData.idnum);
      } else if (!userResult.data.email) {
        console.warn('⚠️ User has no email field. User data:', userResult.data);
      }
      
      if (userResult.data && userResult.data.email) {
        const userEmail = userResult.data.email;
        const userName = userResult.data.name || 'Valued Investor';
        const plan = investmentData.plan || 'Investment Plan';
        const capitalAmount = parseFloat(investmentData.capital).toFixed(2);
        const duration = investmentData.duration || 'N/A';

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
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
    .info-box { background: rgba(255, 152, 55, 0.1); border-left: 4px solid #FF9837; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; background: linear-gradient(120deg, #1C0F36, #2f1d5c); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px auto; }
    .footer { background: #f8f8f8; padding: 25px; text-align: center; border-top: 2px solid #FF8C37; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Investment Submitted Successfully</h1>
    </div>
    <div class="content">
      <p>Dear <strong style="color: #1C0F36;">${userName}</strong>,</p>
      <p>Your investment has been successfully submitted and is now pending approval.</p>

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #1C0F36; margin-bottom: 15px;">Investment Details</h3>
        <table>
          <tr>
            <td>Investment Plan</td>
            <td style="color: #FF8C37;">${plan}</td>
          </tr>
          <tr>
            <td>Amount</td>
            <td>$${capitalAmount}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>${typeof duration === 'number' ? duration + ' days' : duration}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td style="color: #FF9837;">PENDING APPROVAL</td>
          </tr>
        </table>
      </div>

      <div class="info-box">
        <strong>What Happens Next:</strong><br>
        1. Our team will review your investment request<br>
        2. You'll receive email notification once approved<br>
        3. Your ROI will begin accruing after approval<br>
        4. Check your dashboard for status updates
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Dashboard</a>
      </p>

      <p>Thank you for choosing Grant Union Investment! We're excited to help you grow your wealth.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
      <p><a href="https://grantunion.vercel.app/contact" style="color: #FF8C37; text-decoration: none;">Contact Support</a></p>
      <p style="color: #999999; margin-bottom: 0;">© 2026 Grant Union Investment. All rights reserved.</p>
      <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

        const textBody = `Investment Submitted Successfully

Dear ${userName},

Your investment has been successfully submitted and is now pending approval.

Investment Details:
Plan: ${plan}
Amount: $${capitalAmount}
Duration: ${typeof duration === 'number' ? duration + ' days' : duration}
Status: PENDING APPROVAL

What Happens Next:
1. Our team will review your investment request
2. You'll receive email notification once approved
3. Your ROI will begin accruing after approval
4. Check your dashboard for status updates

Thank you for choosing Grant Union Investment!

Best regards,
The Grant Union Investment Team`;

        await sendTransactionalEmail({
          to: userEmail,
          subject: 'Investment Submitted - Grant Union Investment',
          htmlBody,
          textBody
        });

        console.log('✅ Investment submission email sent successfully to:', userEmail);
      } else {
        console.warn('⚠️ Investment email NOT sent - missing user data or email');
      }
    } catch (emailError) {
      console.error('⚠️ Error sending investment submission email:', emailError);
      // Don't fail the investment creation if email fails
    }

    return res.status(200).json({ 
      data: result.data,
      message: 'Investment created successfully'
    });

  } catch (error) {
    console.error('❌ API error in investments/create:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}
