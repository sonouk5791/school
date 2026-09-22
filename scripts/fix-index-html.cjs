const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const oldPart = `          <button class="care-btn" id="warmupClass" type="button">오늘의 수업 시작하기</button>
        </div>
    <section class="section-lessons" id="lessons">
      <div class="section-header-banner">
        <div class="section-badge">✨ 오늘의 맞춤 활동</div>
        <h2 class="section-title">오늘은 무엇을 해볼까요?</h2>
        <p class="section-sub">마음에 드는 수업 카드를 편안하게 꾹 눌러보세요.</p>
      </div>`;

const newPart = `          <button class="care-btn" id="warmupClass" type="button">오늘의 수업 시작하기</button>
        </div>
        <p class="warmup-note" id="warmupStatus" role="status">불편한 동작은 쉬어가셔도 괜찮아요.</p>
      </div>
    </section>

    <!-- 2. 오늘의 수업 8대 대형 카드 섹션 (Today's Lessons Grid) -->
    <section class="section-lessons" id="lessons">
      <div class="section-header-banner">
        <div class="section-badge">✨ 선생님과 함께하는 수업</div>
        <h2 class="section-title">선생님과 함께하는 인지 돌봄 수업</h2>
        <p class="section-sub">마음에 드는 수업 카드를 편안하게 꾹 눌러보세요.</p>
      </div>`;

if (html.includes(oldPart)) {
  html = html.replace(oldPart, newPart);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('INDEX_HTML_FIXED_SUCCESSFULLY');
} else {
  console.log('PATTERN_NOT_FOUND');
}
