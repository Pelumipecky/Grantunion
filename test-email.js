// Test script to send investment approval email
const fetch = require('node-fetch').default || require('node-fetch');

async function testEmailAPI() {
  const emailData = {
    to: 'test@grantunion.com',
    subject: 'Test Investment Approval - Grant Union Investment',
    type: 'investment_approval',
    templateData: {
      userName: 'Test User',
      plan: '7-Day Plan',
      capital: 500,
      roi: 35,
      bonus: 25,
      duration: '7 days'
    }
  };

  console.log('📧 Sending test investment approval email...');
  console.log('Email data:', JSON.stringify(emailData, null, 2));
  
  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();
    
    console.log(`\n✅ Response status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Email sent successfully!');
      if (data.messageId) {
        console.log('Message ID:', data.messageId);
      }
    } else {
      console.error('\n❌ Failed to send email');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Wait for server to be ready
setTimeout(testEmailAPI, 2000);
