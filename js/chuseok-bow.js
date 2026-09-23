/* Legacy URL kept. Fake PNG bows have intentionally been retired.
   CharacterAnimation owns idle/talking/greeting/bowing and validated motion assets. */
window.ChuseokBow={play(id){return window.CharacterAnimation?.motion(id,'bowing')??false;}};
