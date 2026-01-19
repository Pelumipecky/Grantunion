#!/usr/bin/env node
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const lang = 'it';
const outputPath = path.join(__dirname, 'public', 'downloads', `guide-${lang}.pdf`);
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
addHeading1('Benvenuto in Grant Union');
addParagraph('Benvenuto in Grant Union, la principale piattaforma di investimento e trading nel mondo. Ci impegniamo a offrirti un\'esperienza di investimento sicura, trasparente e redditizia.');
addHeading2('Su Grant Union');
addParagraph('Grant Union è un\'azienda di trading professionale specializzata in trading di criptovalute, trading forex, oro e investimenti immobiliari. Il nostro team di trader professionisti lavora diligentemente per massimizzare i rendimenti dei tuoi investimenti in Bitcoin.');
addHeading3('Investimento Minimo');
addParagraph('L\'azienda offre una commissione giornaliera in base al tuo piano di investimento. Con un deposito minimo di soli 100 dollari, puoi iniziare a guadagnare. Dopo il tuo periodo di investimento, puoi scegliere di prelevare sia il capitale che i profitti o reinvestire per una crescita continua.');
addHeading1('Piani di Investimento e Rendimenti');
addParagraph('I nostri Piani di Investimento:');
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
  ['Piano 3 Giorni', '3 giorni', '8%', '$100', '$999'],
  ['Piano 7 Giorni', '7 giorni', '3%', '$599', '$3,999'],
  ['Piano 12 Giorni', '12 giorni', '3.5%', '$1,000', '$4,999'],
  ['Piano 15 Giorni', '15 giorni', '4%', '$3,000', '$9,000'],
  ['Piano 3 Mesi', '90 giorni', '4%', '$5,000', '$15,000'],
  ['Piano 6 Mesi', '180 giorni', '5%', '$15,999', 'Illimitato']
];
doc.fontSize(10).fillColor(lightText).font('ArialBold');
let rowY = tableTop + 22;
rows.forEach((row, idx) => {const currentRowY = rowY + (idx * 18);if (idx % 2 === 1) {doc.rect(15, currentRowY, 565, 18).fillColor('#f9f9f9').fill();}doc.fillColor(lightText);doc.text(row[0], col1, currentRowY + 4, { width: 90 });doc.text(row[1], col2, currentRowY + 4, { width: 110 });doc.text(row[2], col3, currentRowY + 4, { width: 100 });doc.text(row[3], col4, currentRowY + 4, { width: 85 });doc.text(row[4], col5, currentRowY + 4, { width: 85 });});
doc.addPage();
addHeading3('Esempio di Calcolo');
addParagraph('Se investi 100 dollari nel piano 3 giorni all\'8% giornaliero, dopo 3 giorni guadagnerai 24 dollari. Puoi scegliere di prelevare il tuo capitale e i profitti o reinvestire.');
doc.moveDown(0.3);
addHeading2('Come Funziona');
addParagraph('Quando investi con Grant Union, il nostro team professionale di trader negozia il tuo Bitcoin per la durata del tuo piano scelto (ad esempio, 3 giorni). Dopo il periodo di investimento, il tuo capitale e i profitti vengono trasferiti al tuo back office, dove puoi scegliere di prelevare o reinvestire.');
doc.moveDown(0.3);
addHeading2('Metodi di Pagamento');
addParagraph('Grant Union utilizza Bitcoin e USDT per tutte le transazioni sulla piattaforma, garantendo accesso rapido, sicuro e globale.');
doc.moveDown(1);
doc.addPage();
addHeading1('Commissione di Referenza');
addHeading2('Guadagna Commissione Illimitata del 10%');
addParagraph('Grant Union offre una commissione di referenza illimitata del 10% a tutti gli investitori! Guadagna il 10% di ogni deposito effettuato da chiunque si registri utilizzando il tuo link di referenza univoco.');
addHeading2('Come Funziona');
addParagraph('Quando investi con Grant Union, il nostro team professionale di trader negozia il tuo Bitcoin per la durata del tuo piano scelto. Dopo il periodo di investimento, il tuo capitale e i profitti vengono trasferiti al tuo back office, dove puoi scegliere di prelevare o reinvestire.');
addHeading1('Processo di Prelievo');
addHeading2('Prelievi Veloci ed Efficienti');
addParagraph('I prelievi sono veloci ed efficienti. Il processo richiede solo pochi minuti e al massimo 24 ore.');
addHeading2('Passaggi di Prelievo');
addBulletPoint('Accedi al tuo account Grant Union');
addBulletPoint('Vai alla sezione Prelievo');
addBulletPoint('Seleziona l\'importo del prelievo');
addBulletPoint('Scegli il tuo metodo di pagamento (Bitcoin o USDT)');
addBulletPoint('Inserisci l\'indirizzo del tuo portafoglio');
addBulletPoint('Invia la tua richiesta di prelievo');
addBulletPoint('I fondi vengono trasferiti in pochi minuti');
addHeading2('Metodi Disponibili');
addBulletPoint('Bitcoin: trasferimenti di criptovalute sicuri e veloci');
addBulletPoint('USDT: trasferimenti di stablecoin con valore stabile');
addHeading3('Accesso Facile ai Tuoi Fondi');
addParagraph('Che tu voglia prelevare il tuo capitale dopo la fine del tuo periodo di investimento o prendere le tue commissioni giornaliere, Grant Union lo rende veloce e conveniente.');
addHeading1('Sicurezza e Protezione');
addHeading2('Il Nostro Impegno per la Tua Sicurezza');
addParagraph('Grant Union si impegna a mantenere gli standard di sicurezza più elevati e proteggere il tuo investimento.');
addHeading2('Funzionalità di Sicurezza');
addBulletPoint('Crittografia a livello industriale per tutta la trasmissione dei dati');
addBulletPoint('Infrastruttura cloud sicura');
addBulletPoint('Audit di sicurezza regolari e controlli di conformità');
addBulletPoint('Team di trader professionali che monitorano i tuoi investimenti');
addBulletPoint('Cronologia delle transazioni trasparente e rapporti');
addHeading2('Protezione del Tuo Account');
addBulletPoint('Usa una password forte e unica per il tuo account');
addBulletPoint('Non condividere mai le tue credenziali di accesso con nessuno');
addBulletPoint('Mantieni il tuo indirizzo email sicuro e monitorato');
addBulletPoint('Abilita le notifiche email per tutte le transazioni');
addBulletPoint('Segnala immediatamente qualsiasi attività sospetta');
addHeading3('La Tua Sicurezza è la Nostra Priorità');
addParagraph('Grant Union utilizza misure di sicurezza avanzate per proteggere i tuoi fondi e le tue informazioni personali in ogni momento.');
doc.addPage();
addHeading1('Domande Frequenti');
const faqs = [
  {question: 'Qual è l\'importo minimo di investimento?', answer: 'L\'investimento minimo è solo 100 dollari. Puoi iniziare in piccolo e far crescere il tuo investimento nel tempo.'},
  {question: 'Con quale frequenza vengono accreditate le commissioni?', answer: 'Le commissioni giornaliere vengono accreditate al tuo account ogni 24 ore secondo il tuo piano di investimento scelto. Puoi vedere i tuoi guadagni in tempo reale nel tuo dashboard.'},
  {question: 'Posso prelevare prima della fine del mio periodo di investimento?', answer: 'Puoi prelevare le tue commissioni giornaliere in qualsiasi momento. Il tuo capitale rimane bloccato fino al completamento del periodo di investimento come descritto nel tuo piano.'},
  {question: 'Quali metodi di pagamento sono accettati?', answer: 'Grant Union accetta Bitcoin e USDT per tutte le transazioni, garantendo accesso rapido, sicuro e globale.'},
  {question: 'Quanto posso guadagnare dai referral?', answer: 'Non c\'è limite ai guadagni dai referral. Guadagna il 10% di ogni deposito effettuato da chiunque si registri utilizzando il tuo link di referenza. Più fai referral, più guadagni.'},
  {question: 'Quanto tempo impiega il prelievo?', answer: 'I prelievi vengono elaborati in pochi minuti. I trasferimenti di Bitcoin e USDT di solito vengono confermati sulla blockchain entro 24 ore.'},
  {question: 'Il mio investimento è al sicuro?', answer: 'Sì. Grant Union utilizza misure di sicurezza a livello industriale e il nostro team di trader professionisti garantisce che i tuoi fondi vengono gestiti con cura e competenza.'}
];
faqs.forEach((faq, idx) => {doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('D: ' + faq.question, { width: 480 });doc.fontSize(11).fillColor(lightText).font('ArialBold').text('R: ' + faq.answer, { width: 480, lineGap: 1.3 });if (idx < faqs.length - 1) {doc.moveDown(0.3);}});
addHeading1('Contatti e Supporto');
addParagraph('Contatta il nostro team di supporto dedicato per qualsiasi domanda o assistenza:');
addBulletPoint('Email: grantunion583@gmail.com');
addBulletPoint('Sito Web: grantunion.vercel.app');
addBulletPoint('Tempo di Risposta: Entro 24 ore');
addBulletPoint('Orari: Supporto Disponibile 24/7');
addHeading3('Hai Bisogno di Aiuto?');
addParagraph('Il nostro team di supporto professionale è disponibile 24 ore per aiutarti con qualsiasi domanda, problema di account o richiesta di trading. Contattaci in qualsiasi momento su grantunion583@gmail.com!');
doc.moveDown(0.5);
doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. Tutti i diritti riservati.', { align: 'center' });
doc.fontSize(9).text('Trading Professionale | Criptovalute | Forex | Oro | Immobiliare', { align: 'center' });
doc.text('Questo documento è solo a scopo informativo.', { align: 'center' });
doc.end();
doc.on('finish', () => {const stats = fs.statSync(outputPath);console.log(`✓ PDF italiano generato con successo!`);console.log(`✓ File: ${outputPath}`);console.log(`✓ Dimensione: ${(stats.size / 1024).toFixed(2)} KB`);});
doc.on('error', (err) => {console.error('✗ Errore durante la generazione del PDF:', err.message);process.exit(1);});
