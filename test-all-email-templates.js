#!/usr/bin/env node

/**
 * Test all email notification templates
 */

require('dotenv').config({ path: '.env.local' });

const WEBSITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://grantunion.vercel.app';
const TEST_EMAILS = ['pelumipecky@gmail.com'];

async function sendTestEmail(type, subject, templateData, email) {
  try {
    const response = await fetch(`${WEBSITE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: subject,
        type: type,
        templateData: templateData
      })
    });

    const result = await response.json();
    return { success: response.ok && result.success, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testAllEmailTemplates() {
  console.log('\n=== TESTING ALL EMAIL TEMPLATES ===\n');
  console.log('Website:', WEBSITE_URL);
  console.log('Recipients:', TEST_EMAILS.join(', '));
  console.log('');

  const tests = [
    {
      name: 'Welcome Email',
      type: 'welcome',
      subject: 'Welcome to Grant Union Investment',
      data: {
        userName: 'John Doe',
        email: TEST_EMAILS[0]
      }
    },
    {
      name: 'Investment Created',
      type: 'investment_created',
      subject: 'Investment Submitted Successfully',
      data: {
        userName: 'John Doe',
        plan: '14-Day Plan',
        amount: 5000,
        dailyROI: 150,
        duration: 14,
        expectedReturn: 2100,
        transactionHash: 'TXN123456789'
      }
    },
    {
      name: 'Investment Approved',
      type: 'investment_approved',
      subject: 'Investment Approved - Start Earning Now',
      data: {
        userName: 'John Doe',
        plan: '14-Day Plan',
        amount: 5000,
        dailyROI: 150,
        duration: 14
      }
    },
    {
      name: 'Withdrawal Requested',
      type: 'withdrawal_requested',
      subject: 'Withdrawal Request Received',
      data: {
        userName: 'John Doe',
        amount: 1000,
        method: 'Bitcoin',
        accountDetails: 'bc1q...'
      }
    },
    {
      name: 'Withdrawal Approved',
      type: 'withdrawal_approved',
      subject: 'Withdrawal Approved',
      data: {
        userName: 'John Doe',
        amount: 1000,
        method: 'Bitcoin'
      }
    },
    // {
    //   name: 'Deposit Confirmed',
    //   type: 'deposit_confirmed',
    //   subject: 'Deposit Confirmed',
    //   data: {
    //     userName: 'John Doe',
    //     amount: 5000,
    //     method: 'Bitcoin',
    //     transactionHash: 'TXN987654321',
    //     newBalance: 5000
    //   }
    // },
    {
      name: 'Daily ROI Credit',
      type: 'roi_daily_credit',
      subject: 'Daily ROI Credited - $150.00',
      data: {
        userName: 'John Doe',
        dailyROI: 150,
        totalROI: 900,
        totalExpected: 2100,
        plan: '14-Day Plan',
        progress: 42.86
      }
    },
    {
      name: 'KYC Approved',
      type: 'kyc_approved',
      subject: 'KYC Verification Approved',
      data: {
        userName: 'John Doe'
      }
    },
    {
      name: 'KYC Rejected',
      type: 'kyc_rejected',
      subject: 'KYC Verification Update',
      data: {
        userName: 'John Doe',
        reason: 'Document blurry'
      }
    },
    {
      name: 'Withdrawal Rejected',
      type: 'withdrawal_rejected',
      subject: 'Withdrawal Status Update',
      data: {
        userName: 'John Doe',
        amount: 1000,
        reason: 'Insufficient balance'
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`📧 Testing: ${test.name}...`);
    
    // Send to first email only to avoid spam
    const { success, result, error } = await sendTestEmail(
      test.type,
      test.subject,
      test.data,
      TEST_EMAILS[0]
    );

    if (success) {
      console.log(`   ✅ PASSED - Message ID: ${result.messageId || 'N/A'}`);
      passed++;
    } else {
      console.log(`   ❌ FAILED - ${result?.error || error || 'Unknown error'}`);
      failed++;
    }
    console.log('');

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('=== TEST SUMMARY ===\n');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  if (passed === tests.length) {
    console.log('🎉 All email templates are working perfectly!');
    console.log(`📧 Check ${TEST_EMAILS[0]} for all test emails`);
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.');
  }
  console.log('');
}

testAllEmailTemplates();
