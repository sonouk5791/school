/* Home shortcuts reuse existing navigation and lessons. */
document.addEventListener('DOMContentLoaded',()=>{
 const primary=document.querySelector('.senior-primary');
 primary.innerHTML='<button type="button" class="care-btn primary" data-senior-page="exercise"><span>🏃 체조</span><small>천천히 함께 움직여요</small></button><button type="button" class="care-btn" data-senior-lesson="memory"><span>🧠 기억 놀이</span><small>하나씩 함께 기억해요</small></button><button type="button" class="care-btn" data-senior-lesson="music"><span>🎵 음악</span><small>좋아하는 음악을 만나요</small></button><button type="button" class="care-btn" data-open-friend-rooms><span>🏠 친구들 방</span><small>친구의 방에 놀러 가요</small></button><button type="button" class="care-btn" data-senior-page="friends"><span>🤖 AI 친구</span><small>친구와 이야기해요</small></button>';
 primary.setAttribute('aria-label','어르신 주요 활동');
 primary.addEventListener('click',e=>{
  const lesson=e.target.closest('[data-senior-lesson]');
  if(lesson)window.LessonEngine.startLesson(lesson.dataset.seniorLesson);
  if(e.target.closest('[data-open-friend-rooms]'))document.querySelector('#characterRoomsEntry').click();
 });
 document.body.classList.add('senior-staff-separated');
});
