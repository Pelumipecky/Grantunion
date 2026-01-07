// Test email script with Grant Union logo
// This script sends a test email to verify the email styling and logo display

const fetch = require('node-fetch');

async function sendTestEmail() {
    try {
        console.log('🚀 Starting test email send...');
        
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'pelumipecky@gmail.com',
                type: 'test_email',
                templateData: {
                    title: '🎉 Welcome to Grant Union Investment Platform',
                    subject: 'Test Email - Grant Union Investment Platform',
                    userName: 'Test User',
                    message: `
                        <p>This is a test email to verify the Grant Union branding and logo display.</p>
                        
                        <h2>Email Features:</h2>
                        <ul>
                            <li>✅ Professional logo with rocket emoji (🚀)</li>
                            <li>✅ "GRANT UNION" branding</li>
                            <li>✅ "Investment Platform" subtitle</li>
                            <li>✅ Purple and orange gradient styling</li>
                            <li>✅ Professional footer</li>
                        </ul>
                        
                        <p><strong>Email sent at:</strong> ${new Date().toLocaleString()}</p>
                        
                        <p>If you can see the professional branding above, the email styling is working correctly!</p>
                    `,
                    amount: null,
                    status: null
                }
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Email sent successfully!');
            console.log('📧 Response:', data);
        } else {
            console.log('❌ Error sending email:');
            console.log('Status:', response.status);
            console.log('Error:', data);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Make sure the dev server is running: npm run dev');
    }
}

sendTestEmail();
