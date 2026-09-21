import json,wave,re
import numpy as np
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'assets/exercise-20min';p=json.loads((D/'program.json').read_text(encoding='utf-8'));meta=json.loads((D/'narration-source.json').read_text(encoding='utf-8'));words=[w for w in meta['word_timestamps'] if not w['word'].startswith('<')]
norm=lambda s:re.sub(r'[^가-힣A-Za-z0-9]','',s)
with wave.open(str(D/'audio/narration-pcm.wav')) as f:rate=f.getframerate();channels=f.getnchannels();assert f.getsampwidth()==2;source=np.frombuffer(f.readframes(f.getnframes()),dtype=np.int16).reshape(-1,channels).mean(axis=1)/32768
parts=[];cursor=0;info=[]
for i,text in enumerate(p['phrases']):
 start=cursor;got='';target=norm(text)
 while len(got)<len(target):got+=norm(words[cursor]['word']);cursor+=1
 assert got==target,(i,target,got)
 a=max(0,words[start]['start']-.06);b=words[cursor-1]['end']+.07;clip=source[int(a*rate):int(b*rate)];parts.append(clip);info.append({'id':i,'text':text,'start':a,'end':b,'duration':len(clip)/rate})
 with wave.open(str(D/f'audio/phrase-{i:02}.wav'),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes((clip*32767).astype(np.int16).tobytes())
print('Phrase fits:',[(e['phrase'],round(len(parts[e['phrase']])/rate,2),e['duration']) for e in p['events'] if len(parts[e['phrase']])/rate>e['duration']-.25])
mix=np.zeros(1200*rate,dtype=np.float32)
for e in p['events']:
 clip=parts[e['phrase']];start=int((e['start']+.12)*rate);assert len(clip)/rate<e['duration']-.12,(e['text'],len(clip)/rate,e['duration']);mix[start:start+len(clip)]+=clip*.9
# Original quiet, warm 75 BPM accompaniment. Tone beats have soft attacks and decays.
for beat in range(1500):
 start=int(beat*.8*rate);length=min(int(.65*rate),len(mix)-start);t=np.arange(length)/rate;freq=[261.63,329.63,392,329.63][beat%4]
 envelope=(1-np.exp(-t*8))*np.exp(-t*5);tone=(np.sin(2*np.pi*freq*t)+.3*np.sin(2*np.pi*freq*2*t))*envelope
 volume=.018 if beat*.8<1140 else .009
 mix[start:start+length]+=tone*volume
with wave.open(str(D/'audio/class-20min.wav'),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes((np.clip(mix,-.98,.98)*32767).astype(np.int16).tobytes())
(D/'audio/phrases.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf-8');print('Built 59 phrase clips and exact 1200-second narration + 75 BPM original music')
