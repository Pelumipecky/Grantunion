#!/usr/bin/env node
const PDFDocument = require('pdfkit'), fs = require('fs'), path = require('path');
const langs = {
  'tr': 'Turkish', 'hi': 'Hindi', 'id': 'Indonesian', 'th': 'Thai', 'vi': 'Vietnamese', 
  'el': 'Greek', 'sv': 'Swedish', 'no': 'Norwegian', 'da': 'Danish', 'pl': 'Polish'
};
const basePath = path.join(__dirname, 'public', 'downloads');
const logoPath = path.join(__dirname, 'public', 'grantunionLogo.png');
const primary = '#FF8C37', light = '#444', white = '#ffffff';

async function gen(code) {
  return new Promise((res, rej) => {
    const out = path.join(basePath, `guide-${code}.pdf`);
    const doc = new PDFDocument({size: 'A4', margin: 15, bufferPages: true});
    doc.pipe(fs.createWriteStream(out));
    
    if (fs.existsSync(logoPath)) {
      const w = doc.page.width, lw = 75, lx = (w - lw) / 2;
      doc.image(logoPath, lx, 15, { width: 75, height: 50 });
      doc.moveDown(3);
    }
    
    doc.fontSize(26).fillColor(primary).font('ArialBold').text('GRANT UNION', { align: 'center' });
    doc.moveDown(0.6);
    doc.fontSize(18).fillColor(primary).font('ArialBold').text('Welcome to Grant Union');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primary).lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('Grant Union is the world\'s leading investment and trading platform. We are committed to providing you with a safe, transparent, and profitable investment experience.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('About Grant Union');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('Grant Union is a professional trading company specializing in cryptocurrency trading, forex trading, gold, and real estate investments. Our team of professional traders works diligently to maximize the returns on your Bitcoin investments.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(12).fillColor(primary).font('ArialBold').text('Minimum Investment');
    doc.moveDown(0.15);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('The company offers daily commission based on your investment plan. With a minimum deposit of just $100, you can start earning. After your investment period, you may opt to withdraw both your capital and profits or reinvest for continued growth.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(18).fillColor(primary).font('ArialBold').text('Investment Plans and Returns');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primary).lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('Our Investment Plans:', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    
    const tt = doc.y, c1 = 20, c2 = 110, c3 = 220, c4 = 350;
    doc.fontSize(11).font('ArialBold').fillColor(white);
    doc.rect(15, tt, 565, 22).fillColor(primary).fill();
    doc.fillColor(white);
    doc.text('Plan', c1, tt + 6, { width: 90 });
    doc.text('Duration', c2, tt + 6, { width: 110 });
    doc.text('Daily Comm.', c3, tt + 6, { width: 120 });
    doc.text('Min. Inv.', c4, tt + 6, { width: 80 });
    
    const rows = [['3-Day Plan', '3 days', '8%', '$100', '$999'], ['7-Day Plan', '7 days', '3%', '$599', '$3,999'], ['12-Day Plan', '12 days', '3.5%', '$1,000', '$4,999'], ['15-Day Plan', '15 days', '4%', '$3,000', '$9,000'], ['3-Month Plan', '90 days', '4%', '$5,000', '$15,000'], ['6-Month Plan', '180 days', '5%', '$15,999', 'Unlimited']];
    doc.fontSize(10).fillColor(light).font('ArialBold');
    let ry = tt + 22;
    rows.forEach((row, i) => {const cy = ry + (i * 18);if (i % 2 === 1) {doc.rect(15, cy, 565, 18).fillColor('#f9f9f9').fill();}doc.fillColor(light);doc.text(row[0], c1, cy + 4, { width: 90 });doc.text(row[1], c2, cy + 4, { width: 110 });doc.text(row[2], c3, cy + 4, { width: 120 });doc.text(row[3], c4, cy + 4, { width: 80 });doc.text(row[4], 430, cy + 4, { width: 85 });});
    
    doc.addPage();
    doc.fontSize(12).fillColor(primary).font('ArialBold').text('Calculation Example');
    doc.moveDown(0.15);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('If you invest $100 in the 3-day plan at 8% daily, after 3 days you will earn $24.00. You may choose to withdraw your capital and profits or reinvest.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('How It Works');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('When you invest with Grant Union, our professional team of traders trades your Bitcoin for the duration of your chosen plan. After the investment period, your capital and profits are transferred to your back office, where you may choose to withdraw or reinvest.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('Payment Methods');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('Grant Union uses Bitcoin and USDT for all transactions on the platform, ensuring fast, secure, and global accessibility.', { width: 490, lineGap: 1.5 });
    doc.moveDown(1);
    
    doc.addPage();
    doc.fontSize(18).fillColor(primary).font('ArialBold').text('Referral Commission');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primary).lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('Earn Unlimited 10% Commission');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('Grant Union offers unlimited 10% referral commission to all investors! Earn 10% of every deposit made by anyone who registers using your unique referral link.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('How It Works');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('When you invest with Grant Union, our professional team of traders trades your Bitcoin for the duration of your chosen plan. After the investment period, your capital and profits are transferred to your back office, where you may choose to withdraw or reinvest.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    
    doc.fontSize(18).fillColor(primary).font('ArialBold').text('Withdrawal Process');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primary).lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('Fast and Efficient Withdrawals');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('Withdrawals are fast and efficient. The process takes just a few minutes and at most within 24 hours.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('Withdrawal Steps');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('• Log in to your Grant Union account\n• Navigate to the Withdrawal section\n• Select your withdrawal amount\n• Choose your payment method (Bitcoin or USDT)\n• Enter your wallet address\n• Submit your withdrawal request\n• Funds are transferred within minutes', { width: 480, lineGap: 1.2 });
    doc.moveDown(0.25);
    
    doc.fontSize(18).fillColor(primary).font('ArialBold').text('Security and Protection');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primary).lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(13).fillColor(primary).font('ArialBold').text('Our Commitment to Your Security');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor(light).font('ArialBold').text('Grant Union is committed to maintaining the highest security standards and protecting your investment.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(10).fillColor(light).font('ArialBold').text('© 2026 Grant Union. All rights reserved.\nProfessional Trading | Cryptocurrencies | Forex | Gold | Real Estate\nThis document is for informational purposes only.', { align: 'center' });
    
    doc.end();
    doc.on('finish', () => {const s = fs.statSync(out);console.log(`✓ guide-${code}.pdf: ${(s.size / 1024).toFixed(2)} KB`);res();});
    doc.on('error', rej);
  });
}

async function all() {
  const codes = Object.keys(langs);
  console.log(`Generating ${codes.length} language PDFs...\n`);
  for (const code of codes) {
    try { await gen(code); }
    catch (e) { console.error(`✗ ${code}: ${e.message}`); }
  }
  console.log(`\n✓ Complete! All language PDFs generated.`);
}

all();
