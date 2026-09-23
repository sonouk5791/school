/* User-approved artwork stays intact. Pose and mouth layers are display-only. */
window.HanbokCharacter=(()=>{
 'use strict';
 const ns='http://www.w3.org/2000/svg';let serial=0;
 const specs={
  kongi:{waist:1110,angle:14,duration:2400,mouth:[561,674,40,35],bowMouth:[560,753,38,24,0,0,[630,745,30,20]]},
  tori:{waist:1110,angle:15,duration:2400,mouth:[572,712,32,29],bowMouth:[575,805,34,23,0,0,[645,796,30,20]]},
  nabi:{waist:1080,angle:12,duration:2400,mouth:[560,583,36,30],bowMouth:[560,725,34,24,0,0,[625,714,30,20]]},
  bori:{waist:1030,angle:13.5,duration:2600,mouth:[561,569,48,32,0,-58],bowMouth:[560,710,40,25,0,0,[615,695,30,20]]}
 };
 const states=['mouthClosed','mouthA','mouthO','mouthE','mouthSmile'];
 const art=(id,bow=false)=>'/assets/images/chuseok/'+id+(bow?'-bow.png':'-hanbok-v2.png');
 const image=href=>`<image href="${href}" width="1122" height="1402" preserveAspectRatio="xMidYMid meet"/>`;
 function mouth(uid,href,[x,y,rx,ry,sampleX=-88,sampleY=0,sampleRect=null]){
  const sample=sampleRect||(sampleY<0?[511,605,100,35]:null);
  // Adjacent muzzle fur under a feathered mask removes the original open mouth.
  return `<g class="hanbok-mouth-overlay" data-part="mouth">
   <defs><radialGradient id="${uid}-feather"><stop offset="84%" stop-color="white"/><stop offset="100%" stop-color="black"/></radialGradient><mask id="${uid}-patch" maskUnits="userSpaceOnUse" x="${x-rx-24}" y="${y-ry-10}" width="${2*rx+48}" height="${2*ry+20}"><ellipse cx="${x}" cy="${y}" rx="${rx+24}" ry="${ry+10}" fill="url(#${uid}-feather)"/></mask></defs>
   ${sample?`<g mask="url(#${uid}-patch)"><svg x="${x-rx-24}" y="${y-ry-10}" width="${2*rx+48}" height="${2*ry+20}" viewBox="${sample.join(' ')}" preserveAspectRatio="none">${image(href)}</svg></g>`:`<image href="${href}" x="${sampleX}" y="${sampleY}" width="1122" height="1402" mask="url(#${uid}-patch)"/>`}
   <svg x="${x-rx}" y="${y-ry}" width="${rx*2}" height="${ry*2}" viewBox="-50 -40 100 80" overflow="visible">
    <path data-mouth-shape="mouthClosed" d="M-25 0 Q0 7 25 0" fill="none" stroke="#814d42" stroke-width="4" stroke-linecap="round"/>
    <g data-mouth-shape="mouthA"><ellipse cy="5" rx="24" ry="29" fill="#71362f"/><path d="M-17 24 Q0 11 17 24 Q0 40 -17 24" fill="#df7d89"/></g>
    <g data-mouth-shape="mouthO"><ellipse cy="4" rx="15" ry="23" fill="#74392f"/><ellipse cy="19" rx="9" ry="4" fill="#d88188"/></g>
    <g data-mouth-shape="mouthE"><path d="M-33 -8 Q0 -16 33 -8 Q28 25 0 25 Q-28 25 -33 -8" fill="#71362f"/><path d="M-26 -7 Q0 -12 26 -7 L22 1 Q0 5 -22 1Z" fill="#fff5e9"/><path d="M-19 18 Q0 7 19 18 Q0 29 -19 18" fill="#df7d89"/></g>
    <path data-mouth-shape="mouthSmile" d="M-30 -4 Q0 27 30 -4" fill="none" stroke="#894e43" stroke-width="4" stroke-linecap="round"/>
   </svg></g>`;
 }
 function create(id){
  const s=specs[id],uid='hanbok-'+(++serial),svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 1122 1402');svg.setAttribute('aria-hidden','true');svg.classList.add('character-parts-rig','hanbok-character');svg.dataset.character=id;svg.dataset.mouth='mouthSmile';
  svg.style.setProperty('--bow-angle',s.angle+'deg');svg.style.setProperty('--bow-duration',s.duration+'ms');
  svg.innerHTML=`<defs><clipPath id="${uid}-upper"><rect width="1122" height="${s.waist+2}"/></clipPath><linearGradient id="${uid}-blend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="white"/><stop offset="87%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><mask id="${uid}-blend-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1122" height="${s.waist+2}"><rect width="1122" height="${s.waist+2}" fill="url(#${uid}-blend)"/></mask><clipPath id="${uid}-seam"><rect y="${s.waist-150}" width="1122" height="152"/></clipPath><clipPath id="${uid}-lower"><rect y="${s.waist-2}" width="1122" height="${1404-s.waist}"/></clipPath></defs>
   <g class="hanbok-bow-lower" data-part="lower-body" clip-path="url(#${uid}-lower)">${image(art(id))}</g>
   <g class="hanbok-bow-upper" data-part="upper-body" style="transform-origin:561px ${s.waist}px"><g clip-path="url(#${uid}-upper)">
    <g clip-path="url(#${uid}-seam)">${image(art(id))}</g><g class="hanbok-upright-pose">${image(art(id))}${mouth(uid+'-idle',art(id),s.mouth)}</g>
    <g class="hanbok-greeting-pose" mask="url(#${uid}-blend-mask)">${image(art(id,true))}${mouth(uid+'-bow',art(id,true),s.bowMouth)}</g>
   </g></g>`;
  return svg;
 }
 return {create,specs,states,art};
})();
