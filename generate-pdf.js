#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const htmlToPdf = require('html2pdf.js');

const inputPath = path.join(__dirname, 'guide-en-styled.html');
const outputPath = path.join(__dirname, 'guide-en.pdf');

// Read the HTML file
const html = fs.readFileSync(inputPath, 'utf8');

// Configure PDF options
const options = {
  margin: 10,
  filename: outputPath,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { 
    unit: 'mm', 
    format: 'a4', 
    orientation: 'portrait',
    compress: true
  }
};

// Create element from HTML string
const element = document.createElement('div');
element.innerHTML = html;

// Generate PDF
htmlToPdf()
  .set(options)
  .from.element(element)
  .save()
  .then(() => {
    console.log(`✓ PDF generated successfully: ${outputPath}`);
    console.log(`✓ File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
  })
  .catch(err => {
    console.error('✗ Error generating PDF:', err.message);
    process.exit(1);
  });
