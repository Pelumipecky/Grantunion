#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scripts = [
  'create-fresh-pdf.js',           // English
  'create-guide-es.js',             // Spanish
  'create-guide-es-final.js',       // Spanish alt
  'create-guide-fr-final.js',       // French
  'create-guide-de-final.js',       // German
  'create-guide-it-proper.js',      // Italian
  'create-guide-pt-proper.js',      // Portuguese
  'create-guide-ru-proper.js',      // Russian
  'create-guide-ru-final.js',       // Russian alt
  'create-guide-ar-proper.js',      // Arabic
  'create-guide-zh-proper.js',      // Chinese
  'create-guide-ja-proper.js',      // Japanese
  'create-guide-ko-proper.js',      // Korean
  'gen-final-batch.js',             // Batch: pl, nl, tr
  'gen-remaining.js',               // Batch: hi, id, th, vi, el
  'gen-final6.js',                  // Batch: sv, no, da
  'gen-final5.js',                  // Batch: others
  'gen-last4.js',                   // Batch: others
  'gen-pl.js',                      // Polish
  'gen-remaining-langs.js'          // Remaining batch
];

console.log('Starting PDF regeneration...\n');

let success = 0;
let failed = 0;
const errors = [];

scripts.forEach((script, idx) => {
  try {
    console.log(`[${idx + 1}/${scripts.length}] Regenerating from ${script}...`);
    execSync(`node ${script}`, { cwd: __dirname, stdio: 'pipe' });
    success++;
    console.log(`✓ ${script} completed\n`);
  } catch (err) {
    failed++;
    const errorMsg = `✗ ${script} failed: ${err.message}`;
    console.log(errorMsg + '\n');
    errors.push(errorMsg);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`PDF Regeneration Summary:`);
console.log(`✓ Successful: ${success}/${scripts.length}`);
console.log(`✗ Failed: ${failed}/${scripts.length}`);
if (errors.length > 0) {
  console.log(`\nErrors:`);
  errors.forEach(err => console.log(`  ${err}`));
}
console.log('='.repeat(60));

// Verify PDFs were created
const downloadDir = path.join(__dirname, 'public', 'downloads');
const pdfFiles = fs.readdirSync(downloadDir).filter(f => f.startsWith('guide-') && f.endsWith('.pdf'));
console.log(`\nPDFs Generated: ${pdfFiles.length}`);
pdfFiles.forEach(pdf => {
  const stats = fs.statSync(path.join(downloadDir, pdf));
  console.log(`  ✓ ${pdf} (${(stats.size / 1024).toFixed(2)} KB)`);
});
