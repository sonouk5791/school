const http = require('http');
const assert = require('assert');

// 1. Check local server HTTP response
http.get('http://127.0.0.1:8085/', (res) => {
  assert.strictEqual(res.statusCode, 200, 'Homepage must return 200 OK');
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Server HTTP 200 OK');
    assert(data.includes('디지털 학교'), 'Title must exist');
    assert(data.includes('hero-classroom'), 'Hero classroom section must exist in HTML');
    assert(data.includes('brand-logo'), 'Brand logo must exist');
    console.log('✅ Base HTML structure verified');
  });
}).on('error', (e) => {
  console.error('Server check failed:', e);
});
