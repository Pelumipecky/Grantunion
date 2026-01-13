#!/usr/bin/env node

/**
 * Test email notifications on the deployed website
 */

require('dotenv').config({ path: '.env.local' });

const WEBSITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://grantunion.vercel.app';
const TEST_EMAIL = 'pelumipecky@gmail.com';

async function testWebsiteEmailNotifications() {
  console.log('\n=== TESTING WEBSITE EMAIL NOTIFICATIONS ===\n');
  console.log('Website URL:', WEBSITE_URL);
  console.log('Test Email:', TEST_EMAIL);
  console.log('');

  try {
    // Test 1: Simple notification email
    console.log('📧 Test 1: Sending simple notification email...');
    const response1 = await fetch(`${WEBSITE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: TEST_EMAIL,
        subject: 'Test Email Notification - Grant Union',
        type: 'test',
        message: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1C0F36;">Email Notification Test</h2>
            <p>This is a test email from your Grant Union Investment website.</p>
            <p><strong>Status:</strong> ✅ Email system is working correctly!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
        `
      })
    });

    const result1 = await response1.json();
    
    if (response1.ok && result1.success) {
      console.log('✅ Test 1 PASSED:', result1.message);
      if (result1.messageId) {
        console.log('   Message ID:', result1.messageId);
      }
    } else {
      console.log('❌ Test 1 FAILED:', result1.error || result1.message);
      if (result1.warning) {
        console.log('   Warning:', result1.warning);
      }
    }

    console.log('');

    // Test 2: Investment notification template
    console.log('📧 Test 2: Sending investment notification email...');
    const response2 = await fetch(`${WEBSITE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: TEST_EMAIL,
        subject: 'Investment Update - Test Notification',
        type: 'investment',
        templateType: 'investment',
        templateData: {
          userName: 'Test User',
          planName: '14-Day Plan',
          amount: 5000,
          dailyROI: 150,
          status: 'active'
        }
      })
    });

    const result2 = await response2.json();
    
    if (response2.ok && result2.success) {
      console.log('✅ Test 2 PASSED:', result2.message);
      if (result2.messageId) {
        console.log('   Message ID:', result2.messageId);
      }
    } else {
      console.log('❌ Test 2 FAILED:', result2.error || result2.message);
    }

    console.log('');

    // Summary
    console.log('=== TEST SUMMARY ===\n');
    if (response1.ok && response2.ok) {
      console.log('✅ All tests passed!');
      console.log('✅ Email notifications are working on the website');
      console.log('');
      console.log('Check your inbox:', TEST_EMAIL);
      console.log('');
    } else {
      console.log('⚠️  Some tests failed');
      console.log('');
      console.log('Possible issues:');
      console.log('1. Website might not be deployed yet');
      console.log('2. Environment variables not set on Vercel');
      console.log('3. API route might not be accessible');
      console.log('');
      console.log('To fix:');
      console.log('1. Deploy your code to Vercel');
      console.log('2. Add environment variables to Vercel:');
      console.log('   - MAILJET_API_KEY');
      console.log('   - MAILJET_API_SECRET');
      console.log('   - MAILJET_FROM_EMAIL');
      console.log('   - MAILJET_FROM_NAME');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error testing email notifications:', error.message);
    console.log('');
    console.log('This might mean:');
    console.log('1. Website is not accessible at:', WEBSITE_URL);
    console.log('2. Network connection issue');
    console.log('3. API endpoint does not exist');
  }
}

testWebsiteEmailNotifications();
