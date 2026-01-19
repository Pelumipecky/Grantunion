#!/usr/bin/env node
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-ko.pdf');
const logoPath = path.join(__dirname, 'public', 'grantunionLogo.png');
const doc = new PDFDocument({size: 'A4', margin: 15, bufferPages: true});
doc.pipe(fs.createWriteStream(outputPath));

// Register Arial fonts for better Unicode support across all languages
const arialPath = 'C:\\Windows\\Fonts\\arial.ttf';
const arialBoldPath = 'C:\\Windows\\Fonts\\arialbd.ttf';
doc.registerFont('Arial', arialPath);
doc.registerFont('ArialBold', arialBoldPath);
const primaryOrange = '#FF8C37', lightText = '#444', white = '#ffffff';
function addHeading1(text) {doc.fontSize(18).fillColor(primaryOrange).font('ArialBold').text(text);doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primaryOrange).lineWidth(2.5).stroke();doc.moveDown(0.35);}
function addHeading2(text) {doc.fontSize(13).fillColor(primaryOrange).font('ArialBold').text(text);doc.moveDown(0.2);}
function addHeading3(text) {doc.fontSize(12).fillColor(primaryOrange).font('ArialBold').text(text);doc.moveDown(0.15);}
function addParagraph(text) {doc.fontSize(10.5).fillColor(lightText).font('ArialBold').text(text, { width: 490, lineGap: 1.5 });doc.moveDown(0.25);}
function addBulletPoint(text) {doc.fontSize(10.5).fillColor(lightText).font('ArialBold').text('• ' + text, { width: 480, lineGap: 1.2 });doc.moveDown(0.2);}
if (fs.existsSync(logoPath)) {const pageWidth = doc.page.width, logoWidth = 75, logoX = (pageWidth - logoWidth) / 2;doc.image(logoPath, logoX, 15, { width: 75, height: 50 });doc.moveDown(3);}
doc.fontSize(26).fillColor(primaryOrange).font('ArialBold').text('GRANT UNION', { align: 'center' });doc.moveDown(0.6);
addHeading1('Grant Union에 오신 것을 환영합니다');
addParagraph('세계 최고의 투자 및 거래 플랫폼인 Grant Union에 오신 것을 환영합니다. 안전하고 투명하며 수익성 있는 투자 경험을 제공하기 위해 최선을 다하고 있습니다.');
addHeading2('Grant Union 소개');
addParagraph('Grant Union은 암호화폐 거래, 외환 거래, 금 및 부동산 투자를 전문으로 하는 전문 거래 회사입니다. 저희의 전문 트레이더 팀은 귀하의 비트코인 투자 수익을 최대화하기 위해 열심히 일하고 있습니다.');
addHeading3('최소 투자 액수');
addParagraph('회사는 귀하의 투자 계획을 기반으로 일일 수수료를 제공합니다. 최소 입금액이 100달러에 불과하여 수익을 창출할 수 있습니다. 투자 기간 후 자본과 수익을 모두 인출하거나 지속적인 성장을 위해 재투자할 수 있습니다.');
addHeading1('투자 계획 및 수익률');
addParagraph('우리의 투자 계획:');
const tableTop = doc.y, col1 = 20, col2 = 110, col3 = 220, col4 = 330, col5 = 430;
doc.fontSize(11).font('ArialBold').fillColor(white);
doc.rect(15, tableTop, 565, 22).fillColor(primaryOrange).fill();
doc.fillColor(white);
doc.text('Plan', col1, tableTop + 6, { width: 90 });
doc.text('Duration', col2, tableTop + 6, { width: 110 });
doc.text('Daily Commission', col3, tableTop + 6, { width: 100 });
doc.text('Min. Deposit', col4, tableTop + 6, { width: 85 });
doc.text('Max. Deposit', col5, tableTop + 6, { width: 85 });
const rows = [
  ['3일 플랜', '3일', '8%', '$100', '$999'],
  ['7일 플랜', '7일', '3%', '$599', '$3,999'],
  ['12일 플랜', '12일', '3.5%', '$1,000', '$4,999'],
  ['15일 플랜', '15일', '4%', '$3,000', '$9,000'],
  ['3개월 플랜', '90일', '4%', '$5,000', '$15,000'],
  ['6개월 플랜', '180일', '5%', '$15,999', '무제한']
];
doc.fontSize(10).fillColor(lightText).font('ArialBold');
let rowY = tableTop + 22;
rows.forEach((row, idx) => {const currentRowY = rowY + (idx * 18);if (idx % 2 === 1) {doc.rect(15, currentRowY, 565, 18).fillColor('#f9f9f9').fill();}doc.fillColor(lightText);doc.text(row[0], col1, currentRowY + 4, { width: 90 });doc.text(row[1], col2, currentRowY + 4, { width: 110 });doc.text(row[2], col3, currentRowY + 4, { width: 100 });doc.text(row[3], col4, currentRowY + 4, { width: 85 });doc.text(row[4], col5, currentRowY + 4, { width: 85 });});
doc.addPage();
addHeading3('계산 예');
addParagraph('3일 플랜에 100달러를 일일 8%로 투자하면 3일 후 24달러를 벌 것입니다. 자본과 수익을 인출하거나 재투자할 수 있습니다.');
doc.moveDown(0.3);
addHeading2('작동 방식');
addParagraph('Grant Union에 투자할 때, 전문 트레이더 팀이 선택한 기간(예: 3일) 동안 비트코인을 거래합니다. 투자 기간이 끝나면 자본과 수익이 백오피스로 이체되어 인출하거나 재투자할 수 있습니다.');
doc.moveDown(0.3);
addHeading2('결제 방법');
addParagraph('Grant Union은 플랫폼의 모든 거래에 비트코인과 USDT를 사용하여 빠르고 안전하며 글로벌한 접근성을 보장합니다.');
doc.moveDown(1);
doc.addPage();
addHeading1('추천 수수료');
addHeading2('무제한 10% 수수료 획득');
addParagraph('Grant Union은 모든 투자자에게 무제한 10% 추천 수수료를 제공합니다! 귀하의 고유한 추천 링크를 사용하여 등록한 모든 사람이 한 모든 예금의 10%를 획득하십시오.');
addHeading2('작동 방식');
addParagraph('Grant Union에 투자할 때, 전문 트레이더 팀이 선택한 기간 동안 비트코인을 거래합니다. 투자 기간이 끝나면 자본과 수익이 백오피스로 이체되어 인출하거나 재투자할 수 있습니다.');
addHeading1('출금 프로세스');
addHeading2('빠르고 효율적인 출금');
addParagraph('출금은 빠르고 효율적입니다. 프로세스는 단 몇 분만에 완료되며 최대 24시간입니다.');
addHeading2('출금 단계');
addBulletPoint('Grant Union 계정에 로그인');
addBulletPoint('출금 섹션으로 이동');
addBulletPoint('출금액 선택');
addBulletPoint('결제 수단 선택(비트코인 또는 USDT)');
addBulletPoint('지갑 주소 입력');
addBulletPoint('출금 요청 제출');
addBulletPoint('자금이 몇 분 안에 이체됩니다');
addHeading2('이용 가능한 방법');
addBulletPoint('비트코인: 안전하고 빠른 암호화폐 이체');
addBulletPoint('USDT: 안정적인 가치를 가진 스테이블코인 이체');
addHeading3('자금에 쉽게 접근');
addParagraph('투자 기간이 끝난 후 자본을 인출하고 싶거나 일일 수수료를 받고 싶거나, Grant Union은 빠르고 편리하게 해줍니다.');
addHeading1('보안 및 보호');
addHeading2('귀하의 보안에 대한 약속');
addParagraph('Grant Union은 최고의 보안 표준을 유지하고 귀하의 투자를 보호하기 위해 최선을 다합니다.');
addHeading2('보안 기능');
addBulletPoint('모든 데이터 전송을 위한 업계 수준의 암호화');
addBulletPoint('보안 클라우드 인프라');
addBulletPoint('정기적인 보안 감사 및 규정 준수 확인');
addBulletPoint('투자를 모니터링하는 전문 트레이더 팀');
addBulletPoint('투명한 거래 내역 및 보고서');
addHeading2('계정 보호');
addBulletPoint('계정에 강력하고 고유한 비밀번호 사용');
addBulletPoint('로그인 자격증명을 누구와도 공유하지 않기');
addBulletPoint('이메일 주소를 안전하게 유지하고 모니터링');
addBulletPoint('모든 거래에 대한 이메일 알림 활성화');
addBulletPoint('의심 활동 즉시 보고');
addHeading3('귀하의 보안이 최우선입니다');
addParagraph('Grant Union은 귀하의 자금과 개인 정보를 항상 보호하기 위해 고급 보안 조치를 사용합니다.');
doc.addPage();
addHeading1('자주하는 질문');
const faqs = [
  {question: '최소 투자액은 얼마입니까?', answer: '최소 투자액은 100달러에 불과합니다. 작게 시작하여 시간이 지남에 따라 투자를 늘릴 수 있습니다.'},
  {question: '수수료는 얼마나 자주 계산됩니까?', answer: '일일 수수료는 선택한 투자 계획에 따라 매 24시간마다 귀하의 계정에 입금됩니다. 대시보드에서 실시간 수익을 확인할 수 있습니다.'},
  {question: '투자 기간이 끝나기 전에 인출할 수 있습니까?', answer: '언제든지 일일 수수료를 인출할 수 있습니다. 계획에 설명된 대로 투자 기간이 완료될 때까지 자본은 잠긴 상태로 유지됩니다.'},
  {question: '어떤 결제 수단이 허용됩니까?', answer: 'Grant Union은 모든 거래에 비트코인과 USDT를 수락하여 빠르고 안전하며 글로벌한 액세스를 보장합니다.'},
  {question: '추천에서 얼마를 벌 수 있습니까?', answer: '추천 수입에는 제한이 없습니다. 귀하의 추천 링크를 사용하여 등록한 모든 사람이 한 모든 예금의 10%를 획득하십시오. 더 많이 추천할수록 더 많이 벌 수 있습니다.'},
  {question: '출금에는 얼마나 걸립니까?', answer: '출금은 몇 분 안에 처리됩니다. 비트코인 및 USDT 이체는 일반적으로 24시간 이내에 블록체인에서 확인됩니다.'},
  {question: '내 투자가 안전합니까?', answer: '예. Grant Union은 업계 수준의 보안 조치를 사용하며 전문 트레이더 팀은 귀하의 자금이 신중하고 전문적으로 관리되도록 보장합니다.'}
];
faqs.forEach((faq, idx) => {doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('Q: ' + faq.question, { width: 480 });doc.fontSize(11).fillColor(lightText).font('ArialBold').text('A: ' + faq.answer, { width: 480, lineGap: 1.3 });if (idx < faqs.length - 1) {doc.moveDown(0.3);}});
addHeading1('연락처 및 지원');
addParagraph('질문이나 지원이 필요하신 경우 저희 전용 지원 팀에 문의하십시오:');
addBulletPoint('이메일: grantunion583@gmail.com');
addBulletPoint('웹사이트: grantunion.vercel.app');
addBulletPoint('응답 시간: 24시간 이내');
addBulletPoint('시간: 24/7 지원 가능');
addHeading3('도움이 필요하신가요?');
addParagraph('전문 지원팀은 모든 질문, 계정 문제 또는 거래 문의를 지원하기 위해 24시간 이용 가능합니다. grantunion583@gmail.com에 언제든지 문의하세요!');
doc.moveDown(0.5);
doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. 판권 소유.', { align: 'center' });
doc.fontSize(9).text('전문 거래 | 암호화폐 | 외환 | 금 | 부동산', { align: 'center' });
doc.text('본 문서는 정보 제공 목적으로만 작성됩니다.', { align: 'center' });
doc.end();
doc.on('finish', () => {const stats = fs.statSync(outputPath);console.log(`✓ 한국어 PDF가 성공적으로 생성되었습니다!`);console.log(`✓ 파일: ${outputPath}`);console.log(`✓ 크기: ${(stats.size / 1024).toFixed(2)} KB`);});
doc.on('error', (err) => {console.error('✗ PDF 생성 중 오류:', err.message);process.exit(1);});
