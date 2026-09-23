/* Textured expression patches only. The approved full body never transforms. */
window.HanbokCharacter=(()=>{
 'use strict';let serial=0;const ns='http://www.w3.org/2000/svg';
 const states=['mouthClosed','mouthA','mouthO','mouthE','mouthSmile'];
 const characterAnchors={
  kongi:{mouth:{x:561,y:674,width:120,height:84},eyes:[[325,470,205,175],[598,470,205,175]],waist:{x:561,y:1110},sources:[[206,400,96,64],[720,400,96,64],[1232,400,96,64],[206,905,96,64],[720,905,96,64]]},
  tori:{mouth:{x:572,y:712,width:104,height:74},eyes:[[365,550,180,155]],waist:{x:561,y:1110},sources:[[217,375,108,70],[715,375,108,70],[1213,375,108,70],[217,891,108,70],[715,878,108,70]]},
  nabi:{mouth:{x:560,y:583,width:110,height:74},eyes:[[321,407,190,157],[611,407,190,157]],waist:{x:561,y:1080},sources:[[208,354,96,64],[720,354,96,64],[1232,354,96,64],[208,865,96,64],[720,860,96,64]]},
  bori:{mouth:{x:561,y:569,width:130,height:82},eyes:[[349,393,175,130],[600,393,175,130]],waist:{x:561,y:1030},sources:[[221,357,120,74],[734,357,120,74],[1245,357,120,74],[221,868,120,74],[734,866,120,74]]}
 };
 const art=id=>'/assets/images/chuseok/'+id+'-hanbok-v2.png';
 function patch(uid,id,box,source,attrs='',blink=false){
  const [x,y,w,h]=box;
  return `<g ${attrs}><defs><filter id="${uid}-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter><mask id="${uid}-mask" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x+5}" y="${y+5}" width="${w-10}" height="${h-10}" rx="18" fill="white" filter="url(#${uid}-soft)"/></mask></defs><g mask="url(#${uid}-mask)"><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${source.join(' ')}" preserveAspectRatio="none"><image href="/assets/images/chuseok/${id}-${blink?'blink':'expressions'}-v3.png" width="${blink?1122:1536}" height="${blink?1402:1024}"/></svg></g></g>`;
 }
 function create(id){const a=characterAnchors[id],uid='expression-'+(++serial),svg=document.createElementNS(ns,'svg'),m=a.mouth;
  svg.setAttribute('viewBox','0 0 1122 1402');svg.setAttribute('aria-hidden','true');svg.classList.add('character-parts-rig','hanbok-character');svg.dataset.character=id;svg.dataset.state='idle';svg.dataset.mouth='mouthSmile';
  svg.innerHTML=`<image data-part="fixed-body" href="${art(id)}" width="1122" height="1402"/>`+states.map((name,i)=>patch(uid+'-mouth-'+i,id,[m.x-m.width/2,m.y-m.height/2,m.width,m.height],a.sources[i],`data-mouth-shape="${name}" class="hanbok-mouth-patch"`)).join('')+a.eyes.map((box,i)=>patch(uid+'-eye-'+i,id,box,box,'class="hanbok-eye-patch" data-part="eyelid"',true)).join('');
  return svg;
 }
 // Dedicated transparent motion files can be registered later; null means no fake motion.
 const motionAssets=Object.fromEntries(Object.keys(characterAnchors).map(id=>[id,{greeting:null,bowing:null}]));

 function playMotion(svg,type,onEnd){
  const asset=motionAssets[svg.dataset.character]?.[type];
  if(!asset?.validated||!asset.src||!['webm','webp'].includes(asset.format))return null;
  let node,video,timer,finished=false;const duration=Math.min(5000,Math.max(300,asset.duration||2600));
  const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);video?.pause();node?.remove();svg.classList.remove('has-dedicated-motion');onEnd?.();};
  if(asset.format==='webm'){node=document.createElementNS(ns,'foreignObject');node.setAttribute('width','1122');node.setAttribute('height','1402');video=document.createElement('video');video.src=asset.src;video.muted=true;video.playsInline=true;video.style.cssText='width:100%;height:100%;object-fit:contain';video.onended=finish;video.onerror=finish;node.append(video);}
  else{node=document.createElementNS(ns,'image');node.setAttribute('width','1122');node.setAttribute('height','1402');node.setAttribute('href',asset.src);node.addEventListener('error',finish,{once:true});}
  node.classList.add('dedicated-motion');svg.append(node);svg.classList.add('has-dedicated-motion');timer=setTimeout(finish,duration);video?.play().catch(finish);return finish;
 }
 return {create,states,characterAnchors,motionAssets,playMotion,art};
})();
