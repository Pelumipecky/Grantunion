// Server-side EmailService using Mailjet Transactional API
// Uses native fetch (available in Node 18+ and Vercel)

const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || 'no-reply@grantunion.online';
const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || 'Grant Union Investment';

if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
  console.warn('Mailjet credentials not configured in EmailService');
}

async function sendTransactionalEmail({ to, subject, htmlBody, textBody }) {
  if (!to) {
    const err = new Error('Email recipient (to) is required');
    console.error('EmailService error:', err.message);
    throw err;
  }

  if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
    const err = new Error('Mailjet not configured');
    console.error('EmailService error:', err.message);
    throw err;
  }

  console.log(`📨 Sending email to: ${to}, subject: ${subject}`);

  const payload = {
    Messages: [
      {
        From: {
          Email: MAILJET_FROM_EMAIL,
          Name: MAILJET_FROM_NAME
        },
        To: [
          {
            Email: to,
          }
        ],
        Subject: subject,
        TextPart: textBody || `You have a new message from ${MAILJET_FROM_NAME}`,
        HTMLPart: htmlBody || `<p>${textBody || 'Message'}</p>`
      }
    ]
  };

  const resp = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64')
    },
    body: JSON.stringify(payload)
  });

  const result = await resp.json();
  if (!resp.ok) {
    const err = new Error('Mailjet API error');
    err.details = result;
    console.error('EmailService Mailjet error:', result);
    throw err;
  }

  console.log(`✅ Email sent successfully to ${to}`);
  return result;
}

export { sendTransactionalEmail };
