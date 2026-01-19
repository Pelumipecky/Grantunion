const fs = require('fs');
const path = require('path');

// Complete translations for all sections needed
const languageContent = {
  it: {
    howitworks: "Come Funziona",
    howitworks_desc: "Quando investi con Grant Union, il nostro team professionale di trader negozia il tuo Bitcoin per la durata del tuo piano scelto (ad es. 3 giorni). Dopo il periodo di investimento, il tuo capitale e i tuoi guadagni vengono trasferiti al tuo back office, dove puoi scegliere di ritirare o reinvestire.",
    withdrawal: "Processo di Prelievo",
    withdrawal_quick: "Prelievi Veloci ed Efficienti",
    withdrawal_quick_desc: "I prelievi sono veloci ed efficienti. Il processo richiede solo pochi minuti, al massimo entro 24 ore.",
    withdrawal_steps_title: "Passaggi di Prelievo",
    safety: "Sicurezza",
    safety_desc: "Grant Union è impegnata a mantenere gli standard di sicurezza più elevati e proteggere il tuo investimento.",
    faq: "Domande Frequenti"
  },
  pt: {
    howitworks: "Como Funciona",
    howitworks_desc: "Quando você investe com a Grant Union, nosso time profissional de traders negocia seu Bitcoin pela duração do seu plano escolhido (por exemplo, 3 dias). Após o período de investimento, seu capital e ganhos são transferidos para seu back office, onde você pode escolher sacar ou reinvestir.",
    withdrawal: "Processo de Saque",
    withdrawal_quick: "Saques Rápidos e Eficientes",
    withdrawal_quick_desc: "Os saques são rápidos e eficientes. O processo leva apenas alguns minutos, no máximo dentro de 24 horas.",
    safety: "Segurança",
    safety_desc: "A Grant Union está comprometida em manter os mais altos padrões de segurança e proteger seu investimento.",
    faq: "Perguntas Frequentes"
  },
  ru: {
    howitworks: "Как это работает",
    howitworks_desc: "Когда вы инвестируете с Grant Union, наша профессиональная команда трейдеров торгует вашим Bitcoin в течение продолжительности вашего выбранного плана (например, 3 дня). После периода инвестирования ваш капитал и прибыль переводятся на ваш кабинет, где вы можете выбрать вывод или переинвестирование.",
    withdrawal: "Процесс вывода",
    withdrawal_quick: "Быстрые и эффективные выводы",
    withdrawal_quick_desc: "Выводы быстрые и эффективные. Процесс занимает всего несколько минут, максимум в течение 24 часов.",
    safety: "Безопасность",
    safety_desc: "Grant Union привержена поддержанию высочайших стандартов безопасности и защите ваших инвестиций.",
    faq: "Часто задаваемые вопросы"
  },
  ar: {
    howitworks: "كيف يعمل",
    howitworks_desc: "عندما تستثمر مع Grant Union، يتداول فريقنا المهني من المتداولين بيتكوينك لمدة الخطة التي اخترتها (على سبيل المثال، 3 أيام). بعد فترة الاستثمار، يتم نقل رأس المال والأرباح إلى مكتب العودة، حيث يمكنك اختيار السحب أو إعادة الاستثمار.",
    withdrawal: "عملية السحب",
    withdrawal_quick: "عمليات سحب سريعة وفعالة",
    withdrawal_quick_desc: "عمليات السحب سريعة وفعالة. تستغرق العملية دقائق قليلة فقط، وفي أقصى حد ضمن 24 ساعة.",
    safety: "السلامة والأمان",
    safety_desc: "التزمت Grant Union بالحفاظ على أعلى معايير الأمان وحماية استثمارك.",
    faq: "الأسئلة الشائعة"
  },
  zh: {
    howitworks: "工作原理",
    howitworks_desc: "当您与Grant Union投资时,我们专业的交易团队会在您选择的计划期间(例如3天)交易您的比特币。在投资期结束后,您的资本和收益将转移到您的后台办公室,您可以选择提取或重新投资。",
    withdrawal: "提取流程",
    withdrawal_quick: "快速高效的提取",
    withdrawal_quick_desc: "提取快速高效。该流程只需要几分钟,最多在24小时内完成。",
    safety: "安全性",
    safety_desc: "Grant Union致力于维持最高的安全标准并保护您的投资。",
    faq: "常见问题"
  },
  ja: {
    howitworks: "仕組み",
    howitworks_desc: "Grant Union で投資すると、当社のプロフェッショナルなトレーダーチームが選択したプランの期間 (例えば 3 日間) あなたのビットコインを取引します。投資期間終了後、あなたの資本と収益はバックオフィスに転送され、引き出しまたは再投資を選択できます。",
    withdrawal: "引き出しプロセス",
    withdrawal_quick: "迅速で効率的な引き出し",
    withdrawal_quick_desc: "引き出しは迅速かつ効率的です。プロセスはわずか数分、最長 24 時間以内に完了します。",
    safety: "安全性",
    safety_desc: "Grant Union は最高レベルのセキュリティ基準を維持し、お客様の投資を保護することに尽力しています。",
    faq: "よくある質問"
  },
  ko: {
    howitworks: "작동 방식",
    howitworks_desc: "Grant Union에 투자하면 당사의 전문 트레이더 팀이 선택한 계획 기간(예: 3일) 동안 귀하의 비트코인을 거래합니다. 투자 기간이 끝난 후 귀하의 자본과 수익이 백 오피스로 이전되며, 여기서 인출하거나 재투자할 수 있습니다.",
    withdrawal: "인출 프로세스",
    withdrawal_quick: "빠르고 효율적인 인출",
    withdrawal_quick_desc: "인출은 빠르고 효율적입니다. 이 프로세스는 단 몇 분 정도 소요되며 최대 24시간 이내입니다.",
    safety: "보안",
    safety_desc: "Grant Union은 최고 수준의 보안 표준을 유지하고 투자를 보호하기 위해 최선을 다하고 있습니다.",
    faq: "자주 묻는 질문"
  },
  nl: {
    howitworks: "Hoe het werkt",
    howitworks_desc: "Wanneer u met Grant Union investeert, verhandelt ons professionele traderteam uw Bitcoin voor de duur van uw gekozen plan (bijvoorbeeld 3 dagen). Na de investeringsperiode worden uw kapitaal en winsten naar uw back-office overgebracht, waar u kunt kiezen om in te trekken of opnieuw in te investeren.",
    withdrawal: "Opnameproces",
    withdrawal_quick: "Snelle en efficiënte opnames",
    withdrawal_quick_desc: "Opnames zijn snel en efficiënt. Het proces duurt slechts enkele minuten, maximaal binnen 24 uur.",
    safety: "Beveiliging",
    safety_desc: "Grant Union is toegewijd aan het handhaven van de hoogste beveiligingsnormen en het beschermen van uw investering.",
    faq: "Veelgestelde vragen"
  },
  tr: {
    howitworks: "Nasıl Çalışır",
    howitworks_desc: "Grant Union'a yatırım yaptığınızda, profesyonel tüccarlarımız, seçtiğiniz plan dönemince (örneğin 3 gün) Bitcoin'inizi alıp satar. Yatırım döneminden sonra, sermayeniz ve kazançlarınız arka ofisine aktarılır ve buradan çekmeyi veya yeniden yatırım yapmayı seçebilirsiniz.",
    withdrawal: "Para Çekme İşlemi",
    withdrawal_quick: "Hızlı ve Verimli Para Çekme",
    withdrawal_quick_desc: "Para çekme işlemleri hızlı ve verimlidir. İşlem sadece birkaç dakika sürer, en fazla 24 saat içinde.",
    safety: "Güvenlik",
    safety_desc: "Grant Union, en yüksek güvenlik standartlarını korumaya ve yatırımınızı korumaya kararlıdır.",
    faq: "Sıkça Sorulan Sorular"
  },
  sw: {
    howitworks: "Hur det fungerar",
    howitworks_desc: "När du investerar med Grant Union handlar vårt professionella traderteam din Bitcoin under varaktigheten av din valda plan (t.ex. 3 dagar). Efter investeringsperioden överförs ditt kapital och vinster till ditt back office, där du kan välja att ta ut eller återinvestera.",
    withdrawal: "Uttagsprocess",
    withdrawal_quick: "Snabba och effektiva uttag",
    withdrawal_quick_desc: "Uttag är snabba och effektiva. Processen tar bara några minuter, maximalt inom 24 timmar.",
    safety: "Säkerhet",
    safety_desc: "Grant Union är engagerad i att upprätthålla högsta säkerhetsstandarder och skydda din investering.",
    faq: "Vanliga frågor"
  },
  vi: {
    howitworks: "Cách Thức Hoạt Động",
    howitworks_desc: "Khi bạn đầu tư với Grant Union, đội giao dịch chuyên nghiệp của chúng tôi sẽ giao dịch Bitcoin của bạn trong thời gian kế hoạch bạn chọn (ví dụ: 3 ngày). Sau khi kết thúc kỳ đầu tư, vốn và lợi nhuận của bạn sẽ được chuyển đến văn phòng hậu cần, nơi bạn có thể chọn rút tiền hoặc tái đầu tư.",
    withdrawal: "Quy Trình Rút Tiền",
    withdrawal_quick: "Rút Tiền Nhanh Chóng và Hiệu Quả",
    withdrawal_quick_desc: "Rút tiền nhanh chóng và hiệu quả. Quá trình chỉ mất vài phút, tối đa trong 24 giờ.",
    safety: "An Toàn",
    safety_desc: "Grant Union cam kết duy trì các tiêu chuẩn bảo mật cao nhất và bảo vệ khoản đầu tư của bạn.",
    faq: "Các Câu Hỏi Thường Gặp"
  },
  th: {
    howitworks: "วิธีการทำงาน",
    howitworks_desc: "เมื่อคุณลงทุนกับ Grant Union ทีมนักเทรดมืออาชีพของเราจะซื้อขาย Bitcoin ของคุณตลอดระยะเวลาของแผนที่คุณเลือก (เช่น 3 วัน) หลังจากสิ้นสุดระยะเวลาการลงทุน เงินทุนและกำไรของคุณจะถูกโอนไปยังสำนักงานหลัง ซึ่งคุณสามารถเลือกถอนหรือลงทุนใหม่ได้",
    withdrawal: "กระบวนการถอนเงิน",
    withdrawal_quick: "การถอนเงินที่รวดเร็วและมีประสิทธิภาพ",
    withdrawal_quick_desc: "การถอนเงินรวดเร็วและมีประสิทธิภาพ กระบวนการใช้เวลาเพียงไม่กี่นาทีและสูงสุดภายใน 24 ชั่วโมง",
    safety: "ความปลอดภัย",
    safety_desc: "Grant Union มุ่งมั่นที่จะรักษามาตรฐานความปลอดภัยสูงสุดและปกป้องการลงทุนของคุณ",
    faq: "คำถามที่พบบ่อย"
  },
  el: {
    howitworks: "Πώς Λειτουργεί",
    howitworks_desc: "Όταν επενδύετε με το Grant Union, η επαγγελματική ομάδα εμπόρων μας διαπραγματεύεται το Bitcoin σας για τη διάρκεια του σχεδίου που επιλέγετε (π.χ. 3 ημέρες). Μετά την περίοδο επένδυσης, το κεφάλαιο και τα κέρδη σας μεταφέρονται στο γραφείο υποστήριξης, όπου μπορείτε να επιλέξετε να αποσύρετε ή να ξανα-επενδύσετε.",
    withdrawal: "Διαδικασία Ανάληψης",
    withdrawal_quick: "Γρήγορες και Αποτελεσματικές Αναλήψεις",
    withdrawal_quick_desc: "Οι αναλήψεις είναι γρήγορες και αποτελεσματικές. Η διαδικασία διαρκεί μόνο μερικά λεπτά, το πολύ εντός 24 ωρών.",
    safety: "Ασφάλεια",
    safety_desc: "Το Grant Union δεσμεύεται να διατηρήσει τα υψηλότερα πρότυπα ασφάλειας και να προστατεύσει την επένδυσή σας.",
    faq: "Συχνές Ερωτήσεις"
  },
  hi: {
    howitworks: "यह कैसे काम करता है",
    howitworks_desc: "जब आप Grant Union के साथ निवेश करते हैं, तो हमारी पेशेवर व्यापारियों की टीम आपकी बिटकॉइन को आपकी चुनी हुई योजना की अवधि (जैसे 3 दिन) के लिए व्यापार करती है। निवेश अवधि के बाद, आपकी पूंजी और कमाई आपके बैक ऑफिस में स्थानांतरित की जाती है, जहां आप निकालने या पुनः निवेश करने का विकल्प चुन सकते हैं।",
    withdrawal: "निकासी प्रक्रिया",
    withdrawal_quick: "तेज़ और कुशल निकासी",
    withdrawal_quick_desc: "निकासी तेज़ और कुशल है। यह प्रक्रिया कुछ मिनट लगती है, अधिकतम 24 घंटे के भीतर।",
    safety: "सुरक्षा",
    safety_desc: "Grant Union सर्वोच्च सुरक्षा मानकों को बनाए रखने और आपके निवेश की सुरक्षा के लिए प्रतिबद्ध है।",
    faq: "अक्सर पूछे जाने वाले प्रश्न"
  },
  id: {
    howitworks: "Cara Kerjanya",
    howitworks_desc: "Ketika Anda berinvestasi dengan Grant Union, tim trader profesional kami memperdagangkan Bitcoin Anda selama durasi paket yang Anda pilih (misalnya 3 hari). Setelah periode investasi, modal dan keuntungan Anda ditransfer ke back office Anda, di mana Anda dapat memilih untuk menarik atau menginvestasikan kembali.",
    withdrawal: "Proses Penarikan",
    withdrawal_quick: "Penarikan Cepat dan Efisien",
    withdrawal_quick_desc: "Penarikan cepat dan efisien. Prosesnya hanya membutuhkan beberapa menit, paling lama dalam 24 jam.",
    safety: "Keamanan",
    safety_desc: "Grant Union berkomitmen untuk mempertahankan standar keamanan tertinggi dan melindungi investasi Anda.",
    faq: "Pertanyaan yang Sering Diajukan"
  }
};

console.log('Language content ready for update');
console.log('Languages ready:', Object.keys(languageContent).length);
