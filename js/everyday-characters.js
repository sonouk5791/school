/* Presentation only: existing lessons, recordings, storage and speech own their state. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.documentElement.dataset.season !== 'everyday') return;
  const room = document.body.dataset.activityRoom || (document.getElementById('viewReady') ? 'kongi' : null);
  const greetings = {tori:'토리와 함께 즐겁게 놀아볼까요?', nabi:'나비와 함께 차분하게 생각해볼까요?', bori:'보리와 함께 편안한 시간을 보내요.'};
  const greeting = document.querySelector('.tp-hero>p,.nl-hero>p,.bh-hero>p');
  if(greeting && greetings[room]) greeting.textContent = greetings[room];
  const speech = document.querySelector('.tp-speech,.nl-speech,.bh-speech');
  if(speech) speech.textContent = '천천히 함께해요.';
  const host = document.querySelector('.room-flow-toolbar,.se-guide-name');
  if(host && room && window.CharacterAnimation){host.classList.add('everyday-guide');host.prepend(CharacterAnimation.create(room));}
  const ready = document.querySelector('.se-ready-stats');
  if(ready){
    const friends=document.createElement('div');friends.className='everyday-companions';friends.setAttribute('aria-label','함께하는 네 친구');
    for(const [id,name] of Object.entries({kongi:'콩이',tori:'토리',nabi:'나비',bori:'보리'})){
      const figure=document.createElement('figure'), img=document.createElement('img'), caption=document.createElement('figcaption');
      img.src=`assets/images/everyday/${id}-active.png`;img.alt='';img.width=62;img.height=78;caption.textContent=name;figure.append(img,caption);friends.append(figure);
    }
    ready.after(friends);
  }
});
