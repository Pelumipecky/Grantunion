#!/usr/bin/env node

/**
 * Generate Third-Party Beneficiary Withdrawal Authorization Form PDF
 * and send via email with Grant Union branding
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// PDF Generation using pdfkit
const PDFDocument = require('pdfkit');

// Mailjet credentials
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || 'grantunion583@gmail.com';
const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || 'Grant Union Investment';

// Target email
const RECIPIENT_EMAIL = 'Pelumipecky@gmail.com';

// Generate PDF
function generateWithdrawalFormPDF() {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const pdfPath = path.join(__dirname, 'withdrawal-authorization-form.pdf');
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // Colors matching Grant Union theme
      const primaryColor = '#1C0F36';
      const accentColor = '#FF8C37';
      const textColor = '#333333';
      const lightGray = '#666666';

      // HEADER
      doc.fontSize(24)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('GRANT UNION INVESTMENT', { align: 'center' });

      doc.fontSize(11)
         .fillColor(accentColor)
         .font('Helvetica')
         .text('Private Wealth & Digital Asset Brokerage', { align: 'center' });

      doc.moveDown(1);

      // Title
      doc.fontSize(16)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('THIRD-PARTY BENEFICIARY WITHDRAWAL', { align: 'center' });
      
      doc.fontSize(16)
         .text('AUTHORIZATION FORM', { align: 'center' });

      doc.moveDown(0.5);

      // Date field
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica')
         .text('Date: ___________________________', { align: 'left' });

      doc.moveDown(1);

      // Introduction paragraph
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica')
         .text(
           'I, the undersigned beneficiary, hereby authorize Grant Union Investment ("the Firm"), acting through its licensed broker, to process a withdrawal from an investment account held by Austin Stan (the "Account Holder") and disburse the funds directly to my verified bank account as detailed below. This request is made with the full knowledge and consent of the Account Holder, who has separately authorized this transaction in writing.',
           { align: 'justify', lineGap: 4 }
         );

      doc.moveDown(1.5);

      // BENEFICIARY INFORMATION Section
      doc.fontSize(12)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('BENEFICIARY INFORMATION');

      doc.moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .strokeColor(accentColor)
         .lineWidth(2)
         .stroke();

      doc.moveDown(0.5);

      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica');

      const beneficiaryFields = [
        'Full Legal Name: _________________________________________________________________',
        'Current Residential Address: _______________________________________________________',
        '________________________________________________________________________________',
        'City, State, ZIP Code: ______________________________________________________________',
        'Phone Number: ____________________________________________________________________',
        'Email Address: ____________________________________________________________________'
      ];

      beneficiaryFields.forEach(field => {
        doc.text(field, { lineGap: 6 });
      });

      doc.moveDown(1.5);

      // BANKING DETAILS Section
      doc.fontSize(12)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('BANKING DETAILS FOR WIRE TRANSFER');

      doc.moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .strokeColor(accentColor)
         .lineWidth(2)
         .stroke();

      doc.moveDown(0.5);

      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica');

      const bankingFields = [
        'Bank Name: ______________________________________________________________________',
        'Account Holder Name: _____________________________________________________________',
        'Bank Account Number: _____________________________________________________________',
        'Routing Number (ABA): ____________________________________________________________',
        'Account Type:    ☐ Checking    ☐ Savings'
      ];

      bankingFields.forEach(field => {
        doc.text(field, { lineGap: 6 });
      });

      doc.moveDown(0.8);

      // Important Note
      doc.fontSize(8)
         .fillColor(lightGray)
         .font('Helvetica-Oblique')
         .text(
           'Important Note: Funds will ONLY be sent to the account listed above. Any discrepancy may cause delays or rejection. Do not share this form publicly.',
           { align: 'left', lineGap: 2 }
         );

      doc.moveDown(1.5);

      // WITHDRAWAL DETAILS Section
      doc.fontSize(12)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('WITHDRAWAL DETAILS');

      doc.moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .strokeColor(accentColor)
         .lineWidth(2)
         .stroke();

      doc.moveDown(0.5);

      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica-Bold');

      const withdrawalDetails = [
        { label: 'Account Holder:', value: 'Austin Richard' },
        { label: 'Withdrawal Amount:', value: '$184,792.78' },
        { label: 'Processing Fee:', value: '$9,793.02 (paid separately by Account Holder)' },
        { label: 'Expected Disbursement:', value: 'Within 3 business days of full authorization' }
      ];

      withdrawalDetails.forEach(detail => {
        doc.font('Helvetica-Bold').text(detail.label, { continued: true });
        doc.font('Helvetica').text(' ' + detail.value, { lineGap: 4 });
      });

      doc.moveDown(1.5);

      // ACKNOWLEDGEMENT & CONSENT Section
      doc.fontSize(12)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('ACKNOWLEDGEMENT & CONSENT');

      doc.moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .strokeColor(accentColor)
         .lineWidth(2)
         .stroke();

      doc.moveDown(0.5);

      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica');

      const acknowledgements = [
        'I confirm that all information provided above is accurate and complete.',
        'I understand that this withdrawal is subject to approval by Grant Union Investment.',
        'I authorize Grant Union Investment to conduct identity verification and bank account verification.',
        'I waive any liability for delays or failures resulting from incorrect information provided by me.'
      ];

      acknowledgements.forEach(ack => {
        doc.text('• ' + ack, { indent: 10, lineGap: 4 });
      });

      doc.moveDown(2);

      // Signature Section
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica');

      doc.text('Beneficiary Signature: _________________________________________   Date: ___________');
      doc.moveDown(0.8);
      doc.text('Printed Name: ___________________________________________________________________');

      doc.moveDown(2);

      // FOR OFFICE USE ONLY Section
      doc.fontSize(11)
         .fillColor(lightGray)
         .font('Helvetica-Bold')
         .text('FOR OFFICE USE ONLY');

      doc.moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .strokeColor(lightGray)
         .lineWidth(1)
         .stroke();

      doc.moveDown(0.3);

      doc.fontSize(9)
         .fillColor(lightGray)
         .font('Helvetica');

      const officeFields = [
        'Authorized Broker: _______________________________________________',
        'Broker License #: ________________________________________________',
        'Grant Union Investment – Compliance Verified:    ☐ Yes    ☐ No',
        'Date Processed: __________________________________________________'
      ];

      officeFields.forEach(field => {
        doc.text(field, { lineGap: 3 });
      });

      doc.moveDown(2);

      // Footer
      doc.fontSize(8)
         .fillColor(primaryColor)
         .font('Helvetica')
         .text(
           'Grant Union Investment | Licensed Private Brokerage | Confidential – For Internal Processing Only',
           { align: 'center' }
         );

      doc.end();

      stream.on('finish', () => {
        console.log('✅ PDF generated successfully:', pdfPath);
        resolve(pdfPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
}

// Create styled email HTML
function createEmailHTML(pdfUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdrawal Authorization Form</title>
    <style>
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            background-color: #0F0517;
            color: #FEF9FF;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .email-wrapper {
            background-color: #0F0517;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(180deg, #1C0F36 0%, #2A1548 50%, #1C0F36 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 12px 40px rgba(255, 140, 55, 0.2);
            border: 1px solid rgba(255, 140, 55, 0.15);
        }

        /* HEADER SECTION */
        .header {
            background: linear-gradient(120deg, #FF8C37 0%, #FF6B1A 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header-content {
            position: relative;
            z-index: 1;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0 0 15px 0;
            letter-spacing: 1px;
        }
        .logo-subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* CONTENT SECTION */
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            color: #FEF9FF;
            margin: 0 0 15px 0;
            font-weight: 600;
            text-align: center;
        }
        .greeting-highlight {
            color: #FF8C37;
        }
        .intro-text {
            font-size: 16px;
            color: #D4BFE0;
            margin: 0 0 30px 0;
            line-height: 1.8;
            text-align: center;
        }
        
        .info-box {
            background: rgba(255, 140, 55, 0.1);
            border-left: 4px solid #FF8C37;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
        }
        .info-box h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #FF8C37;
        }
        .info-box p {
            margin: 8px 0;
            font-size: 15px;
            color: #E8D9F0;
        }
        .info-item {
            margin: 10px 0;
        }
        .info-label {
            font-weight: 600;
            color: #FEF9FF;
        }

        /* BUTTON */
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(120deg, #FF8C37 0%, #FF6B1A 100%);
            color: #FFFFFF;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 8px 20px rgba(255, 140, 55, 0.3);
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(255, 140, 55, 0.4);
        }

        /* WARNING BOX */
        .warning-box {
            background: rgba(220, 18, 98, 0.1);
            border-left: 4px solid #DC1262;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .warning-box p {
            margin: 5px 0;
            font-size: 14px;
            color: #FFB3D5;
        }
        .warning-icon {
            font-size: 18px;
            margin-right: 8px;
        }

        /* FOOTER */
        .footer {
            background: #120524;
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(255, 140, 55, 0.2);
        }
        .footer-text {
            color: #B8A5D6;
            font-size: 13px;
            margin: 8px 0;
        }
        .footer-link {
            color: #FF8C37;
            text-decoration: none;
        }
        .footer-link:hover {
            text-decoration: underline;
        }

        /* RESPONSIVE */
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
            }
            .header {
                padding: 30px 20px;
            }
            .content {
                padding: 30px 20px;
            }
            .logo {
                font-size: 28px;
            }
            .greeting {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- HEADER -->
            <div class="header">
                <div class="header-content">
                    <h1 class="logo">GRANT UNION INVESTMENT</h1>
                    <p class="logo-subtitle">Private Wealth & Digital Asset Brokerage</p>
                </div>
            </div>

            <!-- CONTENT -->
            <div class="content">
                <h2 class="greeting">Withdrawal Authorization <span class="greeting-highlight">Form</span></h2>
                
                <p class="intro-text">
                    Your requested withdrawal authorization form is ready for review and completion.
                </p>

                <div class="info-box">
                    <h3>📄 Document Details</h3>
                    <div class="info-item">
                        <span class="info-label">Document Type:</span> Third-Party Beneficiary Withdrawal Authorization Form
                    </div>
                    <div class="info-item">
                        <span class="info-label">Account Holder:</span> Austin Richard
                    </div>
                    <div class="info-item">
                        <span class="info-label">Withdrawal Amount:</span> $184,792.78
                    </div>
                    <div class="info-item">
                        <span class="info-label">Processing Fee:</span> $9,793.02 (paid separately by Account Holder)
                    </div>
                    <div class="info-item">
                        <span class="info-label">Expected Disbursement:</span> Within 3 business days of full authorization
                    </div>
                </div>

                <div class="button-container">
                    <a href="cid:withdrawal-form-pdf" class="cta-button" download="Withdrawal-Authorization-Form.pdf">
                        📥 Download Authorization Form
                    </a>
                </div>

                <div class="warning-box">
                    <p><span class="warning-icon">⚠️</span> <strong>Important Instructions:</strong></p>
                    <p>• Review all information carefully before signing</p>
                    <p>• Ensure all banking details are accurate and complete</p>
                    <p>• This form requires original signatures - do not share publicly</p>
                    <p>• Return completed form to your authorized broker</p>
                </div>

                <p class="intro-text" style="margin-top: 30px;">
                    If you have any questions or need assistance, please contact your dedicated account manager.
                </p>
            </div>

            <!-- FOOTER -->
            <div class="footer">
                <p class="footer-text">
                    <strong>Grant Union Investment</strong><br>
                    Licensed Private Brokerage<br>
                    Confidential – For Internal Processing Only
                </p>
                <p class="footer-text">
                    Email: <a href="mailto:grantunion583@gmail.com" class="footer-link">grantunion583@gmail.com</a>
                </p>
                <p class="footer-text" style="margin-top: 20px; font-size: 11px; color: #8B7AA3;">
                    This email and any attachments are confidential and intended solely for the use of the individual to whom it is addressed.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Send email with PDF attachment via Mailjet
async function sendEmailWithPDF(pdfPath) {
  console.log('\n=== SENDING EMAIL WITH PDF ===\n');

  if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
    console.error('❌ Mailjet credentials not configured');
    return false;
  }

  try {
    // Read PDF file and convert to base64
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');

    const mailjetData = {
      Messages: [
        {
          From: {
            Email: MAILJET_FROM_EMAIL,
            Name: MAILJET_FROM_NAME
          },
          To: [
            {
              Email: RECIPIENT_EMAIL
            }
          ],
          Subject: 'Withdrawal Authorization Form - Grant Union Investment',
          HTMLPart: createEmailHTML(),
          Attachments: [
            {
              ContentType: 'application/pdf',
              Filename: 'Withdrawal-Authorization-Form.pdf',
              Base64Content: pdfBase64
            }
          ]
        }
      ]
    };

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + auth
      },
      body: JSON.stringify(mailjetData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ Mailjet API Error:');
      console.log('Status:', response.status);
      console.log('Error:', data.ErrorMessage || data.error || JSON.stringify(data, null, 2));
      return false;
    }

    console.log('✅ Email sent successfully!');
    console.log('Status:', response.status);
    console.log('Message ID:', data.Messages?.[0]?.To?.[0]?.MessageID);
    console.log('Recipient:', RECIPIENT_EMAIL);
    console.log('PDF Attached:', 'Withdrawal-Authorization-Form.pdf');
    return true;

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  try {
    console.log('\n🚀 Starting Withdrawal Authorization Form Generation...\n');
    
    // Generate PDF
    const pdfPath = await generateWithdrawalFormPDF();
    
    // Send email with PDF attachment
    const success = await sendEmailWithPDF(pdfPath);
    
    if (success) {
      console.log('\n✅ Process completed successfully!');
      console.log('📧 Email with PDF has been sent to:', RECIPIENT_EMAIL);
    } else {
      console.log('\n❌ Failed to send email');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
