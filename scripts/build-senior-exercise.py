"""Build a narration-clock slideshow score with measured speech and generous rests."""
import json,re,wave,subprocess,math
from pathlib import Path
import numpy as np
R=Path(__file__).resolve().parents[1];D=R/'assets/senior-exercise'
ffmpeg=R/'.video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
subprocess.run([str(ffmpeg),'-y','-i',str(D/'source/narration.wav'),'-ac','1','-ar','22050','-c:a','pcm_s16le',str(D/'source/narration-pcm.wav')],check=True,capture_output=True)
spec=json.loads((D/'script.json').read_text(encoding='utf-8'));meta=json.loads((D/'source/speech.json').read_text(encoding='utf-8'))
words=[w for w in meta['word_timestamps'] if not w['word'].startswith('<')]
with wave.open(str(D/'source/narration-pcm.wav')) as f:rate=f.getframerate();source=np.frombuffer(f.readframes(f.getnframes()),dtype=np.int16).astype(np.float32)/32768
norm=lambda s:re.sub(r'[^가-힣A-Za-z0-9]','',s)
numbers={'하나.':1,'둘.':2,'셋.':3,'넷.':4};cursor=0;timeline=0;clips=[];scenes=[];cues=[]
short_captions={'디지털 AI 학교와 함께하는 어르신 체조 시간입니다.':'디지털 AI 학교\n어르신 체조 시간이에요','오늘도 천천히, 즐겁게 함께 움직여볼게요.':'천천히, 즐겁게\n함께 움직여요','고개를 왼쪽으로 천천히 기울여 주세요.':'고개를 왼쪽으로\n천천히 기울여요','이번에는 오른쪽으로 천천히 기울여 주세요.':'고개를 오른쪽으로\n천천히 기울여요','어깨를 천천히 위로 올렸다가 내려놓습니다.':'어깨를 천천히\n올렸다가 내려요','이번에는 가볍게 박수를 쳐볼게요.':'이번에는 가볍게\n박수를 쳐요','이번에는 발목을 부드럽게 돌려볼게요.':'발목을 부드럽게\n돌려요','무리하지 말고 천천히 따라오세요.':'무리하지 말고\n천천히 따라해요'}
for scene in spec['scenes']:
 start=timeline;timeline+=.6
 for text in scene['lines']:
  first=cursor;got='';target=norm(text)
  while len(got)<len(target):got+=norm(words[cursor]['word']);cursor+=1
  assert got==target,(text,got)
  a=max(0,words[first]['start']-.045);b=min(len(source)/rate,words[cursor-1]['end']+.07)
  if cursor<len(words):b=min(b,(words[cursor-1]['end']+words[cursor]['start'])/2)
  clip=source[int(a*rate):int(b*rate)].copy()
  n=min(int(rate*.012),len(clip)//2);clip[:n]*=np.linspace(0,1,n);clip[-n:]*=np.linspace(1,0,n)
  duration=len(clip)/rate
  rest=2.3 if text in numbers else 2.2 if ('들이마시' in text or '내쉬' in text or '기울여' in text) else 1.1
  cue={'scene':scene['id'],'start':round(timeline,4),'end':round(timeline+duration+rest,4),'speechEnd':round(timeline+duration,4),'text':text,'number':numbers.get(text)}
  cue['caption']=short_captions.get(text,text)
  if text=='디지털 AI 학교와 함께하는 어르신 체조 시간입니다.':cue['caption']='디지털 AI 학교\n어르신 체조 시간'
  cues.append(cue);clips.append((timeline,clip));timeline+=duration+rest
 timeline=max(timeline,start+scene['minimum']);timeline+=.6
 scenes.append({k:scene[k] for k in ['id','title','subtitle','image']}|{'start':round(start,4),'end':round(timeline,4)})
assert cursor==len(words)
total=math.ceil(timeline);scenes[-1]['end']=total
mix=np.zeros(total*rate,dtype=np.float32)
for start,clip in clips:pos=int(start*rate);mix[pos:pos+len(clip)]+=clip*.88
# Original gentle piano-like accompaniment. Slow attacks, low level, no percussion.
for beat in range(0,total,2):
 pos=beat*rate;n=min(int(3.5*rate),len(mix)-pos);t=np.arange(n)/rate
 freq=[261.6256,329.6276,391.9954,329.6276,220,261.6256,349.2282,293.6648][(beat//2)%8]
 envelope=(1-np.exp(-t*12))*np.exp(-t*1.7)
 tone=(np.sin(2*np.pi*freq*t)+.22*np.sin(4*np.pi*freq*t)+.06*np.sin(6*np.pi*freq*t))*envelope*.010
 mix[pos:pos+n]+=tone
fade=int(rate*2);mix[:fade]*=np.linspace(0,1,fade);mix[-fade:]*=np.linspace(1,0,fade)
assert np.max(np.abs(mix))<1,'Audio clipping'
with wave.open(str(D/'source/program.wav'),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes((mix*32767).astype(np.int16).tobytes())
subprocess.run([str(ffmpeg),'-y','-i',str(D/'source/program.wav'),'-c:a','libmp3lame','-b:a','128k',str(D/'audio/program.mp3')],check=True,capture_output=True)
data={'title':'디지털 AI 학교 어르신 체조','duration':total,'voice':spec['voice'],'scenes':scenes,'cues':cues,'music':'Original soft piano-like synthesized accompaniment, below narration level','format':'narrated image slideshow'}
(D/'program.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
def stamp(t):return f'{int(t)//3600:02}:{int(t)//60%60:02}:{t%60:06.3f}'
(D/'captions-ko.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for c in cues)+'\n',encoding='utf-8')
print(json.dumps({'duration':total,'scenes':[(s['id'],round(s['end']-s['start'],1)) for s in scenes],'cues':len(cues),'peak':float(np.max(np.abs(mix)))},ensure_ascii=False))
