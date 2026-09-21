from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import json, shutil
root=Path(__file__).resolve().parents[1]
if (root/'characters/reference/high-resolution/build.json').exists():
 raise SystemExit('Blocked: high-resolution assets are official. This legacy crop script would overwrite them. Use scripts/build-hd-characters.cjs instead.')
sheet=Image.open(root/'characters/reference/official-mouth-sheet.png').convert('RGBA')
centers=[105,238,371,503,636]
# Source-space outlines exclude title, labels, circular backplates and pedestals.
shapes={
'kongi':(60,[(96,87),(95,78),(98,72),(104,73),(107,77),(110,73),(115,74),(115,83),(121,87),(127,86),(137,93),(144,105),(148,115),(144,122),(134,122),(130,132),(123,138),(127,143),(132,148),(130,156),(124,158),(122,179),(119,188),(110,190),(106,186),(102,190),(94,189),(91,181),(89,159),(82,157),(78,151),(79,145),(85,139),(85,132),(80,121),(74,125),(65,126),(60,121),(61,111),(67,99),(75,91),(85,87),(88,88)],(96,121,117,142)),
'tori':(240,[(91,280),(84,270),(79,261),(82,256),(87,255),(93,260),(99,278),(103,277),(105,260),(109,252),(115,251),(121,255),(121,263),(116,278),(122,285),(128,296),(130,310),(126,322),(130,330),(127,338),(126,348),(119,358),(118,364),(109,367),(104,364),(100,366),(89,365),(85,360),(87,352),(85,336),(82,331),(84,323),(81,315),(81,300),(85,287)],(98,307,115,320)),
'nabi':(420,[(80,458),(80,437),(82,433),(99,441),(110,440),(123,433),(128,435),(130,457),(130,466),(126,478),(129,487),(126,495),(122,497),(121,516),(119,526),(120,533),(115,537),(107,536),(104,532),(100,537),(91,536),(88,531),(89,520),(87,500),(81,495),(79,488),(82,478),(79,466)],(98,468,114,480)),
'bori':(592,[(81,624),(79,616),(82,609),(88,606),(95,610),(107,608),(118,610),(124,607),(130,610),(132,617),(130,624),(134,634),(139,630),(143,630),(148,635),(150,641),(145,649),(136,657),(130,660),(126,667),(124,683),(124,699),(120,706),(110,708),(103,704),(98,708),(87,707),(84,702),(86,688),(85,672),(79,671),(74,665),(75,657),(79,651),(79,637)],(96,635,115,648))}
manifest={}
preview=Image.new('RGB',(128*5,164*4),'#e3e9e6');draw=ImageDraw.Draw(preview)
for row,(id,(top,poly,mouth)) in enumerate(shapes.items()):
 folder=root/'characters'/id;folder.mkdir(exist_ok=True)
 frames=[]
 for col,v in enumerate('aeiou'):
  dx=centers[col]-centers[0]; left=centers[col]-64
  im=sheet.crop((left,top,left+128,top+144))
  mask=Image.new('L',(512,576));d=ImageDraw.Draw(mask)
  d.polygon([((x+dx-left)*4,(y-top)*4) for x,y in poly],fill=255)
  mask=mask.resize((128,144),Image.Resampling.LANCZOS)
  im.putalpha(mask);im.save(folder/f'{id}_{v}.png');frames.append(im)
  preview.paste(im,(col*128,row*164),im);draw.text((col*128+8,row*164+145),f'{id}_{v}',fill='black')
 base=frames[4];base.save(folder/f'{id}_idle.png')
 box=(mouth[0]-41,mouth[1]-top,mouth[2]-41,mouth[3]-top)
 for v,im in zip('aeiou',frames):
  stable=base.copy();patch=im.crop(box)
  stable.paste(patch,box,patch);stable.save(folder/f'{id}_{v}_stable.png')
 manifest[id]={'name':['콩이','토리','나비','보리'][row],'row':row+1,'idle':f'/characters/{id}/{id}_idle.png','mouth':{v:f'/characters/{id}/{id}_{v}.png' for v in 'aeiou'},'stable':{v:f'/characters/{id}/{id}_{v}_stable.png' for v in 'aeiou'},'size':[128,144],'mouthBox':box}
 # Compatibility aliases keep existing screens/data selectors working.
 for suffix in ['', '-talk']:
  target=root/f'assets/images/friend-{id}{suffix}.png'
  backup=root/'characters/reference/legacy'/target.name;backup.parent.mkdir(exist_ok=True)
  if target.exists() and not backup.exists():shutil.copy2(target,backup)
  shutil.copy2(folder/f'{id}_idle.png',target)
for suffix in ['companion','blink','mouth-closed']:
 target=root/f'assets/images/friend-kongi-{suffix}.png'
 if target.exists():
  backup=root/'characters/reference/legacy'/target.name
  if not backup.exists():shutil.copy2(target,backup)
  shutil.copy2(root/'characters/kongi/kongi_idle.png',target)
actions_file=root/'characters/actions-manifest.json'
if actions_file.exists():
 for id,actions in json.loads(actions_file.read_text(encoding='utf-8')).items():manifest[id]['actions']=actions
(root/'characters/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
preview.save(root/'characters/reference/extraction-contact-sheet.png')
print('Extracted 20 RGBA originals + 20 fixed-body mouth frames + 4 idle frames')
