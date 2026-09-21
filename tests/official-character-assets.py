from PIL import Image, ImageChops
from pathlib import Path
import json, hashlib
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'characters/manifest.json').read_text(encoding='utf-8'))
assert list(manifest)==['kongi','tori','nabi','bori']
for id,c in manifest.items():
 base=Image.open(root/c['mouth']['a'].lstrip('/')).convert('RGBA')
 assert base.size==(1254,1254)
 hashes=set()
 for v in 'aeiou':
  p=root/c['mouth'][v].lstrip('/')
  assert p==root/f'public/characters/{id}/mouth/{id}_{v}.png'
  image=Image.open(p)
  assert image.format=='PNG' and image.mode=='RGBA' and image.size==base.size
  alpha=image.getchannel('A');assert alpha.getextrema()==(0,255)
  assert alpha.getpixel((0,0))==0 and alpha.getpixel((1253,1253))==0
  assert sum(alpha.histogram()[1:255])>0,'Missing antialiased edge'
  diff=ImageChops.difference(base,image);diff.paste((0,0,0,0),c['mouthBox'])
  assert not any(ch.getbbox() for ch in diff.split()),(id,v,'pixels moved outside mouth')
  assert ImageChops.difference(base.getchannel('A'),alpha).getbbox() is None
  hashes.add(hashlib.sha256(image.tobytes()).hexdigest())
 assert len(hashes)==5,(id,'duplicate vowel')
 assert Image.open(root/c['idle'].lstrip('/')).size==base.size
print('PASS: 20 distinct 1254px transparent PNGs; identical pixels outside mouth; unchanged alpha and fixed frame sizes')
