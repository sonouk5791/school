/* Move existing controls without recreating their IDs or event handlers. */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.character-home-hero');
  const tools = document.getElementById('homeQuickLinks');
  if (!hero || !tools) return;
  document.body.classList.add('character-home');
  const catalogTools = document.createElement('section');
  catalogTools.id = 'homeCatalogTools';
  catalogTools.className = 'senior-away';
  catalogTools.innerHTML = '<h2>전체 활동</h2><p>하고 싶은 활동을 골라주세요.</p>';
  hero.after(catalogTools);
  ['.main-nav', '#teacherVoiceControls', '#btnHeaderCharHouse'].forEach(selector => {
    const element = document.querySelector(selector);
    if (element) catalogTools.append(element);
  });
  const greeting = hero.querySelector('.home-legacy-greeting');
  if (greeting) catalogTools.append(greeting);
  tools.innerHTML = '<button type="button" class="care-btn" data-senior-page="history">지난 활동 보기</button><details id="homeMoreOptions"><summary>전체 활동 · 화면 설정</summary><div class="home-more-actions"><button type="button" class="care-btn" data-senior-page="activities">전체 활동</button><a class="care-btn" href="character-house.html">캐릭터 집 꾸미기</a></div></details>';
  // Microphone use is an explicit choice; synthesis and character voices are unchanged.
  if (window.voiceRecognizer) {
    for (const [label, action] of [['음성 명령 켜기','start'],['음성 명령 끄기','stop']]) {
      const control = document.createElement('button');
      control.type = 'button'; control.className = 'care-btn'; control.textContent = label;
      control.addEventListener('click', () => window.voiceRecognizer[action]('kongi'));
      tools.querySelector('.home-more-actions').append(control);
    }
  }
  const privacy = document.getElementById('btnOpenPrivacy');
  if (privacy) {
    const footer = privacy.closest('footer');
    const info = document.createElement('details');
    info.className = 'home-school-info';
    info.innerHTML = '<summary>학교 안내</summary>';
    if (footer) { footer.before(info); info.append(footer); }
  }
  // Keep the existing catalogue and lesson handlers, but fold repeated portals.
  const legacy = document.createElement('details');
  legacy.className = 'home-course-folder';
  legacy.innerHTML = '<summary>다른 활동 둘러보기</summary>';
  const drawer = document.getElementById('moreLessonsDrawer');
  if (drawer) {
    drawer.prepend(legacy);
    [...drawer.children].filter(el => el !== legacy && el.id !== 'lessons').forEach(el => legacy.append(el));
  }
  // Move existing nodes, retaining lesson listeners, IDs and catalog data.
  const lessons = document.getElementById('lessons');
  lessons?.querySelectorAll(':scope > .lessons-grid').forEach(grid => {
    const title = grid.previousElementSibling;
    const details = document.createElement('details');
    details.className = 'home-course-folder';
    const summary = document.createElement('summary');
    summary.textContent = grid.id === 'aiCoursesGrid' ? '디지털 배우기' : '시니어 인지활동';
    grid.before(details);details.append(summary);
    if (title?.classList.contains('course-section-title-wrap')) details.append(title);
    details.append(grid);
  });
  const launcher = document.getElementById('morningLauncher');
  if (launcher) hero.after(launcher);
  const returnBar = [...hero.parentElement.children].find(el => el.tagName === 'DIV' && el.querySelector(':scope > .senior-return'));
  if (returnBar) hero.after(returnBar);
});
