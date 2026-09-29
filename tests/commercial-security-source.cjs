const fs = require('node:fs'), assert = require('node:assert/strict');
const root = require('node:path').resolve(__dirname, '..');
const read = file => fs.readFileSync(require('node:path').join(root, file), 'utf8');
for (const file of ['js/companion-character.js', 'server.cjs']) {
  assert(!/tc_[a-f0-9]{20,}/.test(read(file)), 'Credential literal must not be in ' + file);
}
assert(!/X-Typecast-API-Key/i.test(read('js/companion-character.js')), 'Browser must not send a provider key');
assert(read('server.cjs').includes('const apiKey = TYPECAST_API_KEY;'), 'Legacy provider must use server configuration');
assert(read('server.cjs').includes('if (!apiKey)'), 'Unconfigured legacy service must fail closed');
assert(read('.vercelignore').includes('documents/commercial-audit-2026-09-29/'), 'Internal findings must not be public assets');
// Exercise the local proxy without loading .env or sending an external request.
const vm = require('node:vm'), EventEmitter = require('node:events');
const realRequire = require('node:module').createRequire(require('node:path').join(root, 'server.cjs'));
function proxy(serverKey) {
  let handler, forwarded;
  vm.runInNewContext(read('server.cjs'), {
    __dirname: root, Buffer, URL, console: {log() {}, error() {}},
    process: {env: serverKey ? {TYPECAST_API_KEY:serverKey} : {}},
    require(name) {
      if (name === 'fs') return {...fs, existsSync: () => false};
      if (name === 'http') return {createServer(fn) {handler=fn;return {listen() {}};}};
      if (name === 'https') return {request(url, options) {forwarded=options;return {on() {}, write() {}, end() {}};}};
      return realRequire(name);
    },
  });
  const req = new EventEmitter();
  Object.assign(req,{url:'/api/tts/typecast',method:'POST',headers:{'x-typecast-api-key':'browser-test-value'}});
  const res = {setHeader() {},writeHead(code) {this.status=code;},end(body) {this.body=body;}};
  handler(req,res);req.emit('data',JSON.stringify({text:'가상 테스트'}));req.emit('end');
  return {res,forwarded};
}
const missing = proxy(); assert.equal(missing.res.status,503);assert.equal(missing.forwarded,undefined);
const configured = proxy('server-test-only');assert.equal(configured.forwarded.headers.Authorization,'Bearer server-test-only');
console.log('PASS no credential literals/browser key header, missing server config returns 503, client key ignored, configured legacy proxy preserved, audit deployment exclusion. No key validity or revocation claimed.');
