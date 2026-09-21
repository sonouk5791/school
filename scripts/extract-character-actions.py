from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import json,collections
R=Path(__file__).resolve().parents[1];im=Image.open(R/'characters/reference/actions/source.png').convert('RGB')
# Manual visual review. Names printed on the source are deliberately ignored.
rows=[
[('kongi','hello'),('kongi','read'),('kongi','explain'),('tori','hello'),('tori','cheer'),('tori','turn'),('kongi','bow'),(None,'dance'),('kongi','sleep')],
[('tori','wink'),('kongi','wink'),(None,'emotional'),('tori','jump'),('tori','cheer'),(None,'shy'),('tori','dance'),('tori','wave'),(None,'sleep')],
[('nabi','hello'),('nabi','sit'),('nabi','dance'),(None,'play'),('nabi','cheer'),('nabi','shy'),(None,'dance'),('tori','surprise'),('nabi','sleep')],
[('bori','thumbsup'),('bori','music'),(None,'explain'),('bori','music'),(None,'thumbsup'),(None,'thumbsup'),('bori','shy'),('bori','happy'),('bori','sit')]]
xs=[56,109,162,215,268,321,375,428,480];tops=[60,178,310,447];bottoms=[112,233,366,505]
manifest={};entries=[];preview=Image.new('RGB',(9*96,4*114),'#e5ebe5');d=ImageDraw.Draw(preview)
reasons={(1,8):'갈색 곰이지만 파란색/흰색 공식 의상 없음',(2,3):'강아지 + 분홍색 의상',(2,6):'강아지 + 분홍색 의상',(2,9):'강아지 + 분홍색 의상',(3,4):'곰 + 보라색 의상',(3,7):'곰 + 보라색 의상',(4,3):'흰색 강아지 + 보라색 의상',(4,5):'토끼 + 파란색 의상',(4,6):'토끼 + 파란색 의상'}
for row,cells in enumerate(rows):
 for col,(id,action) in enumerate(cells):
  left=xs[col]-26;top=tops[row];crop=im.crop((left,top,left+52,bottoms[row]));w,h=crop.size
  # Per-scanline edge background; outside flood excludes only near-background pixels.
  allowed=set()
  for y in range(h):
   bg=crop.getpixel((0,y));bg2=crop.getpixel((w-1,y));bg=tuple((a+b)//2 for a,b in zip(bg,bg2))
   for x in range(w):
    p=crop.getpixel((x,y))
    if max(abs(a-b) for a,b in zip(p,bg))<23:allowed.add((x,y))
  q=collections.deque(p for p in allowed if p[0] in (0,w-1) or p[1] in (0,h-1));outside=set(q)
  while q:
   x,y=q.popleft()
   for p in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
    if p in allowed and p not in outside:outside.add(p);q.append(p)
  mask=Image.new('L',(w,h),255)
  for p in outside:mask.putpixel(p,0)
  # Remove isolated background/noise islands, preserving the principal subject.
  fg={(x,y) for y in range(h) for x in range(w) if mask.getpixel((x,y))};components=[]
  while fg:
   seed=fg.pop();todo=[seed];component={seed}
   while todo:
    x,y=todo.pop()
    for p in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
     if p in fg:fg.remove(p);component.add(p);todo.append(p)
   components.append(component)
  keep=set().union(*(c for c in components if len(c)>12))
  mask=Image.new('L',(w,h));
  for p in keep:mask.putpixel(p,255)
  rgba=crop.convert('RGBA');rgba.putalpha(mask)
  canvas=Image.new('RGBA',(128,144));rgba=rgba.resize((104,h*2),Image.Resampling.LANCZOS);canvas.alpha_composite(rgba,(12,132-h*2))
  if id:
   folder=R/'characters'/id/'actions';folder.mkdir(exist_ok=True)
   existing=manifest.setdefault(id,{});key=action;count=2
   while key in existing:key=f'{action}_{count}';count+=1
   name=f'{id}_{key}.png';path=f'/characters/{id}/actions/{name}';canvas.save(folder/name);existing[key]=path
  else:
   path=f'/characters/reference/actions/pose-only-r{row+1}-c{col+1}.png';canvas.save(R/path.lstrip('/'))
  entries.append({'row':row+1,'column':col+1,'character':id,'action':action,'status':'accepted' if id else 'pose-only','path':path,'reason':reasons.get((row+1,col+1),'외형과 공식 의상 기준으로 분류'),'sourceBox':[left,top,left+52,bottoms[row]]})
  small=canvas.resize((80,90));preview.paste(small,(col*96+8,row*114),small);d.text((col*96+3,row*114+91),f'{row+1}-{col+1} {id or "REF"}',fill='black');d.text((col*96+3,row*114+102),action,fill='black')
for id in ['kongi','tori','nabi','bori']:
 path=f'/characters/{id}/actions/{id}_idle.png';Image.open(R/f'characters/{id}/{id}_idle.png').save(R/path.lstrip('/'));manifest[id]['idle']=path
(R/'characters/actions-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
(R/'characters/reference/actions/classification.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8');preview.save(R/'characters/reference/actions/classification-preview.png')
base=json.loads((R/'characters/manifest.json').read_text(encoding='utf-8'))
for id in base:base[id]['actions']=manifest[id]
(R/'characters/manifest.json').write_text(json.dumps(base,ensure_ascii=False,indent=2),encoding='utf-8')
(R/'js/characters.js').write_text('/* Official appearance stays governed by the mouth reference; actions are visually classified. */\nwindow.characters = Object.freeze('+json.dumps(base,ensure_ascii=False,indent=2)+');\n',encoding='utf-8')
print('27 accepted action frames, 9 pose-only references, 4 official idle fallbacks')
