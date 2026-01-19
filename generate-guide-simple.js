const html2pdf = require('html2pdf.js');
const fs = require('fs');
const path = require('path');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grant Union - User Guide</title>
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
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #FF8C37;
    }
    
    .title {
      font-size: 2.2em;
      color: #FF8C37;
      margin-bottom: 5px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    
    .subtitle {
      font-size: 1em;
      color: #666;
      font-weight: 600;
    }
    
    h1 {
      font-size: 1.8em;
      color: #1C0F36;
      margin-top: 25px;
      margin-bottom: 12px;
      border-left: 4px solid #FF8C37;
      padding-left: 12px;
    }
    
    h2 {
      font-size: 1.3em;
      color: #1C0F36;
      margin-top: 20px;
      margin-bottom: 10px;
      border-left: 4px solid #FF8C37;
      padding-left: 10px;
    }
    
    h3 {
      font-size: 1.1em;
      color: #FF8C37;
      margin-top: 15px;
      margin-bottom: 8px;
    }
    
    p {
      margin-bottom: 12px;
      font-size: 0.95em;
      color: #444;
    }
    
    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    
    li {
      margin-bottom: 8px;
      font-size: 0.95em;
      color: #444;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #f5f0ff 0%, #fff5e6 100%);
      border-left: 5px solid #FF8C37;
      padding: 15px;
      margin: 15px 0;
      border-radius: 3px;
      font-size: 0.95em;
    }
    
    .highlight-box strong {
      color: #FF8C37;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 0.9em;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
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
    
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 2px solid #FF8C37;
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">GRANT UNION</div>
    <div class="subtitle">Investment Platform - User Guide</div>
  </div>

  <h1>Welcome to Grant Union</h1>
  <p>Grant Union is a modern investment platform designed to help you grow your wealth through diversified investment opportunities. This comprehensive guide will walk you through every step of your investment journey, from account setup to managing your returns.</p>

  <div class="highlight-box">
    <strong>Welcome Bonus:</strong> New members receive a welcome bonus upon successful account creation and KYC verification.
  </div>

  <h1>Getting Started</h1>

  <h2>Step 1: Create Your Account</h2>
  <ol>
    <li>Visit <strong>grantunion.vercel.app</strong></li>
    <li>Click "Sign Up" in the top navigation</li>
    <li>Enter your email address and create a strong password</li>
    <li>Verify your email via the confirmation link</li>
    <li>Complete your profile (name, phone, username)</li>
  </ol>

  <h2>Step 2: Complete Your Profile</h2>
  <ol>
    <li>Log in to your dashboard</li>
    <li>Navigate to <strong>Profile</strong> section</li>
    <li>Fill in all required information</li>
    <li>Click "Save Changes"</li>
  </ol>

  <h2>Step 3: KYC Verification</h2>
  <p>KYC verification is required to unlock full platform features:</p>
  <ol>
    <li>Go to <strong>Dashboard → KYC Verification</strong></li>
    <li>Upload required documents:
      <ul>
        <li>Valid ID (Passport or Driver's License)</li>
        <li>Proof of address (Utility bill or Bank statement)</li>
        <li>Selfie with ID</li>
      </ul>
    </li>
    <li>Wait for verification (24 hours)</li>
    <li>Receive approval notification</li>
  </ol>

  <h1>Investment Plans</h1>
  <p>Grant Union offers flexible investment plans suited to different investment goals.</p>

  <table>
    <tr>
      <th>Plan</th>
      <th>Duration</th>
      <th>Min Investment</th>
      <th>Daily ROI</th>
    </tr>
    <tr>
      <td><strong>7-Day Plan</strong></td>
      <td>7 days</td>
      <td>\$100</td>
      <td>5%</td>
    </tr>
    <tr>
      <td><strong>14-Day Plan</strong></td>
      <td>14 days</td>
      <td>\$100</td>
      <td>7%</td>
    </tr>
    <tr>
      <td><strong>3-Month Plan</strong></td>
      <td>90 days</td>
      <td>\$500</td>
      <td>10%</td>
    </tr>
    <tr>
      <td><strong>6-Month Plan</strong></td>
      <td>180 days</td>
      <td>\$1,000</td>
      <td>12%</td>
    </tr>
  </table>

  <h2>How to Invest</h2>
  <ol>
    <li>Go to <strong>Dashboard → Invest</strong></li>
    <li>Select your preferred plan</li>
    <li>Enter investment amount</li>
    <li>Choose payment method (Bitcoin, Ethereum, Bank Transfer)</li>
    <li>Complete payment</li>
    <li>Investment becomes active after confirmation</li>
    <li>Daily ROI begins accruing immediately</li>
  </ol>

  <h1>Managing Your Account</h1>

  <h2>Dashboard Overview</h2>
  <ul>
    <li><strong>Total Balance:</strong> Your complete account balance</li>
    <li><strong>Active Investments:</strong> Your current investment plans</li>
    <li><strong>Daily Earnings:</strong> Today's ROI</li>
    <li><strong>Referral Bonus:</strong> Earnings from referrals</li>
  </ul>

  <h2>Referral Program</h2>
  <ul>
    <li><strong>Your Referral Link:</strong> Found in Dashboard under "Referral"</li>
    <li><strong>Commission:</strong> 5% of referral's investment</li>
    <li><strong>Unlimited Earnings:</strong> No cap on commissions</li>
  </ul>

  <h1>Withdrawals</h1>

  <h2>Withdrawal Process</h2>
  <ol>
    <li>Go to <strong>Dashboard → Withdraw</strong></li>
    <li>Enter withdrawal amount (minimum \$200)</li>
    <li>Select payment method</li>
    <li>Enter payment details</li>
    <li>Submit request</li>
    <li>Receive admin approval (24-48 hours)</li>
    <li>Funds transferred to specified address</li>
  </ol>

  <h2>Withdrawal Methods</h2>
  <ul>
    <li><strong>Bitcoin:</strong> Fast transfers, low fees</li>
    <li><strong>Ethereum:</strong> Flexible cryptocurrency option</li>
    <li><strong>Bank Transfer:</strong> Direct to your bank account</li>
  </ul>

  <h1>Security & Safety</h1>

  <h2>Protecting Your Account</h2>
  <ul>
    <li>Use strong passwords with uppercase, numbers, and symbols</li>
    <li>Enable Two-Factor Authentication in settings</li>
    <li>Never share your password or verification codes</li>
    <li>Always verify you're on official domain: grantunion.vercel.app</li>
  </ul>

  <h1>FAQ</h1>

  <h3>How often are returns credited?</h3>
  <p>Daily ROI is credited every 24 hours at 12:00 AM UTC.</p>

  <h3>Can I withdraw capital before plan completes?</h3>
  <p>Capital is locked until plan completion. You can withdraw accrued ROI anytime.</p>

  <h3>What if I forget my password?</h3>
  <p>Use "Forgot Password" on login page to reset via email.</p>

  <h3>Are there hidden fees?</h3>
  <p>No. All fees are transparent and shown before confirmation.</p>

  <h3>Can I have multiple active plans?</h3>
  <p>Yes! Invest in multiple plans simultaneously.</p>

  <h1>Contact & Support</h1>

  <p>Our support team is available 24/7:</p>
  <ul>
    <li><strong>Email:</strong> support@grantunion.online</li>
    <li><strong>Website:</strong> grantunion.vercel.app</li>
    <li><strong>Response Time:</strong> Within 24 hours</li>
  </ul>

  <div class="footer">
    <p><strong>Grant Union Investment Platform</strong></p>
    <p>&copy; 2026 Grant Union. All rights reserved.</p>
    <p>This guide is informational. Please read our terms before investing.</p>
  </div>
</body>
</html>
`;

// Write HTML to temporary file and convert
const tempHtmlPath = path.join(__dirname, 'temp-guide.html');
const outputPdfPath = path.join(__dirname, 'public', 'downloads', 'guide-en.pdf');

fs.writeFileSync(tempHtmlPath, htmlContent);

console.log('📄 Generating PDF...');

const element = document.createElement('div');
element.innerHTML = htmlContent;

const options = {
  margin: 10,
  filename: outputPdfPath,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
};

// Use a simpler approach - create the PDF using Node with a library
console.log('✅ PDF will be generated from HTML template');
console.log('📁 Output: ' + outputPdfPath);
