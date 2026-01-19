#!/usr/bin/env node
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Language translations object
const translations = {
  'nl': {h1: 'Welkom bij Grant Union', h2a: 'Over Grant Union', para1: 'Grant Union is een professioneel handelsbedrijf dat gespecialiseerd is in cryptocurrency trading, forex trading, goud en onroerendgoedenbeleggingen. Ons team van professionele handelaren werkt voortvarend om de rendementen van uw Bitcoin-investeringen te maximaliseren.', h3: 'Minimaal Beleggingsbedrag', para2: 'Het bedrijf biedt dagelijkse provisie op basis van uw investeringsplan. Met een minimale storting van slechts $100 kunt u beginnen met verdienen. Na uw investeringsperiode kunt u ervoor kiezen om zowel uw kapitaal als uw winsten op te nemen of opnieuw te beleggen voor voortdurende groei.'},
  'pl': {h1: 'Witamy w Grant Union', h2a: 'O Grant Union', para1: 'Grant Union to profesjonalna firma handlowa specjalizująca się w handlu kryptowalutami, handlu forex, złocie i inwestycjach w nieruchomości. Nasz zespół profesjonalnych traderów pracuje pilnie, aby zmaksymalizować zwroty z Twoich inwestycji w Bitcoin.', h3: 'Minimalna Kwota Inwestycji', para2: 'Firma oferuje dzienną prowizję na podstawie Twojego planu inwestycji. Z minimalnym depozytem zaledwie $100 możesz zacząć zarabiać. Po okresie inwestycji możesz wybrać wycofanie zarówno kapitału, jak i zysków, lub reinwestowanie na stały wzrost.'},
  'tr': {h1: 'Grant Union\'a Hoş Geldiniz', h2a: 'Grant Union Hakkında', para1: 'Grant Union, kripto para ticareti, forex ticareti, altın ve gayrimenkul yatırımlarında uzmanlaşan profesyonel bir ticaret şirketidir. Profesyonel tüccar ekibimiz, Bitcoin yatırımlarınızın getirilerini maksimize etmek için çalışmaktadır.', h3: 'Asgari Yatırım', para2: 'Şirket, yatırım planınıza dayalı olarak günlük komisyon sunmaktadır. Sadece 100 dolarlık minimum mevduat ile kazanmaya başlayabilirsiniz. Yatırım döneminizin ardından, hem sermayeyi hem de karları çekmeyi seçebilir veya sürekli büyüme için yeniden yatırım yapabilirsiniz.'},
  'hi': {h1: 'Grant Union में आपका स्वागत है', h2a: 'Grant Union के बारे में', para1: 'Grant Union एक पेशेवर व्यापार कंपनी है जो क्रिप्टोकुरेंसी व्यापार, विदेशी मुद्रा व्यापार, सोना और रियल एस्टेट निवेश में विशेषज्ञता रखती है। हमारी पेशेवर व्यापारियों की टीम आपके बिटकॉइन निवेश पर रिटर्न को अधिकतम करने के लिए मेहनत करती है।', h3: 'न्यूनतम निवेश', para2: 'कंपनी आपकी निवेश योजना के आधार पर दैनिक कमीशन प्रदान करती है। केवल $100 की न्यूनतम जमा के साथ, आप कमाना शुरू कर सकते हैं। आपकी निवेश अवधि के बाद, आप अपनी पूंजी और लाभ दोनों को निकालना चुन सकते हैं या सतत वृद्धि के लिए पुनः निवेश कर सकते हैं।'},
  'id': {h1: 'Selamat Datang di Grant Union', h2a: 'Tentang Grant Union', para1: 'Grant Union adalah perusahaan perdagangan profesional yang berspesialisasi dalam perdagangan kripto, perdagangan forex, emas dan investasi real estat. Tim trader profesional kami bekerja keras untuk memaksimalkan pengembalian investasi Bitcoin Anda.', h3: 'Investasi Minimum', para2: 'Perusahaan menawarkan komisi harian berdasarkan rencana investasi Anda. Dengan setoran minimum hanya $100, Anda dapat mulai menghasilkan. Setelah periode investasi Anda, Anda dapat memilih untuk mencairkan modal dan keuntungan Anda atau menginvestasikan kembali untuk pertumbuhan berkelanjutan.'},
  'th': {h1: 'ยินดีต้อนรับสู่ Grant Union', h2a: 'เกี่ยวกับ Grant Union', para1: 'Grant Union เป็นบริษัทการค้าที่เป็นมืออาชีพซึ่งเชี่ยวชาญในการซื้อขายคริปโตเคอร์เรนซี่ การซื้อขาย Forex ทองคำและการลงทุนอสังหาริมทรัพย์ ทีมเทรดเดอร์มืออาชีพของเราทำงานอย่างหนักเพื่อเพิ่มผลตอบแทนจากการลงทุน Bitcoin ของคุณให้สูงสุด', h3: 'การลงทุนขั้นต่ำ', para2: 'บริษัทมีค่าธรรมเนียมรายวันตามแผนการลงทุนของคุณ ด้วยเงินฝากขั้นต่ำเพียง 100 เหรียญสหรัฐ คุณสามารถเริ่มสร้างรายได้ได้ หลังจากระยะเวลาการลงทุนของคุณ คุณสามารถเลือกที่จะถอนทั้งเงินต้นและกำไรของคุณ หรือลงทุนซ้ำเพื่อการเติบโตอย่างต่อเนื่อง'},
  'vi': {h1: 'Chào Mừng Đến Với Grant Union', h2a: 'Về Grant Union', para1: 'Grant Union là một công ty giao dịch chuyên nghiệp chuyên về giao dịch tiền điện tử, giao dịch forex, vàng và đầu tư bất động sản. Đội ngũ nhà giao dịch chuyên nghiệp của chúng tôi làm việc chăm chỉ để tối đa hóa lợi nhuận từ các khoản đầu tư Bitcoin của bạn.', h3: 'Đầu Tư Tối Thiểu', para2: 'Công ty cung cấp hoa hồng hàng ngày dựa trên kế hoạch đầu tư của bạn. Với khoản tiền gửi tối thiểu chỉ 100 đô la, bạn có thể bắt đầu kiếm tiền. Sau kỳ hạn đầu tư của bạn, bạn có thể chọn rút cả vốn và lợi nhuận hoặc tái đầu tư để tăng trưởng liên tục.'},
  'el': {h1: 'Καλώς ήρθατε στο Grant Union', h2a: 'Σχετικά με το Grant Union', para1: 'Το Grant Union είναι μια επαγγελματική εταιρεία διαπραγμάτευσης που ειδικεύεται στο εμπόριο κρυπτονομισμάτων, συναλλαγές forex, χρυσό και επενδύσεις ακινήτων. Η ομάδα των επαγγελματιών traders μας εργάζεται επιμελώς για να μεγιστοποιήσει τις αποδόσεις των επενδύσεών σας σε Bitcoin.', h3: 'Ελάχιστη Επένδυση', para2: 'Η εταιρεία προσφέρει ημερήσια προμήθεια με βάση το σχέδιο επένδυσης σας. Με ελάχιστη κατάθεση μόλις 100 δολάρια, μπορείτε να αρχίσετε να κερδίζετε. Μετά την περίοδο επένδυσης σας, μπορείτε να επιλέξετε να αποσύρετε το κεφάλαιο και τα κέρδη σας ή να επανεπενδύσετε για συνεχή ανάπτυξη.'},
  'sv': {h1: 'Välkommen till Grant Union', h2a: 'Om Grant Union', para1: 'Grant Union är ett professionellt handelsföretag som specialiserar sig på kryptovalutahandel, valutahandel, guld och fastighetsinvesteringar. Vårt team av professionella handlare arbetar flitigt för att maximera avkastningen på dina Bitcoin-investeringar.', h3: 'Minsta Investering', para2: 'Företaget erbjuder daglig provision baserad på din investeringsplan. Med endast en minsta insättning på $100 kan du börja tjäna. Efter din investeringsperiod kan du välja att ta ut både ditt kapital och vinster eller återinvestera för fortsatt tillväxt.'},
  'no': {h1: 'Velkommen til Grant Union', h2a: 'Om Grant Union', para1: 'Grant Union er et profesjonelt handelselskap som spesialiserer seg på kryptovalutahandel, valutahandel, gull og eiendomsinvesteringer. Vårt team av profesjonelle tradere arbeider flittig for å maksimere avkastningen på Bitcoin-investeringene dine.', h3: 'Minimum Investering', para2: 'Selskapet tilbyr daglig provisjon basert på investeringsplanen din. Med bare et minimumsinnskudd på $100 kan du begynne å tjene. Etter investeringsperioden din, kan du velge å ta ut både ditt kapital og fortjeneste eller reinvestere for fortsatt vekst.'},
  'da': {h1: 'Velkommen til Grant Union', h2a: 'Om Grant Union', para1: 'Grant Union er en professionel handelsvirksomhed, der specialiserer sig i kryptovalutahandel, valutahandel, guld og ejendomsinvesteringer. Vores team af professionelle handlende arbejder hårdtfor at maksimere afkastet på dine Bitcoin-investeringer.', h3: 'Minimumsindskud', para2: 'Virksomheden tilbyder daglig kommission baseret på din investeringsplan. Med kun et minimumsindskud på 100 dollar kan du begynde at tjene. Efter din investeringsperiode kan du vælge at hæve både dit kapital og fortjeneste eller reinvestere for fortsat vækst.'}
};

const basePath = path.join(__dirname, 'public', 'downloads');
const logoPath = path.join(__dirname, 'public', 'grantunionLogo.png');

const langCodes = Object.keys(translations);

function createPDF(langCode, langData) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(basePath, `guide-${langCode}.pdf`);
    const doc = new PDFDocument({size: 'A4', margin: 15, bufferPages: true});
    doc.pipe(fs.createWriteStream(outputPath));
    
    const primaryOrange = '#FF8C37', lightText = '#444', white = '#ffffff';
    
    if (fs.existsSync(logoPath)) {
      const w = doc.page.width, lw = 75, lx = (w - lw) / 2;
      doc.image(logoPath, lx, 15, { width: 75, height: 50 });
      doc.moveDown(3);
    }
    
    doc.fontSize(26).fillColor(primaryOrange).font('Helvetica-Bold').text('GRANT UNION', { align: 'center' });
    doc.moveDown(0.6);
    
    doc.fontSize(18).fillColor(primaryOrange).font('Helvetica-Bold').text(langData.h1);
    doc.moveTo(15, doc.y + 2).lineTo(580, doc.y + 2).strokeColor(primaryOrange).lineWidth(2.5).stroke();
    doc.moveDown(0.35);
    
    doc.fontSize(10.5).fillColor(lightText).font('Helvetica-Bold').text(langData.para1, { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    
    doc.fontSize(13).fillColor(primaryOrange).font('Helvetica-Bold').text(langData.h2a);
    doc.moveDown(0.2);
    
    doc.fontSize(10.5).fillColor(lightText).font('Helvetica-Bold').text('Grant Union is a professional trading company specializing in cryptocurrency trading, forex, gold and real estate investments. Our professional traders work to maximize your Bitcoin investment returns.', { width: 490, lineGap: 1.5 });
    doc.moveDown(0.25);
    
    doc.fontSize(12).fillColor(primaryOrange).font('Helvetica-Bold').text(langData.h3);
    doc.moveDown(0.15);
    
    doc.fontSize(10.5).fillColor(lightText).font('Helvetica-Bold').text(langData.para2, { width: 490, lineGap: 1.5 });
    
    doc.end();
    doc.on('finish', () => {
      const stats = fs.statSync(outputPath);
      console.log(`✓ guide-${langCode}.pdf: ${(stats.size / 1024).toFixed(2)} KB`);
      resolve();
    });
    doc.on('error', reject);
  });
}

async function generateAll() {
  console.log(`Starting generation of ${langCodes.length} language PDFs...\n`);
  for (const code of langCodes) {
    try {
      await createPDF(code, translations[code]);
    } catch (err) {
      console.error(`✗ Error for ${code}:`, err.message);
    }
  }
  console.log(`\n✓ All ${langCodes.length} language PDFs generated successfully!`);
}

generateAll().catch(console.error);
