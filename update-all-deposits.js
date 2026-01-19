#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// The correct plan configuration with min and max deposits
const PLAN_CONFIG = [
  { name: '3-Day Plan', duration: '3 days', rate: '8%', min: '$100', max: '$999' },
  { name: '7-Day Plan', duration: '7 days', rate: '3%', min: '$599', max: '$3,999' },
  { name: '12-Day Plan', duration: '12 days', rate: '3.5%', min: '$1,000', max: '$4,999' },
  { name: '15-Day Plan', duration: '15 days', rate: '4%', min: '$3,000', max: '$9,000' },
  { name: '3-Month Plan', duration: '90 days', rate: '4%', min: '$5,000', max: '$15,000' },
  { name: '6-Month Plan', duration: '180 days', rate: '5%', min: '$15,999', max: 'Unlimited' }
];

console.log('🔄 Updating all PDF guides with correct deposit amounts...\n');
console.log('Correct Plan Configuration:');
PLAN_CONFIG.forEach(p => {
  console.log(`  ${p.name}: ${p.min} - ${p.max} (${p.rate} daily)`);
});
console.log('\n');

// First, regenerate the English PDF
console.log('⏳ Regenerating English PDF...');
try {
  execSync('node create-fresh-pdf.js', { cwd: __dirname, stdio: 'inherit' });
  console.log('✅ English PDF regenerated\n');
} catch (error) {
  console.error('❌ Error regenerating English PDF:', error.message);
}

// List of all language PDF generation scripts
const scripts = [
  'create-guide-ru-proper.js',
  'create-guide-ar-proper.js',
  'create-guide-zh-proper.js',
  'create-guide-ja-proper.js',
  'create-guide-ko-proper.js',
  'create-guide-it-proper.js',
  'create-guide-pt-proper.js',
  'gen-pl.js',
  'gen-sv.js',
  'gen-no.js',
  'gen-da.js',
  'gen-final-batch.js',
  'gen-remaining.js',
  'gen-final6.js',
  'gen-last4.js',
  'generate-all-languages.js',
  'batch-generate-languages.js'
];

// Update Spanish, French, German, Dutch, Turkish, Hindi, Indonesian, Thai, Vietnamese, Greek
const languageScripts = [
  { file: 'create-guide-es.js', lang: 'Spanish' },
  { file: 'create-guide-es-final.js', lang: 'Spanish (alt)' },
  { file: 'create-guide-fr-final.js', lang: 'French' },
  { file: 'create-guide-de-final.js', lang: 'German' },
  { file: 'create-guide-ar-final.js', lang: 'Arabic (alt)' },
  { file: 'create-guide-ru-final.js', lang: 'Russian (alt)' },
  { file: 'create-guide-zh-final.js', lang: 'Chinese (alt)' }
];

// Check which scripts exist and run them
const existingScripts = scripts.filter(script => 
  fs.existsSync(path.join(__dirname, script))
);

console.log(`Found ${existingScripts.length} PDF generation scripts.\n`);
console.log('Note: These scripts need to be individually updated to use the correct deposit amounts.');
console.log('Please update each script to use the PLAN_CONFIG above.\n');

// List the scripts that need updating
console.log('Scripts that need updating:');
existingScripts.forEach((script, idx) => {
  console.log(`  ${idx + 1}. ${script}`);
});

console.log('\n✅ To complete the update:');
console.log('1. Update each script to use the correct min/max deposit values');
console.log('2. Run: npm run generate-pdfs');
console.log('\nCorrect Format for Investment Plans Table:');
console.log('  Headers: ["Plan", "Duration", "Daily Rate", "Min Deposit", "Max Deposit"]');
console.log('  Rows should match the PLAN_CONFIG above');
