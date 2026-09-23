/* Homepage only. Existing anchors, voice state and persistent data are untouched. */
document.addEventListener('DOMContentLoaded',()=>{
 if(document.documentElement.dataset.season!=='chuseok')return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),ns='http://www.w3.org/2000/svg';
 const waiting=[],friends=[];let active=null,lastStart=-Infinity;
 const node=(tag,attrs)=>{const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);return el;};
 document.querySelectorAll('.home-friend .hanbok-character').forEach(svg=>{
  const id=svg.dataset.character,image=svg.querySelector('image');if(!image)return;
  const waist={kongi:940,tori:920,nabi:880,bori:900}[id];
  const defs=node('defs',{}),top=node('clipPath',{id:'bow-top-'+id}),bottom=node('clipPath',{id:'bow-bottom-'+id});
  top.append(node('rect',{x:0,y:0,width:1254,height:waist}));bottom.append(node('rect',{x:0,y:waist,width:1254,height:1254-waist}));defs.append(top,bottom);
  const lower=node('g',{'clip-path':`url(#bow-bottom-${id})`}),upper=node('g',{class:'hanbok-bow-upper'}),crop=node('g',{'clip-path':`url(#bow-top-${id})`});
  lower.append(image.cloneNode(true));crop.append(image);upper.append(crop);upper.style.transformOrigin=`627px ${waist}px`;svg.append(defs,lower,upper);
  const item={svg,upper,link:svg.closest('a'),introduced:false,last:-Infinity};friends.push(item);
  upper.addEventListener('animationend',()=>finish(item));
  item.link.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')respond(item);});
  item.link.addEventListener('focus',()=>respond(item));
 });
 function visible(item){const r=item.svg.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&item.svg.getClientRects().length>0;}
 function finish(item){item.svg.classList.remove('is-bowing');if(active===item)active=null;}
 function play(item){if(reduce.matches||document.hidden||active||!visible(item))return false;
  active=item;item.last=lastStart=performance.now();item.svg.classList.add('is-bowing');return true;
 }
 function respond(item){if(!item.introduced||waiting.length||performance.now()-lastStart<30000||performance.now()-item.last<30000)return;play(item);}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){const item=friends.find(f=>f.svg===entry.target);if(entry.isIntersecting&&!item.introduced){item.introduced=true;waiting.push(item);observer.unobserve(item.svg);}}},{threshold:.5});
 friends.forEach(item=>observer.observe(item.svg));
 // One greeting per friend when first seen. No automatic recurring greeting.
 const timer=setInterval(()=>{if(reduce.matches||document.hidden)return;if(active||performance.now()-lastStart<2600)return;const i=waiting.findIndex(visible);if(i>=0&&play(waiting[i]))waiting.splice(i,1);},250);
 function stop(){friends.forEach(finish);}
 reduce.addEventListener('change',()=>{stop();if(reduce.matches){waiting.length=0;friends.forEach(f=>f.introduced=true);observer.disconnect();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.addEventListener('pagehide',()=>{stop();observer.disconnect();clearInterval(timer);});
 if(reduce.matches){observer.disconnect();waiting.length=0;friends.forEach(f=>f.introduced=true);}
});
