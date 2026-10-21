import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const runBuild = () => execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'pipe' });
const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const headers = Object.fromEntries(config.headers[0].headers.map(h => [h.key, h.value]));

test('deployment excludes private files, documentation and unapproved assets', () => {
  const probes = ['private-records.json', 'assets/private-records.json', 'assets/private-photo.jpg'];
  try {
    for (const probe of probes) writeFileSync(join(root, probe), '{"private":true}');
    runBuild();
    assert.equal(config.outputDirectory, 'public');
    assert.deepEqual(readdirSync(join(root, 'public')).sort(), ['app.js', 'assets', 'exercise.html', 'garden.html', 'index.html', 'play.html', 'shelter.html', 'study.html', 'style.css'].sort());
    for (const probe of probes) assert.equal(existsSync(join(root, 'public', probe)), false);
    assert.equal(readdirSync(join(root, 'public/assets')).length, 9);
  } finally {
    for (const probe of probes) unlinkSync(join(root, probe));
  }
});

test('CSP blocks unapproved scripts, outbound requests, forms and framing', () => {
  const csp = headers['Content-Security-Policy'];
  const scripts = csp.split(';').find(d => d.trim().startsWith('script-src '));
  assert.ok(!scripts.includes('unsafe-inline') && !scripts.includes('unsafe-eval'));
  for (const directive of ["connect-src 'none'", "form-action 'none'", "frame-ancestors 'none'", "object-src 'none'", "base-uri 'none'"]) assert.ok(csp.includes(directive));
  assert.equal(headers['Cache-Control'], 'no-store');
  assert.equal(headers['Referrer-Policy'], 'no-referrer');
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
});

test('modified inline scripts cannot silently break the CSP', () => {
  const page = join(root, 'exercise.html');
  const original = readFileSync(page);
  try {
    writeFileSync(page, original.toString().replace('<script>', '<script>\n/* changed */'));
    assert.throws(runBuild, /CSP hash review required/);
  } finally { writeFileSync(page, original); }
});

test('all local page links, scripts and image references resolve in the published output', () => {
  for (const name of readdirSync(join(root, 'public')).filter(n => n.endsWith('.html'))) {
    const html = readFileSync(join(root, 'public', name), 'utf8');
    for (const [, reference] of html.matchAll(/(?:src|href|data-target)=["']([^"']+)["']/g)) {
      if (/^(?:https?:|data:|#)/.test(reference)) continue;
      assert.ok(existsSync(resolve(root, 'public', reference)), `${name}: ${reference}`);
    }
  }
});
