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
  tools.innerHTML = '<button type="button" class="care-btn" data-senior-page="history">지난 활동 보기</button><button type="button" class="care-btn" data-senior-page="activities">전체 활동 보기</button>';
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
