import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'public');
const pages = ['index.html', 'exercise.html', 'play.html', 'study.html', 'garden.html', 'shelter.html'];
const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const csp = config.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const scriptPolicy = csp.split(';').find(d => d.trim().startsWith('script-src '));

// Fail closed if an inline script changes without a matching CSP review.
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8').replace(/\r\n?/g, '\n');
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(attributes)) continue;
    const hash = createHash('sha256').update(body).digest('base64');
    if (!scriptPolicy.includes(`'sha256-${hash}'`)) throw new Error(`CSP hash review required: ${page}`);
  }
}

// Publish only known application files; never copy the repository root.
// Constrain deletion to this project's generated public directory.
if (resolve(output) !== resolve(root, 'public')) throw new Error('Invalid output path');
if (existsSync(output)) rmSync(output, { recursive: true });
mkdirSync(output);
for (const name of [...pages, 'app.js', 'style.css']) cpSync(join(root, name), join(output, name));
mkdirSync(join(output, 'assets'));
const publicAssets = ['bori_exercise.jpg', 'bori_lilac_home.jpg', 'bori_sheet.jpg', 'bori_shelter.jpg', 'bori_study.jpg', 'bori_tori_play.jpg', 'kongi_sheet.jpg', 'nabi_turtle_sheet.jpg', 'tori_sheet.jpg'];
for (const name of publicAssets) {
  cpSync(join(root, 'assets', name), join(output, 'assets', name));
}
console.log('Built public site: 6 pages, existing scripts/styles and media only.');
