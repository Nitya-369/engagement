#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distClient = path.join(__dirname, '../dist/client');

// Find the generated CSS and JS files
const assetsDir = path.join(distClient, 'assets');
const files = fs.readdirSync(assetsDir);

const cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));
const jsFiles = files.filter(f => f.startsWith('index-') && f.endsWith('.js'));

// Create index.html with correct asset paths
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Deven & Nitya — Engagement Invitation</title>
    <meta name="description" content="With blessings, the Vakotar & Makwana families invite you to the engagement of Deven & Nitya on 12th July 2026, Ahmedabad." />
    <meta property="og:title" content="Deven & Nitya — Engagement Invitation" />
    <meta property="og:description" content="Join us in celebrating the engagement of Deven & Nitya — 12th July 2026, Ahmedabad." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Tangerine:wght@400;700&display=swap" rel="stylesheet" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ''}
  </head>
  <body>
    <div id="root"></div>
    ${jsFiles.map(js => `<script type="module" src="/assets/${js}"></script>`).join('\n    ')}
  </body>
</html>`;

fs.writeFileSync(path.join(distClient, 'index.html'), html);
console.log('✓ Created index.html for Netlify deployment');
