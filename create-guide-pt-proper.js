#!/usr/bin/env node
const PDFDocument = require('pdfkit'), fs = require('fs'), path = require('path');
const lang = 'pt', outputPath = path.join(__dirname, 'public', 'downloads', `guide-${lang}.pdf`), logoPath = path.join(__dirname, 'public', 'grantunionLogo.png');
const doc = new PDFDocument({size: 'A4', margin: 15, bufferPages: true});
doc.pipe(fs.createWriteStream(outputPath));

// Register Arial fonts for better Unicode support across all languages
const arialPath = 'C:\\Windows\\Fonts\\arial.ttf';
const arialBoldPath = 'C:\\Windows\\Fonts\\arialbd.ttf';
doc.registerFont('Arial', arialPath);
doc.registerFont('ArialBold', arialBoldPath);
const primaryOrange = '#FF8C37', lightText = '#444', white = '#ffffff';
function addHeading1(t) {doc.fontSize(18).fillColor(primaryOrange).font('ArialBold').text(t);doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primaryOrange).lineWidth(2.5).stroke();doc.moveDown(0.35);}
function addHeading2(t) {doc.fontSize(13).fillColor(primaryOrange).font('ArialBold').text(t);doc.moveDown(0.2);}
function addHeading3(t) {doc.fontSize(12).fillColor(primaryOrange).font('ArialBold').text(t);doc.moveDown(0.15);}
function addParagraph(t) {doc.fontSize(10.5).fillColor(lightText).font('ArialBold').text(t, { width: 490, lineGap: 1.5 });doc.moveDown(0.25);}
function addBulletPoint(t) {doc.fontSize(10.5).fillColor(lightText).font('ArialBold').text('• ' + t, { width: 480, lineGap: 1.2 });doc.moveDown(0.2);}
if (fs.existsSync(logoPath)) {const w = doc.page.width, lw = 75, lx = (w - lw) / 2;doc.image(logoPath, lx, 15, { width: 75, height: 50 });doc.moveDown(3);}
doc.fontSize(26).fillColor(primaryOrange).font('ArialBold').text('GRANT UNION', { align: 'center' });doc.moveDown(0.6);
addHeading1('Bem-vindo ao Grant Union');
addParagraph('Bem-vindo ao Grant Union, a principal plataforma de investimento e trading do mundo. Estamos comprometidos em fornecer a você uma experiência de investimento segura, transparente e lucrativa.');
addHeading2('Sobre Grant Union');
addParagraph('Grant Union é uma empresa de trading profissional especializada em negociação de criptomoedas, trading forex, ouro e investimentos imobiliários. Nosso time de traders profissionais trabalha diligentemente para maximizar os retornos de seus investimentos em Bitcoin.');
addHeading3('Investimento Mínimo');
addParagraph('A empresa oferece comissão diária com base em seu plano de investimento. Com um depósito mínimo de apenas $100, você pode começar a ganhar. Após seu período de investimento, você pode optar por sacar seu capital e lucros ou reinvestir para crescimento contínuo.');
addHeading1('Planos de Investimento e Retornos');
addParagraph('Nossos Planos de Investimento:');
const t = doc.y, c1 = 20, c2 = 110, c3 = 220, c4 = 330, c5 = 430;
doc.fontSize(11).font('ArialBold').fillColor(white);
doc.rect(15, t, 565, 22).fillColor(primaryOrange).fill();
doc.fillColor(white);
doc.text('Plan', c1, t + 6, { width: 90 });
doc.text('Duration', c2, t + 6, { width: 110 });
doc.text('Daily Commission', c3, t + 6, { width: 100 });
doc.text('Min. Deposit', c4, t + 6, { width: 85 });
doc.text('Max. Deposit', c5, t + 6, { width: 85 });
const r = [
  ['Plano de 3 Dias', '3 dias', '8%', '$100', '$999'],
  ['Plano de 7 Dias', '7 dias', '3%', '$599', '$3,999'],
  ['Plano de 12 Dias', '12 dias', '3.5%', '$1,000', '$4,999'],
  ['Plano de 15 Dias', '15 dias', '4%', '$3,000', '$9,000'],
  ['Plano de 3 Meses', '90 dias', '4%', '$5,000', '$15,000'],
  ['Plano de 6 Meses', '180 dias', '5%', '$15,999', 'Ilimitado']
];
doc.fontSize(10).fillColor(lightText).font('ArialBold');
let ry = t + 22;
r.forEach((row, i) => {const cy = ry + (i * 18);if (i % 2 === 1) {doc.rect(15, cy, 565, 18).fillColor('#f9f9f9').fill();}doc.fillColor(lightText);doc.text(row[0], c1, cy + 4, { width: 90 });doc.text(row[1], c2, cy + 4, { width: 110 });doc.text(row[2], c3, cy + 4, { width: 100 });doc.text(row[3], c4, cy + 4, { width: 85 });doc.text(row[4], c5, cy + 4, { width: 85 });});
doc.addPage();
addHeading3('Exemplo de Cálculo');
addParagraph('Se você investir $100 no plano de 3 dias com 8% ao dia, após 3 dias ganhará $24,00. Você pode optar por sacar seu capital e lucros ou reinvestir.');
doc.moveDown(0.3);
addHeading2('Como Funciona');
addParagraph('Quando você investe com Grant Union, nosso time profissional de traders negocia seu Bitcoin pela duração do seu plano escolhido (por exemplo, 3 dias). Após o período de investimento, seu capital e lucros são transferidos para seu back office, onde você pode optar por sacar ou reinvestir.');
doc.moveDown(0.3);
addHeading2('Métodos de Pagamento');
addParagraph('Grant Union usa Bitcoin e USDT para todas as transações na plataforma, garantindo acesso rápido, seguro e global.');
doc.moveDown(1);
doc.addPage();
addHeading1('Comissão de Afiliado');
addHeading2('Ganhe Comissão Ilimitada de 10%');
addParagraph('Grant Union oferece comissão de afiliado ilimitada de 10% para todos os investidores! Ganhe 10% de cada depósito feito por qualquer pessoa que se registre usando seu link de afiliado único.');
addHeading2('Como Funciona');
addParagraph('Quando você investe com Grant Union, nosso time profissional de traders negocia seu Bitcoin pela duração do seu plano escolhido. Após o período de investimento, seu capital e lucros são transferidos para seu back office, onde você pode optar por sacar ou reinvestir.');
addHeading1('Processo de Saque');
addHeading2('Saques Rápidos e Eficientes');
addParagraph('Os saques são rápidos e eficientes. O processo leva apenas alguns minutos e no máximo 24 horas.');
addHeading2('Etapas de Saque');
addBulletPoint('Faça login em sua conta Grant Union');
addBulletPoint('Navegue até a seção Saque');
addBulletPoint('Selecione seu valor de saque');
addBulletPoint('Escolha seu método de pagamento (Bitcoin ou USDT)');
addBulletPoint('Insira o endereço de sua carteira');
addBulletPoint('Envie sua solicitação de saque');
addBulletPoint('Os fundos são transferidos em poucos minutos');
addHeading2('Métodos Disponíveis');
addBulletPoint('Bitcoin: transferências seguras e rápidas de criptomoedas');
addBulletPoint('USDT: transferências de stablecoin com valor estável');
addHeading3('Acesso Fácil aos Seus Fundos');
addParagraph('Se você deseja sacar seu capital após o término do seu período de investimento ou receber suas comissões diárias, Grant Union torna rápido e conveniente.');
addHeading1('Segurança e Proteção');
addHeading2('Nosso Compromisso com Sua Segurança');
addParagraph('Grant Union está comprometida em manter os mais altos padrões de segurança e proteger seu investimento.');
addHeading2('Recursos de Segurança');
addBulletPoint('Criptografia de nível industrial para todas as transmissões de dados');
addBulletPoint('Infraestrutura de nuvem segura');
addBulletPoint('Auditorias de segurança regulares e verificações de conformidade');
addBulletPoint('Equipe profissional de traders monitorando seus investimentos');
addBulletPoint('Histórico de transações transparente e relatórios');
addHeading2('Protegendo Sua Conta');
addBulletPoint('Use uma senha forte e única para sua conta');
addBulletPoint('Nunca compartilhe suas credenciais de login com ninguém');
addBulletPoint('Mantenha seu endereço de email seguro e monitorado');
addBulletPoint('Ative notificações por email para todas as transações');
addBulletPoint('Reporte qualquer atividade suspeita imediatamente');
addHeading3('Sua Segurança é Nossa Prioridade');
addParagraph('Grant Union emprega medidas de segurança avançadas para proteger seus fundos e informações pessoais a todo tempo.');
doc.addPage();
addHeading1('Perguntas Frequentes');
const f = [
  {q: 'Qual é o valor mínimo de investimento?', a: 'O investimento mínimo é apenas $100. Você pode começar pequeno e crescer seu investimento ao longo do tempo.'},
  {q: 'Com que frequência as comissões são creditadas?', a: 'As comissões diárias são creditadas em sua conta a cada 24 horas de acordo com seu plano de investimento escolhido. Você pode ver seus ganhos em tempo real no seu painel.'},
  {q: 'Posso sacar antes do fim do meu período de investimento?', a: 'Você pode sacar suas comissões diárias a qualquer momento. Seu capital permanece travado até que o período de investimento seja concluído conforme descrito em seu plano.'},
  {q: 'Quais métodos de pagamento são aceitos?', a: 'Grant Union aceita Bitcoin e USDT para todas as transações, garantindo acesso rápido, seguro e global.'},
  {q: 'Quanto posso ganhar com afiliados?', a: 'Não há limite nos ganhos com afiliados. Ganhe 10% de cada depósito feito por qualquer pessoa que se registre usando seu link de afiliado. Quanto mais você indicar, mais ganha.'},
  {q: 'Quanto tempo leva para sacar?', a: 'Os saques são processados em poucos minutos. Transferências de Bitcoin e USDT geralmente são confirmadas na blockchain em 24 horas.'},
  {q: 'Meu investimento é seguro?', a: 'Sim. Grant Union usa medidas de segurança de nível industrial e nossa equipe profissional de traders garante que seus fundos sejam gerenciados com cuidado e expertise.'}
];
f.forEach((faq, i) => {doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('P: ' + faq.q, { width: 480 });doc.fontSize(11).fillColor(lightText).font('ArialBold').text('R: ' + faq.a, { width: 480, lineGap: 1.3 });if (i < f.length - 1) {doc.moveDown(0.3);}});
addHeading1('Contato e Suporte');
addParagraph('Entre em contato com nossa equipe de suporte dedicada para qualquer pergunta ou assistência:');
addBulletPoint('Email: grantunion583@gmail.com');
addBulletPoint('Site: grantunion.vercel.app');
addBulletPoint('Tempo de Resposta: Dentro de 24 horas');
addBulletPoint('Horários: Suporte Disponível 24/7');
addHeading3('Precisa de Ajuda?');
addParagraph('Nossa equipe profissional de suporte está disponível 24 horas para ajudá-lo com qualquer pergunta, problema de conta ou consulta de trading. Entre em contato conosco a qualquer momento em grantunion583@gmail.com!');
doc.moveDown(0.5);
doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. Todos os direitos reservados.', { align: 'center' });
doc.fontSize(9).text('Trading Profissional | Criptomoedas | Forex | Ouro | Imóveis', { align: 'center' });
doc.text('Este documento é apenas para fins informativos.', { align: 'center' });
doc.end();
doc.on('finish', () => {const s = fs.statSync(outputPath);console.log(`✓ PDF português gerado com sucesso!`);console.log(`✓ Arquivo: ${outputPath}`);console.log(`✓ Tamanho: ${(s.size / 1024).toFixed(2)} KB`);});
doc.on('error', (e) => {console.error('✗ Erro ao gerar PDF:', e.message);process.exit(1);});
