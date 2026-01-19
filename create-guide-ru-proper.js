#!/usr/bin/env node

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-ru.pdf');
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

addHeading1('Добро пожаловать в Grant Union');
addParagraph('Добро пожаловать в Grant Union, ведущую платформу инвестирования и торговли в мире. Мы привержены предоставлению вам безопасного, прозрачного и прибыльного инвестиционного опыта.');

addHeading2('О компании Grant Union');
addParagraph('Grant Union - это профессиональная торговая компания, специализирующаяся на торговле криптовалютами, валютной торговле, золотом и инвестициях в недвижимость. Наша команда опытных трейдеров работает усердно, чтобы максимизировать доходность ваших инвестиций в биткойн.');

addHeading3('Минимальный Размер Инвестиции');
addParagraph('Компания предлагает ежедневные комиссии в зависимости от выбранного вами инвестиционного плана. С минимальным депозитом всего в 100 долларов вы можете начать зарабатывать. По окончании периода инвестирования вы можете вывести как капитал, так и прибыль, или реинвестировать для продолжения роста.');

addHeading1('Инвестиционные Планы и Доходность');
addParagraph('Наши инвестиционные планы:');

const tableTop = doc.y;
const col1 = 20;
const col2 = 110;
const col3 = 220;
const col4 = 330;
const col5 = 430;

doc.fontSize(11).font('ArialBold').fillColor(white);
doc.rect(15, tableTop, 565, 22).fillColor(primaryOrange).fill();
doc.fillColor(white);
doc.text('План', col1, tableTop + 6, { width: 90 });
doc.text('Длительность', col2, tableTop + 6, { width: 110 });
doc.text('Дневная Комиссия', col3, tableTop + 6, { width: 100 });
doc.text('Мин. Депозит', col4, tableTop + 6, { width: 85 });
doc.text('Макс. Депозит', col5, tableTop + 6, { width: 85 });

const rows = [
  ['План на 3 дня', '3 дня', '8%', '$100', '$999'],
  ['План на 7 дней', '7 дней', '3%', '$599', '$3,999'],
  ['План на 12 дней', '12 дней', '3.5%', '$1,000', '$4,999'],
  ['План на 15 дней', '15 дней', '4%', '$3,000', '$9,000'],
  ['План на 3 месяца', '90 дней', '4%', '$5,000', '$15,000'],
  ['План на 6 месяцев', '180 дней', '5%', '$15,999', 'Без лимита']
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

addHeading3('Пример Расчета');
addParagraph('Если вы инвестируете 100 долларов в план на 3 дня с ежедневной комиссией 8%, то через 3 дня вы заработаете 24 доллара. Вы можете выбрать вывод капитала и прибыли или реинвестировать их.');

doc.moveDown(0.3);

addHeading2('Как Это Работает');
addParagraph('Когда вы инвестируете в Grant Union, наша профессиональная команда трейдеров торгует вашими биткойнами в течение выбранного вами периода (например, 3 дня). После завершения периода инвестирования ваш капитал и прибыль переводятся на ваш личный счет, откуда вы можете вывести средства или реинвестировать их.');

doc.moveDown(0.3);

addHeading2('Способы Оплаты');
addParagraph('Grant Union использует биткойн и USDT для всех транзакций на платформе, обеспечивая быстрый, безопасный и глобальный доступ.');

doc.moveDown(1);

doc.addPage();

addHeading1('Реферальные Комиссии');

addHeading2('Получайте Неограниченные Комиссии 10%');
addParagraph('Grant Union предлагает неограниченные реферальные комиссии в размере 10% всем инвесторам! Зарабатывайте 10% от каждого депозита, внесенного любым человеком, зарегистрировавшимся по вашей уникальной реферальной ссылке.');

addHeading2('Как Это Работает');
addParagraph('Когда вы инвестируете в Grant Union, наша профессиональная команда трейдеров торгует вашими биткойнами в течение выбранного вами периода. После завершения периода инвестирования ваш капитал и прибыль переводятся на ваш личный счет, откуда вы можете вывести средства или реинвестировать их.');

addHeading1('Процесс Вывода');

addHeading2('Быстрый и Эффективный Вывод');
addParagraph('Выводы средств осуществляются быстро и эффективно. Процесс занимает всего несколько минут и не более 24 часов.');

addHeading2('Этапы Вывода');
addBulletPoint('Войдите в свой аккаунт Grant Union');
addBulletPoint('Откройте раздел "Вывод"');
addBulletPoint('Укажите сумму вывода');
addBulletPoint('Выберите способ оплаты (Биткойн или USDT)');
addBulletPoint('Введите адрес вашего кошелька');
addBulletPoint('Подтвердите запрос на вывод');
addBulletPoint('Средства переводятся в течение нескольких минут');

addHeading2('Доступные Способы');
addBulletPoint('Биткойн: быстрые и защищенные переводы криптовалюты');
addBulletPoint('USDT: переводы стейблкойна с фиксированной стоимостью');

addHeading3('Легкий Доступ к Вашим Средствам');
addParagraph('Независимо от того, хотите ли вы вывести капитал после завершения периода инвестирования или снять ежедневные комиссии, Grant Union обеспечивает быстрый и удобный процесс.');

addHeading1('Безопасность и Защита');

addHeading2('Наше Обязательство перед Вашей Безопасностью');
addParagraph('Grant Union обязуется поддерживать самые высокие стандарты безопасности и защищать ваши инвестиции.');

addHeading2('Функции Безопасности');
addBulletPoint('Шифрование на уровне индустрии для всех передач данных');
addBulletPoint('Защищенная облачная инфраструктура');
addBulletPoint('Регулярные аудиты безопасности и проверки соответствия');
addBulletPoint('Профессиональная команда трейдеров отслеживает ваши инвестиции');
addBulletPoint('Прозрачная история всех транзакций и отчеты');

addHeading2('Защита Вашего Аккаунта');
addBulletPoint('Используйте надежный и уникальный пароль');
addBulletPoint('Никогда не делитесь своими учетными данными ни с кем');
addBulletPoint('Защищайте и отслеживайте свой адрес электронной почты');
addBulletPoint('Включите уведомления по электронной почте для всех транзакций');
addBulletPoint('Немедленно сообщайте о любой подозрительной активности');

addHeading3('Ваша Безопасность - Наш Приоритет');
addParagraph('Grant Union использует передовые меры безопасности для защиты ваших средств и личной информации в любое время.');

doc.addPage();

addHeading1('Часто Задаваемые Вопросы');

const faqs = [
  {
    question: 'Какой минимальный размер инвестиции?',
    answer: 'Минимальная инвестиция составляет всего 100 долларов. Вы можете начать с малого и постепенно увеличивать свои инвестиции.'
  },
  {
    question: 'Как часто начисляются комиссии?',
    answer: 'Ежедневные комиссии начисляются на ваш счет каждые 24 часа в соответствии с выбранным планом инвестирования. Вы можете видеть свои прибыли в реальном времени на личной панели.'
  },
  {
    question: 'Могу ли я снять средства раньше окончания периода инвестирования?',
    answer: 'Вы можете снять ежедневные комиссии в любое время. Ваш капитал останется заблокирован до завершения периода инвестирования, как указано в вашем плане.'
  },
  {
    question: 'Какие способы оплаты принимаются?',
    answer: 'Grant Union принимает биткойн и USDT для всех транзакций, обеспечивая быстрый, безопасный и глобальный доступ.'
  },
  {
    question: 'Сколько я могу заработать на рефералах?',
    answer: 'Нет ограничений на доход от рефералов. Зарабатывайте 10% от каждого депозита, внесенного любым человеком, зарегистрировавшимся по вашей ссылке. Чем больше рефералов, тем больше вы заработаете.'
  },
  {
    question: 'Сколько времени занимает процесс вывода?',
    answer: 'Выводы обрабатываются в течение нескольких минут. Переводы биткойнов и USDT обычно подтверждаются в блокчейне в течение 24 часов.'
  },
  {
    question: 'Безопасны ли мои инвестиции?',
    answer: 'Да. Grant Union использует защиту на уровне индустрии, и наша профессиональная команда трейдеров гарантирует, что ваши средства управляются с должной заботой и экспертизой.'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('В: ' + faq.question, { width: 480 });
  doc.fontSize(11).fillColor(lightText).font('ArialBold').text('О: ' + faq.answer, { width: 480, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

addHeading1('Контакты и Поддержка');
addParagraph('Обратитесь к нашей команде поддержки с любыми вопросами или запросами помощи:');

addBulletPoint('Электронная почта: grantunion583@gmail.com');
addBulletPoint('Веб-сайт: grantunion.vercel.app');
addBulletPoint('Время ответа: в течение 24 часов');
addBulletPoint('Часы работы: поддержка доступна 24/7');

addHeading3('Нужна Помощь?');
addParagraph('Наша профессиональная команда поддержки доступна 24 часа в сутки для помощи с любыми вопросами, проблемами с аккаунтом или торговыми запросами. Свяжитесь с нами в любое время на адресе grantunion583@gmail.com!');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. Все права защищены.', { align: 'center' });
doc.fontSize(9).text('Профессиональная Торговля | Криптовалюты | Форекс | Золото | Недвижимость', { align: 'center' });
doc.text('Данный документ предоставляется в информационных целях.', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ Русский PDF успешно создан!`);
  console.log(`✓ Файл: ${outputPath}`);
  console.log(`✓ Размер: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ Ошибка при создании PDF:', err.message);
  process.exit(1);
});
