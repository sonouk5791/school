from pathlib import Path
from PIL import Image
import json
r=Path(__file__).resolve().parents[1];p=json.loads((r/'assets/senior-exercise/program.json').read_text(encoding='utf-8'))
assert p['duration']==184 and len(p['scenes'])==6 and len(p['cues'])==50
assert [s['id'] for s in p['scenes']]==['intro','neck','arms','legs','breathing','ending']
last=0
for s in p['scenes']:
 assert abs(s['start']-last)<.001 and s['end']>s['start'];last=s['end']
 im=Image.open(r/'assets/senior-exercise/images'/s['image']);assert im.size==(1672,941)
for c in p['cues']:
 s=next(s for s in p['scenes'] if s['id']==c['scene']);assert s['start']<=c['start']<c['speechEnd']<c['end']<=s['end']+.001
 if c['number']:assert c['end']-c['speechEnd']>=2.299
assert [c['number'] for c in p['cues'] if c['scene']=='arms' and c['number']]==[1,2,3,4,1,2,3,4]
print('PASS: 5 high-resolution posters, 6 contiguous scenes, 50 aligned captions, 184 seconds, >=2.3s silence after each count')
