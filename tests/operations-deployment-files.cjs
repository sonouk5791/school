const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const base=process.argv[2]||'https://school-tau-pearl.vercel.app';
const files=['index.html','daycare-class.html','js/daycare-session.js','js/operations-home.js','js/operations-admin.js','js/operations-sync.js','automation/domain.js','css/operations.css','js/character-voice-system.js','assets/images/home-hero/four-friends.jpg'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{for(const file of files){const r=await fetch(base+'/'+file);assert.equal(r.status,200,file);assert.equal(hash(Buffer.from(await r.arrayBuffer())),hash(fs.readFileSync(file)),file);}console.log(`PASS ${files.length} production files match local SHA256, including preserved artwork`);})().catch(e=>{console.error(e);process.exit(1)});
