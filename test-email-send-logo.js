// Send test email with Grant Union branding
const fetch = require('node-fetch');

async function sendTestEmail() {
  try {
    console.log('🚀 Sending test email to pelumipecky@gmail.com...');
    console.log('📧 Using API: http://localhost:3001/api/send-email');
    
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'pelumipecky@gmail.com',
        subject: 'Test Email - Grant Union Investment Platform 🚀',
        type: 'investment_approval',
        templateData: {
          userName: 'Pelumi Pecky',
          plan: 'Premium Investment Plan',
          capital: 5000,
          roi: 250,
          bonus: 50,
          duration: '30 days'
        }
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Email sent successfully!');
      console.log('📨 To: pelumipecky@gmail.com');
      console.log('📋 Subject: Test Email - Grant Union Investment Platform 🚀');
      console.log('🎨 Template: investment_approval with Grant Union branding');
      console.log('✉️ Message ID:', data.messageId);
      console.log('\n🔍 Check pelumipecky@gmail.com for the email with:');
      console.log('  • 🚀 GRANT UNION logo');
      console.log('  • Professional purple and orange styling');
      console.log('  • Investment details in formatted box');
      console.log('  • Call-to-action button');
    } else {
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure the dev server is running on port 3001');
  }
}

sendTestEmail();
