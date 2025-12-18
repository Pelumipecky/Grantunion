// API endpoint for sending email notifications using Mailjet
// Mailjet is a reliable email service provider with good deliverability

import { supabase } from '../../database/supabaseConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Special test endpoint for withdrawal debugging
  if (req.body.testWithdrawal) {
    console.log('🧪 Testing withdrawal creation...');
    try {
      const testData = {
        idnum: 36720209,
        amount: 100,
        status: 'pending',
        paymentoption: 'Bitcoin',
        wallet_address: 'bc1qtest123456789'
      };

      console.log('🧪 Test data:', testData);

      const { data, error } = await supabase
        .from('withdrawals')
        .insert([testData])
        .select()
        .single();

      console.log('🧪 Test result - data:', data, 'error:', error);

      return res.status(200).json({
        success: !error,
        data,
        error,
        message: 'Withdrawal test completed'
      });
    } catch (err) {
      console.error('🧪 Test error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const { to, subject, message, type } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, message' });
    }

    // Get Mailjet credentials from environment variables
    const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
    const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
    const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || 'noreply@grantunioninvestment.com';
    const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || 'Grant Union Investment';

    if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
      console.warn('Mailjet credentials not configured, falling back to logging only');
      console.log('📧 Email Notification (not sent - Mailjet not configured):', {
        to,
        subject,
        message,
        type,
        timestamp: new Date().toISOString()
      });
      return res.status(200).json({
        success: true,
        message: 'Email logged (Mailjet not configured)',
        warning: 'Configure MAILJET_API_KEY and MAILJET_API_SECRET to send real emails'
      });
    }

    // Prepare Mailjet API request
    const mailjetData = {
      Messages: [
        {
          From: {
            Email: MAILJET_FROM_EMAIL,
            Name: MAILJET_FROM_NAME
          },
          To: [
            {
              Email: to
            }
          ],
          Subject: subject,
          HTMLPart: message,
          CustomID: type || 'grant-union-notification'
        }
      ]
    };

    // Send email via Mailjet API
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64')
      },
      body: JSON.stringify(mailjetData)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Mailjet API error:', responseData);
      throw new Error(`Mailjet API error: ${response.status} - ${responseData.ErrorMessage || 'Unknown error'}`);
    }

    console.log('📧 Email sent successfully via Mailjet:', {
      to,
      subject,
      messageId: responseData.Messages?.[0]?.To?.[0]?.MessageID,
      type,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully via Mailjet',
      messageId: responseData.Messages?.[0]?.To?.[0]?.MessageID
    });

  } catch (error) {
    console.error('Email notification error:', error);
    res.status(500).json({
      error: 'Failed to send email notification',
      details: error.message
    });
  }
}