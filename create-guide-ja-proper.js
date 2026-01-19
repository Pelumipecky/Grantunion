#!/usr/bin/env node

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-ja.pdf');
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

addHeading1('Grant Unionへようこそ');
addParagraph('世界有数の投資・取引プラットフォームGrant Unionへようこそ。安全で透明性があり、利益を生む投資体験を提供することをお約束します。');

addHeading2('Grant Unionについて');
addParagraph('Grant Unionは、暗号資産取引、外国為替取引、金、不動産投資を専門とするプロの取引会社です。私たちのプロの取引チームは、あなたのビットコイン投資の収益を最大化するために懸命に取り組んでいます。');

addHeading3('最小投資額');
addParagraph('同社は、あなたの投資計画に基づいて日々の手数料を提供しています。わずか100ドルの最小入金で、収入を開始できます。投資期間終了後、資本と利益の両方を引き出すか、継続的な成長のために再投資することをお選びいただけます。');

addHeading1('投資計画とリターン');
addParagraph('当社の投資計画：');

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
doc.text('Duration', col2, tableTop + 6, { width: 110 });
doc.text('Daily Commission', col3, tableTop + 6, { width: 100 });
doc.text('Min. Deposit', col4, tableTop + 6, { width: 85 });
doc.text('Max. Deposit', col5, tableTop + 6, { width: 85 });

const rows = [
  ['3日プラン', '3日', '8%', '$100', '$999'],
  ['7日プラン', '7日', '3%', '$599', '$3,999'],
  ['12日プラン', '12日', '3.5%', '$1,000', '$4,999'],
  ['15日プラン', '15日', '4%', '$3,000', '$9,000'],
  ['3ヶ月プラン', '90日', '4%', '$5,000', '$15,000'],
  ['6ヶ月プラン', '180日', '5%', '$15,999', '無制限']
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

addHeading3('計算例');
addParagraph('100ドルを1日8%の3日プランに投資した場合、3日後に24ドルを獲得できます。資本と利益を引き出すか、再投資することをお選びいただけます。');

doc.moveDown(0.3);

addHeading2('仕組み');
addParagraph('Grant Unionに投資すると、プロのトレーダーチームが選択した期間（例：3日）あなたのビットコインを取引します。投資期間終了後、あなたの資本と利益がバックオフィスに転送され、引き出すか再投資するかを選択できます。');

doc.moveDown(0.3);

addHeading2('支払い方法');
addParagraph('Grant Unionはプラットフォーム上のすべての取引にビットコインとUSDTを使用し、迅速で安全、グローバルアクセスを確保します。');

doc.moveDown(1);

doc.addPage();

addHeading1('紹介手数料');

addHeading2('無制限の10%手数料を獲得');
addParagraph('Grant Unionはすべての投資家に無制限の10%紹介手数料を提供しています！あなたのユニークな紹介リンクを使用して登録した人が行ったすべての入金の10%を獲得します。');

addHeading2('仕組み');
addParagraph('Grant Unionに投資すると、プロのトレーダーチームが選択した期間あなたのビットコインを取引します。投資期間終了後、あなたの資本と利益がバックオフィスに転送され、引き出すか再投資するかを選択できます。');

addHeading1('出金プロセス');

addHeading2('迅速かつ効率的な出金');
addParagraph('出金は迅速かつ効率的です。プロセスには数分しかかかり、最大24時間です。');

addHeading2('出金手順');
addBulletPoint('Grant Unionアカウントにログイン');
addBulletPoint('出金セクションに移動');
addBulletPoint('出金額を選択');
addBulletPoint('支払い方法を選択（ビットコインまたはUSDT）');
addBulletPoint('ウォレットアドレスを入力');
addBulletPoint('出金リクエストを送信');
addBulletPoint('資金は数分以内に転送されます');

addHeading2('利用可能な方法');
addBulletPoint('ビットコイン：安全で迅速な暗号通貨転送');
addBulletPoint('USDT：安定した価値を持つステーブルコイン転送');

addHeading3('資金への簡単アクセス');
addParagraph('投資期間終了後に資本を引き出したい場合でも、毎日の手数料を受け取りたい場合でも、Grant Unionは迅速かつ便利にします。');

addHeading1('セキュリティと保護');

addHeading2('セキュリティへのコミットメント');
addParagraph('Grant Unionは最高のセキュリティ基準を維持し、投資を保護することを約束しています。');

addHeading2('セキュリティ機能');
addBulletPoint('すべてのデータ転送の業界レベルの暗号化');
addBulletPoint('セキュアなクラウドインフラストラクチャ');
addBulletPoint('定期的なセキュリティ監査とコンプライアンスチェック');
addBulletPoint('投資を監視する専門トレーダーチーム');
addBulletPoint('透明な取引履歴とレポート');

addHeading2('アカウントの保護');
addBulletPoint('アカウントに強力でユニークなパスワードを使用');
addBulletPoint('ログイン認証情報を誰とも共有しないでください');
addBulletPoint('メールアドレスを安全に保ち、監視してください');
addBulletPoint('すべての取引についてメール通知を有効にします');
addBulletPoint('疑わしいアクティビティをすぐに報告します');

addHeading3('セキュリティが最優先');
addParagraph('Grant Unionは高度なセキュリティ対策を採用して、あなたの資金と個人情報をいつでも保護しています。');

doc.addPage();

addHeading1('よくある質問');

const faqs = [
  {
    question: '最小投資額はいくらですか？',
    answer: '最小投資額はわずか100ドルです。少額から始めて、時間をかけて投資を増やすことができます。'
  },
  {
    question: 'どのくらいの頻度で手数料が計上されますか？',
    answer: '日々の手数料は、選択した投資計画に従って24時間ごとにあなたのアカウントに計上されます。ダッシュボードでリアルタイムの収益を確認できます。'
  },
  {
    question: '投資期間が終わる前に引き出せますか？',
    answer: 'いつでも日々の手数料を引き出すことができます。計画で説明されているとおり、投資期間が完了するまで資本はロックされたままです。'
  },
  {
    question: 'どのような支払い方法が受け入れられていますか？',
    answer: 'Grant Unionはすべての取引にビットコインとUSDTを受け入れ、迅速で安全、グローバルアクセスを確保します。'
  },
  {
    question: '紹介からいくら稼ぐことができますか？',
    answer: '紹介収入に制限はありません。あなたの紹介リンクを使用して登録した人が行ったすべての入金の10%を獲得します。より多くを紹介すれば、より多く稼ぎます。'
  },
  {
    question: '出金にはどのくらい時間がかかりますか？',
    answer: '出金は数分以内に処理されます。ビットコインとUSDT転送は通常、24時間以内にブロックチェーンで確認されます。'
  },
  {
    question: '投資は安全ですか？',
    answer: 'はい。Grant Unionは業界レベルのセキュリティ対策を使用し、プロのトレーダーチームはあなたの資金が注意深く専門的に管理されることを保証します。'
  }
];

faqs.forEach((faq, idx) => {
  doc.fontSize(11).fillColor(primaryOrange).font('ArialBold').text('Q: ' + faq.question, { width: 480 });
  doc.fontSize(11).fillColor(lightText).font('ArialBold').text('A: ' + faq.answer, { width: 480, lineGap: 1.3 });
  if (idx < faqs.length - 1) {
    doc.moveDown(0.3);
  }
});

addHeading1('お問い合わせとサポート');
addParagraph('ご質問やご不明な点がございましたら、専門のサポートチームにお問い合わせください：');

addBulletPoint('メール：grantunion583@gmail.com');
addBulletPoint('ウェブサイト：grantunion.vercel.app');
addBulletPoint('対応時間：24時間以内');
addBulletPoint('営業時間：24/7サポート利用可能');

addHeading3('サポートが必要ですか？');
addParagraph('プロのサポートチームは、質問、アカウントの問題、または取引のご相談をサポートするために24時間対応しています。grantunion583@gmail.comにいつでもお気軽にお問い合わせください！');

doc.moveDown(0.5);

doc.fontSize(10).fillColor(lightText).font('ArialBold').text('© 2026 Grant Union. すべての権利は保有されています。', { align: 'center' });
doc.fontSize(9).text('プロの取引 | 暗号通貨 | 外国為替 | ゴールド | 不動産', { align: 'center' });
doc.text('本ドキュメントは情報提供のみを目的としています。', { align: 'center' });

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✓ 日本語 PDF が正常に生成されました！`);
  console.log(`✓ ファイル: ${outputPath}`);
  console.log(`✓ サイズ: ${(stats.size / 1024).toFixed(2)} KB`);
});

doc.on('error', (err) => {
  console.error('✗ PDF 生成中にエラーが発生しました:', err.message);
  process.exit(1);
});
