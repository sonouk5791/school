// Reproducible, silent 20-second illustrated introduction. No remote media.
const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage();await page.setContent('<canvas width="960" height="480"></canvas>');
const data=await page.evaluate(async()=>{
 const canvas=document.querySelector('canvas'),c=canvas.getContext('2d');
 function oval(x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
 function line(x,y,a,b,color,w){c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke()}
 function box(x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
 function text(s,x,y,size,color='#51483d'){c.fillStyle=color;c.font=`500 ${size}px "Malgun Gothic", sans-serif`;c.textAlign='center';c.fillText(s,x,y)}
 const people=[['콩이','dog','#eddfc7','#819472'],['토리','rabbit','#f4e9db','#a497ac'],['어르신','woman','#efc8a9','#a57d65'],['어르신','man','#e9c3a3','#7b91a0'],['나비','cat','#e4b878','#b7a16c'],['보리','bear','#af8060','#889d8b']];
 function person(p,x,t){let [name,kind,skin,shirt]=p;const human=kind==='woman'||kind==='man';const phase=t<6?0:t<14?1:2;const wave=Math.sin(t*Math.PI/2);const clap=(1-Math.cos((t-6)*Math.PI/2))/2;
  c.save();c.translate(x,0);oval(0,384,54,9,'#e0d6c6');box(-39,244,78,98,15,'#d1b998');line(-32,326,-36,379,'#b8a085',8);line(32,326,36,379,'#b8a085',8);
  line(-17,318,-19,369,human?'#827b71':skin,23);line(17,318,20,369,human?'#827b71':skin,23);oval(-22,371,18,9,'#746c5d');oval(24,371,18,9,'#746c5d');
  c.save();c.translate(0,310);c.rotate(phase===2?Math.sin((t-14)*Math.PI/3)*.035:0);c.translate(0,-310);
  box(-34,245,68,79,23,shirt);line(0,259,0,313,'#e2d5bc',2);oval(0,280,2.5,2.5,'#e8dcc6');oval(0,296,2.5,2.5,'#e8dcc6');
  if(kind==='rabbit'){oval(-21,174,12,44,skin);oval(21,174,12,44,skin);oval(-21,174,5,31,'#ddb6ad');oval(21,174,5,31,'#ddb6ad')}
  if(kind==='bear'){oval(-34,191,17,19,skin);oval(34,191,17,19,skin);oval(-34,191,9,10,'#d8ae8d');oval(34,191,9,10,'#d8ae8d')}
  if(kind==='cat'){for(const side of [-1,1]){c.fillStyle=skin;c.beginPath();c.moveTo(side*9,192);c.lineTo(side*35,163);c.lineTo(side*43,209);c.fill()}}
  oval(0,216,human?34:43,human?40:39,skin);
  if(kind==='dog'){oval(-39,221,15,35,'#a57752');oval(39,221,15,35,'#a57752')}
  if(human){c.fillStyle='#d9d7cf';c.beginPath();c.arc(0,211,36,Math.PI,Math.PI*2);c.fill();if(kind==='woman'){oval(-32,210,9,24,'#d9d7cf');oval(32,210,9,24,'#d9d7cf')}line(-22,207,-9,206,'#aaa79d',2);line(9,206,22,207,'#aaa79d',2)}
  oval(-13,219,3.4,4.2,'#514035');oval(13,219,3.4,4.2,'#514035');oval(-14,218,1,1,'white');oval(12,218,1,1,'white');
  if(!human)oval(0,230,5,3.5,'#675044');oval(-24,234,7,3,'#dba492');oval(24,234,7,3,'#dba492');c.strokeStyle='#795747';c.lineWidth=2;c.beginPath();c.arc(0,233,9,0.15,Math.PI-.15);c.stroke();
  for(const side of [-1,1]){const sx=side*29,sy=263;let ex=side*47,ey=288,hx=side*40,hy=308;
   if(phase===0&&side===1){ex=48;ey=259;hx=52+wave*7;hy=226+wave*3}
   if(phase===1){ex=side*43;ey=281;hx=side*(22-14*clap);hy=277}
   line(sx,sy,ex,ey,shirt,16);line(ex,ey,hx,hy,skin,13);oval(hx,hy,8,9,skin);
  }
  c.restore();text(name,0,416,20);c.restore();
 }
 function draw(t){box(0,0,960,480,0,'#fcf6eb');box(38,26,884,337,24,'#f3eadb');box(360,51,240,160,15,'#fffdf7');box(374,64,212,132,9,'#e5ede7');line(480,64,480,196,'#fffdf7',7);line(374,130,586,130,'#fffdf7',7);oval(533,98,18,18,'#eadbb5');
  box(52,334,856,104,30,'#ece1cf');text('함께 천천히, 즐겁게',480,40,20,'#657857');people.forEach((p,i)=>person(p,105+i*150,t));
  text(t<6?'앉아서 반갑게 손 인사해요':t<14?'가볍게, 천천히 박수쳐요':'손을 내려놓고 편안하게 쉬어요',480,464,25);
 }
 draw(0);const poster=canvas.toDataURL('image/png');const stream=canvas.captureStream(24);const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:650000});const chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);
 const done=new Promise(resolve=>recorder.onstop=resolve);recorder.start();const start=performance.now();await new Promise(resolve=>{function frame(now){const t=(now-start)/1000;draw(Math.min(t,19.99));if(t<20)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});recorder.stop();await done;stream.getTracks().forEach(t=>t.stop());
 const buffer=await new Blob(chunks).arrayBuffer();return {video:Array.from(new Uint8Array(buffer)),poster:poster.split(',')[1]};
 });fs.mkdirSync('assets/videos',{recursive:true});fs.writeFileSync('assets/videos/friends-chair-warmup.webm',Buffer.from(data.video));fs.writeFileSync('assets/videos/friends-chair-warmup-poster.png',Buffer.from(data.poster,'base64'));console.log('Created actual silent 20-second WebM and poster');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
