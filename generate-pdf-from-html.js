#!/usr/bin/env node

const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'public', 'downloads', 'guide-en-styled.html');
const outputPath = path.join(__dirname, 'public', 'downloads', 'guide-en.pdf');
const publicPath = path.join(__dirname, 'public');

// Read HTML file
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace relative image paths with absolute paths for PDF generation
html = html.replace(/src="([^"]+\.png)"/g, (match, filename) => {
  const imagePath = path.join(publicPath, filename).replace(/\\/g, '/');
  return `src="file:///${imagePath}"`;
});

// PDF options with portrait orientation
const options = {
  format: 'A4',
  orientation: 'portrait',
  margin: {
    top: '15mm',
    right: '15mm',
    bottom: '15mm',
    left: '15mm'
  },
  header: {
    height: '0mm'
  },
  footer: {
    height: '10mm',
    contents: {
      default: '<div style="text-align: center; font-size: 9px; color: #999;">Page <span class="page"></span> of <span class="toPage"></span></div>'
    }
  },
  zoomFactor: '1.0'
};

// Generate PDF
pdf.create(html, options).toFile(outputPath, (err, res) => {
  if (err) {
    console.error('✗ Error generating PDF:', err.message);
    process.exit(1);
  }
  
  const stats = fs.statSync(outputPath);
  console.log(`✓ PDF generated successfully!`);
  console.log(`✓ File: ${outputPath}`);
  console.log(`✓ Size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`✓ File saved successfully`);
});
