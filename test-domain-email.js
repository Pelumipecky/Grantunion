#!/usr/bin/env node

/**
 * Send test email from no-reply@grantunion.online
 */

require('dotenv').config({ path: '.env.local' });

const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;

async function sendTestEmailFromDomain() {
  console.log('\n=== TESTING EMAIL FROM no-reply@grantunion.online ===\n');

  const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');

  const emailData = {
    Messages: [
      {
        From: {
          Email: 'no-reply@grantunion.online',
          Name: 'Grant Union Investment'
        },
        To: [
          {
            Email: 'test@grantunion.com',
            Name: 'Recipient'
          }
        ],
        Subject: '✓ Test Email from Grant Union Investment',
        TextPart: 'This is a test email from no-reply@grantunion.online to verify delivery is working.',
        HTMLPart: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(120deg, #FF8C37 0%, #FF6B1A 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .content {
            color: #333;
            line-height: 1.8;
        }
        .success {
            background: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://grantunion.vercel.app/logos/grantunionsmall.png" alt="Grant Union Investment" style="max-width: 100px; height: auto; margin-bottom: 15px;" onerror="this.style.display='none'">
            <h1 style="margin:0;">GRANT UNION INVESTMENT</h1>
            <p style="margin:10px 0 0 0;">Private Wealth & Digital Asset Brokerage</p>
        </div>
        <div class="content">
            <h2>✅ Email Delivery Test Successful!</h2>
            <p>This is a test email from <strong>no-reply@grantunion.online</strong></p>
            <div class="success">
                Email system is working correctly!
            </div>
            <p>If you're seeing this email, it means:</p>
            <ul>
                <li>Your Mailjet configuration is correct</li>
                <li>The domain email is properly set up</li>
                <li>Email delivery is functional</li>
            </ul>
            <p>You should now receive all automated emails from Grant Union Investment.</p>
        </div>
    </div>
</body>
</html>
        `
      }
    ]
  };

  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + auth
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('From: no-reply@grantunion.online');
      console.log('To: test@grantunion.com');
      console.log('Message ID:', result.Messages?.[0]?.To?.[0]?.MessageID);
      console.log('Status:', result.Messages?.[0]?.Status);
      console.log('\n📧 Check your email inbox (or spam folder)');
    } else {
      console.log('❌ Failed to send email');
      console.log('Response:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendTestEmailFromDomain();
