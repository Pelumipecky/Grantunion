const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grant Union - User Guide</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Alegreya Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: #fff;
      color: #333;
      line-height: 1.8;
      padding: 40px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #FF8C37;
    }
    
    .logo {
      max-width: 140px;
      margin: 0 auto 15px;
      display: block;
    }
    
    .title {
      font-size: 2.5em;
      color: #FF8C37;
      margin-bottom: 5px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    
    .subtitle {
      font-size: 1.1em;
      color: #666;
      font-weight: 600;
    }
    
    h1 {
      font-size: 2em;
      color: #1C0F36;
      margin-top: 35px;
      margin-bottom: 15px;
      border-left: 4px solid #FF8C37;
      padding-left: 15px;
    }
    
    h2 {
      font-size: 1.5em;
      color: #1C0F36;
      margin-top: 28px;
      margin-bottom: 12px;
      border-left: 4px solid #FF8C37;
      padding-left: 12px;
    }
    
    h3 {
      font-size: 1.2em;
      color: #FF8C37;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    
    p {
      margin-bottom: 15px;
      font-size: 1.05em;
      color: #444;
    }
    
    ul, ol {
      margin-left: 25px;
      margin-bottom: 15px;
    }
    
    li {
      margin-bottom: 10px;
      font-size: 1.05em;
      color: #444;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #f5f0ff 0%, #fff5e6 100%);
      border-left: 5px solid #FF8C37;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    
    .highlight-box strong {
      color: #FF8C37;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #FF8C37;
      color: #666;
      font-size: 0.95em;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    th {
      background-color: #FF8C37;
      color: white;
      font-weight: 600;
    }
    
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="Grant Union" class="logo" style="width: 140px; height: auto;">
    <div class="title">GRANT UNION</div>
    <div class="subtitle">Investment Platform - User Guide</div>
  </div>

  <h1>Welcome to Grant Union</h1>
  <p>
    Grant Union is a modern investment platform designed to help you grow your wealth through diversified investment opportunities. 
    This comprehensive guide will walk you through every step of your investment journey, from account setup to managing your returns.
  </p>

  <div class="highlight-box">
    <strong>Welcome Bonus:</strong> New members receive a welcome bonus upon successful account creation and KYC verification. 
    Start your investment journey and earn daily returns on your capital.
  </div>

  <h1>Getting Started</h1>

  <h2>Step 1: Create Your Account</h2>
  <ol>
    <li>Visit <strong>grantunion.vercel.app</strong></li>
    <li>Click "Sign Up" in the top right corner</li>
    <li>Enter your email address and create a strong password</li>
    <li>Verify your email by clicking the link sent to your inbox</li>
    <li>Complete your profile with your name, phone, and username</li>
  </ol>

  <div class="highlight-box">
    <strong>Password Requirements:</strong> Your password must contain at least 8 characters, including uppercase letters, numbers, and special characters.
  </div>

  <h2>Step 2: Complete Your Profile</h2>
  <ol>
    <li>Log in to your dashboard</li>
    <li>Navigate to <strong>Profile</strong></li>
    <li>Fill in all required information:
      <ul>
        <li>Full name</li>
        <li>Phone number</li>
        <li>Username</li>
        <li>Profile picture (optional)</li>
      </ul>
    </li>
    <li>Click "Save Changes"</li>
  </ol>

  <h2>Step 3: KYC Verification</h2>
  <p>Know Your Customer (KYC) verification is required to unlock full platform features and higher withdrawal limits.</p>
  <ol>
    <li>Go to <strong>Dashboard → KYC Verification</strong></li>
    <li>Upload the following documents:
      <ul>
        <li>Valid ID (Passport, Driver's License, or National ID)</li>
        <li>Proof of address (Utility bill, Bank statement, or Lease agreement)</li>
        <li>Selfie with your ID</li>
      </ul>
    </li>
    <li>Wait for verification (usually 24 hours)</li>
    <li>Receive approval notification via email</li>
  </ol>

  <div class="page-break"></div>

  <h1>Investment Plans</h1>
  <p>Grant Union offers flexible investment plans tailored to different risk profiles and investment horizons.</p>

  <h2>Available Plans</h2>
  <table>
    <tr>
      <th>Plan</th>
      <th>Duration</th>
      <th>Min Investment</th>
      <th>Daily ROI</th>
      <th>Best For</th>
    </tr>
    <tr>
      <td><strong>7-Day Plan</strong></td>
      <td>7 days</td>
      <td>\$100</td>
      <td>5%</td>
      <td>Quick returns</td>
    </tr>
    <tr>
      <td><strong>14-Day Plan</strong></td>
      <td>14 days</td>
      <td>\$100</td>
      <td>7%</td>
      <td>Balanced growth</td>
    </tr>
    <tr>
      <td><strong>3-Month Plan</strong></td>
      <td>90 days</td>
      <td>\$500</td>
      <td>10%</td>
      <td>Long-term growth</td>
    </tr>
    <tr>
      <td><strong>6-Month Plan</strong></td>
      <td>180 days</td>
      <td>\$1,000</td>
      <td>12%</td>
      <td>Maximum returns</td>
    </tr>
  </table>

  <div class="highlight-box">
    <strong>How ROI Works:</strong> Daily ROI is calculated based on your investment capital and credited directly to your account balance every 24 hours.
  </div>

  <h2>How to Invest</h2>
  <ol>
    <li>Go to <strong>Dashboard → Invest</strong></li>
    <li>Select your preferred investment plan</li>
    <li>Enter the investment amount (must be minimum required)</li>
    <li>Choose your payment method (Bitcoin, Ethereum, Bank Transfer)</li>
    <li>Complete payment following the instructions</li>
    <li>Your investment becomes active after payment confirmation</li>
    <li>Daily ROI begins accruing immediately</li>
  </ol>

  <div class="page-break"></div>

  <h1>Managing Your Account</h1>

  <h2>Dashboard Overview</h2>
  <p>Your dashboard provides a complete overview of your investment portfolio:</p>
  <ul>
    <li><strong>Total Balance:</strong> Your complete account balance including ROI</li>
    <li><strong>Active Investments:</strong> Your current active investment plans</li>
    <li><strong>Daily Earnings:</strong> ROI credited today</li>
    <li><strong>Referral Bonus:</strong> Earnings from your referral network</li>
  </ul>

  <h2>Monitoring Your Investments</h2>
  <ol>
    <li>Check your dashboard daily for ROI updates</li>
    <li>Review investment details by clicking on active plans</li>
    <li>Track completion percentage of each investment</li>
    <li>View transaction history and payment confirmations</li>
  </ol>

  <h2>Referral Program</h2>
  <p>Earn passive income by referring friends and family to Grant Union.</p>
  <ul>
    <li><strong>Your Referral Link:</strong> Find in your dashboard under "Referral"</li>
    <li><strong>Commission:</strong> 5% of your referral's investment</li>
    <li><strong>Unlimited Earnings:</strong> No cap on referral commissions</li>
    <li><strong>Automatic Payments:</strong> Commissions credited instantly</li>
  </ul>

  <h1>Withdrawals</h1>

  <h2>Withdrawal Process</h2>
  <ol>
    <li>Go to <strong>Dashboard → Withdraw</strong></li>
    <li>Enter withdrawal amount (minimum \$200)</li>
    <li>Select payment method</li>
    <li>Enter payment details (wallet address or bank account)</li>
    <li>Submit withdrawal request</li>
    <li>Receive admin approval (24-48 hours)</li>
    <li>Funds transferred to your specified address</li>
  </ol>

  <h2>Withdrawal Methods</h2>
  <ul>
    <li><strong>Bitcoin:</strong> Fast transfers, low fees</li>
    <li><strong>Ethereum:</strong> Flexible, widely accepted</li>
    <li><strong>Bank Transfer:</strong> Direct to your bank account</li>
  </ul>

  <div class="highlight-box">
    <strong>Withdrawal Limits:</strong> Minimum withdrawal is \$200. No maximum limit, but large withdrawals may require additional verification.
  </div>

  <h2>Processing Times</h2>
  <table>
    <tr>
      <th>Method</th>
      <th>Processing Time</th>
    </tr>
    <tr>
      <td>Bitcoin/Ethereum</td>
      <td>24-48 hours</td>
    </tr>
    <tr>
      <td>Bank Transfer</td>
      <td>2-5 business days</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <h1>Safety & Security</h1>

  <h2>Protecting Your Account</h2>
  <ul>
    <li><strong>Strong Password:</strong> Use complex passwords with uppercase, numbers, and symbols</li>
    <li><strong>Two-Factor Authentication:</strong> Enable in account settings for added security</li>
    <li><strong>Never Share Credentials:</strong> Our team will never ask for your password</li>
    <li><strong>Verify URLs:</strong> Always use official domain grantunion.vercel.app</li>
  </ul>

  <h2>Data Protection</h2>
  <p>Grant Union employs industry-leading security measures:</p>
  <ul>
    <li>SSL/TLS encryption for all transactions</li>
    <li>Secure cloud infrastructure with Supabase</li>
    <li>Regular security audits and compliance checks</li>
    <li>User data protection in compliance with international standards</li>
  </ul>

  <h1>Frequently Asked Questions</h1>

  <h3>How often are returns credited?</h3>
  <p>Daily ROI is credited to your account balance every 24 hours at 12:00 AM UTC.</p>

  <h3>Can I withdraw my capital before the plan completes?</h3>
  <p>No, capital is locked until the plan completion date. However, you can withdraw accrued ROI at any time.</p>

  <h3>What if I lose my password?</h3>
  <p>Use the "Forgot Password" link on the login page to reset it via email verification.</p>

  <h3>Are there any hidden fees?</h3>
  <p>No hidden fees. All fees are transparent and displayed before you confirm any transaction.</p>

  <h3>Can I invest in multiple plans simultaneously?</h3>
  <p>Yes! You can have multiple active investment plans at the same time.</p>

  <h3>How does the referral bonus work?</h3>
  <p>You earn 5% of each referred member's investment. There's no limit to how many people you can refer.</p>

  <h1>Contact & Support</h1>

  <p>Our dedicated support team is available 24/7 to assist you:</p>
  <ul>
    <li><strong>Email:</strong> support@grantunion.online</li>
    <li><strong>Website:</strong> grantunion.vercel.app</li>
    <li><strong>Response Time:</strong> Within 24 hours</li>
  </ul>

  <div class="highlight-box">
    <strong>Report Issues:</strong> If you encounter any problems, please contact our support team immediately with details about the issue.
  </div>

  <div class="footer">
    <p><strong>Grant Union Investment Platform</strong></p>
    <p>&copy; 2026 Grant Union. All rights reserved.</p>
    <p>This guide is for informational purposes only. Investment carries risk. Please read our terms and conditions before investing.</p>
  </div>
</body>
</html>
`;

async function generatePDF() {
  try {
    console.log('📄 Starting PDF generation...');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-en.pdf');
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      printBackground: true,
      preferCSSPageSize: true
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully!');
    console.log('📁 Location: ' + outputPath);
    console.log('📖 File: guide-en.pdf');
  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  }
}

generatePDF();
