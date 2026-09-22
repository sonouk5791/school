/* Official reference-sheet sprite; no generated facial geometry.
 * Word timestamps come from the generated Korean recording. Syllable visemes
 * interpolate within each word, not phoneme-level forced alignment. */
(() => {
  'use strict';
  const TEXT = '안녕하세요! 만나서 반가워요. 오늘도 저와 함께 즐겁게 시작해 볼까요?';
  const WORDS = [
    ['안녕하세요',.284444,1.256667],['만나서',1.422222,1.896333],
    ['반가워요',1.943333,2.892222],['오늘도',3.176667,3.603],
    ['저와',3.65,3.934444],['함께',3.982222,4.361111],
    ['즐겁게',4.456667,5.025222],['시작해',5.072222,5.498889],['볼까요',5.498889,6.03099]
  ];
  class AnimatedCharacter {
    constructor(host) {
      this.host=host; this.audio=new Audio('assets/audio/kongi-greeting-ko.wav');
      this.audio.preload='metadata'; this.audio.volume=.85;
      this.abort=new AbortController(); this.frame=0; this.blink=0; this.openEyes=0; this.greet=0; this.sequence=0;
      this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
      this.mount(); this.bind(); this.greeting();
    }
    mount() {
      this.host.innerHTML=`<div class="animated-character">
        <button type="button" class="animated-character-trigger" aria-label="콩이 인사 듣기" aria-describedby="acStatus">
          <img class="official-character-sprite" src="${window.characters.kongi.idle}" width="1254" height="1254" alt="공식 안내 캐릭터 콩이" data-character-id="kongi" decoding="async">
        </button>
        <div class="animated-character-controls" role="group" aria-label="콩이 음성 조절">
          <button type="button" data-ac="replay">다시 듣기</button>
          <button type="button" data-ac="pause" disabled>일시정지</button>
          <button type="button" data-ac="mute" aria-pressed="false">음소거</button>
        </div>
        <p id="acStatus" class="animated-character-status" role="status">콩이를 누르면 인사해요</p>
        <p class="animated-character-caption" hidden>${TEXT}</p>
      </div>`;
      this.el=this.host.firstElementChild; this.status=this.el.querySelector('[role=status]');
      this.pauseButton=this.el.querySelector('[data-ac=pause]'); this.mouth={setAttribute:()=>window.CharacterLipSync.set(this.sprite,'kongi')};
      this.sprite=this.el.querySelector('.official-character-sprite');
    }
    on(target,event,fn) { target.addEventListener(event,fn,{signal:this.abort.signal}); }
    bind() {
      this.on(this.el.querySelector('.animated-character-trigger'),'click',()=>this.play());
      this.on(this.el.querySelector('[data-ac=replay]'),'click',()=>this.play());
      this.on(this.pauseButton,'click',()=>{ if(this.audio.paused)this.resume(); else this.audio.pause(); });
      this.on(this.el.querySelector('[data-ac=mute]'),'click',e=>{
        this.audio.muted=!this.audio.muted; e.currentTarget.setAttribute('aria-pressed',String(this.audio.muted));
        e.currentTarget.textContent=this.audio.muted?'음소거 해제':'음소거';
      });
      this.on(this.audio,'playing',()=>{ this.status.textContent='콩이가 인사하고 있어요'; this.pauseButton.disabled=false; this.pauseButton.textContent='일시정지'; this.el.classList.remove('ac-paused'); this.animateMouth(); });
      this.on(this.audio,'pause',()=>{ cancelAnimationFrame(this.frame); this.mouth.setAttribute('visibility','hidden'); if(!this.audio.ended&&this.audio.currentTime>0){this.status.textContent='잠시 멈췄어요';this.pauseButton.textContent='계속 듣기';this.el.classList.add('ac-paused');} });
      this.on(this.audio,'waiting',()=>{cancelAnimationFrame(this.frame);this.mouth.setAttribute('visibility','hidden');this.status.textContent='음성을 불러오고 있어요';});
      this.on(this.audio,'ended',()=>this.stop('다시 듣고 싶으면 콩이를 눌러주세요'));
      this.on(this.audio,'error',()=>this.stop('음성을 불러오지 못했어요. 다시 듣기를 눌러주세요'));
      this.on(window,'character-audio-start',()=>this.stop());
      this.on(window,'welcome-audio-start',()=>this.stop());
      this.on(document,'visibilitychange',()=>{if(document.hidden)this.suspend();else this.wake();});
      this.on(window,'pagehide',()=>this.suspend());
      this.on(window,'pageshow',()=>this.wake());
      this.on(window,'popstate',()=>this.stop()); this.on(window,'hashchange',()=>this.stop());
      this.observer=new MutationObserver(()=>{ if(!this.host.isConnected){this.destroy();return;} if(!this.host.getClientRects().length)this.suspend();else this.wake(); });
      this.observer.observe(document.querySelector('main'),{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
    }
    stopOthers() { window.CharacterAudioPlayer?.stop(); window.VoiceManager?.stopSpeaking(); window.dispatchEvent(new Event('character-audio-start')); }
    async play() {
      if(window.CharacterVoice)return CharacterVoice.playRecording('kongi');
      this.stopOthers(); this.stop(); const token=++this.sequence;
      this.el.querySelector('.animated-character-caption').hidden=false;
      this.status.textContent='음성을 불러오고 있어요';
      try { await this.audio.play(); } catch { if(token===this.sequence)this.stop('음성을 재생하지 못했어요. 다시 눌러주세요'); }
    }
    async resume() {
      window.CharacterAudioPlayer?.stop(); window.VoiceManager?.stopSpeaking();
      const token=++this.sequence;
      try { await this.audio.play(); } catch { if(token===this.sequence)this.stop('다시 듣기를 눌러주세요'); }
    }
    stop(message='콩이를 누르면 인사해요') {
      this.sequence++; window.CharacterLipSync.unbind(this.audio); this.audio.pause(); this.audio.currentTime=0; cancelAnimationFrame(this.frame);
      this.mouth.setAttribute('visibility','hidden'); this.el.classList.remove('ac-paused');
      this.pauseButton.disabled=true; this.pauseButton.textContent='일시정지'; this.status.textContent=message;
    }
    animateMouth() { window.CharacterLipSync.bind(this.audio,this.sprite,'kongi',WORDS); }
    greeting() {this.el.classList.add('ac-greeting');this.greet=setTimeout(()=>this.el.classList.remove('ac-greeting'),2500);}
    scheduleBlink() {clearTimeout(this.blink);this.blink=setTimeout(()=>{if(!this.reduced.matches)this.el.classList.add('ac-blink');this.openEyes=setTimeout(()=>{this.el.classList.remove('ac-blink');},150);},3000+Math.random()*2000);}
    suspend() {if(this.suspended)return;this.suspended=true;this.stop();clearTimeout(this.blink);clearTimeout(this.openEyes);clearTimeout(this.greet);this.el.classList.remove('ac-blink','ac-greeting');this.el.classList.add('ac-inactive');}
    wake() {if(!this.suspended||document.hidden||!this.host.getClientRects().length)return;this.suspended=false;this.el.classList.remove('ac-inactive');}
    destroy() {this.suspend();this.abort.abort();this.observer.disconnect();this.audio.removeAttribute('src');this.audio.load();}
  }
  window.AnimatedCharacter=AnimatedCharacter;
  document.addEventListener('DOMContentLoaded',()=>{
    const hero=document.querySelector('.hero-robot-wrapper'); if(!hero)return;
    document.getElementById('kongiCharacterWrap')?.remove(); hero.querySelector('.character-action-buttons')?.remove(); hero.querySelector('.character-audio-controls')?.remove();
    const host=document.createElement('div');hero.prepend(host);window.animatedCharacter=new AnimatedCharacter(host);
  });
})();
