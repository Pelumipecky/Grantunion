const https = require('https');

const data = JSON.stringify({
  to: 'test@grantunion.com',
  subject: 'Investment Approved - Grant Union Investment',
  type: 'investment_approved',
  templateData: {
    userName: 'Test User',
    plan: 'Premium Plan',
    amount: '100000',
    roi: '7500',
    bonus: '0',
    duration: '7 days',
    dailyROI: '1071.43'
  }
});

const options = {
  hostname: 'grantunion.vercel.app',
  port: 443,
  path: '/api/send-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('📧 Testing investment approval email...\n');
console.log('Sending to: test@grantunion.com');
console.log('Template: investment_approved\n');

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}\n`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      console.log('Response:', JSON.stringify(result, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ Email sent successfully!');
      } else {
        console.log('\n❌ Email failed to send');
      }
    } catch (e) {
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(data);
req.end();
