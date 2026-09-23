/* A seasonal entry point into existing content; original completion and records own the flow. */
document.addEventListener('DOMContentLoaded',()=>{
 if(document.documentElement.dataset.season!=='chuseok'||document.body.dataset.activityRoom!=='bori')return;
 const menu=document.querySelector('.bh-menu');
 const story=[...document.querySelectorAll('#storyGrid .story-card')].find(card=>card.querySelector('.story-card-title')?.textContent==='추석과 송편');
 if(!menu||!story)return;
 const section=document.createElement('section');section.className='season-recommendation';section.setAttribute('aria-labelledby','seasonRecommendationTitle');
 section.innerHTML='<h2 id="seasonRecommendationTitle">오늘의 명절 추천 활동</h2><button type="button" class="season-recommendation-card"><strong>🌕 명절 추억 이야기</strong><span>송편 이야기를 듣고, 하나만 맞혀봐요.</span></button>';
 menu.after(section);
 section.querySelector('button').addEventListener('click',()=>{
  // Use the same selection handler to cancel stale callbacks and enter playing.
  menu.querySelector('[data-tab="story"]').click();
  story.click();
  const title=document.getElementById('storyContentTitle');title.tabIndex=-1;title.focus();
 });
});
