# 💻 Email Integration Code Examples

## Complete Implementation Examples

### Example 1: Send ROI Daily Credit Email
**Location**: `scripts/update-daily-roi.js` (Already Integrated)

```javascript
// When crediting daily ROI
async function sendDailyROIEmail(userEmail, userName, investmentData) {
  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: `Daily ROI Credit - $${investmentData.dailyROI.toFixed(2)} Earned`,
        type: 'roi_daily_credit',
        templateData: {
          userName: userName,
          dailyROI: investmentData.dailyROI,
          totalROI: investmentData.totalROI,
          totalExpected: investmentData.totalExpected,
          plan: investmentData.plan,
          progress: (investmentData.totalROI / investmentData.totalExpected) * 100
        }
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log(`✅ ROI email sent to ${userEmail}`);
      return result.messageId;
    } else {
      console.error(`❌ Failed to send ROI email: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('Error sending ROI email:', error);
    return null;
  }
}

// Usage in update loop:
for (const investment of investments) {
  // ... ROI calculation ...
  
  // Send email
  const emailResult = await sendDailyROIEmail(
    userData.email,
    userData.name,
    {
      dailyROI: dailyAmount,
      totalROI: newCredited,
      totalExpected: totalExpectedROI,
      plan: investment.plan
    }
  );
}
```

---

### Example 2: Investment Approval Email
**Location**: `src/components/dashAdmin/InvestAdminSect.jsx`

```javascript
// When admin approves investment
async function sendInvestmentApprovalEmail(userData, investment, calculatedData) {
  try {
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userData.email,
        subject: `Investment Approved - ${investment.plan}`,
        type: 'investment_approval',
        templateData: {
          userName: userData.name || userData.email,
          plan: investment.plan,
          capital: investment.capital,
          roi: calculatedData.totalROI,
          bonus: calculatedData.bonus || 0,
          duration: calculatedData.durationLabel || '30 days'
        }
      })
    });

    const result = await emailResponse.json();
    if (result.success) {
      console.log('✅ Investment approval email sent');
      return true;
    } else {
      console.error('❌ Failed to send investment approval email');
      return false;
    }
  } catch (error) {
    console.error('Error sending investment approval email:', error);
    return false;
  }
}

// Usage in approve button:
const handleApproveInvestment = async (investment) => {
  try {
    // Approve in database
    const { error } = await supabase
      .from('investments')
      .update({ status: 'Active' })
      .eq('id', investment.id);

    if (!error) {
      // Get user data
      const { data: userData } = await supabase
        .from('userlogs')
        .select('email, name')
        .eq('idnum', investment.idnum)
        .single();

      // Send email
      await sendInvestmentApprovalEmail(userData, investment, {
        totalROI: investment.roi,
        bonus: investment.bonus,
        durationLabel: investment.plan
      });

      alert('Investment approved and email sent!');
    }
  } catch (err) {
    console.error('Error approving investment:', err);
  }
};
```

---

### Example 3: KYC Verification Email
**Location**: `src/components/dashAdmin/KycAdmin.jsx`

```javascript
// When admin updates KYC status
async function sendKYCVerificationEmail(userData, status) {
  try {
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userData.email,
        subject: `KYC Verification Status - ${status}`,
        type: 'kyc_verification',
        templateData: {
          userName: userData.name || userData.email,
          status: status  // 'Verified', 'Pending', 'Rejected'
        }
      })
    });

    const result = await emailResponse.json();
    if (result.success) {
      console.log('✅ KYC verification email sent');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending KYC email:', error);
    return false;
  }
}

// Usage in KYC approval:
const handleKYCStatusChange = async (kycRequest, newStatus) => {
  try {
    // Update KYC status
    const { error } = await supabase
      .from('kyc_requests')
      .update({ status: newStatus })
      .eq('id', kycRequest.id);

    if (!error) {
      // Get user data
      const { data: userData } = await supabase
        .from('userlogs')
        .select('email, name')
        .eq('idnum', kycRequest.idnum)
        .single();

      // Send KYC email
      await sendKYCVerificationEmail(userData, newStatus);

      alert(`KYC ${newStatus} - Email sent to user`);
    }
  } catch (err) {
    console.error('Error updating KYC:', err);
  }
};
```

---

### Example 4: Withdrawal Notification Email
**Location**: `src/components/dashboard/WithdrawSection.jsx` (or similar)

```javascript
// When withdrawal status changes
async function sendWithdrawalEmail(userEmail, userName, withdrawalData) {
  try {
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: `Withdrawal ${withdrawalData.status.toUpperCase()} - $${withdrawalData.amount}`,
        type: 'withdrawal_notification',
        templateData: {
          userName: userName,
          amount: withdrawalData.amount,
          status: withdrawalData.status,  // 'approved', 'pending', 'rejected'
          method: withdrawalData.method   // 'Bitcoin', 'Bank', etc.
        }
      })
    });

    const result = await emailResponse.json();
    return result.success;
  } catch (error) {
    console.error('Error sending withdrawal email:', error);
    return false;
  }
}

// Usage in withdrawal processing:
const handleWithdrawalUpdate = async (withdrawal, newStatus) => {
  try {
    // Update withdrawal status
    const { error } = await supabase
      .from('withdrawals')
      .update({ status: newStatus })
      .eq('id', withdrawal.id);

    if (!error) {
      // Get user data
      const { data: userData } = await supabase
        .from('userlogs')
        .select('email, name')
        .eq('idnum', withdrawal.idnum)
        .single();

      // Send withdrawal email
      await sendWithdrawalEmail(userData.email, userData.name, {
        amount: withdrawal.amount,
        status: newStatus,
        method: withdrawal.paymentoption
      });

      alert('Withdrawal updated - Email sent to user');
    }
  } catch (err) {
    console.error('Error updating withdrawal:', err);
  }
};
```

---

### Example 5: Password Reset Email
**Location**: `src/pages/forgot-password.jsx`

```javascript
// When user requests password reset
async function sendPasswordResetEmail(userEmail, userName, resetToken) {
  try {
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: 'Password Reset Request',
        type: 'password_reset',
        templateData: {
          userName: userName || 'User',
          resetLink: resetLink
        }
      })
    });

    const result = await emailResponse.json();
    return result.success;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

// Usage in forgot password form:
const handleForgotPassword = async (email) => {
  try {
    setIsLoading(true);

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('userlogs')
      .select('name, email')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      throw new Error('User not found');
    }

    // Generate reset token (you'd implement your token generation)
    const resetToken = generateSecureToken();

    // Store reset token in database
    await supabase
      .from('password_resets')
      .insert({
        email: email,
        token: resetToken,
        expires_at: new Date(Date.now() + 3600000) // 1 hour
      });

    // Send email
    const emailSent = await sendPasswordResetEmail(
      email,
      userData.name,
      resetToken
    );

    if (emailSent) {
      setSuccessMsg('Password reset link sent to your email!');
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error:', error);
    setErrMsg(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

### Example 6: Contact Form Email
**Location**: `src/pages/contact.jsx`

```javascript
// When contact form is submitted (to admin)
async function sendContactFormEmail(contactData) {
  try {
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'support@grantunioninvestment.com',  // Admin email
        subject: `New Contact Form Submission from ${contactData.name}`,
        type: 'contact_form',
        templateData: {
          senderName: contactData.name,
          senderEmail: contactData.email,
          senderPhone: contactData.phone,
          message: contactData.message,
          subject: contactData.subject
        }
      })
    });

    return await emailResponse.json();
  } catch (error) {
    console.error('Error sending contact email:', error);
    return { success: false, error: error.message };
  }
}
```

---

## Utility Function (Reusable)

```javascript
// utils/emailService.js - Create this file for reusability

export const emailService = {
  async sendEmail(to, subject, templateType, templateData) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          type: templateType,
          templateData
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Helper methods for each email type
  async sendROIEmail(email, name, roiData) {
    return this.sendEmail(
      email,
      `Daily ROI Credit - $${roiData.dailyROI.toFixed(2)}`,
      'roi_daily_credit',
      { userName: name, ...roiData }
    );
  },

  async sendInvestmentApprovalEmail(email, name, investmentData) {
    return this.sendEmail(
      email,
      `Investment Approved - ${investmentData.plan}`,
      'investment_approval',
      { userName: name, ...investmentData }
    );
  },

  async sendKYCEmail(email, name, status) {
    return this.sendEmail(
      email,
      `KYC Verification Status`,
      'kyc_verification',
      { userName: name, status }
    );
  },

  async sendWithdrawalEmail(email, name, withdrawalData) {
    return this.sendEmail(
      email,
      `Withdrawal ${withdrawalData.status.toUpperCase()}`,
      'withdrawal_notification',
      { userName: name, ...withdrawalData }
    );
  },

  async sendPasswordResetEmail(email, name, resetLink) {
    return this.sendEmail(
      email,
      'Password Reset Request',
      'password_reset',
      { userName: name, resetLink }
    );
  }
};

// Usage:
import { emailService } from '@/utils/emailService';

// In your code:
await emailService.sendROIEmail(userEmail, userName, {
  dailyROI: 50,
  totalROI: 150,
  totalExpected: 500,
  plan: '7-Day Plan',
  progress: 30
});
```

---

## Error Handling Best Practices

```javascript
// Wrap email sending in try-catch
async function sendEmailWithFallback(emailOptions) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailOptions),
      timeout: 10000  // 10 second timeout
    });

    const result = await response.json();

    if (result.success) {
      // Log successful send
      console.log(`✅ Email sent: ${result.messageId}`);
      
      // Store in database for audit trail
      await logEmailSent({
        messageId: result.messageId,
        to: emailOptions.to,
        type: emailOptions.type,
        timestamp: new Date()
      });

      return result;
    } else {
      // Handle email API error
      console.error(`❌ Email API error: ${result.error}`);
      
      // Could queue for retry, alert admin, etc.
      await handleEmailFailure(emailOptions);
      
      return result;
    }
  } catch (error) {
    // Handle network/timeout error
    console.error(`❌ Email network error: ${error.message}`);
    
    // Queue for retry
    await queueEmailForRetry(emailOptions);
    
    return { success: false, error: error.message };
  }
}
```

---

## Testing the Implementation

```javascript
// Test script - run in browser console or as Node script
async function testAllEmailTypes() {
  const testEmails = [
    {
      name: 'ROI Daily Credit',
      data: {
        to: 'test@example.com',
        subject: 'Test ROI Email',
        type: 'roi_daily_credit',
        templateData: {
          userName: 'Test User',
          dailyROI: 50,
          totalROI: 150,
          totalExpected: 500,
          plan: '7-Day Plan',
          progress: 30
        }
      }
    },
    {
      name: 'Investment Approval',
      data: {
        to: 'test@example.com',
        subject: 'Test Investment Email',
        type: 'investment_approval',
        templateData: {
          userName: 'Test User',
          plan: '15-Day Plan',
          capital: 5000,
          roi: 3000,
          bonus: 500,
          duration: '15 days'
        }
      }
    }
    // Add other templates...
  ];

  for (const emailTest of testEmails) {
    console.log(`Testing: ${emailTest.name}`);
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailTest.data)
    });
    const result = await response.json();
    console.log(result);
  }
}

// Run: testAllEmailTypes();
```

---

**Status**: ✅ Ready to Use  
**Last Updated**: December 21, 2025
