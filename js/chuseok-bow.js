/* Homepage only. Clipped upper body hinges at the waist; feet never transform. */
document.addEventListener('DOMContentLoaded',()=>{
 if(document.documentElement.dataset.season!=='chuseok')return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),ns='http://www.w3.org/2000/svg';
 const friends=[];let introduced=false,ready=false;
 const specs={kongi:{waist:940,angle:14,duration:2400},tori:{waist:880,angle:15,duration:2400},nabi:{waist:850,angle:12,duration:2400},bori:{waist:930,angle:13.5,duration:2600}};
 const node=(tag,attrs)=>{const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);return el;};
 const images=[];
 document.querySelectorAll('.home-friend .hanbok-character').forEach(svg=>{
  const id=svg.dataset.character,image=svg.querySelector('image'),spec=specs[id];if(!image||!spec)return;
  const {waist,angle,duration}=spec;
  const defs=node('defs',{}),top=node('clipPath',{id:'bow-top-'+id}),bottom=node('clipPath',{id:'bow-bottom-'+id});
  top.append(node('rect',{x:0,y:0,width:1254,height:waist+2}));bottom.append(node('rect',{x:0,y:waist-2,width:1254,height:1256-waist}));defs.append(top,bottom);
  const lower=node('g',{class:'hanbok-bow-lower','clip-path':'url(#bow-bottom-'+id+')'}),upper=node('g',{class:'hanbok-bow-upper'}),crop=node('g',{'clip-path':'url(#bow-top-'+id+')'});
  lower.append(image.cloneNode(true));crop.append(image);upper.append(crop);
  upper.style.transformOrigin='627px '+waist+'px';svg.style.setProperty('--bow-angle',angle+'deg');svg.style.setProperty('--bow-duration',duration+'ms');svg.append(defs,lower,upper);
  const item={svg,upper,last:-Infinity,timer:null};friends.push(item);
  const preload=new Image();preload.src=image.getAttribute('href');images.push(preload.decode().catch(()=>{}));
  upper.addEventListener('animationend',()=>finish(item));
  const link=svg.closest('a');link.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')respond(item);});link.addEventListener('focus',()=>respond(item));
 });
 function finish(item){clearTimeout(item.timer);item.svg.classList.remove('is-bowing');}
 function play(item){if(reduce.matches||document.hidden||item.svg.classList.contains('is-bowing'))return;
  item.last=performance.now();item.svg.classList.add('is-bowing');item.timer=setTimeout(()=>finish(item),2800);
 }
 function respond(item){if(!introduced||!ready||performance.now()-item.last<10000)return;play(item);}
 function initial(){if(!ready||introduced||document.hidden)return;introduced=true;if(!reduce.matches)friends.forEach(play);}
 Promise.all(images).then(()=>{ready=true;requestAnimationFrame(initial);});
 function stop(){friends.forEach(finish);}
 reduce.addEventListener('change',()=>{if(reduce.matches){introduced=true;stop();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else initial();});
 window.addEventListener('pagehide',()=>{introduced=true;stop();});
});
