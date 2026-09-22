const fs = require('fs');
const path = 'j:/sh/index.html';
let html = fs.readFileSync(path, 'utf8');

if (!html.includes('character-house.html')) {
  html = html.replace(
    '<a href="senior-exercise.html" class="btn-voice-ctrl" id="btnHeaderSeniorExercise"',
    `<a href="character-house.html" class="btn-voice-ctrl" id="btnHeaderCharHouse" title="어르신과 함께하는 콩이·토리·나비·곰이 집 꾸미기" style="background:#FFF8E1; color:#F57F17; border:2px solid #FFE082; font-weight:800; text-decoration:none; display:inline-flex; align-items:center;">
          <span class="ctrl-icon">🏡</span>
          <span class="ctrl-text">캐릭터 집 꾸미기</span>
        </a>

        <a href="senior-exercise.html" class="btn-voice-ctrl" id="btnHeaderSeniorExercise"`
  );

  html = html.replace(
    '<button class="btn-hero-action btn-hero-cream" id="btnHeroMeetAi">',
    `<a href="character-house.html" class="btn-hero-action btn-hero-cream" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; background:#FFF8E1; color:#F57F17; border-color:#FFE082;">
              🏡 캐릭터 집 꾸미기 &gt;
            </a>
            <button class="btn-hero-action btn-hero-cream" id="btnHeroMeetAi">`
  );

  fs.writeFileSync(path, html, 'utf8');
  console.log('Successfully added character-house.html link to index.html');
}
