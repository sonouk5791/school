/* No similarity search or fallback image: exact question + approved metadata only. */
(function(root){
 'use strict';
 const scope=new Set(['photo','monthly-0','monthly-1','monthly-5','monthly-8','monthly-10','monthly-11','monthly-13','monthly-15','monthly-18','monthly-20']);
 function create(manifest){
  const bindings=manifest.bindings||{},images=manifest.images||{};
  function keyFor(id,index,step){
   if(step.reminiscenceKey)return step.reminiscenceKey;
   const key=id+':'+index;
   if(scope.has(id)||(id==='greeting'&&index===2)||Object.hasOwn(bindings,key))return key;
   // A copied scene keeps its exact original question, never a keyword match.
   return Object.keys(bindings).find(k=>bindings[k].question===step.prompt)||null;
  }
  function valid(id,binding,src){const image=images[id];return !!(image&&binding.approved===true&&image.approved===true&&image.theme===binding.theme&&image.src===src&&image.src===id&&image.category===binding.category&&typeof image.theme==='string'&&image.theme.trim()&&image.theme!=='unreviewed'&&typeof image.era==='string'&&image.era.trim()&&image.era!=='미확인'&&typeof image.description==='string'&&image.description.trim()&&Array.isArray(image.keywords)&&image.keywords.length&&image.keywords.every(k=>typeof k==='string'&&k.trim()));}
  function protect(step,id,index){
   if(!step)return step;
   const key=keyFor(id,index,step);if(!key)return step;
   const b=bindings[key],matches=!!b&&b.question===step.prompt;
   const result={...step,reminiscenceKey:key};
   const main=matches&&valid(b.image,b,step.imageSrc);
   delete result.sketchImageSrc;delete result.revealOnSelect;
   result.options=(step.options||[]).map((o,i)=>{const copy={...o},ref=b?.options?.[i];if(!matches||ref?.text!==o.text||!valid(ref?.image,b,o.imageSrc))delete copy.imageSrc;return copy;});
   if(main){result.imageAlt=images[b.image].description;result.imageCaption=images[b.image].description;}
   else {delete result.imageSrc;delete result.imageCaption;delete result.imageAlt;result.missingReminiscenceImage=true;}
   return result;
  }
  return {keyFor,protect};
 }
 if(typeof module==='object'&&module.exports)module.exports={create};
 else {root.ReminiscenceImages=create(root.REMINISCENCE_IMAGE_MANIFEST||{});document.addEventListener('DOMContentLoaded',()=>{for(const lesson of root.LESSON_CATALOG||[])lesson.steps.forEach((step,i)=>{const key=root.ReminiscenceImages.keyFor(lesson.id,i,step);if(key)step.reminiscenceKey=key;});});}
})(typeof window==='object'?window:globalThis);
