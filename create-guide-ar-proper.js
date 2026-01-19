#!/usr/bin/env node

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-ar.pdf');
const logoPath = path.join(__dirname, 'public', 'grantunionLogo.png');

const doc = new PDFDocument({
  size: 'A4',
  margin: 15,
  bufferPages: true
});

doc.pipe(fs.createWriteStream(outputPath));

// Register Arial fonts for better Unicode support for Arabic
const arialPath = 'C:\\Windows\\Fonts\\arial.ttf';
const arialBoldPath = 'C:\\Windows\\Fonts\\arialbd.ttf';
doc.registerFont('Arial', arialPath);
doc.registerFont('ArialBold', arialBoldPath);

const primaryOrange = '#FF8C37';
const lightText = '#444';
const white = '#ffffff';

// Use Arial font which has better Unicode support for Arabic
const textFont = 'Arial';
const boldFont = 'ArialBold';

function addHeading1(text) {
  doc.fontSize(18).fillColor(primaryOrange).font(boldFont).text(text, { align: 'right' });
  doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primaryOrange).lineWidth(2.5).stroke();
  doc.moveDown(0.35);
}

function addHeading2(text) {
  doc.fontSize(13).fillColor(primaryOrange).font(boldFont).text(text, { align: 'right' });
  doc.moveDown(0.2);
}

function addHeading3(text) {
  doc.fontSize(12).fillColor(primaryOrange).font(boldFont).text(text, { align: 'right' });
  doc.moveDown(0.15);
}

function addParagraph(text) {
  doc.fontSize(10.5).fillColor(lightText).font(textFont).text(text, { width: 490, lineGap: 1.5, align: 'right' });
  doc.moveDown(0.25);
}

function addBulletPoint(text) {
  doc.fontSize(10.5).fillColor(lightText).font(textFont).text('• ' + text, { width: 480, lineGap: 1.2, align: 'right' });
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

addHeading1('أهلا بك في Grant Union');
addParagraph('أهلا بك في Grant Union، منصة الاستثمار والتداول الرائدة في العالم. نحن ملتزمون بتوفير تجربة استثمارية آمنة وشفافة وربحية.');

addHeading2('حول Grant Union');
addParagraph('Grant Union هي شركة تداول احترافية متخصصة في تداول العملات المشفرة وتداول الفوركس والذهب والاستثمارات العقارية. يعمل فريقنا من متداولي محترفين بجد لتعظيم عوائد استثمارات البيتكوين الخاصة بك.');

addHeading3('الحد الأدنى للاستثمار');
addParagraph('تقدم الشركة عمولة يومية بناءً على خطة استثمارك. بحد أدنى للإيداع يبلغ 100 دولار فقط، يمكنك البدء في الكسب. بعد فترة الاستثمار الخاصة بك، يمكنك اختيار سحب رأس مالك وأرباحك أو إعادة الاستثمار لمواصلة النمو.');

addHeading1('خطط الاستثمار والعوائد');
addParagraph('خطط الاستثمار لدينا:');

const tableTop = doc.y;
const col1 = 20;
const col2 = 110;
const col3 = 220;
const col4 = 330;
const col5 = 430;

doc.fontSize(11).font(boldFont).fillColor(white);
doc.rect(15, tableTop, 565, 22).fillColor(primaryOrange).fill();
doc.fillColor(white);
doc.text('الخطة', col1, tableTop + 6, { width: 90, align: 'right' });
doc.text('المدة', col2, tableTop + 6, { width: 110, align: 'right' });
doc.text('العمولة اليومية', col3, tableTop + 6, { width: 100, align: 'right' });
doc.text('الحد الأدنى', col4, tableTop + 6, { width: 85, align: 'right' });
doc.text('الحد الأقصى', col5, tableTop + 6, { width: 85, align: 'right' });

const rows = [
  ['خطة 3 أيام', '3 أيام', '8%', '$100', '$999'],
  ['خطة 7 أيام', '7 أيام', '3%', '$599', '$3,999'],
  ['خطة 12 يوم', '12 يوم', '3.5%', '$1,000', '$4,999'],
  ['خطة 15 يوم', '15 يوم', '4%', '$3,000', '$9,000'],
  ['خطة 3 أشهر', '90 يوم', '4%', '$5,000', '$15,000'],
  ['خطة 6 أشهر', '180 يوم', '5%', '$15,999', 'غير محدود']
];

doc.fontSize(10).fillColor(lightText).font(textFont);
let rowY = tableTop + 22;
rows.forEach((row, idx) => {
  const currentRowY = rowY + (idx * 18);
  if (idx % 2 === 1) {
    doc.rect(15, currentRowY, 565, 18).fillColor('#f9f9f9').fill();
  }
  doc.fillColor(lightText);
  doc.text(row[0], col1, currentRowY + 4, { width: 90, align: 'right' });
  doc.text(row[1], col2, currentRowY + 4, { width: 110, align: 'right' });
  doc.text(row[2], col3, currentRowY + 4, { width: 100, align: 'center' });
  doc.text(row[3], col4, currentRowY + 4, { width: 85, align: 'center' });
  doc.text(row[4], col5, currentRowY + 4, { width: 85, align: 'center' });
});

doc.addPage();

addHeading3('مثال الحساب');
addParagraph('إذا استثمرت 100 دولار في خطة 3 أيام بنسبة 8% يومياً، ستكسب 24 دولاراً بعد 3 أيام. يمكنك اختيار سحب رأس مالك وأرباحك أو إعادة الاستثمار.');

doc.moveDown(0.3);

addHeading2('كيف يعمل');
addParagraph('عندما تستثمر مع Grant Union، يقوم فريقنا المحترف من المتداولين بتداول البيتكوين الخاص بك لمدة خطتك المختارة (مثل 3 أيام). بعد فترة الاستثمار، يتم تحويل رأس مالك وأرباحك إلى مكتبك الخلفي حيث يمكنك الاختيار بين السحب أو إعادة الاستثمار.');

doc.moveDown(0.3);

addHeading2('طرق الدفع');
addParagraph('تستخدم Grant Union البيتكوين و USDT لجميع المعاملات على المنصة، مما يضمن الوصول السريع والآمن والعالمي.');

doc.moveDown(1);

doc.addPage();

addHeading1('عمولة الإحالة');

addHeading2('اكسب عمولة غير محدودة 10%');
addParagraph('تقدم Grant Union عمولة إحالة غير محدودة بنسبة 10% لجميع المستثمرين! اكسب 10% من كل إيداع يتم من قبل أي شخص يسجل باستخدام رابط الإحالة الفريد الخاص بك.');

addHeading2('كيف يعمل');
addParagraph('عندما تستثمر مع Grant Union، يقوم فريقنا المحترف من المتداولين بتداول البيتكوين الخاص بك لمدة خطتك المختارة. بعد فترة الاستثمار، يتم تحويل رأس مالك وأرباحك إلى مكتبك الخلفي حيث يمكنك الاختيار بين السحب أو إعادة الاستثمار.');

addHeading1('عملية السحب');

addHeading2('السحب السريع والفعال');
addParagraph('السحب سريع وفعال. تستغرق العملية بضع دقائق فقط وأقصى 24 ساعة.');

addHeading2('خطوات السحب');
addBulletPoint('تسجيل الدخول إلى حسابك في Grant Union');
addBulletPoint('انتقل إلى قسم السحب');
addBulletPoint('حدد مبلغ السحب الخاص بك');
addBulletPoint('اختر طريقة الدفع (البيتكوين أو USDT)');
addBulletPoint('أدخل عنوان محفظتك');
addBulletPoint('قدم طلب السحب الخاص بك');
addBulletPoint('يتم تحويل الأموال في غضون دقائق');

addHeading2('الطرق المتاحة');
addBulletPoint('البيتكوين: تحويلات آمنة وسريعة للعملات المشفرة');
addBulletPoint('USDT: تحويلات العملات المستقرة بقيمة مستقرة');

addHeading3('الوصول السهل إلى أموالك');
addParagraph('سواء كنت تريد سحب رأس مالك بعد انتهاء فترة الاستثمار أو أخذ عمولاتك اليومية، فإن Grant Union تجعل الأمر سريعاً وسهلاً.');

addHeading1('الأمان والحماية');

addHeading2('التزامنا بأمانك');
addParagraph('تلتزم Grant Union بالحفاظ على أعلى معايير الأمان وحماية استثمارك.');

addHeading2('ميزات الأمان');
addBulletPoint('تشفير على مستوى الصناعة لجميع نقل البيانات');
addBulletPoint('البنية التحتية السحابية الآمنة');
addBulletPoint('عمليات التدقيق الأمني المنتظمة والفحوصات المتطابقة');
addBulletPoint('فريق متداولين محترف يراقب استثماراتك');
addBulletPoint('سجل المعاملات الشفاف والتقارير');

addHeading2('حماية حسابك');
addBulletPoint('استخدم كلمة مرور قوية وفريدة لحسابك');
addBulletPoint('لا تشارك بيانات اعتمادك مع أحد');
addBulletPoint('حافظ على عنوان بريدك الإلكتروني آمناً ومراقباً');
addBulletPoint('تفعيل إشعارات البريد الإلكتروني لجميع المعاملات');
addBulletPoint('الإبلاغ عن أي نشاط مريب فوراً');

addHeading3('أمانك هو أولويتنا');
addParagraph('تستخدم Grant Union تدابير أمان متقدمة لحماية أموالك ومعلوماتك الشخصية في جميع الأوقات.');

doc.addPage();

addHeading1('الأسئلة الشائعة');

const faqs = [
  {
    question: 'ما هو الحد الأدنى للاستثمار؟',
    answer: 'الحد الأدنى للاستثمار هو 100 دولار فقط. يمكنك البدء بمبلغ صغير وتنمية استثمارك بمرور الوقت.'
  },
  {
    question: 'ما مدى تكرار الحصول على العمولات؟',
    answer: 'يتم إيداع العمولات اليومية في حسابك كل 24 ساعة وفقاً لخطة الاستثمار المختارة. يمكنك رؤية أرباحك في الوقت الفعلي على لوحة التحكم الخاصة بك.'
  },
  {
    question: 'هل يمكنني السحب قبل انتهاء فترة الاستثمار؟',
    answer: 'يمكنك سحب العمولات اليومية في أي وقت. يبقى رأس مالك مقفولاً حتى انتهاء فترة الاستثمار كما هو موضح في خطتك.'
  },
  {
    question: 'ما طرق الدفع المقبولة؟',
    answer: 'تقبل Grant Union البيتكوين و USDT لجميع المعاملات، مما يضمن الوصول السريع والآمن والعالمي.'
  },
  {
    question: 'كم يمكنني أن أكسب من الإحالات؟',
    answer: 'لا توجد حدود على أرباح الإحالات. اكسب 10% من كل إيداع يتم من قبل أي شخص يسجل باستخدام رابط الإحالة الخاص بك. كلما أكثر الإحالات، كلما ربحت أكثر.'
  },
  {
    question: 'كم من الوقت يستغرق السحب؟',
    answer: 'تتم معالجة السحب في غضون دقائق. عادةً ما يتم تأكيد تحويلات البيتكوين و USDT في blockchain خلال 24 ساعة.'
  },
  {
    question: 'هل استثماري آمن؟',
    answer: 'نعم. تستخدم Grant Union تدابير أمان على مستوى الصناعة ويضمن فريقنا المحترف من المتداولين إدارة أموالك بعناية واحترافية.'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('س: ' + faq.question, { width: 480 });
  doc.fontSize(11).fillColor(lightText).font('ArialBold').text('ج: ' + faq.answer, { width: 480, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

addHeading1('التواصل والدعم');
addParagraph('اتصل بفريق الدعم المخصص لدينا لأي أسئلة أو طلب مساعدة:');

addBulletPoint('البريد الإلكتروني: grantunion583@gmail.com');
addBulletPoint('الموقع: grantunion.vercel.app');
addBulletPoint('وقت الرد: في غضون 24 ساعة');
addBulletPoint('الساعات: الدعم متاح 24/7');

addHeading3('هل تحتاج إلى مساعدة؟');
addParagraph('فريق الدعم المحترف لدينا متاح 24 ساعة للمساعدة في أي أسئلة أو مشاكل في الحساب أو استفسارات التداول. تواصل معنا في أي وقت على grantunion583@gmail.com!');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. جميع الحقوق محفوظة.', { align: 'center' });
doc.fontSize(9).text('التداول المهني | العملات المشفرة | الفوركس | الذهب | العقارات', { align: 'center' });
doc.text('هذا المستند لأغراض إعلامية فقط.', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ PDF العربية تم إنشاؤها بنجاح!`);
  console.log(`✓ الملف: ${outputPath}`);
  console.log(`✓ الحجم: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ خطأ في إنشاء PDF:', err.message);
  process.exit(1);
});
