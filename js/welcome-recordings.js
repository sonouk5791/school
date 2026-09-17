/* A successful empty manifest means no recordings; do not probe missing audio URLs. */
window.SchoolWelcomeRecordings = {};
window.refreshWelcomeRecordings = (()=>{
 let pending=null;
 return ()=>pending||(pending=(async()=>{
  try{const response=await fetch('/welcome-recordings.json',{cache:'no-store'});if(!response.ok){window.SchoolWelcomeRecordings={};return;}const data=await response.json(),safe={};
   for(const id of ['kongi','tori','nabi','bori'])if(typeof data?.[id]==='string'&&/^\/(?:public\/|assets\/)?audio\/welcome\/[a-z]+\.(mp3|wav)$/.test(data[id]))safe[id]=data[id];
   window.SchoolWelcomeRecordings=safe;
  }catch{window.SchoolWelcomeRecordings={};}finally{pending=null;window.dispatchEvent(new Event('welcome-recordings-changed'));}
 })());
})();
window.refreshWelcomeRecordings();
window.addEventListener('focus',()=>window.refreshWelcomeRecordings());
setInterval(()=>{if(!document.hidden)window.refreshWelcomeRecordings();},30000);
