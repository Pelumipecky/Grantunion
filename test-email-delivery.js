#!/usr/bin/env node

/**
 * Comprehensive Email Delivery Test
 * Tests the entire email sending flow
 */

require('dotenv').config({ path: '.env.local' });

const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;

console.log('\n=== COMPREHENSIVE EMAIL DELIVERY TEST ===\n');

async function testEmailSending() {
  // Test 1: Direct Mailjet API
  console.log('TEST 1: Direct Mailjet API Send');
  console.log('-------------------------------');

  const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');

  const testEmails = [
    {
      to: 'pelumipecky@gmail.com',
      subject: 'Test 1: Direct API - Investment Approval',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Investment Approved!</h2>
          <p>This is a test email to verify Mailjet delivery.</p>
          <p><strong>Recipient:</strong> pelumipecky@gmail.com</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Test Type:</strong> Direct API</p>
        </div>
      `
    }
  ];

  for (const email of testEmails) {
    try {
      const response = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + auth
        },
        body: JSON.stringify({
          Messages: [
            {
              From: { Email: 'grantunion583@gmail.com', Name: 'Grant Union Investment' },
              To: [{ Email: email.to }],
              Subject: email.subject,
              HTMLPart: email.html
            }
          ]
        })
      });

      const data = await response.json();

      if (response.ok && data.Messages?.[0]?.Status === 'success') {
        console.log(`✅ Email sent to ${email.to}`);
        console.log(`   Message ID: ${data.Messages[0].To[0].MessageID}`);
      } else {
        console.log(`❌ Failed to send to ${email.to}`);
        console.log(`   Status: ${data.Messages?.[0]?.Status}`);
        console.log(`   Error: ${data.ErrorMessage || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ Error sending to ${email.to}: ${error.message}`);
    }
  }

  console.log('\n✅ Email tests completed!');
  console.log('\nNext steps:');
  console.log('1. Check spam/junk folder for emails');
  console.log('2. Check Mailjet dashboard for delivery status');
  console.log('3. Verify recipient email is correct');
  console.log('4. Check sender domain is verified in Mailjet');
}

testEmailSending();
