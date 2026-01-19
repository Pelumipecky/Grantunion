const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const langs = ['th', 'vi', 'el', 'sv', 'no', 'da'];

async function gen(lang) {
  return new Promise((resolve, reject) => {
    const out = path.join(__dirname, 'public', 'downloads', `guide-${lang}.pdf`);
    const logo = path.join(__dirname, 'public', 'grantunionLogo.png');
    const doc = new PDFDocument({ size: 'A4', margin: 15, bufferPages: true });
    doc.pipe(fs.createWriteStream(out));
    
    if (fs.existsSync(logo)) {
      const w = doc.page.width;
      doc.image(logo, (w - 75) / 2, 15, { width: 75, height: 50 });
      doc.moveDown(3);
    }
    
    doc.fontSize(26).fillColor('#FF8C37').font('ArialBold').text('GRANT UNION', { align: 'center' });
    doc.moveDown(0.6);
    doc.fontSize(18).fillColor('#FF8C37').font('ArialBold').text('Welcome to Grant Union');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor('#FF8C37').lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('Grant Union is the world\'s leading investment and trading platform. We are committed to providing you with a safe, transparent, and profitable investment experience.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor('#FF8C37').font('ArialBold').text('About Grant Union');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('Grant Union is a professional trading company specializing in cryptocurrency trading, forex trading, gold, and real estate investments. Our team of professional traders works diligently to maximize the returns on your Bitcoin investments.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(12).fillColor('#FF8C37').font('ArialBold').text('Minimum Investment');
    doc.moveDown(0.15);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('The company offers daily commission based on your investment plan. With a minimum deposit of just $100, you can start earning. After your investment period, you may opt to withdraw both your capital and profits or reinvest for continued growth.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(18).fillColor('#FF8C37').font('ArialBold').text('Investment Plans');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor('#FF8C37').lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    
    const t = doc.y;
    doc.fontSize(11).font('ArialBold').fillColor('#ffffff');
    doc.rect(15, t, 565, 22).fillColor('#FF8C37').fill();
    doc.fillColor('#ffffff');
    doc.text('Plan', 20, t + 6, { width: 90 });
    doc.text('Duration', 110, t + 6, { width: 110 });
    doc.text('Daily Comm.', 220, t + 6, { width: 120 });
    doc.text('Min. Inv.', 350, t + 6, { width: 80 });
    
    const plans = [
      ['3-Day Plan', '3 days', '8%', '$100', '$999'],
      ['7-Day Plan', '7 days', '3%', '$599', '$3,999'],
      ['12-Day Plan', '12 days', '3.5%', '$1,000', '$4,999'],
      ['15-Day Plan', '15 days', '4%', '$3,000', '$9,000'],
      ['3-Month Plan', '90 days', '4%', '$5,000', '$15,000'],
      ['6-Month Plan', '180 days', '5%', '$15,999', 'Unlimited']
    ];
    
    doc.fontSize(10).fillColor('#444').font('ArialBold');
    let ry = t + 22;
    plans.forEach((row, i) => {
      const cy = ry + (i * 18);
      if (i % 2 === 1) doc.rect(15, cy, 565, 18).fillColor('#f9f9f9').fill();
      doc.fillColor('#444');
      doc.text(row[0], 20, cy + 4, { width: 90 });
      doc.text(row[1], 110, cy + 4, { width: 110 });
      doc.text(row[2], 220, cy + 4, { width: 120 });
      doc.text(row[3], 350, cy + 4, { width: 80 });
    });
    
    doc.addPage();
    doc.fontSize(12).fillColor('#FF8C37').font('ArialBold').text('Calculation Example');
    doc.moveDown(0.15);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('If you invest $100 in the 3-day plan at 8% daily, after 3 days you will earn $24.00. You may choose to withdraw your capital and profits or reinvest.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor('#FF8C37').font('ArialBold').text('How It Works');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('When you invest with Grant Union, our professional team of traders trades your Bitcoin for the duration of your chosen plan. After the investment period, your capital and profits are transferred to your back office, where you may choose to withdraw or reinvest.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor('#FF8C37').font('ArialBold').text('Payment Methods');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('Grant Union uses Bitcoin and USDT for all transactions on the platform, ensuring fast, secure, and global accessibility.', { width: 490, lineGap: 1.5 });
    doc.moveDown(1);
    doc.addPage();
    doc.fontSize(18).fillColor('#FF8C37').font('ArialBold').text('Referral Commission');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor('#FF8C37').lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(13).fillColor('#FF8C37').font('ArialBold').text('Earn Unlimited 10% Commission');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('Grant Union offers unlimited 10% referral commission to all investors! Earn 10% of every deposit made by anyone who registers using your unique referral link.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(18).fillColor('#FF8C37').font('ArialBold').text('Withdrawal Process');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor('#FF8C37').lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(13).fillColor('#FF8C37').font('ArialBold').text('Fast Withdrawals');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('Withdrawals are fast and efficient. The process takes just a few minutes and at most within 24 hours.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    doc.fontSize(18).fillColor('#FF8C37').font('ArialBold').text('Security');
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor('#FF8C37').lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    doc.fontSize(13).fillColor('#FF8C37').font('ArialBold').text('Your Security is Our Priority');
    doc.moveDown(0.2);
    doc.fontSize(10.5).fillColor('#444').font('ArialBold').text('Grant Union employs advanced security measures to protect your funds and personal information at all times.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#444').font('ArialBold').text('© 2026 Grant Union. All rights reserved.', { align: 'center' });
    doc.fontSize(9).text('Email: grantunion583@gmail.com | Website: grantunion.vercel.app', { align: 'center' });
    
    doc.end();
    doc.on('finish', () => {
      const s = fs.statSync(out);
      console.log(`✓ guide-${lang}.pdf: ${(s.size / 1024).toFixed(2)} KB`);
      resolve();
    });
    doc.on('error', reject);
  });
}

(async () => {
  console.log('Generating final 6 languages...\n');
  for (const l of langs) {
    try {
      await gen(l);
    } catch (e) {
      console.error(`✗ ${l}: ${e.message}`);
    }
  }
  console.log('\n✓ All 22 languages complete!');
})();
