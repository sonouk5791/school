const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base='https://school-tau-pearl.vercel.app',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{for(const file of ['index.html','js/kongi-greeting-video.js','css/kongi-greeting-video.css','assets/images/kongi-greeting-poster.png','assets/videos/kongi-greeting.mp4']){
 const res=await fetch(base+'/'+file);assert.equal(res.status,200);assert.equal(hash(Buffer.from(await res.arrayBuffer())),hash(fs.readFileSync(file)),file);
}console.log('PASS production page/controller/style/poster/MP4 hashes match');})().catch(e=>{console.error(e);process.exitCode=1});
