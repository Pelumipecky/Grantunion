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
addParagraph('Добро пожаловать в Grant Union, ведущую платформу инвестирования и торговли в мире. Мы стремимся предоставить вам безопасный, прозрачный и прибыльный инвестиционный опыт.');

addHeading2('О компании Grant Union');
addParagraph('Grant Union - это профессиональная торговая компания, специализирующаяся на торговле криптовалютами, валютной торговле, золотом и инвестициях в недвижимость. Наша команда профессиональных трейдеров работает добросовестно, чтобы максимизировать доходы ваших инвестиций в Биткойн.');

addHeading3('Минимальные инвестиции');
addParagraph('Компания предлагает дневную комиссию, основанную на вашем инвестиционном плане. При минимальном депозите всего в 100 долларов вы можете начать зарабатывать. После периода инвестирования вы можете выбрать вывод своего капитала и прибыли или реинвестировать для постоянного роста.');

addHeading1('Инвестиционные Планы и Возвраты');
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
doc.text('Продолжительность', col2, tableTop + 6, { width: 110 });
doc.text('Дневная Комиссия', col3, tableTop + 6, { width: 100 });
doc.text('Мин. Вклад', col4, tableTop + 6, { width: 85 });
doc.text('Макс. Вклад', col5, tableTop + 6, { width: 85 });

const rows = [
  ['План 3 дня', '3 дня', '8%', '$100', '$999'],
  ['План 7 дней', '7 дней', '3%', '$599', '$3,999'],
  ['План 12 дней', '12 дней', '3.5%', '$1,000', '$4,999'],
  ['План 15 дней', '15 дней', '4%', '$3,000', '$9,000'],
  ['План 3 месяца', '90 дней', '4%', '$5,000', '$15,000'],
  ['План 6 месяцев', '180 дней', '5%', '$15,999', 'Неограниченно']
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
addParagraph('Если вы инвестируете 100 долларов в план 3 дня под 8% ежедневно, через 3 дня вы заработаете 24,00 доллара. Вы можете выбрать вывод своего капитала и прибыли или реинвестировать.');

doc.moveDown(0.3);

addHeading2('Как это Работает');
addParagraph('Когда вы инвестируете в Grant Union, наша профессиональная команда трейдеров торгует ваш Биткойн на протяжении выбранного вами периода (например, 3 дня). После периода инвестирования ваш капитал и прибыль переводятся на ваш внутренний счет, где вы можете выбрать вывод или реинвестирование.');

doc.moveDown(0.3);

addHeading2('Методы Оплаты');
addParagraph('Grant Union использует Биткойн и USDT для всех транзакций на платформе, обеспечивая быстрый, безопасный и глобальный доступ.');

doc.moveDown(1);

doc.addPage();

addHeading1('Комиссия за Рефереалов');

addHeading2('Зарабатывайте Неограниченные Комиссии 10%');
addParagraph('Grant Union предлагает неограниченную комиссию за рефереалов 10% всем инвесторам! Заработайте 10% от каждого депозита, сделанного кем-либо, кто зарегистрируется с использованием вашей уникальной реферальной ссылки.');

addHeading2('Как это Работает');
addParagraph('Когда вы инвестируете в Grant Union, наша профессиональная команда трейдеров торгует ваш Биткойн на протяжении выбранного вами периода (например, 3 дня). После периода инвестирования ваш капитал и прибыль переводятся на ваш внутренний счет, где вы можете выбрать вывод или реинвестирование.');

addHeading1('Процесс Вывода');

addHeading2('Быстрые и Эффективные Выводы');
addParagraph('Выводы осуществляются быстро и эффективно. Процесс занимает всего несколько минут и максимум 24 часа.');

addHeading2('Этапы Вывода');
addBulletPoint('Войдите на свой счет Grant Union');
addBulletPoint('Перейдите в раздел вывода');
addBulletPoint('Выберите сумму вывода');
addBulletPoint('Выберите метод платежа (Биткойн или USDT)');
addBulletPoint('Введите адрес вашего кошелька');
addBulletPoint('Отправьте запрос на вывод');
addBulletPoint('Средства переводятся в течение нескольких минут');

addHeading2('Доступные Методы');
addBulletPoint('Биткойн: Безопасные и быстрые переводы криптовалюты');
addBulletPoint('USDT: Переводы стейблкойнов со стабильной стоимостью');

addHeading3('Легкий Доступ к Вашим Средствам');
addParagraph('Независимо от того, хотите ли вы вывести свой капитал после завершения периода инвестирования или снять свои дневные комиссии, Grant Union делает это быстро и удобно.');

addHeading1('Безопасность и Защита');

addHeading2('Наше Обязательство Вашей Безопасности');
addParagraph('Grant Union обязуется поддерживать самые высокие стандарты безопасности и защищать ваши инвестиции.');

addHeading2('Функции Безопасности');
addBulletPoint('Шифрование на промышленном уровне для всех передач данных');
addBulletPoint('Безопасная облачная инфраструктура');
addBulletPoint('Регулярные проверки безопасности и проверки соответствия');
addBulletPoint('Профессиональная команда трейдеров отслеживает ваши инвестиции');
addBulletPoint('Прозрачная история транзакций и отчеты');

addHeading2('Защита Вашего Счета');
addBulletPoint('Используйте сильный и уникальный пароль для своего счета');
addBulletPoint('Никогда не делитесь своими учетными данными ни с кем');
addBulletPoint('Держите свой адрес электронной почты в безопасности и под наблюдением');
addBulletPoint('Включите уведомления по электронной почте для всех транзакций');
addBulletPoint('Сообщайте о любой подозрительной активности немедленно');

addHeading3('Ваша Безопасность - Наш Приоритет');
addParagraph('Grant Union использует передовые меры безопасности для защиты ваших средств и личной информации в любое время.');

doc.addPage();

addHeading1('Часто Задаваемые Вопросы');

const faqs = [
  {
    question: 'Какова минимальная сумма инвестирования?',
    answer: 'Минимальная инвестиция составляет всего 100 долларов. Вы можете начать с малого и со временем увеличивать свои инвестиции.'
  },
  {
    question: 'Как часто начисляются комиссии?',
    answer: 'Дневные комиссии начисляются на ваш счет каждые 24 часа в соответствии с выбранным вами инвестиционным планом. Вы можете видеть свои прибыли в реальном времени на своей панели управления.'
  },
  {
    question: 'Могу ли я вывести средства до окончания периода инвестирования?',
    answer: 'Вы можете снять свои дневные комиссии в любое время. Ваш капитал остается заблокированным до завершения периода инвестирования, как описано в вашем плане.'
  },
  {
    question: 'Какие методы оплаты принимаются?',
    answer: 'Grant Union принимает Биткойн и USDT для всех транзакций, обеспечивая быстрый, безопасный и глобальный доступ.'
  },
  {
    question: 'Сколько я могу заработать на рефереалах?',
    answer: 'Нет ограничений на заработок на рефереалах. Зарабатывайте 10% от каждого депозита, сделанного кем-либо, кто зарегистрируется с использованием вашей реферальной ссылки. Чем больше рефереалов, тем больше вы заработаете.'
  },
  {
    question: 'Сколько времени занимает вывод?',
    answer: 'Выводы обрабатываются в течение нескольких минут. Передачи Биткойна и USDT обычно подтверждаются в блокчейне в течение 24 часов.'
  },
  {
    question: 'Безопасны ли мои инвестиции?',
    answer: 'Да. Grant Union использует меры безопасности на промышленном уровне, и наша профессиональная команда трейдеров гарантирует, что ваши средства управляются с заботой и мастерством.'
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
addParagraph('Свяжитесь с нашей выделенной командой поддержки с любыми вопросами или запросами помощи:');

addBulletPoint('Электронная почта: grantunion583@gmail.com');
addBulletPoint('Веб-сайт: grantunion.vercel.app');
addBulletPoint('Время ответа: В течение 24 часов');
addBulletPoint('Часы работы: Поддержка доступна 24/7');

addHeading3('Нужна Помощь?');
addParagraph('Наша профессиональная команда поддержки доступна 24 часа в сутки, чтобы помочь вам с любыми вопросами, проблемами с учетной записью или запросами по торговле. Свяжитесь с нами в любое время по адресу grantunion583@gmail.com!');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. Все права защищены.', { align: 'center' });
doc.fontSize(9).text('Профессиональная Торговля | Криптовалюты | Форекс | Золото | Недвижимость', { align: 'center' });
doc.text('Этот документ предназначен только в информационных целях.', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ PDF на русском языке успешно создан!`);
  console.log(`✓ Файл: ${outputPath}`);
  console.log(`✓ Размер: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ Ошибка при создании PDF:', err.message);
  process.exit(1);
});
