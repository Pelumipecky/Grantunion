#!/usr/bin/env node

// Simple test email script
const http = require('http');

const emailData = {
  to: 'test@grantunion.com',
  subject: 'Test Investment Approval - Grant Union',
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
console.log('Recipient:', emailData.to);
console.log('Plan:', emailData.templateData.plan);
console.log('Capital: $' + emailData.templateData.capital);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/send-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n✅ Response received (Status: ' + res.statusCode + ')');
    try {
      const response = JSON.parse(data);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      if (res.statusCode === 200 && response.success) {
        console.log('\n🎉 Email sent successfully!');
        if (response.messageId) {
          console.log('Message ID:', response.messageId);
        }
      } else {
        console.log('\n⚠️ Email may not have been sent');
      }
    } catch (e) {
      console.log('Response:', data);
    }
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});

req.on('error', (e) => {
  console.error('\n❌ Error connecting to server:', e.message);
  console.error('Make sure the dev server is running: npm run dev');
  process.exit(1);
});

req.write(JSON.stringify(emailData));
req.end();
