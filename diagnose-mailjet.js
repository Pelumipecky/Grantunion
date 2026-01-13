#!/usr/bin/env node

/**
 * Check Mailjet sender status and message history
 */

require('dotenv').config({ path: '.env.local' });

const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;

async function checkMailjetStatus() {
  console.log('\n=== MAILJET DIAGNOSTICS ===\n');

  const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');

  try {
    // Check sender addresses
    console.log('📧 Checking Sender Addresses...\n');
    const senderResponse = await fetch('https://api.mailjet.com/v3/REST/sender', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + auth
      }
    });

    const senders = await senderResponse.json();
    
    if (senders.Data && senders.Data.length > 0) {
      console.log('Registered Sender Addresses:');
      senders.Data.forEach(sender => {
        console.log(`  - ${sender.Email}`);
        console.log(`    Status: ${sender.Status}`);
        console.log(`    Verified: ${sender.IsDefaultSender ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No sender addresses found or not verified');
      console.log('');
    }

    // Check recent messages
    console.log('\n📨 Checking Recent Message History...\n');
    const messageResponse = await fetch('https://api.mailjet.com/v3/REST/message?Limit=5', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + auth
      }
    });

    const messages = await messageResponse.json();
    
    if (messages.Data && messages.Data.length > 0) {
      console.log('Recent Messages:');
      messages.Data.forEach(msg => {
        console.log(`  - ID: ${msg.ID}`);
        console.log(`    From: ${msg.SenderEmail || 'N/A'}`);
        console.log(`    Status: ${msg.Status}`);
        console.log(`    Sent At: ${msg.ArrivedAt || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('No recent messages found');
    }

    // Try to get message statistics
    console.log('\n📊 Checking Message Statistics...\n');
    const statsResponse = await fetch('https://api.mailjet.com/v3/REST/messagestatistics?Limit=5', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + auth
      }
    });

    const stats = await statsResponse.json();
    console.log('Stats Response:', JSON.stringify(stats, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Test sending to a different approach
async function sendTestEmail() {
  console.log('\n\n=== SENDING DIRECT TEST EMAIL ===\n');

  const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');

  // Try with the Gmail address first (which should be verified)
  const testData = {
    Messages: [
      {
        From: {
          Email: 'grantunion583@gmail.com',
          Name: 'Grant Union Investment'
        },
        To: [
          {
            Email: 'pelumipecky@gmail.com',
            Name: 'Recipient'
          }
        ],
        Subject: 'Test Email - Grant Union Investment',
        TextPart: 'This is a test email to verify delivery.',
        HTMLPart: '<h3>Test Email</h3><p>This is a test email from Grant Union Investment to verify delivery.</p><p>If you receive this, email delivery is working!</p>'
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
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', result.Messages?.[0]?.To?.[0]?.MessageID);
      console.log('Status:', result.Messages?.[0]?.Status);
    } else {
      console.log('❌ Failed to send test email');
      console.log('Error:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  await checkMailjetStatus();
  await sendTestEmail();
  
  console.log('\n\n=== RECOMMENDATIONS ===\n');
  console.log('1. Check if no-reply@grantunion.online is verified in Mailjet');
  console.log('2. Log into Mailjet dashboard: https://app.mailjet.com');
  console.log('3. Go to "Account Settings" > "Sender addresses & domains"');
  console.log('4. Verify the domain or add grantunion583@gmail.com as default sender');
  console.log('5. Check your spam folder for emails');
  console.log('');
}

main();
