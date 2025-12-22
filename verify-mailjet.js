#!/usr/bin/env node

/**
 * Debug script to verify Mailjet credentials and send a test email
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n=== MAILJET CREDENTIALS CHECK ===\n');

const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL;
const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME;

console.log('✓ MAILJET_API_KEY:', MAILJET_API_KEY ? `${MAILJET_API_KEY.substring(0, 10)}...` : '❌ NOT SET');
console.log('✓ MAILJET_API_SECRET:', MAILJET_API_SECRET ? `${MAILJET_API_SECRET.substring(0, 10)}...` : '❌ NOT SET');
console.log('✓ MAILJET_FROM_EMAIL:', MAILJET_FROM_EMAIL || '❌ NOT SET (using default)');
console.log('✓ MAILJET_FROM_NAME:', MAILJET_FROM_NAME || '❌ NOT SET (using default)');

if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
  console.log('\n❌ ERROR: Mailjet credentials not found in .env.local');
  console.log('\nPlease ensure .env.local has:');
  console.log('MAILJET_API_KEY=your_key');
  console.log('MAILJET_API_SECRET=your_secret');
  process.exit(1);
}

console.log('\n✅ Mailjet credentials are configured!');

// Test sending an email via Mailjet API directly
async function testMailjetEmail() {
  console.log('\n=== TESTING MAILJET DIRECT API ===\n');

  const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');

  const mailjetData = {
    Messages: [
      {
        From: {
          Email: MAILJET_FROM_EMAIL || 'grantunion583@gmail.com',
          Name: MAILJET_FROM_NAME || 'Grant Union Investment'
        },
        To: [
          {
            Email: 'pelumipecky@gmail.com'
          }
        ],
        Subject: 'Test Email - Mailjet Credential Verification',
        HTMLPart: '<p>This is a test email to verify Mailjet credentials are working correctly.</p>'
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
      body: JSON.stringify(mailjetData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ Mailjet API Error:');
      console.log('Status:', response.status);
      console.log('Error:', data.ErrorMessage || data.error || JSON.stringify(data, null, 2));
      return false;
    }

    console.log('✅ Mailjet API Response:');
    console.log('Status:', response.status);
    console.log('Message ID:', data.Messages?.[0]?.To?.[0]?.MessageID);
    console.log('\n✅ Email should be sent to pelumipecky@gmail.com');
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

testMailjetEmail();
