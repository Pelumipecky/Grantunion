#!/usr/bin/env node

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-zh.pdf');
const logoPath = path.join(__dirname, 'public', 'grantunionLogo.png');

const doc = new PDFDocument({
  size: 'A4',
  margin: 15,
  bufferPages: true
});

doc.pipe(fs.createWriteStream(outputPath));

// Register Arial fonts for better Unicode support across all languages
const arialPath = 'C:\\Windows\\Fonts\\arial.ttf';
const arialBoldPath = 'C:\\Windows\\Fonts\\arialbd.ttf';
doc.registerFont('Arial', arialPath);
doc.registerFont('ArialBold', arialBoldPath);

const primaryOrange = '#FF8C37';
const lightText = '#444';
const white = '#ffffff';

function addHeading1(text) {
  doc.fontSize(18).fillColor(primaryOrange).font('ArialBold').text(text);
  doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primaryOrange).lineWidth(2.5).stroke();
  doc.moveDown(0.35);
}

function addHeading2(text) {
  doc.fontSize(13).fillColor(primaryOrange).font('ArialBold').text(text);
  doc.moveDown(0.2);
}

function addHeading3(text) {
  doc.fontSize(12).fillColor(primaryOrange).font('ArialBold').text(text);
  doc.moveDown(0.15);
}

function addParagraph(text) {
  doc.fontSize(10.5).fillColor(lightText).font('ArialBold').text(text, { width: 490, lineGap: 1.5 });
  doc.moveDown(0.25);
}

function addBulletPoint(text) {
  doc.fontSize(10.5).fillColor(lightText).font('ArialBold').text('• ' + text, { width: 480, lineGap: 1.2 });
  doc.moveDown(0.2);
}

if (fs.existsSync(logoPath)) {
  const pageWidth = doc.page.width;
  const logoWidth = 75;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.image(logoPath, logoX, 15, { width: 75, height: 50 });
  doc.moveDown(3);
}

doc.fontSize(26).fillColor(primaryOrange).font('ArialBold').text('GRANT UNION', { align: 'center' });
doc.moveDown(0.6);

addHeading1('Welcome to Grant Union');
addParagraph('Welcome to Grant Union, the world\'s leading investment and trading platform. We are committed to providing you with a safe, transparent, and profitable investment experience.');

addHeading2('About Grant Union');
addParagraph('Grant Union is a professional trading company specializing in cryptocurrency trading, forex trading, gold, and real estate investments. Our team of professional traders works diligently to maximize the returns on your Bitcoin investments.');

addHeading3('Minimum Investment');
addParagraph('The company offers daily commission based on your investment plan. With a minimum deposit of just $100, you can start earning. After your investment period, you may opt to withdraw both your capital and profits or reinvest for continued growth.');

addHeading1('Investment Plans and Returns');
addParagraph('Our Investment Plans:');

const tableTop = doc.y;
const col1 = 20;
const col2 = 110;
const col3 = 220;
const col4 = 350;

doc.fontSize(11).font('ArialBold').fillColor(white);
doc.rect(15, tableTop, 565, 22).fillColor(primaryOrange).fill();
doc.fillColor(white);
doc.text('Plan', col1, tableTop + 6, { width: 90 });
doc.text('Duration', col2, tableTop + 6, { width: 110 });
doc.text('Daily Commission', col3, tableTop + 6, { width: 100 });
doc.text('Min. Deposit', col4, tableTop + 6, { width: 85 });
doc.text('Max. Deposit', 430, tableTop + 6, { width: 85 });

const rows = [
  ['3-Day Plan', '3 days', '8%', '$100', '$999'],
  ['7-Day Plan', '7 days', '3%', '$599', '$3,999'],
  ['12-Day Plan', '12 days', '3.5%', '$1,000', '$4,999'],
  ['15-Day Plan', '15 days', '4%', '$3,000', '$9,000'],
  ['3-Month Plan', '90 days', '4%', '$5,000', '$15,000'],
  ['6-Month Plan', '180 days', '5%', '$15,999', 'Unlimited']
];

doc.fontSize(10).fillColor(lightText).font('ArialBold');
let rowY = tableTop + 22;
rows.forEach((row, idx) => {
  const currentRowY = rowY + (idx * 18);
  if (idx % 2 === 1) {
    doc.rect(15, currentRowY, 565, 18).fillColor('#f9f9f9').fill();
  }
  doc.fillColor(lightText);
  doc.text(row[0], col1, currentRowY + 4, { width: 90 });
  doc.text(row[1], col2, currentRowY + 4, { width: 110 });
  doc.text(row[2], col3, currentRowY + 4, { width: 100 });
  doc.text(row[3], col4, currentRowY + 4, { width: 85 });
  doc.text(row[4], 430, currentRowY + 4, { width: 85 });
});

doc.addPage();

addHeading3('Calculation Example');
addParagraph('If you invest $100 in the 3-day plan at 8% daily, after 3 days you will earn $24.00. You may choose to withdraw your capital and profits or reinvest.');

doc.moveDown(0.3);

addHeading2('How It Works');
addParagraph('When you invest with Grant Union, our professional team of traders trades your Bitcoin for the duration of your chosen plan (e.g., 3 days). After the investment period, your capital and profits are transferred to your back office, where you may choose to withdraw or reinvest.');

doc.moveDown(0.3);

addHeading2('Payment Methods');
addParagraph('Grant Union uses Bitcoin and USDT for all transactions on the platform, ensuring fast, secure, and global accessibility.');

doc.moveDown(1);

doc.addPage();

addHeading1('Referral Commission');

addHeading2('Earn Unlimited 10% Commission');
addParagraph('Grant Union offers unlimited 10% referral commission to all investors! Earn 10% of every deposit made by anyone who registers using your unique referral link.');

addHeading2('How It Works');
addParagraph('When you invest with Grant Union, our professional team of traders trades your Bitcoin for the duration of your chosen plan (e.g., 3 days). After the investment period, your capital and profits are transferred to your back office, where you may choose to withdraw or reinvest.');

addHeading1('Withdrawal Process');

addHeading2('Fast and Efficient Withdrawals');
addParagraph('Withdrawals are fast and efficient. The process takes just a few minutes and at most within 24 hours.');

addHeading2('Withdrawal Steps');
addBulletPoint('Log in to your Grant Union account');
addBulletPoint('Navigate to the Withdrawal section');
addBulletPoint('Select your withdrawal amount');
addBulletPoint('Choose your payment method (Bitcoin or USDT)');
addBulletPoint('Enter your wallet address');
addBulletPoint('Submit your withdrawal request');
addBulletPoint('Funds are transferred within minutes');

addHeading2('Available Methods');
addBulletPoint('Bitcoin: Safe and fast cryptocurrency transfers');
addBulletPoint('USDT: Stablecoin transfers with stable value');

addHeading3('Easy Access to Your Funds');
addParagraph('Whether you want to withdraw your capital after your investment period ends or take your daily commissions, Grant Union makes it fast and convenient.');

addHeading1('Security and Protection');

addHeading2('Our Commitment to Your Security');
addParagraph('Grant Union is committed to maintaining the highest security standards and protecting your investment.');

addHeading2('Security Features');
addBulletPoint('Industry-level encryption for all data transmission');
addBulletPoint('Secure cloud infrastructure');
addBulletPoint('Regular security audits and compliance checks');
addBulletPoint('Professional trading team monitoring your investments');
addBulletPoint('Transparent transaction history and reports');

addHeading2('Protecting Your Account');
addBulletPoint('Use a strong and unique password for your account');
addBulletPoint('Never share your login credentials with anyone');
addBulletPoint('Keep your email address safe and monitored');
addBulletPoint('Enable email notifications for all transactions');
addBulletPoint('Report any suspicious activity immediately');

addHeading3('Your Security Is Our Priority');
addParagraph('Grant Union employs advanced security measures to protect your funds and personal information at all times.');

doc.addPage();

addHeading1('Frequently Asked Questions');

const faqs = [
  {
    question: 'What is the minimum investment amount?',
    answer: 'The minimum investment is just $100. You can start small and grow your investment over time.'
  },
  {
    question: 'How often are commissions credited?',
    answer: 'Daily commissions are credited to your account every 24 hours according to your chosen investment plan. You can see your earnings in real-time on your dashboard.'
  },
  {
    question: 'Can I withdraw before my investment period ends?',
    answer: 'You can withdraw your daily commissions anytime. Your capital remains locked until the investment period is completed as described in your plan.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'Grant Union accepts Bitcoin and USDT for all transactions, ensuring fast, secure, and global access.'
  },
  {
    question: 'How much can I earn from referrals?',
    answer: 'There is no limit on referral earnings. Earn 10% of every deposit made by anyone who registers using your referral link. The more you refer, the more you earn.'
  },
  {
    question: 'How long does withdrawal take?',
    answer: 'Withdrawals are processed within minutes. Bitcoin and USDT transfers are usually confirmed on the blockchain within 24 hours.'
  },
  {
    question: 'Is my investment safe?',
    answer: 'Yes. Grant Union uses industry-level security measures and our professional trading team ensures your funds are managed with care and expertise.'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('Q: ' + faq.question, { width: 480 });
  doc.fontSize(11).fillColor(lightText).font('ArialBold').text('A: ' + faq.answer, { width: 480, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

addHeading1('Contact and Support');
addParagraph('Contact our dedicated support team for any questions or assistance:');

addBulletPoint('Email: grantunion583@gmail.com');
addBulletPoint('Website: grantunion.vercel.app');
addBulletPoint('Response Time: Within 24 hours');
addBulletPoint('Hours: Support Available 24/7');

addHeading3('Need Help?');
addParagraph('Our professional support team is available 24 hours to help you with any questions, account issues, or trading inquiries. Contact us anytime at grantunion583@gmail.com!');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. All rights reserved.', { align: 'center' });
doc.fontSize(9).text('Professional Trading | Cryptocurrencies | Forex | Gold | Real Estate', { align: 'center' });
doc.text('This document is for informational purposes only.', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ PDF guide created successfully!`);
  console.log(`✓ File: ${outputPath}`);
  console.log(`✓ Size: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ Error generating PDF:', err.message);
  process.exit(1);
});
