#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const languages = {
  'nl': { name: 'Dutch', content: {
    h1: 'Welkom bij Grant Union',
    about: 'Grant Union is een professioneel handelsbedrijf dat gespecialiseerd is in cryptocurrency trading, forex trading, goud en onroerendgoedenbeleggingen. Ons team van professionele handelaren werkt voortvarend om de rendementen van uw Bitcoin-investeringen te maximaliseren.',
    min: 'Het bedrijf biedt dagelijkse provisie op basis van uw investeringsplan. Met een minimale storting van slechts $100 kunt u beginnen met verdienen. Na uw investeringsperiode kunt u ervoor kiezen om zowel uw kapitaal als uw winsten op te nemen of opnieuw te beleggen voor voortdurende groei.'
  }},
  'pl': { name: 'Polish', content: {
    h1: 'Witamy w Grant Union',
    about: 'Grant Union to profesjonalna firma handlowa specjalizująca się w handlu kryptowalutami, handlu forex, złocie i inwestycjach w nieruchomości. Nasz zespół profesjonalnych traderów pracuje pilnie, aby zmaksymalizować zwroty z Twoich inwestycji w Bitcoin.',
    min: 'Firma oferuje dzienną prowizję na podstawie Twojego planu inwestycji. Z minimalnym depozytem zaledwie $100 możesz zacząć zarabiać. Po okresie inwestycji możesz wybrać wycofanie zarówno kapitału, jak i zysków, lub reinwestowanie na stały wzrost.'
  }},
  'tr': { name: 'Turkish', content: {
    h1: 'Grant Union\'a Hoş Geldiniz',
    about: 'Grant Union, kripto para ticareti, forex ticareti, altın ve gayrimenkul yatırımlarında uzmanlaşan profesyonel bir ticaret şirketidir. Profesyonel tüccar ekibimiz, Bitcoin yatırımlarınızın getirilerini maksimize etmek için çalışmaktadır.',
    min: 'Şirket, yatırım planınıza dayalı olarak günlük komisyon sunmaktadır. Sadece 100 dolarlık minimum mevduat ile kazanmaya başlayabilirsiniz. Yatırım döneminizin ardından, hem sermayeyi hem de karları çekmeyi seçebilir veya sürekli büyüme için yeniden yatırım yapabilirsiniz.'
  }},
  'hi': { name: 'Hindi', content: {
    h1: 'Grant Union में आपका स्वागत है',
    about: 'Grant Union एक पेशेवर व्यापार कंपनी है जो क्रिप्टोकुरेंसी व्यापार, विदेशी मुद्रा व्यापार, सोना और रियल एस्टेट निवेश में विशेषज्ञता रखती है। हमारी पेशेवर व्यापारियों की टीम आपके बिटकॉइन निवेश पर रिटर्न को अधिकतम करने के लिए मेहनत करती है।',
    min: 'कंपनी आपकी निवेश योजना के आधार पर दैनिक कमीशन प्रदान करती है। केवल $100 की न्यूनतम जमा के साथ, आप कमाना शुरू कर सकते हैं। आपकी निवेश अवधि के बाद, आप अपनी पूंजी और लाभ दोनों को निकालना चुन सकते हैं या सतत वृद्धि के लिए पुनः निवेश कर सकते हैं।'
  }},
  'id': { name: 'Indonesian', content: {
    h1: 'Selamat Datang di Grant Union',
    about: 'Grant Union adalah perusahaan perdagangan profesional yang berspesialisasi dalam perdagangan kripto, perdagangan forex, emas dan investasi real estat. Tim trader profesional kami bekerja keras untuk memaksimalkan pengembalian investasi Bitcoin Anda.',
    min: 'Perusahaan menawarkan komisi harian berdasarkan rencana investasi Anda. Dengan setoran minimum hanya $100, Anda dapat mulai menghasilkan. Setelah periode investasi Anda, Anda dapat memilih untuk mencairkan modal dan keuntungan Anda atau menginvestasikan kembali untuk pertumbuhan berkelanjutan.'
  }},
  'th': { name: 'Thai', content: {
    h1: 'ยินดีต้อนรับสู่ Grant Union',
    about: 'Grant Union เป็นบริษัทการค้าที่เป็นมืออาชีพซึ่งเชี่ยวชาญในการซื้อขายคริปโตเคอร์เรนซี่ การซื้อขาย Forex ทองคำและการลงทุนอสังหาริมทรัพย์ ทีมเทรดเดอร์มืออาชีพของเราทำงานอย่างหนักเพื่อเพิ่มผลตอบแทนจากการลงทุน Bitcoin ของคุณให้สูงสุด',
    min: 'บริษัทมีค่าธรรมเนียมรายวันตามแผนการลงทุนของคุณ ด้วยเงินฝากขั้นต่ำเพียง 100 เหรียญสหรัฐ คุณสามารถเริ่มสร้างรายได้ได้ หลังจากระยะเวลาการลงทุนของคุณ คุณสามารถเลือกที่จะถอนทั้งเงินต้นและกำไรของคุณ หรือลงทุนซ้ำเพื่อการเติบโตอย่างต่อเนื่อง'
  }},
  'vi': { name: 'Vietnamese', content: {
    h1: 'Chào Mừng Đến Với Grant Union',
    about: 'Grant Union là một công ty giao dịch chuyên nghiệp chuyên về giao dịch tiền điện tử, giao dịch forex, vàng và đầu tư bất động sản. Đội ngũ nhà giao dịch chuyên nghiệp của chúng tôi làm việc chăm chỉ để tối đa hóa lợi nhuận từ các khoản đầu tư Bitcoin của bạn.',
    min: 'Công ty cung cấp hoa hồng hàng ngày dựa trên kế hoạch đầu tư của bạn. Với khoản tiền gửi tối thiểu chỉ 100 đô la, bạn có thể bắt đầu kiếm tiền. Sau kỳ hạn đầu tư của bạn, bạn có thể chọn rút cả vốn và lợi nhuận hoặc tái đầu tư để tăng trưởng liên tục.'
  }},
  'el': { name: 'Greek', content: {
    h1: 'Καλώς ήρθατε στο Grant Union',
    about: 'Το Grant Union είναι μια επαγγελματική εταιρεία διαπραγμάτευσης που ειδικεύεται στο εμπόριο κρυπτονομισμάτων, συναλλαγές forex, χρυσό και επενδύσεις ακινήτων. Η ομάδα των επαγγελματιών traders μας εργάζεται επιμελώς για να μεγιστοποιήσει τις αποδόσεις των επενδύσεών σας σε Bitcoin.',
    min: 'Η εταιρεία προσφέρει ημερήσια προμήθεια με βάση το σχέδιο επένδυσης σας. Με ελάχιστη κατάθεση μόλις 100 δολάρια, μπορείτε να αρχίσετε να κερδίζετε. Μετά την περίοδο επένδυσης σας, μπορείτε να επιλέξετε να αποσύρετε το κεφάλαιο και τα κέρδη σας ή να επανεπενδύσετε για συνεχή ανάπτυξη.'
  }},
  'sv': { name: 'Swedish', content: {
    h1: 'Välkommen till Grant Union',
    about: 'Grant Union är ett professionellt handelsföretag som specialiserar sig på kryptovalutahandel, valutahandel, guld och fastighetsinvesteringar. Vårt team av professionella handlare arbetar flitigt för att maximera avkastningen på dina Bitcoin-investeringar.',
    min: 'Företaget erbjuder daglig provision baserad på din investeringsplan. Med endast en minsta insättning på $100 kan du börja tjäna. Efter din investeringsperiod kan du välja att ta ut både ditt kapital och vinster eller återinvestera för fortsatt tillväxt.'
  }},
  'no': { name: 'Norwegian', content: {
    h1: 'Velkommen til Grant Union',
    about: 'Grant Union er et profesjonelt handelselskap som spesialiserer seg på kryptovalutahandel, valutahandel, gull og eiendomsinvesteringer. Vårt team av profesjonelle tradere arbeider flittig for å maksimere avkastningen på Bitcoin-investeringene dine.',
    min: 'Selskapet tilbyr daglig provisjon basert på investeringsplanen din. Med bare et minimumsinnskudd på $100 kan du begynne å tjene. Etter investeringsperioden din, kan du velge å ta ut både ditt kapital og fortjeneste eller reinvestere for fortsatt vekst.'
  }},
  'da': { name: 'Danish', content: {
    h1: 'Velkommen til Grant Union',
    about: 'Grant Union er en professionel handelsvirksomhed, der specialiserer sig i kryptovalutahandel, valutahandel, guld og ejendomsinvesteringer. Vores team af professionelle handlende arbejder hårdtfor at maksimere afkastet på dine Bitcoin-investeringer.',
    min: 'Virksomheden tilbyder daglig kommission baseret på din investeringsplan. Med kun et minimumsindskud på 100 dollar kan du begynde at tjene. Efter din investeringsperiode kan du vælge at hæve både dit kapital og fortjeneste eller reinvestere for fortsat vækst.'
  }}
};

console.log(`Creating ${Object.keys(languages).length} language PDF scripts...`);
Object.keys(languages).forEach(lang => {
  const langData = languages[lang];
  console.log(`✓ Language ${lang} (${langData.name}) prepared for generation`);
});
