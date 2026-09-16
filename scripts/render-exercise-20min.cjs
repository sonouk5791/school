const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ffmpeg = process.env.FFMPEG_PATH || path.resolve('.video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
const fontPath = 'C\\:/Windows/Fonts/malgunbd.ttf';
const inputImage = path.resolve('assets/images/friends-exercise-guide.png');

const chapters = [
  ['편하게 앉아 준비해요', '튼튼한 의자에 앉아 두 발을 바닥에 두어요'],
  ['콩이와 손 인사', '손을 가볍게 들어 천천히 인사해요'],
  ['토리와 가벼운 박수', '손뼉을 살짝 맞대고 천천히 벌려요'],
  ['나비와 팔 앞으로', '팔을 편안한 높이까지만 앞으로 들어요'],
  ['보리와 손목 움직이기', '팔꿈치를 몸 가까이 두고 손목을 작게 움직여요'],
  ['함께 쉬어가요', '손을 무릎에 두고 편안하게 쉬어요'],
  ['콩이와 팔 굽혔다 펴기', '팔꿈치를 몸 가까이 두고 천천히 굽혀요'],
  ['나비와 양손 인사', '양손을 낮게 들어 가볍게 인사해요'],
  ['토리와 느린 박수', '부드럽게 박수치고 손을 내려놓아요'],
  ['보리와 마무리', '두 손을 편히 내려놓아요. 함께해서 즐거웠어요']
];

function run(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
    let err = '';
    p.stderr.on('data', b => err += b);
    p.on('error', reject);
    p.on('close', code => code ? reject(new Error(err)) : resolve());
  });
}

(async () => {
  fs.mkdirSync('.video-build', { recursive: true });
  fs.mkdirSync('assets/videos', { recursive: true });

  console.log('Rendering 10 exercise chapters using the new attached characters...');

  for (let i = 0; i < chapters.length; i++) {
    const [title, instruction] = chapters[i];
    const titleFile = path.resolve(`.video-build/title-${i}.txt`);
    const cap1File = path.resolve(`.video-build/cap1-${i}.txt`);
    const cap2File = path.resolve(`.video-build/cap2-${i}.txt`);

    fs.writeFileSync(titleFile, `${i + 1} / 10 · ${title}`, 'utf8');
    fs.writeFileSync(cap1File, instruction, 'utf8');
    fs.writeFileSync(cap2File, '손을 내려놓고 편안하게 쉬어요', 'utf8');

    const tf = titleFile.replace(/\\/g, '/').replace(':', '\\:');
    const c1 = cap1File.replace(/\\/g, '/').replace(':', '\\:');
    const c2 = cap2File.replace(/\\/g, '/').replace(':', '\\:');

    const outputFile = path.resolve(`.video-build/chapter-${i}.mp4`);

    const filter = [
      `[0:v]scale=960:480:force_original_aspect_ratio=increase,crop=960:480,boxblur=25:5[bg]`,
      `[0:v]scale=720:480[fg]`,
      `[bg][fg]overlay=(W-w)/2:'(H-h)/2 + if(lt(t,8), sin(t*PI*1.2)*6, 0)':eval=frame[v1]`,
      `[v1]drawtext=fontfile='${fontPath}':textfile='${tf}':fontcolor='#234b28':fontsize=24:x=(w-text_w)/2:y=28:box=1:boxcolor='#ffffff@0.9':boxborderw=10[v2]`,
      `[v2]drawtext=fontfile='${fontPath}':textfile='${c1}':fontcolor='#201e1b':fontsize=24:x=(w-text_w)/2:y=425:box=1:boxcolor='#ffffff@0.92':boxborderw=12:enable='lt(t,8)'[v3]`,
      `[v3]drawtext=fontfile='${fontPath}':textfile='${c2}':fontcolor='#5a4e3c':fontsize=24:x=(w-text_w)/2:y=425:box=1:boxcolor='#ffffff@0.92':boxborderw=12:enable='gte(t,8)'[vout]`
    ].join(';');

    await run([
      '-loop', '1',
      '-i', inputImage,
      '-filter_complex', filter,
      '-map', '[vout]',
      '-t', '12',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '24',
      '-pix_fmt', 'yuv420p',
      outputFile
    ]);

    console.log(`Rendered chapter ${i + 1}/10: ${title}`);
  }

  // Export high-quality poster frame from chapter 0
  await run([
    '-ss', '1',
    '-i', path.resolve('.video-build/chapter-0.mp4'),
    '-frames:v', '1',
    'assets/videos/friends-exercise-20min-poster.png'
  ]);
  console.log('Saved assets/videos/friends-exercise-20min-poster.png');

  // Concatenate: 10 repetitions per chapter (12s * 10 = 120s = 2 minutes each), 10 chapters = 1200s (20 minutes)
  const lines = [];
  for (let i = 0; i < chapters.length; i++) {
    for (let r = 0; r < 10; r++) {
      lines.push(`file 'chapter-${i}.mp4'`);
    }
  }
  fs.writeFileSync('.video-build/concat.txt', lines.join('\n'));

  await run([
    '-f', 'concat',
    '-safe', '0',
    '-i', '.video-build/concat.txt',
    '-c', 'copy',
    '-movflags', '+faststart',
    'assets/videos/friends-exercise-20min.mp4'
  ]);
  console.log('Created full 20-minute video: assets/videos/friends-exercise-20min.mp4');

  // Update chapters JSON
  const chapterData = chapters.map(([title, instruction], i) => ({
    start: i * 120,
    end: (i + 1) * 120,
    title,
    instruction
  }));
  fs.writeFileSync('assets/videos/friends-exercise-20min-chapters.json', JSON.stringify(chapterData, null, 2));

  // Also sync to school-release if it exists
  const releaseVideos = path.resolve('school-release/assets/videos');
  if (fs.existsSync(releaseVideos)) {
    fs.copyFileSync('assets/videos/friends-exercise-20min-poster.png', path.join(releaseVideos, 'friends-exercise-20min-poster.png'));
    fs.copyFileSync('assets/videos/friends-exercise-20min.mp4', path.join(releaseVideos, 'friends-exercise-20min.mp4'));
    fs.copyFileSync('assets/videos/friends-exercise-20min-chapters.json', path.join(releaseVideos, 'friends-exercise-20min-chapters.json'));
    console.log('Synced video assets to school-release');
  }

  console.log('Finished successfully!');
})().catch(e => {
  console.error('Error rendering video:', e);
  process.exitCode = 1;
});
