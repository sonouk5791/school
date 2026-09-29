const fs = require('fs');

const path = 'bori-hobby.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<header class="bh-header">[\s\S]*?<\/section>/,
  `<header class="bh-header">
  <a href="index.html" class="bh-back-link">🏡 친구들 마을로 돌아가기</a>
  <div class="bh-location"><strong>🐻 보리집 · 취미방</strong></div>
  <button type="button" class="bh-voice-btn" id="btnBhVoice">🔊 보리 안내</button>
</header>
<section class="bh-hero">
  <img src="assets/images/everyday/bori-active.png" alt="보리 캐릭터" class="bh-char-img" onerror="this.src='assets/images/friend-bori.png'">
  <h1>🐻 보리집 · 취미방</h1>
  <div class="bh-speech">"오늘은 어떤 취미를 해볼까요?"</div>
</section>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('bori-hobby.html updated successfully');
