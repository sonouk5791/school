// Offline production: ten distinct chapters with gentle movement/rest sets.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const ffmpeg=process.env.FFMPEG_PATH||path.resolve('.video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
const chapters=[
 ['편하게 앉아 준비해요','튼튼한 의자에 앉아 두 발을 바닥에 두어요',2],
 ['콩이와 손 인사','손을 가볍게 들어 천천히 인사해요',0],
 ['토리와 가벼운 박수','손뼉을 살짝 맞대고 천천히 벌려요',1],
 ['나비와 팔 앞으로','팔을 편안한 높이까지만 앞으로 들어요',3],
 ['보리와 손목 움직이기','팔꿈치를 몸 가까이 두고 손목을 작게 움직여요',4],
 ['함께 쉬어가요','손을 무릎에 두고 편안하게 쉬어요',2],
 ['콩이와 팔 굽혔다 펴기','팔꿈치를 몸 가까이 두고 천천히 굽혀요',5],
 ['나비와 양손 인사','양손을 낮게 들어 가볍게 인사해요',6],
 ['토리와 느린 박수','부드럽게 박수치고 손을 내려놓아요',1],
 ['보리와 마무리','두 손을 편히 내려놓아요. 함께해서 즐거웠어요',2]
];
function run(args){return new Promise((resolve,reject)=>{const p=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y',...args]);let err='';p.stderr.on('data',b=>err+=b);p.on('error',reject);p.on('close',code=>code?reject(new Error(err)):resolve())})}
(async()=>{fs.mkdirSync('.video-build',{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true});try{const page=await browser.newPage();await page.setContent('<canvas width="960" height="480"></canvas>');
 let source=fs.readFileSync('scripts/render-warmup.cjs','utf8');source=source.slice(source.indexOf(' const canvas='),source.indexOf(' draw(0);'));
 source=source.replace('const phase=t<6?0:t<14?1:2;const wave=Math.sin(t*Math.PI/2);const clap=(1-Math.cos((t-6)*Math.PI/2))/2;','const phase=window.motion;const wave=Math.sin(t*Math.PI/4);const clap=(1-Math.cos(t*Math.PI/4))/2;');
 source=source.replace("c.rotate(phase===2?Math.sin((t-14)*Math.PI/3)*.035:0)","c.rotate(0)");
 source=source.replace('if(phase===0&&side===1)','if((phase===0&&side===1)||phase===6)');
 source=source.replace('ex=48;ey=259;hx=52+wave*7;hy=226+wave*3','ex=side*48;ey=259;hx=side*(52+wave*7);hy=226+wave*3');
 source=source.replace('line(sx,sy,ex,ey,shirt,16);',`if(phase===3){ex=side*43;ey=285-clap*13;hx=side*48;hy=307-clap*43}
   if(phase===4){ex=side*42;ey=287;hx=side*43+Math.sin(t*Math.PI/4)*5;hy=270+Math.cos(t*Math.PI/4)*5}
   if(phase===5){ex=side*41;ey=286;hx=side*(42-9*clap);hy=305-48*clap}
   line(sx,sy,ex,ey,shirt,16);`);
 source=source.replace("text('함께 천천히, 즐겁게',480,40,20,'#657857')","text(window.heading,480,40,22,'#657857')");
 source=source.replace("text(t<6?'앉아서 반갑게 손 인사해요':t<14?'가볍게, 천천히 박수쳐요':'손을 내려놓고 편안하게 쉬어요',480,464,25)","text(window.caption,480,464,24)");
 await page.evaluate(source+';window.drawExercise=draw;');
 for(let chapter=0;chapter<chapters.length;chapter++){
  const [title,caption,motion]=chapters[chapter];const output=path.resolve(`.video-build/chapter-${chapter}.mp4`);
  const p=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','12','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p',output]);let err='';p.stderr.on('data',b=>err+=b);const done=new Promise((resolve,reject)=>{p.on('error',reject);p.on('close',code=>code?reject(new Error(err)):resolve())});
  // 8 seconds of gentle movement, then 4 seconds of rest. Ten sets per chapter.
  for(let f=0;f<144;f++){const data=await page.evaluate(({f,title,caption,motion,chapter})=>{window.motion=f>=96?2:motion;window.heading=`${chapter+1} / 10 · ${title}`;window.caption=f>=96&&motion!==2?'손을 내려놓고 잠깐 쉬어요':caption;window.drawExercise(f/12);return document.querySelector('canvas').toDataURL('image/png').split(',')[1]},{f,title,caption,motion,chapter});const buf=Buffer.from(data,'base64');if(chapter===0&&f===0)fs.writeFileSync('assets/videos/friends-exercise-20min-poster.png',buf);if(!p.stdin.write(buf))await new Promise(resolve=>p.stdin.once('drain',resolve));}
  p.stdin.end();await done;console.log(`Rendered chapter ${chapter+1}/10: ${title}`);
 }
 const lines=[];for(let i=0;i<10;i++)for(let repeat=0;repeat<10;repeat++)lines.push(`file 'chapter-${i}.mp4'`);fs.writeFileSync('.video-build/concat.txt',lines.join('\n'));
 await run(['-f','concat','-safe','0','-i','.video-build/concat.txt','-c','copy','-movflags','+faststart','assets/videos/friends-exercise-20min.mp4']);
 fs.writeFileSync('assets/videos/friends-exercise-20min-chapters.json',JSON.stringify(chapters.map(([title,instruction],i)=>({start:i*120,end:(i+1)*120,title,instruction})),null,2));
 console.log('Created 1200-second MP4 with ten two-minute chapters, silent and captioned.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
