/* Move existing controls without recreating their IDs or event handlers. */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.character-home-hero');
  const tools = document.getElementById('homeQuickLinks');
  if (!hero || !tools) return;
  document.body.classList.add('character-home');
  ['.main-nav', '#teacherVoiceControls', '#btnHeaderCharHouse'].forEach(selector => {
    const element = document.querySelector(selector);
    if (element) tools.append(element);
  });
  const launcher = document.getElementById('morningLauncher');
  if (launcher) hero.after(launcher);
  const returnBar = [...hero.parentElement.children].find(el => el.tagName === 'DIV' && el.querySelector(':scope > .senior-return'));
  if (returnBar) hero.after(returnBar);
});
