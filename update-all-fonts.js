#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of all PDF generator scripts
const scripts = [
  'create-fresh-pdf.js',
  'create-guide-es.js',
  'create-guide-es-final.js',
  'create-guide-fr-final.js',
  'create-guide-de-final.js',
  'create-guide-ru-proper.js',
  'create-guide-ru-final.js',
  'create-guide-ar-proper.js',
  'create-guide-ar-final.js',
  'create-guide-zh-proper.js',
  'create-guide-zh-final.js',
  'create-guide-ja-proper.js',
  'create-guide-ko-proper.js',
  'create-guide-it-proper.js',
  'create-guide-pt-proper.js',
  'gen-final-batch.js',
  'gen-remaining.js',
  'gen-final6.js',
  'gen-final5.js',
  'gen-last4.js',
  'gen-pl.js',
  'gen-remaining-langs.js'
];

console.log('Updating all PDF scripts to use Arial fonts...\n');

scripts.forEach((script, idx) => {
  const scriptPath = path.join(__dirname, script);
  
  if (!fs.existsSync(scriptPath)) {
    console.log(`⊘ [${idx + 1}/${scripts.length}] ${script} - NOT FOUND`);
    return;
  }

  let content = fs.readFileSync(scriptPath, 'utf8');
  let updated = false;

  // 1. Add font registration after doc.pipe if not already present
  if (!content.includes('registerFont')) {
    const pipeRegex = /doc\.pipe\(fs\.createWriteStream\(outputPath\)\);/;
    if (pipeRegex.test(content)) {
      content = content.replace(pipeRegex, 
        `doc.pipe(fs.createWriteStream(outputPath));

// Register Arial fonts for better Unicode support across all languages
const arialPath = 'C:\\\\Windows\\\\Fonts\\\\arial.ttf';
const arialBoldPath = 'C:\\\\Windows\\\\Fonts\\\\arialbd.ttf';
doc.registerFont('Arial', arialPath);
doc.registerFont('ArialBold', arialBoldPath);`);
      updated = true;
    }
  }

  // 2. Replace all font references
  const fontReplacements = [
    { old: /\.font\('Helvetica-Bold'\)/g, new: ".font('ArialBold')" },
    { old: /\.font\("Helvetica-Bold"\)/g, new: '.font("ArialBold")' },
    { old: /\.font\('Helvetica'\)/g, new: ".font('Arial')" },
    { old: /\.font\("Helvetica"\)/g, new: '.font("Arial")' },
    { old: /\.font\('Courier-Bold'\)/g, new: ".font('ArialBold')" },
    { old: /\.font\("Courier-Bold"\)/g, new: '.font("ArialBold")' },
    { old: /\.font\('Courier'\)/g, new: ".font('Arial')" },
    { old: /\.font\("Courier"\)/g, new: '.font("Arial")' },
    { old: /font\('Helvetica-Bold'\)/g, new: "font('ArialBold')" },
    { old: /font\("Helvetica-Bold"\)/g, new: 'font("ArialBold")' },
    { old: /font\('Helvetica'\)/g, new: "font('Arial')" },
    { old: /font\("Helvetica"\)/g, new: 'font("Arial")' }
  ];

  fontReplacements.forEach(replacement => {
    if (replacement.old.test(content)) {
      content = content.replace(replacement.old, replacement.new);
      updated = true;
    }
  });

  // Write back if changed
  if (updated) {
    fs.writeFileSync(scriptPath, content, 'utf8');
    console.log(`✓ [${idx + 1}/${scripts.length}] ${script} - Updated`);
  } else {
    console.log(`- [${idx + 1}/${scripts.length}] ${script} - No changes needed`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✓ All PDF scripts updated to use Arial fonts');
console.log('='.repeat(60));
