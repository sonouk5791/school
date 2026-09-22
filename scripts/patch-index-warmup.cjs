const fs = require('fs');
const path = 'j:/sh/index.html';
let html = fs.readFileSync(path, 'utf8');

const replacement = `<div class="warmup-copy">
        <a class="warmup-exercise-entry" href="senior-exercise.html">🧘‍♂️ 치매 어르신 AI 의자 체조 (10단계) 바로가기</a>
        <p class="warmup-eyebrow">함께하는 20분 체조 · 준비와 휴식 포함</p>
        <h2 id="warmupTitle">친구들과 천천히 체조해요</h2>
        <p>콩이, 토리, 나비, 보리와 함께<br>편하게 앉아서 천천히 따라해요.</p>
        <div class="warmup-actions">
          <a href="senior-exercise.html" class="care-btn primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">▶ AI 체조 시작하기</a>
          <button class="care-btn" id="warmupPlay" type="button" aria-controls="warmupVideo">소개 영상 보기</button>
          <button class="care-btn" id="warmupClass" type="button">오늘의 수업 시작하기</button>
        </div>
        <p class="warmup-note" id="warmupStatus" role="status">`;

html = html.replace(/<div class="warmup-copy">[\s\S]*?<p class="warmup-note" id="warmupStatus" role="status">/, replacement);

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully updated index.html warmup copy');
