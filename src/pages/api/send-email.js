// @ts-nocheck
// API endpoint for sending email notifications using Mailjet
// Mailjet is a reliable email service provider with good deliverability

import { supabase } from '../../database/supabaseConfig';

// Email template builder with Grant Union branding
const buildStyledEmailTemplate = (title, content, footer = null) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Alegreya Sans', Arial, sans-serif;
          background-color: #120524;
          color: #FEF9FF;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #1C0F36;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          border: 1px solid #2d2d2d;
        }
        .header {
          background-color: #1C0F36;
          padding: 40px 20px;
          text-align: center;
          border-bottom: 2px solid #FF8C37;
        }
        .logo-section {
          margin-bottom: 15px;
        }
        .logo-section img {
          max-width: 120px;
          height: auto;
          margin-bottom: 15px;
        }
        .logo-text {
          font-size: 32px;
          font-weight: 800;
          color: #FEF9FF;
          letter-spacing: 2px;
          margin: 0;
          text-transform: uppercase;
          text-shadow: 0 4px 12px rgba(255, 140, 55, 0.3);
        }
        .logo-subtitle {
          font-size: 12px;
          color: #FFD6B8;
          letter-spacing: 3px;
          margin: 5px 0 0 0;
          text-transform: uppercase;
          font-weight: 600;
        }
        .header h1 {
          color: #FEF9FF;
          font-size: 28px;
          margin: 10px 0 0 0;
          font-weight: 600;
        }
        .content {
          padding: 30px 25px;
          background: rgba(28, 15, 54, 0.8);
        }
        .content p {
          margin: 15px 0;
          line-height: 1.6;
          font-size: 15px;
          color: #F8EDFF;
        }
        .content h2 {
          color: #FF8C37;
          font-size: 22px;
          margin: 20px 0 15px 0;
          font-weight: 600;
        }
        .content h3 {
          color: #FF8C37;
          font-size: 16px;
          margin: 15px 0 10px 0;
          font-weight: 600;
        }
        .stats-box {
          background: rgba(255, 140, 55, 0.1);
          border-left: 4px solid #FF8C37;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          backdrop-filter: blur(10px);
        }
        .stats-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .stats-box li {
          padding: 8px 0;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 140, 55, 0.2);
          font-size: 14px;
        }
        .stats-box li:last-child {
          border-bottom: none;
        }
        .stats-box strong {
          color: #FF8C37;
          font-weight: 600;
        }
        .stats-box .value {
          color: #2DC194;
          font-weight: 600;
        }
        .button {
          display: inline-block;
          background: linear-gradient(120deg, #FF8C37, #FF6B1B);
          color: #FEF9FF;
          padding: 14px 35px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.3s ease;
          border: 2px solid #FF8C37;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 140, 55, 0.4);
        }
        .highlight {
          color: #2DC194;
          font-weight: 600;
        }
        .success-badge {
          display: inline-block;
          background: #2DC194;
          color: #120524;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin: 5px 0;
        }
        .info-box {
          background: rgba(45, 193, 148, 0.1);
          border-left: 4px solid #2DC194;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
          font-size: 14px;
          color: #E0D5FF;
        }
        .footer {
          background: rgba(58, 26, 99, 0.6);
          padding: 25px;
          text-align: center;
          border-top: 2px solid #FF8C37;
          font-size: 12px;
          color: #B8A5D6;
        }
        .footer p {
          margin: 8px 0;
        }
        .footer-link {
          color: #FF8C37;
          text-decoration: none;
          font-weight: 600;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF8C37, transparent);
          margin: 20px 0;
        }
        .warning-box {
          background: rgba(255, 152, 55, 0.1);
          border-left: 4px solid #FF9837;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
          font-size: 14px;
          color: #FFD6B8;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo-section">
            <img src="https://grantunion.vercel.app/grantunionLogo.png" alt="Grant Union Investment" onerror="this.style.display='none'">
            <p class="logo-text">GRANT UNION</p>
            <p class="logo-subtitle">Investment Platform</p>
          </div>
          <h1>${title}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          ${footer || `
            <p style="margin-top: 0; font-weight: 600;">Grant Union Investment</p>
            <p><a href="https://grantunion.vercel.app" class="footer-link">Visit Our Website</a> | <a href="https://grantunion.vercel.app/contact" class="footer-link">Contact Support</a></p>
            <div class="divider" style="margin: 15px 0;"></div>
            <p style="color: #8B7BA8; font-size: 11px; margin-bottom: 0;">This is an automated message from Grant Union Investment. Please do not reply to this email.</p>
            <p style="color: #8B7BA8; font-size: 11px; margin: 5px 0 0 0;">© 2025 Grant Union Investment. All rights reserved.</p>
          `}
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template generators for different email types
const emailTemplates = {
  // Welcome email for new users
  welcome: (data) => {
    const { userName, email } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Member'}</strong>,</p>
      <p>Welcome to Grant Union Investment! We're thrilled to have you join our community of successful investors.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #FF8C37;">Getting Started Guide</h3>
        <p style="margin-bottom: 15px;">Here's how to navigate your Grant Union Investment platform:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 140, 55, 0.2);">
            <strong style="color: #FF8C37;">1. Complete Your Profile</strong><br>
            <span style="font-size: 13px;">Go to Dashboard → Profile to verify your account details</span>
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 140, 55, 0.2);">
            <strong style="color: #FF8C37;">2. Submit KYC Verification</strong><br>
            <span style="font-size: 13px;">Visit Dashboard → KYC to upload required documents</span>
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 140, 55, 0.2);">
            <strong style="color: #FF8C37;">3. Choose Investment Plan</strong><br>
            <span style="font-size: 13px;">Browse our plans: 7-Day, 14-Day, 3-Month, or 6-Month options</span>
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 140, 55, 0.2);">
            <strong style="color: #FF8C37;">4. Make Your First Deposit</strong><br>
            <span style="font-size: 13px;">Click Invest Now and follow the deposit instructions</span>
          </li>
          <li style="padding: 10px 0;">
            <strong style="color: #FF8C37;">5. Track Your Returns</strong><br>
            <span style="font-size: 13px;">Monitor daily ROI credits in your dashboard</span>
          </li>
        </ul>
      </div>

      <div class="info-box">
        <strong>Account Details:</strong><br>
        Email: ${email}<br>
        Member Since: ${new Date().toLocaleDateString()}<br>
        Status: Active
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/signin" class="button">Access Your Dashboard</a>
      </p>

      <p>If you have any questions, our support team is here to help 24/7.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Welcome to Grant Union Investment', content);
  },

  // Investment creation notification
  investment_created: (data) => {
    const { userName, plan, amount, dailyROI, duration, expectedReturn, transactionHash } = data;
    
    // Only show ROI fields if they are provided and greater than 0
    const showROI = dailyROI && parseFloat(dailyROI) > 0;
    const showExpected = expectedReturn && parseFloat(expectedReturn) > 0;
    
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Investor'}</strong>,</p>
      <p>Your investment has been successfully submitted and is now pending approval.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #FF8C37;">Investment Details</h3>
        <ul>
          <li>
            <span>Investment Plan</span>
            <span style="color: #FF8C37; font-weight: 600;">${plan}</span>
          </li>
          <li>
            <span>Capital Amount</span>
            <span class="value">$${parseFloat(amount).toFixed(2)}</span>
          </li>
          ${showROI ? `<li>
            <span>Daily ROI</span>
            <span class="value">$${parseFloat(dailyROI).toFixed(2)}</span>
          </li>` : ''}
          <li>
            <span>Duration</span>
            <span style="color: #FEF9FF;">${duration} days</span>
          </li>
          ${showExpected ? `<li>
            <span>Expected Total Return</span>
            <span class="value">$${parseFloat(expectedReturn).toFixed(2)}</span>
          </li>` : ''}
          ${transactionHash ? `<li><span>Transaction ID</span><span style="color: #FEF9FF; font-size: 11px; word-break: break-all;">${transactionHash}</span></li>` : ''}
          <li>
            <span>Status</span>
            <span style="color: #FFB347;">Pending Approval</span>
          </li>
        </ul>
      </div>

      <div class="info-box">
        <strong>What Happens Next:</strong><br>
        1. Our team will review your investment within 24 hours<br>
        2. You'll receive a confirmation email once approved<br>
        3. Daily ROI credits will begin immediately after approval<br>
        4. Track your earnings in real-time on your dashboard
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Dashboard</a>
      </p>

      <p>Thank you for choosing Grant Union Investment.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Investment Submitted Successfully', content);
  },

  investment_approved: (data) => {
    // Determine which field names are being used (support both old and new)
    const userName = data.userName;
    const plan = data.plan;
    const amount = data.amount || data.capital; // Fallback to capital
    const duration = data.duration;
    
    // Determine ROI value - support dailyROI or total roi/projectedEarnings
    let roiValue = 0;
    let roiLabel = 'Daily ROI';
    
    if (data.dailyROI) {
        roiValue = parseFloat(data.dailyROI);
        roiLabel = 'Daily ROI';
    } else if (data.roi) {
        // If it's a total ROI, show it as such
        roiValue = parseFloat(data.roi);
        roiLabel = 'Projected Total Profit';
    }
    
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Investor'}</strong>,</p>
      <p>Great news! Your investment has been approved and activated.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #2DC194;">Investment Active</h3>
        <ul>
          <li><span>Plan</span><span style="color: #FF8C37;">${plan}</span></li>
          <li><span>Capital</span><span class="value">$${parseFloat(amount).toFixed(2)}</span></li>
          <li><span>${roiLabel}</span><span class="value">$${roiValue.toFixed(2)}</span></li>
          <li><span>Duration</span><span style="color: #FEF9FF;">${duration} ${duration.toString().includes('day') ? '' : 'days'}</span></li>
        </ul>
      </div>

      <p>Your daily ROI credits will begin immediately. You can track your earnings in real-time on your dashboard.</p>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Your Earnings</a>
      </p>

      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Investment Approved', content);
  },

  /* DEACTIVATED AS REQUESTED - DUPLICATE/ALT TEMPLATES
  investment_approval: (data) => {
  withdrawal_requested: (data) => {
    const { userName, amount, method, accountDetails } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Member'}</strong>,</p>
      <p>We have received your withdrawal request and it is currently being processed.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #FF8C37;">Withdrawal Details</h3>
        <ul>
          <li>
            <span>Withdrawal Amount</span>
            <span class="value">$${parseFloat(amount).toFixed(2)}</span>
          </li>
          <li>
            <span>Payment Method</span>
            <span style="color: #FEF9FF;">${method || 'Bank Transfer'}</span>
          </li>
          <li>
            <span>Status</span>
            <span style="color: #FFD700;">Pending Review</span>
          </li>
          <li>
            <span>Requested On</span>
            <span style="color: #FEF9FF;">${new Date().toLocaleDateString()}</span>
          </li>
        </ul>
      </div>

      <div class="info-box">
        <strong>Processing Timeline:</strong><br>
        • Review: Within 24 hours<br>
        • Approval: 1-2 business days<br>
        • Transfer: 3-5 business days<br>
        • You'll be notified at each stage
      </div>

      <p>We'll send you another email once your withdrawal has been approved and processed.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Withdrawal Request Received', content);
  },

  // Withdrawal approved notification
  withdrawal_approved: (data) => {
    const { userName, amount, method } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Member'}</strong>,</p>
      <p>Excellent news! Your withdrawal request has been approved and processed.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #2DC194;">Withdrawal Approved</h3>
        <ul>
          <li>
            <span>Amount</span>
            <span class="value">$${parseFloat(amount).toFixed(2)}</span>
          </li>
          <li>
            <span>Payment Method</span>
            <span style="color: #FEF9FF;">${method || 'Bank Transfer'}</span>
          </li>
          <li>
            <span>Status</span>
            <span class="value">Approved</span>
          </li>
          <li>
            <span>Processed On</span>
            <span style="color: #FEF9FF;">${new Date().toLocaleDateString()}</span>
          </li>
        </ul>
      </div>

      <div class="info-box">
        <strong>What's Next:</strong><br>
        The funds have been transferred to your account. Depending on your bank, it may take 3-5 business days for the funds to reflect in your account.
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Transaction History</a>
      </p>

      <p>Thank you for your patience.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Withdrawal Approved', content);
  },

  // Withdrawal rejected notification
  withdrawal_rejected: (data) => {
    const { userName, amount, reason } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Member'}</strong>,</p>
      <p>We regret to inform you that your withdrawal request could not be processed at this time.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #DC1262;">Withdrawal Details</h3>
        <ul>
          <li>
            <span>Amount</span>
            <span style="color: #FEF9FF;">$${parseFloat(amount).toFixed(2)}</span>
          </li>
          <li>
            <span>Status</span>
            <span style="color: #DC1262;">Rejected</span>
          </li>
          <li>
            <span>Date</span>
            <span style="color: #FEF9FF;">${new Date().toLocaleDateString()}</span>
          </li>
        </ul>
      </div>

      <div class="warning-box">
        <strong>Reason for Rejection:</strong><br>
        ${reason || 'Please contact support for more information regarding your withdrawal request.'}
      </div>

      <p>If you have any questions or would like to discuss this further, please contact our support team.</p>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/contact" class="button">Contact Support</a>
      </p>

      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Withdrawal Status Update', content);
  },

  /* DEACTIVATED AS REQUESTED
  // Deposit confirmation
  deposit_confirmed: (data) => {
    const { userName, amount, method, transactionHash, newBalance } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Member'}</strong>,</p>
      <p>Your deposit has been successfully confirmed and credited to your account.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #2DC194;">Deposit Confirmed</h3>
        <ul>
          <li>
            <span>Deposit Amount</span>
            <span class="value">$${parseFloat(amount).toFixed(2)}</span>
          </li>
          <li>
            <span>Payment Method</span>
            <span style="color: #FEF9FF;">${method || 'Cryptocurrency'}</span>
          </li>
          ${transactionHash ? `<li><span>Transaction ID</span><span style="color: #FEF9FF; font-size: 11px; word-break: break-all;">${transactionHash}</span></li>` : ''}
          ${newBalance ? `<li><span>New Balance</span><span class="value">$${parseFloat(newBalance).toFixed(2)}</span></li>` : ''}
          <li>
            <span>Status</span>
            <span class="value">Confirmed</span>
          </li>
          <li>
            <span>Date</span>
            <span style="color: #FEF9FF;">${new Date().toLocaleDateString()}</span>
          </li>
        </ul>
      </div>

      <p>Your funds are now available for investment. Start earning daily returns by choosing one of our investment plans.</p>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">Start Investing</a>
      </p>

      <p>Thank you for your deposit.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Deposit Confirmed', content);
  },
  */

  // Daily ROI credit
  roi_daily_credit: (data) => {
    const { userName, dailyROI, totalROI, totalExpected, plan, progress } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Investor'}</strong>,</p>
      <p>Excellent news! Your daily ROI has been successfully credited to your account.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #FF8C37;">Today's Earnings Summary</h3>
        <ul>
          <li>
            <span>Daily ROI Credited</span>
            <span class="value">$${parseFloat(dailyROI).toFixed(2)}</span>
          </li>
          <li>
            <span>Total ROI Credited</span>
            <span class="value">$${parseFloat(totalROI).toFixed(2)}</span>
          </li>
          <li>
            <span>Total Expected ROI</span>
            <span class="value">$${parseFloat(totalExpected).toFixed(2)}</span>
          </li>
          <li>
            <span>Investment Plan</span>
            <span style="color: #FF8C37;">${plan}</span>
          </li>
          <li>
            <span>Completion Progress</span>
            <span class="value">${parseFloat(progress || 0).toFixed(1)}%</span>
          </li>
        </ul>
      </div>

      <p>Your investment is performing excellently. Keep earning daily returns automatically.</p>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Full Details</a>
      </p>

      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Daily ROI Credited', content);
  },

  // KYC status updates
  kyc_approved: (data) => {
    const { userName } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Member'}</strong>,</p>
      <p>Congratulations! Your KYC verification has been approved.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #2DC194;">Verification Complete</h3>
        <p>Your account is now fully verified and you have access to all platform features:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 8px 0; color: #2DC194;">✓ Full investment access</li>
          <li style="padding: 8px 0; color: #2DC194;">✓ Unlimited withdrawals</li>
          <li style="padding: 8px 0; color: #2DC194;">✓ Priority support</li>
          <li style="padding: 8px 0; color: #2DC194;">✓ Enhanced security</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard" class="button">Access Your Account</a>
      </p>

      <p>Thank you for completing the verification process.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('KYC Verification Approved', content);
  },

  kyc_rejected: (data) => {
    const { userName, reason } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Valued Member'}</strong>,</p>
      <p>We were unable to approve your KYC verification at this time.</p>
      
      <div class="warning-box">
        <strong>Reason:</strong><br>
        ${reason || 'The documents provided did not meet our verification requirements. Please ensure your documents are clear, valid, and match your account information.'}
      </div>

      <div class="info-box">
        <strong>Next Steps:</strong><br>
        1. Review the rejection reason above<br>
        2. Prepare valid identification documents<br>
        3. Resubmit your KYC application<br>
        4. Contact support if you need assistance
      </div>

      <p style="text-align: center;">
        <a href="https://grantunion.vercel.app/dashboard/kyc" class="button">Resubmit Documents</a>
      </p>

      <p>Our support team is here to help if you have any questions.</p>
      <p>Best regards,<br><strong style="color: #FF8C37;">The Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('KYC Verification Update', content);
  },

  /* DEACTIVATED AS REQUESTED - DUPLICATE/ALT TEMPLATES
  investment_approval: (data) => {
    const { userName, plan, capital, roi, bonus, duration } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Investor'}</strong>,</p>
      <p>Congratulations! Your investment request has been <span class="success-badge">APPROVED</span></p>
      <p>Your capital has been credited to your account and your investment plan is now active. Earnings will be posted daily according to your investment schedule.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #FF8C37;">Investment Details</h3>
        <ul>
          <li>
            <span>Investment Plan</span>
            <span style="color: #FF8C37;">${plan}</span>
          </li>
          <li>
            <span>Capital Invested</span>
            <span class="value">$${parseFloat(capital).toLocaleString()}</span>
          </li>
          <li>
            <span>Projected Earnings</span>
            <span class="value">$${parseFloat(roi).toFixed(2)}</span>
          </li>
          ${bonus ? `<li>
            <span>Legacy Bonus</span>
            <span class="value">$${parseFloat(bonus).toFixed(2)}</span>
          </li>` : ''}
          <li>
            <span>Investment Duration</span>
            <span style="color: #FF8C37;">${duration}</span>
          </li>
        </ul>
      </div>

      <div class="info-box">
        Your ROI will be credited daily to your account balance. You can withdraw your capital plus commissions after the investment term completes.
      </div>

      <a href="https://grantunion.vercel.app/dashboard" class="button">View Investment</a>

      <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #FF8C37;">Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Investment Approved ✓', content);
  },

  kyc_verification: (data) => {
    const { userName, status } = data;
    const isVerified = status === 'Verified';
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'User'}</strong>,</p>
      <p>${isVerified 
        ? `Excellent news! Your KYC verification has been <span class="success-badge">APPROVED</span>` 
        : `Your KYC verification status has been updated to <span style="color: #FF9837; font-weight: 600;">${status}</span>`
      }</p>
      
      ${isVerified ? `
        <div class="info-box">
          You can now access all premium features including higher withdrawal limits and exclusive investment opportunities!
        </div>
      ` : `
        <div class="warning-box">
          Please review your submitted documents. If you have any questions, please contact our support team for assistance.
        </div>
      `}

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #FF8C37;">Verification Status</h3>
        <ul>
          <li>
            <span>KYC Status</span>
            <span style="color: ${isVerified ? '#2DC194' : '#FF9837'};">${status}</span>
          </li>
          <li>
            <span>Updated At</span>
            <span style="color: #FF8C37;">${new Date().toLocaleDateString()}</span>
          </li>
        </ul>
      </div>

      <a href="https://grantunion.vercel.app/dashboard" class="button">Go to Dashboard</a>

      <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #FF8C37;">Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('KYC Verification Update', content);
  },

  withdrawal_notification: (data) => {
    const { userName, amount, status, method } = data;
    const statusText = status === 'approved' ? 'APPROVED' : status === 'rejected' ? 'REJECTED' : 'PENDING';
    const statusColor = status === 'approved' ? '#2DC194' : status === 'rejected' ? '#FF4444' : '#FF9837';
    
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'Investor'}</strong>,</p>
      <p>Your withdrawal request has been <strong style="color: ${statusColor};">${statusText}</strong>.</p>
      
      <div class="stats-box">
        <h3 style="margin-top: 0; color: #FF8C37;">Withdrawal Details</h3>
        <ul>
          <li>
            <span>Withdrawal Amount</span>
            <span class="value">$${parseFloat(amount).toFixed(2)}</span>
          </li>
          <li>
            <span>Payment Method</span>
            <span style="color: #FF8C37;">${method}</span>
          </li>
          <li>
            <span>Status</span>
            <span style="color: ${statusColor};">${statusText}</span>
          </li>
        </ul>
      </div>

      ${status === 'approved' ? `
        <div class="info-box">
          Your withdrawal has been approved and will be processed within 24-48 hours. You will receive another notification once the funds are sent.
        </div>
      ` : status === 'rejected' ? `
        <div class="warning-box">
          Your withdrawal request could not be processed and has been rejected. The amount has been refunded to your account balance.
        </div>
      ` : `
        <div class="warning-box">
          Your withdrawal request is pending review. We will notify you once it has been processed.
        </div>
      `}

      <center>
        <a href="https://grantunion.vercel.app/dashboard" class="button">View Dashboard</a>
      </center>

      <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #FF8C37;">Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Withdrawal Notification', content);
  },

  password_reset: (data) => {
    const { userName, resetLink } = data;
    const content = `
      <p>Dear <strong style="color: #FF8C37;">${userName || 'User'}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div class="info-box">
        This link will expire in 15 minutesfor security purposes.
      </div>

      <center>
        <a href="${resetLink || 'https://grantunion.vercel.app/reset-password'}" class="button">Reset Password</a>
      </center>

      <p style="margin-bottom: 0;">If you didn't request this password reset, you can safely ignore this email.<br><strong style="color: #FF8C37;">Grant Union Investment Team</strong></p>
    `;
    return buildStyledEmailTemplate('Password Reset Request', content);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Special test endpoint for withdrawal debugging
  if (req.body.testWithdrawal) {
    console.log('🧪 Testing withdrawal creation...');
    try {
      const testData = {
        idnum: 36720209,
        amount: 100,
        status: 'pending',
        paymentoption: 'Bitcoin',
        wallet_address: 'bc1qtest123456789'
      };

      console.log('🧪 Test data:', testData);

      const { data, error } = await supabase
        .from('withdrawals')
        .insert([testData])
        .select()
        .single();

      console.log('🧪 Test result - data:', data, 'error:', error);

      return res.status(200).json({
        success: !error,
        data,
        error,
        message: 'Withdrawal test completed'
      });
    } catch (err) {
      console.error('🧪 Test error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    let { to, subject, message, type, templateData, templateType } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'Missing required fields: to, subject' });
    }

    // Use templateType or type for template selection
    const templateKey = templateType || type;

    // Use styled template if template key is specified
    if (templateKey && emailTemplates[templateKey]) {
      if (!templateData) {
        return res.status(400).json({ error: `Template '${templateKey}' requires templateData` });
      }
      message = emailTemplates[templateKey](templateData);
    } else if (!message) {
      return res.status(400).json({ error: 'Missing message or valid template type with templateData' });
    }

    // Get Mailjet credentials from environment variables
    const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
    const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
    const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || 'no-reply@grantunion.online';
    const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || 'Grant Union Investment';

    if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
      console.warn('Mailjet credentials not configured, falling back to logging only');
      console.log('📧 Email Notification (not sent - Mailjet not configured):', {
        to,
        subject,
        type,
        timestamp: new Date().toISOString()
      });
      return res.status(200).json({
        success: true,
        message: 'Email logged (Mailjet not configured)',
        warning: 'Configure MAILJET_API_KEY and MAILJET_API_SECRET to send real emails'
      });
    }

    // Prepare Mailjet API request
    const mailjetData = {
      Messages: [
        {
          From: {
            Email: MAILJET_FROM_EMAIL,
            Name: MAILJET_FROM_NAME
          },
          To: [
            {
              Email: to
            }
          ],
          Subject: subject,
          HTMLPart: message,
          CustomID: type || 'grant-union-notification'
        }
      ]
    };

    // Send email via Mailjet API
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64')
      },
      body: JSON.stringify(mailjetData)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Mailjet API error:', responseData);
      throw new Error(`Mailjet API error: ${response.status} - ${responseData.ErrorMessage || 'Unknown error'}`);
    }

    console.log('📧 Email sent successfully via Mailjet:', {
      to,
      subject,
      messageId: responseData.Messages?.[0]?.To?.[0]?.MessageID,
      type,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully via Mailjet',
      messageId: responseData.Messages?.[0]?.To?.[0]?.MessageID
    });

  } catch (error) {
    console.error('Email notification error:', error);
    res.status(500).json({
      error: 'Failed to send email notification',
      details: error.message
    });
  }
}