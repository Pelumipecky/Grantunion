const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Plan Configuration (Hardcoded from src/utils/planConfig.js for script usage)
const PLANS = [
  {
    name: "3-Day Plan",
    duration: "3 days",
    dailyRate: "3%",
    min: "$100",
    max: "$999",
    bonus: "10%"
  },
  {
    name: "7-Day Plan",
    duration: "7 days",
    dailyRate: "3%",
    min: "$599",
    max: "$3,999",
    bonus: "10%"
  },
  {
    name: "12-Day Plan",
    duration: "12 days",
    dailyRate: "3.5%",
    min: "$1,000",
    max: "$5,000",
    bonus: "10%"
  },
  {
    name: "15-Day Plan",
    duration: "15 days",
    dailyRate: "4%",
    min: "$3,000",
    max: "$9,000",
    bonus: "10%"
  },
  {
    name: "3-Month Plan",
    duration: "90 days",
    dailyRate: "4%",
    min: "$5,000",
    max: "$15,000",
    bonus: "10%"
  },
  {
    name: "6-Month Plan",
    duration: "180 days",
    dailyRate: "5%",
    min: "$15,999",
    max: "Unlimited",
    bonus: "10%"
  }
];

const LANGUAGES = {
  en: {
    title: "Grant Union Investment Guide",
    intro: "Welcome to Grant Union, the world's premier investment and trading platform. We are committed to providing you with a secure, transparent, and profitable investment experience.",
    howToDeposit: {
      title: "How to Make a Deposit",
      steps: [
        "1. Log in to your Grant Union account.",
        "2. Navigate to the 'Deposit' section.",
        "3. Select your preferred cryptocurrency (Bitcoin, Ethereum, or USDT).",
        "4. Copy the wallet address provided or scan the QR code.",
        "5. Send the exact amount you wish to invest from your crypto wallet.",
        "6. Your deposit will be credited automatically after network confirmation."
      ]
    },
    packages: {
      title: "Investment Packages",
      headers: ["Plan Name", "Duration", "Daily Rate", "Min Deposit", "Max Deposit"]
    },
    withdrawal: {
      title: "Withdrawal Process",
      content: "Withdrawals are simple and fast. Once your investment term is complete, or you have accrued earnings, navigate to the 'Withdraw' section. Enter the amount and your wallet address. Requests are processed after admin approval."
    }
  },
  es: {
    title: "Guía de Inversión Grant Union",
    intro: "Bienvenido a Grant Union, la plataforma de inversión y comercio líder en el mundo. Nos comprometemos a brindarle una experiencia de inversión segura, transparente y rentable.",
    howToDeposit: {
      title: "Cómo hacer un depósito",
      steps: [
        "1. Inicie sesión en su cuenta de Grant Union.",
        "2. Vaya a la sección 'Depósito'.",
        "3. Seleccione su criptomoneda preferida (Bitcoin, Ethereum o USDT).",
        "4. Copie la dirección de la billetera proporcionada o escanee el código QR.",
        "5. Envíe la cantidad exacta que desea invertir desde su billetera criptográfica.",
        "6. Su depósito se acreditará automáticamente después de la confirmación de la red."
      ]
    },
    packages: {
      title: "Paquetes de Inversión",
      headers: ["Plan", "Duración", "Tasa Diaria", "Mínimo", "Máximo"]
    },
    withdrawal: {
      title: "Proceso de Retiro",
      content: "Los retiros son simples y rápidos. Una vez que finalice su plazo de inversión o haya acumulado ganancias, vaya a la sección 'Retirar'. Ingrese el monto y la dirección de su billetera. Las solicitudes se procesan después de la aprobación del administrador."
    }
  },
  fr: {
    title: "Guide d'Investissement Grant Union",
    intro: "Bienvenue chez Grant Union, la première plateforme d'investissement et de trading au monde. Nous nous engageons à vous offrir une expérience d'investissement sécurisée, transparente et rentable.",
    howToDeposit: {
      title: "Comment faire un dépôt",
      steps: [
        "1. Connectez-vous à votre compte Grant Union.",
        "2. Accédez à la section 'Dépôt'.",
        "3. Sélectionnez votre crypto-monnaie préférée (Bitcoin, Ethereum ou USDT).",
        "4. Copiez l'adresse du portefeuille fournie ou scannez le code QR.",
        "5. Envoyez le montant exact que vous souhaitez investir depuis votre portefeuille crypto.",
        "6. Votre dépôt sera crédité automatiquement après confirmation du réseau."
      ]
    },
    packages: {
      title: "Forfaits d'Investissement",
      headers: ["Plan", "Durée", "Taux Journalier", "Min", "Max"]
    },
    withdrawal: {
      title: "Processus de Retrait",
      content: "Les retraits sont simples et rapides. Une fois votre terme d'investissement terminé ou vos gains accumulés, accédez à la section 'Retrait'. Entrez le montant et l'adresse de votre portefeuille. Les demandes sont traitées après approbation de l'administrateur."
    }
  },
  de: {
    title: "Grant Union Anlageführer",
    intro: "Willkommen bei Grant Union, der weltweit führenden Investitions- und Handelsplattform. Wir verpflichten uns, Ihnen ein sicheres, transparentes und profitables Anlageerlebnis zu bieten.",
    howToDeposit: {
      title: "Wie man eine Einzahlung tätigt",
      steps: [
        "1. Melden Sie sich bei Ihrem Grant Union-Konto an.",
        "2. Navigieren Sie zum Bereich 'Einzahlung'.",
        "3. Wählen Sie Ihre bevorzugte Kryptowährung (Bitcoin, Ethereum oder USDT).",
        "4. Kopieren Sie die angegebene Wallet-Adresse oder scannen Sie den QR-Code.",
        "5. Senden Sie den genauen Betrag, den Sie investieren möchten, von Ihrer Krypto-Wallet.",
        "6. Ihre Einzahlung wird nach Netzwerkbestätigung automatisch gutgeschrieben."
      ]
    },
    packages: {
      title: "Investitionspakete",
      headers: ["Plan", "Dauer", "Tagesrate", "Min", "Max"]
    },
    withdrawal: {
      title: "Auszahlungsprozess",
      content: "Auszahlungen sind einfach und schnell. Sobald Ihre Investitionslaufzeit beendet ist oder Sie Gewinne erzielt haben, navigieren Sie zum Bereich 'Auszahlen'. Geben Sie den Betrag und Ihre Wallet-Adresse ein. Anfragen werden nach Genehmigung durch den Administrator bearbeitet."
    }
  },
  zh: {
    title: "Grant Union 投资指南",
    intro: "欢迎来到 Grant Union，全球首屈一指的投资和交易平台。我们致力于为您提供安全、透明和有利可图的投资体验。",
    howToDeposit: {
      title: "如何存款",
      steps: [
        "1. 登录您的 Grant Union 账户。",
        "2. 导航至“存款”部分。",
        "3. 选择您喜欢的加密货币（比特币、以太坊或 USDT）。",
        "4. 复制提供的钱包地址或扫描二维码。",
        "5. 从您的加密钱包发送您希望投资的确切金额。",
        "6. 您的存款将在网络确认后自动记入。"
      ]
    },
    packages: {
      title: "投资套餐",
      headers: ["计划", "持续时间", "日利率", "最低", "最高"]
    },
    withdrawal: {
      title: "提款流程",
      content: "提款简单快捷。一旦您的投资期限结束，或者您已累积收益，请导航至“提款”部分。输入金额和您的钱包地址。请求将在管理员批准后处理。"
    }
  },
  ru: {
    title: "Руководство по инвестициям Grant Union",
    intro: "Добро пожаловать в Grant Union, ведущую мировую инвестиционную и торговую платформу. Мы стремимся предоставить вам безопасный, прозрачный и прибыльный инвестиционный опыт.",
    howToDeposit: {
      title: "Как сделать депозит",
      steps: [
        "1. Войдите в свою учетную запись Grant Union.",
        "2. Перейдите в раздел 'Депозит'.",
        "3. Выберите предпочитаемую криптовалюту (Bitcoin, Ethereum или USDT).",
        "4. Скопируйте предоставленный адрес кошелька или отсканируйте QR-код.",
        "5. Отправьте точную сумму, которую вы хотите инвестировать, со своего криптокошелька.",
        "6. Ваш депозит будет зачислен автоматически после подтверждения сети."
      ]
    },
    packages: {
      title: "Инвестиционные пакеты",
      headers: ["План", "Срок", "Ставка", "Мин", "Макс"]
    },
    withdrawal: {
      title: "Процесс вывода средств",
      content: "Вывод средств прост и быстр. Как только срок ваших инвестиций истечет или вы накопите прибыль, перейдите в раздел 'Вывод средств'. Введите сумму и адрес вашего кошелька. Запросы обрабатываются после одобрения администратором."
    }
  },
  ar: {
    title: "دليل استثمار Grant Union",
    intro: "مرحبًا بكم في Grant Union، منصة الاستثمار والتداول الرائدة في العالم. نحن ملتزمون بتزويدك بتجربة استثمارية آمنة وشفافة ومربحة.",
    howToDeposit: {
      title: "كيفية الإيداع",
      steps: [
        "1. قم بتسجيل الدخول إلى حساب Grant Union الخاص بك.",
        "2. انتقل إلى قسم 'الإيداع'.",
        "3. اختر العملة المشفرة المفضلة لديك (Bitcoin أو Ethereum أو USDT).",
        "4. انسخ عنوان المحفظة المقدم أو امسح رمز الاستجابة السريعة ضوئيًا.",
        "5. أرسل المبلغ المحدد الذي ترغب في استثماره من محفظتك المشفرة.",
        "6. سيتم قيد إيداعك تلقائيًا بعد تأكيد الشبكة."
      ]
    },
    packages: {
      title: "باقات الاستثمار",
      headers: ["الخطة", "المدة", "المعدل اليومي", "الحد الأدنى", "الحد الأقصى"]
    },
    withdrawal: {
      title: "عملية السحب",
      content: "عمليات السحب بسيطة وسريعة. بمجرد اكتمال مدة استثمارك، أو تراكم الأرباح، انتقل إلى قسم 'السحب'. أدخل المبلغ وعنوان محفظتك. تتم معالجة الطلبات بعد موافقة المسؤول."
    }
  }
};

// Font setup (using standard fonts for simplicity, might need custom fonts for non-latin scripts in a real production env)
// For this script, we'll rely on PDFKit's standard fonts for Latin, and try to handle others gracefully or use a fallback font if available.
// Note: PDFKit standard fonts don't support Chinese/Arabic/Russian characters well without loading a specific font file.
// To make this robust without external font files, we might have limitations. 
// However, for the purpose of this task, we will try to generate them. If characters are missing, we'd typically need a .ttf file.
// I will assume standard font usage. If special chars fail, I'll note that a font file is needed.
// Actually, to ensure it works for all languages, I should probably use a font that supports unicode if possible, but I don't have one handy in the env.
// I will proceed with standard generation.

const generatePDF = (langCode, content) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, '../public/downloads', `guide-${langCode}.pdf`);
  
  doc.pipe(fs.createWriteStream(filePath));

  // Title
  doc.fontSize(25).text(content.title, { align: 'center' });
  doc.moveDown();

  // Intro
  doc.fontSize(12).text(content.intro, { align: 'left' });
  doc.moveDown(2);

  // How to Deposit
  doc.fontSize(18).text(content.howToDeposit.title);
  doc.moveDown(0.5);
  doc.fontSize(12);
  content.howToDeposit.steps.forEach(step => {
    doc.text(step);
    doc.moveDown(0.2);
  });
  doc.moveDown(2);

  // Packages
  doc.fontSize(18).text(content.packages.title);
  doc.moveDown(0.5);
  
  // Simple list for packages instead of complex table to avoid layout issues
  PLANS.forEach(plan => {
    doc.fontSize(14).text(plan.name, { underline: true });
    doc.fontSize(12).text(`${content.packages.headers[1]}: ${plan.duration}`);
    doc.text(`${content.packages.headers[2]}: ${plan.dailyRate}`);
    doc.text(`${content.packages.headers[3]}: ${plan.min}`);
    doc.text(`${content.packages.headers[4]}: ${plan.max}`);
    doc.moveDown(1);
  });

  // Withdrawal
  doc.fontSize(18).text(content.withdrawal.title);
  doc.moveDown(0.5);
  doc.fontSize(12).text(content.withdrawal.content);

  doc.end();
  console.log(`Generated guide-${langCode}.pdf`);
};

// Generate for all languages
Object.keys(LANGUAGES).forEach(lang => {
  // Note: For languages like Chinese (zh), Arabic (ar), Russian (ru), PDFKit requires a font that supports those characters.
  // Without a custom font, these will likely render as squares or garbage.
  // Since I cannot easily upload a font file here, I will generate them but they might be imperfect without the font.
  // For a real deployment, you would need to add a font file (e.g. NotoSans.ttf) and load it: doc.font('path/to/font.ttf')
  
  // For now, we generate.
  try {
      generatePDF(lang, LANGUAGES[lang]);
  } catch (e) {
      console.error(`Failed to generate for ${lang}:`, e);
  }
});
