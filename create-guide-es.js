#!/usr/bin/env node

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-es.pdf');
const logoPath = path.join(__dirname, 'public', 'grantunionLogo.png');

// Create a PDF document - optimized for portrait
const doc = new PDFDocument({
  size: 'A4',
  margin: 10,
  bufferPages: true
});

// Pipe to file
doc.pipe(fs.createWriteStream(outputPath));

// Register Arial fonts for better Unicode support
const arialPath = 'C:\\Windows\\Fonts\\arial.ttf';
const arialBoldPath = 'C:\\Windows\\Fonts\\arialbd.ttf';
doc.registerFont('Arial', arialPath);
doc.registerFont('ArialBold', arialBoldPath);

// Define colors
const primaryOrange = '#FF8C37';
const darkPurple = '#1C0F36';

// Helper functions with optimized sizing
function addHeading1(text) {
  doc.fontSize(15).fillColor(darkPurple).font('ArialBold').text(text);
  doc.moveTo(10, doc.y + 2).lineTo(585, doc.y + 2).strokeColor(primaryOrange).lineWidth(2).stroke();
  doc.moveDown(0.35);
}

function addHeading2(text) {
  doc.fontSize(11.5).fillColor(darkPurple).font('ArialBold').text(text);
  doc.moveDown(0.2);
}

function addHeading3(text) {
  doc.fontSize(10.5).fillColor(primaryOrange).font('ArialBold').text(text);
  doc.moveDown(0.15);
}

function addParagraph(text) {
  doc.fontSize(9.5).fillColor('#444').font('Arial').text(text, { width: 510, lineGap: 1.5 });
  doc.moveDown(0.25);
}

function addBulletPoint(text) {
  doc.fontSize(9.5).fillColor('#444').font('Arial').text('• ' + text, { width: 500, lineGap: 1.2 });
  doc.moveDown(0.2);
}

// Header with centered logo
if (fs.existsSync(logoPath)) {
  const pageWidth = doc.page.width;
  const logoWidth = 75;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.image(logoPath, logoX, 15, { width: 75, height: 50 });
  doc.moveDown(3);
}

doc.fontSize(22).fillColor(primaryOrange).font('ArialBold').text('GRANT UNION', { align: 'center' });
doc.fontSize(10).fillColor('#666').font('Arial').text('Plataforma Principal de Inversión y Trading en el Mundo', { align: 'center' });
doc.moveDown(0.6);

// Welcome section
addHeading1('Bienvenido a Grant Union');
addParagraph('Grant Union es la plataforma principal de inversión y trading en el mundo, comprometida a proporcionarle una experiencia de inversión segura, transparente y rentable.');

addHeading2('Acerca de Grant Union');
addParagraph('Somos una empresa profesional de trading especializada en trading de criptomonedas, trading de divisas, oro e inversiones en bienes raíces. Nuestro equipo experto trabaja diligentemente para maximizar los retornos de sus inversiones en Bitcoin con retornos diarios basados en comisiones.');

addHeading3('Inversión Mínima');
addParagraph('Comience con solo $100 y comience a obtener retornos diarios. Después de su período de inversión, puede optar por retirar tanto el capital como las ganancias o reinvertir para un crecimiento continuo.');

// Investment Plans
addHeading1('Planes de Inversión y Retornos');
addParagraph('Grant Union ofrece planes de inversión flexibles con retornos de comisión diaria.');

const tableTop = doc.y;
const col1 = 20;
const col2 = 110;
const col3 = 220;
const col4 = 330;
const col5 = 430;

doc.fontSize(9).font('ArialBold').fillColor('white');
doc.rect(15, tableTop, 565, 22).fillColor(primaryOrange).fill();
doc.text('Plan', col1, tableTop + 6, { width: 90 });
doc.text('Duración', col2, tableTop + 6, { width: 110 });
doc.text('Comisión Diaria', col3, tableTop + 6, { width: 100 });
doc.text('Depósito Mín.', col4, tableTop + 6, { width: 85 });
doc.text('Depósito Máx.', col5, tableTop + 6, { width: 85 });

const rows = [
  ['Plan de 3 Días', '3 días', '8%', '$100', '$999'],
  ['Plan de 7 Días', '7 días', '3%', '$599', '$3,999'],
  ['Plan de 12 Días', '12 días', '3.5%', '$1,000', '$4,999'],
  ['Plan de 15 Días', '15 días', '4%', '$3,000', '$9,000'],
  ['Plan de 3 Meses', '90 días', '4%', '$5,000', '$15,000'],
  ['Plan de 6 Meses', '180 días', '5%', '$15,999', 'Ilimitado']
];

doc.fontSize(9).fillColor('#444').font('ArialBold');
let rowY = tableTop + 22;
rows.forEach((row, idx) => {
  const currentRowY = rowY + (idx * 18);
  if (idx % 2 === 1) {
    doc.rect(15, currentRowY, 565, 18).fillColor('#f9f9f9').fill();
  }
  doc.fillColor('#444');
  doc.text(row[0], col1, currentRowY + 4, { width: 90 });
  doc.text(row[1], col2, currentRowY + 4, { width: 110 });
  doc.text(row[2], col3, currentRowY + 4, { width: 100 });
  doc.text(row[3], col4, currentRowY + 4, { width: 85 });
  doc.text(row[4], col5, currentRowY + 4, { width: 85 });
});

doc.moveDown(4.2);

addHeading3('Ejemplo de Cálculo');
addParagraph('Si invierte $100 en el Plan de 3 Días con una comisión diaria del 8%, puede retirar su capital y ganancias o reinvertir para continuar creciendo.');

addHeading2('Cómo Funciona');
addParagraph('Cuando invierte con Grant Union, nuestro equipo profesional negocia su Bitcoin por la duración de su plan elegido. Después de la finalización, su capital y ganancias se transfieren a su oficina trasera, donde puede optar por retirar o reinvertir para un crecimiento continuo.');

addHeading2('Métodos de Pago');
addParagraph('Grant Union utiliza Bitcoin y USDT para todas las transacciones:');
addBulletPoint('Bitcoin: Transacciones seguras de moneda digital de igual a igual');
addBulletPoint('USDT: Transferencias rápidas y estables de monedas estables con valor confiable');

// Referral Commission
addHeading1('Comisión de Referencia');

addHeading2('Gane Comisión Ilimitada del 10%');
addParagraph('Grant Union ofrece una comisión de referencia ilimitada del 10% en cada depósito realizado por cualquier persona que se registre usando su enlace de referencia único.');

addHeading2('Cómo Ganar Comisiones de Referencia');
addBulletPoint('Comparta su enlace de referencia único con amigos y familiares');
addBulletPoint('Cuando depositan e invierten usando su enlace, gana el 10% de su depósito');
addBulletPoint('Las comisiones se acreditan instantáneamente a su cuenta');
addBulletPoint('Sin límite en la cantidad de referencias que puede hacer');
addBulletPoint('Sin límite en las ganancias totales de referencias');
addBulletPoint('Vea cómo crece su ingreso pasivo a medida que su red se expande');

addHeading3('Potencial de Ganancias Ilimitadas');
addParagraph('Construya su propia red de inversión y gane comisiones del 10%. Sus ganancias pueden crecer exponencialmente a medida que más personas se unan a través de su enlace.');

doc.addPage();

// Withdrawals
addHeading1('Proceso de Retiro');

addHeading2('Retiros Rápidos y Eficientes');
addParagraph('Los retiros son rápidos y eficientes. El proceso toma solo unos minutos, permitiéndole acceder a su capital y ganancias siempre que los necesite.');

addHeading2('Pasos de Retiro');
addBulletPoint('Inicie sesión en su cuenta de Grant Union');
addBulletPoint('Navegue a la sección de Retiro');
addBulletPoint('Seleccione su monto de retiro');
addBulletPoint('Elija su método de pago (Bitcoin o USDT)');
addBulletPoint('Ingrese su dirección de billetera');
addBulletPoint('Envíe su solicitud de retiro');
addBulletPoint('Los fondos se transfieren en minutos');

addHeading2('Métodos Disponibles');
addBulletPoint('Bitcoin: Transferencias de criptomonedas seguras y rápidas');
addBulletPoint('USDT: Transferencias de monedas estables con valor estable');

addHeading3('Acceso Fácil a Sus Fondos');
addParagraph('Ya sea que desee retirar su capital después de que finalice su período de inversión o tomar sus comisiones diarias, Grant Union lo hace rápido y conveniente.');

// Security
addHeading1('Seguridad y Protección');

addHeading2('Nuestro Compromiso con Su Seguridad');
addParagraph('Grant Union se compromete a mantener los más altos estándares de seguridad y proteger su inversión.');

addHeading2('Características de Seguridad');
addBulletPoint('Cifrado de nivel industrial para toda transmisión de datos');
addBulletPoint('Infraestructura en la nube segura');
addBulletPoint('Auditorías de seguridad regular y verificaciones de cumplimiento');
addBulletPoint('Equipo profesional de trading monitoreando sus inversiones');
addBulletPoint('Historial de transacciones transparente e informes');

addHeading2('Protegiendo Su Cuenta');
addBulletPoint('Use una contraseña fuerte y única para su cuenta');
addBulletPoint('Nunca comparta sus credenciales de inicio de sesión con nadie');
addBulletPoint('Mantenga su dirección de correo electrónico segura y monitoreada');
addBulletPoint('Habilite notificaciones por correo electrónico para todas las transacciones');
addBulletPoint('Reporte cualquier actividad sospechosa inmediatamente');

addHeading3('Su Seguridad Es Nuestra Prioridad');
addParagraph('Grant Union emplea medidas de seguridad avanzadas para proteger sus fondos e información personal en todo momento.');

doc.addPage();

// FAQ
addHeading1('Preguntas Frecuentes');

const faqs = [
  {
    question: '¿Cuál es la cantidad de inversión mínima?',
    answer: 'La inversión mínima es solo $100. Puede comenzar poco a poco y hacer crecer su inversión con el tiempo.'
  },
  {
    question: '¿Con qué frecuencia se acreditan las comisiones?',
    answer: 'Las comisiones diarias se acreditan a su cuenta cada 24 horas según su plan de inversión elegido. Puede ver sus ganancias en tiempo real en su panel.'
  },
  {
    question: '¿Puedo retirar antes de que termine mi período de inversión?',
    answer: 'Puede retirar sus comisiones diarias en cualquier momento. Su capital permanece bloqueado hasta que se complete el período de inversión según se describe en su plan.'
  },
  {
    question: '¿Qué métodos de pago se aceptan?',
    answer: 'Grant Union acepta Bitcoin y USDT para todas las transacciones, asegurando accesibilidad rápida, segura y global.'
  },
  {
    question: '¿Cuánto puedo ganar de las referencias?',
    answer: 'No hay límite en las ganancias de referencias. Gana el 10% de cada depósito realizado por cualquiera que se registre usando su enlace de referencia. Cuantas más referencias haga, más gana.'
  },
  {
    question: '¿Cuánto tiempo tarda el retiro?',
    answer: 'Los retiros se procesan en minutos. Las transferencias de Bitcoin y USDT generalmente se confirman en la cadena de bloques dentro de 24 horas.'
  },
  {
    question: '¿Es segura mi inversión?',
    answer: 'Sí. Grant Union emplea medidas de seguridad de nivel industrial y nuestro equipo profesional de trading asegura que sus fondos se administren con cuidado y experiencia.'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(10).fillColor(primaryOrange).font('ArialBold').text('P: ' + faq.question, { width: 500 });
  doc.fontSize(9.5).fillColor('#444').font('Arial').text('R: ' + faq.answer, { width: 500, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

// Contact
addHeading1('Contacto y Soporte');
addParagraph('Póngase en contacto con nuestro equipo de soporte dedicado para cualquier pregunta o asistencia:');

addBulletPoint('Correo Electrónico: grantunion583@gmail.com');
addBulletPoint('Sitio Web: grantunion.vercel.app');
addBulletPoint('Tiempo de Respuesta: Dentro de 24 horas');
addBulletPoint('Horarios: Soporte Disponible 24/7');

addHeading3('¿Necesita Ayuda?');
addParagraph('Nuestro equipo de soporte profesional está disponible las 24 horas para ayudarle con cualquier pregunta, problema de cuenta o consulta de trading. ¡Contáctenos en cualquier momento en grantunion583@gmail.com!');

doc.moveDown(0.5);

// Footer
doc.fontSize(9).fillColor('#666').font('Arial').text('© 2026 Grant Union. Todos los derechos reservados.', { align: 'center' });
doc.fontSize(8).text('Trading Profesional | Criptomonedas | Divisas | Oro | Bienes Raíces', { align: 'center' });
doc.text('Este documento es solo con fines informativos.', { align: 'center' });

// Finalize PDF
doc.end();

// Handle completion
doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ PDF en español generado exitosamente!`);
  console.log(`✓ Archivo: ${outputPath}`);
  console.log(`✓ Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ Error generando PDF:', err.message);
  process.exit(1);
});
