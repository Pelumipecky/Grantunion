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

addHeading1('欢迎来到 Grant Union');
addParagraph('欢迎来到 Grant Union，全球领先的投资和交易平台。我们致力于为您提供安全、透明和盈利的投资体验。');

addHeading2('关于 Grant Union');
addParagraph('Grant Union 是一家专业交易公司，专门从事加密货币交易、外汇交易、黄金和房地产投资。我们的专业交易团队努力工作，以最大化您的比特币投资回报。');

addHeading3('最低投资额');
addParagraph('公司根据您的投资计划提供日常佣金。仅需最低入金 100 美元，您就可以开始获利。投资期结束后，您可以选择提取本金和利润，或继续投资以获得持续增长。');

addHeading1('投资计划和回报');
addParagraph('我们的投资计划：');

const tableTop = doc.y;
const col1 = 20;
const col2 = 110;
const col3 = 220;
const col4 = 330;
const col5 = 430;

doc.fontSize(11).font('ArialBold').fillColor(white);
doc.rect(15, tableTop, 565, 22).fillColor(primaryOrange).fill();
doc.fillColor(white);
doc.text('Plan', col1, tableTop + 6, { width: 90 });
doc.text('Duration', col2, tableTop + 6, { width: 110 });
doc.text('Daily Commission', col3, tableTop + 6, { width: 100 });
doc.text('Min. Deposit', col4, tableTop + 6, { width: 85 });
doc.text('Max. Deposit', col5, tableTop + 6, { width: 85 });

const rows = [
  ['3 天计划', '3 天', '8%', '$100', '$999'],
  ['7 天计划', '7 天', '3%', '$599', '$3,999'],
  ['12 天计划', '12 天', '3.5%', '$1,000', '$4,999'],
  ['15 天计划', '15 天', '4%', '$3,000', '$9,000'],
  ['3 个月计划', '90 天', '4%', '$5,000', '$15,000'],
  ['6 个月计划', '180 天', '5%', '$15,999', '无限制']
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
  doc.text(row[4], col5, currentRowY + 4, { width: 85 });
});

doc.addPage();

addHeading3('计算示例');
addParagraph('如果您在 3 天计划中投资 100 美元，日收益率为 8%，那么 3 天后您将获利 24 美元。您可以选择提取本金和利润，或继续投资。');

doc.moveDown(0.3);

addHeading2('工作原理');
addParagraph('当您在 Grant Union 投资时，我们专业的交易团队会在您选定的期间（如 3 天）交易您的比特币。在投资期结束后，您的本金和利润将转入您的后台账户，您可以选择提取或继续投资。');

doc.moveDown(0.3);

addHeading2('支付方式');
addParagraph('Grant Union 使用比特币和 USDT 进行平台上的所有交易，确保快速、安全和全球可达。');

doc.moveDown(1);

doc.addPage();

addHeading1('推荐佣金');

addHeading2('赚取无限的 10% 佣金');
addParagraph('Grant Union 向所有投资者提供无限的 10% 推荐佣金！通过您唯一的推荐链接注册的任何人所进行的每次存款的 10%。');

addHeading2('工作原理');
addParagraph('当您在 Grant Union 投资时，我们专业的交易团队会在您选定的期间交易您的比特币。在投资期结束后，您的本金和利润将转入您的后台账户，您可以选择提取或继续投资。');

addHeading1('提款流程');

addHeading2('快速和高效的提款');
addParagraph('提款快速有效。整个过程只需几分钟，最多 24 小时。');

addHeading2('提款步骤');
addBulletPoint('登录您的 Grant Union 账户');
addBulletPoint('导航到提款部分');
addBulletPoint('选择您的提款金额');
addBulletPoint('选择支付方式（比特币或 USDT）');
addBulletPoint('输入您的钱包地址');
addBulletPoint('提交您的提款请求');
addBulletPoint('资金在几分钟内转入');

addHeading2('可用方式');
addBulletPoint('比特币：安全快速的加密货币转账');
addBulletPoint('USDT：具有稳定价值的稳定币转账');

addHeading3('轻松访问您的资金');
addParagraph('无论您是想在投资期结束后提取本金，还是想获取每日佣金，Grant Union 都能快速便捷地完成。');

addHeading1('安全和保护');

addHeading2('我们对您安全的承诺');
addParagraph('Grant Union 致力于维护最高的安全标准并保护您的投资。');

addHeading2('安全功能');
addBulletPoint('所有数据传输的行业级加密');
addBulletPoint('安全的云基础设施');
addBulletPoint('定期安全审计和合规检查');
addBulletPoint('专业交易团队监控您的投资');
addBulletPoint('透明的交易历史和报告');

addHeading2('保护您的账户');
addBulletPoint('为您的账户使用强大和独特的密码');
addBulletPoint('永远不要与任何人分享您的登录凭据');
addBulletPoint('保持您的电子邮件地址安全和受监控');
addBulletPoint('为所有交易启用电子邮件通知');
addBulletPoint('立即报告任何可疑活动');

addHeading3('您的安全是我们的优先事项');
addParagraph('Grant Union 采用先进的安全措施，随时保护您的资金和个人信息。');

doc.addPage();

addHeading1('常见问题');

const faqs = [
  {
    question: '最低投资额是多少？',
    answer: '最低投资仅为 100 美元。您可以从小额开始，逐时增加投资。'
  },
  {
    question: '佣金多久计入一次？',
    answer: '每日佣金根据您选择的投资计划每 24 小时计入您的账户一次。您可以在仪表板上实时查看您的收益。'
  },
  {
    question: '我可以在投资期结束前提取吗？',
    answer: '您可以随时提取您的每日佣金。您的本金将被锁定，直到投资期完成，如您的计划中所述。'
  },
  {
    question: '接受哪些支付方式？',
    answer: 'Grant Union 接受比特币和 USDT 进行所有交易，确保快速、安全和全球可达。'
  },
  {
    question: '我可以从推荐中赚多少？',
    answer: '推荐收入没有限制。通过您的推荐链接注册的任何人所进行的每次存款的 10%。推荐越多，赚取越多。'
  },
  {
    question: '提款需要多长时间？',
    answer: '提款在几分钟内处理。比特币和 USDT 转账通常在 24 小时内在区块链上确认。'
  },
  {
    question: '我的投资安全吗？',
    answer: '是的。Grant Union 采用行业级的安全措施，我们专业的交易团队确保您的资金得到妥善和专业的管理。'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('问：' + faq.question, { width: 480 });
  doc.fontSize(11).fillColor(lightText).font('ArialBold').text('答：' + faq.answer, { width: 480, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

addHeading1('联系和支持');
addParagraph('如有任何问题或需要帮助，请联系我们的专业支持团队：');

addBulletPoint('电子邮件：grantunion583@gmail.com');
addBulletPoint('网站：grantunion.vercel.app');
addBulletPoint('响应时间：24 小时内');
addBulletPoint('工作时间：全天 24/7 支持');

addHeading3('需要帮助？');
addParagraph('我们的专业支持团队随时可用，帮助您解答任何问题、账户问题或交易咨询。随时通过 grantunion583@gmail.com 与我们联系！');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. 版权所有。', { align: 'center' });
doc.fontSize(9).text('专业交易 | 加密货币 | 外汇 | 黄金 | 房地产', { align: 'center' });
doc.text('本文件仅供参考使用。', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ 中文 PDF 已成功生成！`);
  console.log(`✓ 文件：${outputPath}`);
  console.log(`✓ 大小：${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ 生成 PDF 时出错:', err.message);
  process.exit(1);
});
