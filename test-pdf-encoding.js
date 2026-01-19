#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Create a simple test PDF to verify text rendering without encoding issues
const testPath = path.join(__dirname, 'test-encoding.pdf');
const doc = new PDFDocument({ size: 'A4', margin: 15 });
doc.pipe(fs.createWriteStream(testPath));

doc.fontSize(12).text('Testing Text Encoding:', { underline: true });
doc.fontSize(11).text('');

const testStrings = [
  'English: Grant Union Investment Plans',
  'Spanish: Plan de 3 Días - $100-$999',
  'French: Plan 3 Jours - $100-$999',
  'German: 3-Tage-Plan - $100-$999',
  'Russian: План 3 дня - $100-$999',
  'Arabic: خطة 3 أيام - $100-$999',
  'Chinese: 3天计划 - $100-$999',
  'Japanese: 3日間プラン - $100-$999',
  'Korean: 3일 계획 - $100-$999',
  'Italian: Piano 3 Giorni - $100-$999',
  'Portuguese: Plano 3 Dias - $100-$999'
];

testStrings.forEach((str, idx) => {
  doc.fontSize(10).text(`${idx + 1}. ${str}`);
});

doc.end();

console.log('✓ Test encoding PDF created at: ' + testPath);
console.log('\nIf this file shows garbled text, there is a character encoding issue.');
console.log('Otherwise, character encoding is working correctly.');
