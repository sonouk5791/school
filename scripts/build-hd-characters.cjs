// Composite newly generated high-resolution mouth edits onto one immutable master.
// No source-sheet crop, upscaling, face warping, or synthesized vector mouth.
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'characters/reference/high-resolution');
const ids=['kongi','tori','nabi','bori'];
const boxes={kongi:[548,511,724,665],tori:[570,593,731,733],nabi:[548,444,712,579],bori:[530,440,722,594]};
const writeJSON=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
async function build(){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'characters/manifest.json'))),report={tool:'built-in image_gen',source:'design-reference.jpeg',size:[1254,1254],method:'New native high-resolution render; only generated mouth region composited onto immutable master with 8px feather. No source sheet pixels enlarged.',characters:{}};
 const previews=[];
 for(const [row,id] of ids.entries()){
  const dir=path.join(root,`public/characters/${id}/mouth`);fs.mkdirSync(dir,{recursive:true});
  const masterPath=path.join(out,`raw/${id}/${id}_a.png`),meta=await sharp(masterPath).metadata();
  if(meta.width!==1254||meta.height!==1254||!meta.hasAlpha)throw Error('Unexpected master size/alpha '+id);
  const base=await sharp(masterPath).ensureAlpha().raw().toBuffer(),box=boxes[id];
  for(const v of 'aeiou'){
   const rawPath=path.join(out,`raw/${id}/${id}_${v}.png`),m=await sharp(rawPath).metadata();
   if(m.width<1024||m.height<1024)throw Error('Generation too small '+rawPath);
   if(m.width<1254||m.height<1254)throw Error('Would require upscale '+rawPath);
   const edit=await sharp(rawPath).resize(1254,1254,{fit:'fill',withoutEnlargement:true}).ensureAlpha().raw().toBuffer();
   const pixels=Buffer.from(base);
   if(v!=='a')for(let y=box[1];y<box[3];y++)for(let x=box[0];x<box[2];x++){
    const blend=Math.min(1,(x-box[0])/8,(box[2]-1-x)/8,(y-box[1])/8,(box[3]-1-y)/8);
    const i=(y*1254+x)*4;for(let c=0;c<3;c++)pixels[i+c]=Math.round(base[i+c]*(1-blend)+edit[i+c]*blend);
   }
   const final=path.join(dir,`${id}_${v}.png`);await sharp(pixels,{raw:{width:1254,height:1254,channels:4}}).png().toFile(final);
   // Compatibility for existing screens and saved links.
   for(const suffix of ['', '_stable'])fs.copyFileSync(final,path.join(root,`characters/${id}/${id}_${v}${suffix}.png`));
   previews.push({input:await sharp(final).resize(240,240).png().toBuffer(),left:'aeiou'.indexOf(v)*240,top:row*240});
  }
  // A small pursed resting expression, as in the reference's final column.
  const idle=path.join(root,`public/characters/${id}/${id}_idle.png`);fs.copyFileSync(path.join(dir,`${id}_u.png`),idle);
  for(const target of [`characters/${id}/${id}_idle.png`,`characters/${id}/actions/${id}_idle.png`,`assets/images/friend-${id}.png`,`assets/images/friend-${id}-talk.png`])fs.copyFileSync(idle,path.join(root,target));
  if(id==='kongi')for(const suffix of ['companion','blink','mouth-closed']){const p=path.join(root,`assets/images/friend-kongi-${suffix}.png`);if(fs.existsSync(p))fs.copyFileSync(idle,p);}
  const c=manifest[id];c.idle=`/public/characters/${id}/${id}_idle.png`;c.mouth=Object.fromEntries([...'aeiou'].map(v=>[v,`/public/characters/${id}/mouth/${id}_${v}.png`]));c.stable={...c.mouth};c.size=[1254,1254];c.mouthBox=box;c.actions.idle=c.idle;c.revision='hd-2026-09-21';
  report.characters[id]={master:`raw/${id}/${id}_a.png`,mouthBox:box};
 }
 writeJSON(path.join(root,'characters/manifest.json'),manifest);fs.writeFileSync(path.join(root,'js/characters.js'),'/* Official high-resolution mouth assets, 2026-09-21. */\nwindow.characters = Object.freeze('+JSON.stringify(manifest,null,2)+');\n');writeJSON(path.join(out,'build.json'),report);
 await sharp({create:{width:1200,height:960,channels:4,background:'#dce5e8'}}).composite(previews).png().toFile(path.join(out,'final-preview.png'));
 console.log('Saved 20 native 1254px transparent fixed-position PNGs and compatibility paths.');
}
build().catch(e=>{console.error(e);process.exitCode=1});
