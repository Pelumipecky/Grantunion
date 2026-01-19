#!/usr/bin/env node

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-de.pdf');
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

addHeading1('Willkommen bei Grant Union');
addParagraph('Willkommen bei Grant Union, der führenden Investitions- und Handelsplattform der Welt. Wir sind bestrebt, Sie mit einer sicheren, transparenten und rentablen Anlageerfahrung zu versorgen.');

addHeading2('Über Grant Union');
addParagraph('Grant Union ist ein professionelles Handelsunternehmen, das sich auf den Handel mit Kryptowährungen, Devisenhandel, Gold und Immobilieninvestitionen spezialisiert hat. Unser Team professioneller Trader arbeitet gewissenhaft daran, die Rendite Ihrer Bitcoin-Investitionen zu maximieren.');

addHeading3('Mindestanlage');
addParagraph('Das Unternehmen bietet eine tägliche Provision basierend auf Ihrem Anlageplan. Mit einer Mindesteinzahlung von nur 100 $ können Sie anfangen zu verdienen. Nach Ihrer Anlagefrist können Sie Ihr Kapital und Ihre Gewinne abheben oder zur weiteren Rendite reinvestieren.');

addHeading1('Anlagepläne und Renditen');
addParagraph('Unsere Anlagepläne:');

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
doc.text('Dauer', col2, tableTop + 6, { width: 110 });
doc.text('Tägliche Provision', col3, tableTop + 6, { width: 100 });
doc.text('Min. Einzahlung', col4, tableTop + 6, { width: 85 });
doc.text('Max. Einzahlung', col5, tableTop + 6, { width: 85 });

const rows = [
  ['3-Tage-Plan', '3 Tage', '8%', '$100', '$999'],
  ['7-Tage-Plan', '7 Tage', '3%', '$599', '$3,999'],
  ['12-Tage-Plan', '12 Tage', '3,5%', '$1,000', '$4,999'],
  ['15-Tage-Plan', '15 Tage', '4%', '$3,000', '$9,000'],
  ['3-Monats-Plan', '90 Tage', '4%', '$5,000', '$15,000'],
  ['6-Monats-Plan', '180 Tage', '5%', '$15,999', 'Unbegrenzt']
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

addHeading3('Berechnungsbeispiel');
addParagraph('Wenn Sie 100 $ in den 3-Tage-Plan mit 8% täglich investieren, verdienen Sie nach 3 Tagen 24,00 $. Sie können Ihr Kapital und Ihre Gewinne abheben oder reinvestieren.');

doc.moveDown(0.3);

addHeading2('Wie Es Funktioniert');
addParagraph('Wenn Sie bei Grant Union investieren, handelt unser professionelles Trader-Team Ihre Bitcoins für die Dauer Ihres gewählten Plans (z. B. 3 Tage). Nach Ablauf der Anlagefrist werden Ihr Kapital und Ihre Gewinne auf Ihr Back-Office übertragen, wo Sie die Möglichkeit haben, abzuheben oder reinzustecken.');

doc.moveDown(0.3);

addHeading2('Zahlungsmethoden');
addParagraph('Grant Union verwendet Bitcoin und USDT für alle Transaktionen auf der Plattform und gewährleistet so schnellen, sicheren und globalen Zugang.');

doc.moveDown(1);

doc.addPage();

addHeading1('Affiliate-Provision');

addHeading2('Verdienen Sie 10% unbegrenzte Provisionen');
addParagraph('Grant Union bietet allen Investoren unbegrenzte Affiliate-Provisionen von 10%! Verdienen Sie 10% jeder Einzahlung, die von jeder Person getätigt wird, die sich mit Ihrem eindeutigen Affiliate-Link registriert.');

addHeading2('Wie Es Funktioniert');
addParagraph('Wenn Sie bei Grant Union investieren, handelt unser professionelles Trader-Team Ihre Bitcoins für die Dauer Ihres gewählten Plans (z. B. 3 Tage). Nach Ablauf der Anlagefrist werden Ihr Kapital und Ihre Gewinne auf Ihr Back-Office übertragen, wo Sie die Möglichkeit haben, abzuheben oder reinzustecken.');

addHeading1('Auszahlungsprozess');

addHeading2('Schnelle und Effiziente Auszahlungen');
addParagraph('Auszahlungen sind schnell und effizient. Der Vorgang dauert nur wenige Minuten und dauert maximal 24 Stunden.');

addHeading2('Auszahlungsschritte');
addBulletPoint('Melden Sie sich bei Ihrem Grant Union-Konto an');
addBulletPoint('Navigieren Sie zum Auszahlungsbereich');
addBulletPoint('Wählen Sie Ihren Auszahlungsbetrag');
addBulletPoint('Wählen Sie Ihre Zahlungsmethode (Bitcoin oder USDT)');
addBulletPoint('Geben Sie Ihre Wallet-Adresse ein');
addBulletPoint('Senden Sie Ihre Auszahlungsanforderung ein');
addBulletPoint('Gelder werden in wenigen Minuten übertragen');

addHeading2('Verfügbare Methoden');
addBulletPoint('Bitcoin: Sichere und schnelle Kryptowährungstransfers');
addBulletPoint('USDT: Stablecoin-Transfers mit stabilem Wert');

addHeading3('Einfacher Zugriff auf Ihre Gelder');
addParagraph('Egal ob Sie Ihr Kapital nach Ablauf Ihrer Anlagefrist abheben möchten oder Ihre täglichen Provisionen auszahlen lassen möchten, Grant Union macht es schnell und bequem.');

addHeading1('Sicherheit und Schutz');

addHeading2('Unser Engagement für Ihre Sicherheit');
addParagraph('Grant Union verpflichtet sich, die höchsten Sicherheitsstandards einzuhalten und Ihre Investition zu schützen.');

addHeading2('Sicherheitsmerkmale');
addBulletPoint('Industriestandard-Verschlüsselung für alle Datenübertragungen');
addBulletPoint('Sichere Cloud-Infrastruktur');
addBulletPoint('Regelmäßige Sicherheitsaudits und Compliance-Überprüfungen');
addBulletPoint('Professionelles Trader-Team überwacht Ihre Anlagen');
addBulletPoint('Transparenter Transaktionsverlauf und Berichte');

addHeading2('Ihr Konto Schützen');
addBulletPoint('Verwenden Sie ein starkes und einzigartiges Passwort für Ihr Konto');
addBulletPoint('Teilen Sie Ihre Anmeldedaten niemals mit jemandem');
addBulletPoint('Halten Sie Ihre E-Mail-Adresse sicher und überwacht');
addBulletPoint('Aktivieren Sie E-Mail-Benachrichtigungen für alle Transaktionen');
addBulletPoint('Melden Sie verdächtige Aktivitäten sofort');

addHeading3('Ihre Sicherheit Ist Unsere Priorität');
addParagraph('Grant Union verwendet fortschrittliche Sicherheitsmaßnahmen, um Ihre Gelder und persönlichen Daten jederzeit zu schützen.');

doc.addPage();

addHeading1('Häufig Gestellte Fragen');

const faqs = [
  {
    question: 'Wie hoch ist die Mindestanlage?',
    answer: 'Die Mindestanlage beträgt nur 100 $. Sie können klein anfangen und Ihre Investition im Laufe der Zeit ausbauen.'
  },
  {
    question: 'Wie oft werden Provisionen gutgeschrieben?',
    answer: 'Tägliche Provisionen werden alle 24 Stunden gemäß Ihrem gewählten Anlageplan auf Ihr Konto gutgeschrieben. Sie können Ihre Gewinne in Echtzeit in Ihrem Dashboard sehen.'
  },
  {
    question: 'Kann ich vor Ende meiner Anlagefrist abheben?',
    answer: 'Sie können Ihre täglichen Provisionen jederzeit abheben. Ihr Kapital bleibt bis zum Ende der Anlagefrist wie in Ihrem Plan beschrieben gesperrt.'
  },
  {
    question: 'Welche Zahlungsmethoden werden akzeptiert?',
    answer: 'Grant Union akzeptiert Bitcoin und USDT für alle Transaktionen und gewährleistet so schnellen, sicheren und globalen Zugang.'
  },
  {
    question: 'Wie viel kann ich mit Affiliate-Links verdienen?',
    answer: 'Es gibt keine Grenze für Affiliate-Einnahmen. Verdienen Sie 10% jeder Einzahlung, die von jeder Person getätigt wird, die sich mit Ihrem Affiliate-Link registriert. Je mehr Sie werben, desto mehr verdienen Sie.'
  },
  {
    question: 'Wie lange dauert die Auszahlung?',
    answer: 'Auszahlungen werden in wenigen Minuten bearbeitet. Bitcoin- und USDT-Übertragungen werden normalerweise innerhalb von 24 Stunden in der Blockchain bestätigt.'
  },
  {
    question: 'Ist meine Investition sicher?',
    answer: 'Ja. Grant Union verwendet Sicherheitsmaßnahmen auf Industriestandard und unser professionelles Trader-Team stellt sicher, dass Ihre Gelder sorgfältig und sachkundig verwaltet werden.'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('F: ' + faq.question, { width: 480 });
  doc.fontSize(11).fillColor(lightText).font('ArialBold').text('A: ' + faq.answer, { width: 480, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

addHeading1('Kontakt und Support');
addParagraph('Kontaktieren Sie unser engagiertes Support-Team bei Fragen oder für Hilfe:');

addBulletPoint('E-Mail: grantunion583@gmail.com');
addBulletPoint('Website: grantunion.vercel.app');
addBulletPoint('Reaktionszeit: Innerhalb von 24 Stunden');
addBulletPoint('Öffnungszeiten: Support verfügbar 24/7');

addHeading3('Benötigen Sie Hilfe?');
addParagraph('Unser professionelles Support-Team ist rund um die Uhr verfügbar, um Ihnen bei Fragen, Kontoproblemen oder Handelsanfragen zu helfen. Kontaktieren Sie uns jederzeit unter grantunion583@gmail.com!');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. Alle Rechte vorbehalten.', { align: 'center' });
doc.fontSize(9).text('Professioneller Handel | Kryptowährungen | Forex | Gold | Immobilien', { align: 'center' });
doc.text('Dieses Dokument dient nur zu Informationszwecken.', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ PDF auf Deutsch erfolgreich generiert!`);
  console.log(`✓ Datei: ${outputPath}`);
  console.log(`✓ Größe: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ Fehler beim Generieren des PDF:', err.message);
  process.exit(1);
});
