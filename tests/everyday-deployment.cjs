const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const base='https://school-tau-pearl.vercel.app';
const files=['senior-exercise.html','index.html','tori-play.html','nabi-learn.html','bori-hobby.html','js/everyday-characters.js','js/hanbok-character.js','js/character-animation.js','css/everyday-characters.css','css/character-expressions.css','assets/senior-exercise/program.json'];
for(const id of ['kongi','tori','nabi','bori'])files.push(`assets/images/everyday/${id}-active.png`);
for(const name of fs.readdirSync('assets/senior-exercise/images/everyday'))files.push('assets/senior-exercise/images/everyday/'+name);
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
(async()=>{for(const file of files){const res=await fetch(base+'/'+file);assert.equal(res.status,200,file);assert.equal(hash(Buffer.from(await res.arrayBuffer())),hash(fs.readFileSync(file)),file);}console.log('PASS production byte hashes: '+files.length+' HTML/scripts/styles/program/character/scene files');})().catch(e=>{console.error(e);process.exitCode=1});
