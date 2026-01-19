#!/usr/bin/env node

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-fr.pdf');
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

addHeading1('Bienvenue chez Grant Union');
addParagraph('Bienvenue chez Grant Union, la plateforme d\'investissement et de trading principaux au monde. Nous nous engageons à vous fournir une expérience d\'investissement sûre, transparente et rentable.');

addHeading2('À Propos de Grant Union');
addParagraph('Grant Union est une entreprise de trading professionnelle spécialisée dans le trading de cryptomonnaies, le trading forex, l\'or et les investissements immobiliers. Notre équipe de traders professionnels travaille avec diligence pour maximiser les rendements de vos investissements Bitcoin.');

addHeading3('Investissement Minimum');
addParagraph('L\'entreprise offre une commission quotidienne en fonction de votre plan d\'investissement. Avec un dépôt minimum de seulement 100 $, vous pouvez commencer à gagner. Après votre période d\'investissement, vous pouvez choisir de retirer votre capital et vos bénéfices ou de réinvestir pour une croissance continue.');

addHeading1('Plans d\'Investissement et Rendements');
addParagraph('Nos Plans d\'Investissement :');

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
doc.text('Durée', col2, tableTop + 6, { width: 110 });
doc.text('Commission Quotidienne', col3, tableTop + 6, { width: 100 });
doc.text('Dép. Min.', col4, tableTop + 6, { width: 85 });
doc.text('Dép. Max.', col5, tableTop + 6, { width: 85 });

const rows = [
  ['Plan 3 Jours', '3 jours', '8%', '$100', '$999'],
  ['Plan 7 Jours', '7 jours', '3%', '$599', '$3,999'],
  ['Plan 12 Jours', '12 jours', '3.5%', '$1,000', '$4,999'],
  ['Plan 15 Jours', '15 jours', '4%', '$3,000', '$9,000'],
  ['Plan 3 Mois', '90 jours', '4%', '$5,000', '$15,000'],
  ['Plan 6 Mois', '180 jours', '5%', '$15,999', 'Illimité']
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

addHeading3('Exemple de Calcul');
addParagraph('Si vous investissez 100 $ dans le plan 3 jours à 8% par jour, après 3 jours vous gagnerez 24,00 $. Vous pouvez choisir de retirer votre capital et vos bénéfices ou de réinvestir.');

doc.moveDown(0.3);

addHeading2('Comment Cela Fonctionne');
addParagraph('Lorsque vous investissez avec Grant Union, notre équipe professionnelle de traders négocie votre Bitcoin pour la durée de votre plan choisi (par exemple, 3 jours). Après la période d\'investissement, votre capital et vos bénéfices sont transférés à votre back-office, où vous pouvez choisir de retirer ou de réinvestir.');

doc.moveDown(0.3);

addHeading2('Méthodes de Paiement');
addParagraph('Grant Union utilise Bitcoin et USDT pour toutes les transactions sur la plateforme, assurant un accès rapide, sûr et mondial.');

doc.moveDown(1);

doc.addPage();

addHeading1('Commission de Parrainage');

addHeading2('Gagnez une Commission Illimitée de 10%');
addParagraph('Grant Union offre une commission de parrainage illimitée de 10% à tous les investisseurs ! Gagnez 10% de chaque dépôt effectué par toute personne qui s\'inscrit en utilisant votre lien de parrainage unique.');

addHeading2('Comment Cela Fonctionne');
addParagraph('Lorsque vous investissez avec Grant Union, notre équipe professionnelle de traders négocie votre Bitcoin pour la durée de votre plan choisi (par exemple, 3 jours). Après la période d\'investissement, votre capital et vos bénéfices sont transférés à votre back-office, où vous pouvez choisir de retirer ou de réinvestir.');

addHeading1('Processus de Retrait');

addHeading2('Retraits Rapides et Efficaces');
addParagraph('Les retraits sont rapides et efficaces. Le processus ne prend que quelques minutes et au maximum 24 heures.');

addHeading2('Étapes de Retrait');
addBulletPoint('Connectez-vous à votre compte Grant Union');
addBulletPoint('Accédez à la section Retrait');
addBulletPoint('Sélectionnez votre montant de retrait');
addBulletPoint('Choisissez votre méthode de paiement (Bitcoin ou USDT)');
addBulletPoint('Entrez votre adresse de portefeuille');
addBulletPoint('Soumettez votre demande de retrait');
addBulletPoint('Les fonds sont transférés en quelques minutes');

addHeading2('Méthodes Disponibles');
addBulletPoint('Bitcoin : Transferts de cryptomonnaies sûrs et rapides');
addBulletPoint('USDT : Transferts de pièces stables avec valeur stable');

addHeading3('Accès Facile à Vos Fonds');
addParagraph('Que vous souhaitiez retirer votre capital après la fin de votre période d\'investissement ou prendre vos commissions quotidiennes, Grant Union le rend rapide et pratique.');

addHeading1('Sécurité et Protection');

addHeading2('Notre Engagement envers Votre Sécurité');
addParagraph('Grant Union s\'engage à maintenir les normes de sécurité les plus élevées et à protéger votre investissement.');

addHeading2('Fonctionnalités de Sécurité');
addBulletPoint('Chiffrement au niveau industriel pour toutes les transmissions de données');
addBulletPoint('Infrastructure cloud sécurisée');
addBulletPoint('Audits de sécurité réguliers et vérifications de conformité');
addBulletPoint('Équipe professionnelle de traders surveillant vos investissements');
addBulletPoint('Historique des transactions transparent et rapports');

addHeading2('Protection de Votre Compte');
addBulletPoint('Utilisez un mot de passe fort et unique pour votre compte');
addBulletPoint('Ne partagez jamais vos identifiants de connexion avec quiconque');
addBulletPoint('Gardez votre adresse e-mail sécurisée et surveillée');
addBulletPoint('Activez les notifications par e-mail pour toutes les transactions');
addBulletPoint('Signalez immédiatement toute activité suspecte');

addHeading3('Votre Sécurité Est Notre Priorité');
addParagraph('Grant Union utilise des mesures de sécurité avancées pour protéger vos fonds et vos informations personnelles à tout moment.');

doc.addPage();

addHeading1('Questions Fréquemment Posées');

const faqs = [
  {
    question: 'Quel est le montant d\'investissement minimum ?',
    answer: 'Le montant d\'investissement minimum est seulement 100 $. Vous pouvez commencer peu à peu et développer votre investissement au fil du temps.'
  },
  {
    question: 'À quelle fréquence les commissions sont-elles créditées ?',
    answer: 'Les commissions quotidiennes sont créditées à votre compte toutes les 24 heures selon le plan d\'investissement choisi. Vous pouvez voir vos gains en temps réel dans votre tableau de bord.'
  },
  {
    question: 'Puis-je retirer avant la fin de ma période d\'investissement ?',
    answer: 'Vous pouvez retirer vos commissions quotidiennes à tout moment. Votre capital reste bloqué jusqu\'à la fin de la période d\'investissement comme décrit dans votre plan.'
  },
  {
    question: 'Quelles méthodes de paiement sont acceptées ?',
    answer: 'Grant Union accepte Bitcoin et USDT pour toutes les transactions, assurant un accès rapide, sûr et mondial.'
  },
  {
    question: 'Combien puis-je gagner grâce aux parrainages ?',
    answer: 'Il n\'y a pas de limite aux gains de parrainage. Gagnez 10% de chaque dépôt effectué par toute personne qui s\'inscrit en utilisant votre lien de parrainage. Plus vous parrinez, plus vous gagnez.'
  },
  {
    question: 'Combien de temps prend le retrait ?',
    answer: 'Les retraits sont traités en quelques minutes. Les transferts Bitcoin et USDT sont généralement confirmés sur la blockchain dans les 24 heures.'
  },
  {
    question: 'Mon investissement est-il sûr ?',
    answer: 'Oui. Grant Union utilise des mesures de sécurité au niveau industriel et notre équipe professionnelle de traders garantit que vos fonds sont gérés avec soin et expertise.'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('Q: ' + faq.question, { width: 480 });
  doc.fontSize(11).fillColor(lightText).font('ArialBold').text('R: ' + faq.answer, { width: 480, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

addHeading1('Contact et Support');
addParagraph('Contactez notre équipe d\'assistance dédiée pour toute question ou assistance :');

addBulletPoint('E-mail : grantunion583@gmail.com');
addBulletPoint('Site Web : grantunion.vercel.app');
addBulletPoint('Temps de Réponse : Dans les 24 heures');
addBulletPoint('Horaires : Support Disponible 24/7');

addHeading3('Besoin d\'Aide ?');
addParagraph('Notre équipe d\'assistance professionnelle est disponible 24h/24 pour vous aider avec toute question, problème de compte ou demande de trading. Contactez-nous à tout moment sur grantunion583@gmail.com !');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. Tous droits réservés.', { align: 'center' });
doc.fontSize(9).text('Trading Professionnel | Cryptomonnaies | Forex | Or | Immobilier', { align: 'center' });
doc.text('Ce document est fourni à titre informatif uniquement.', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ PDF en français généré avec succès!`);
  console.log(`✓ Fichier: ${outputPath}`);
  console.log(`✓ Taille: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ Erreur lors de la génération du PDF:', err.message);
  process.exit(1);
});
