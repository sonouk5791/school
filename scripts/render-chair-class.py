from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import math,json,subprocess,sys
R=Path(__file__).resolve().parents[1];D=R/'assets/exercise-20min';P=json.loads((D/'program.json').read_text(encoding='utf-8'))
FONT='C:/Windows/Fonts/malgun.ttf';BOLD='C:/Windows/Fonts/malgunbd.ttf';fonts={n:ImageFont.truetype(BOLD,n) for n in [20,24,28,32,36]}
# Rigid cutout rig: original reference pixels, unchanged head/clothing textures.
# All movement is articulated on a fixed chair. No separately drawn person.
rigs={
 'kongi':{'head':(17,4,110,81),'body':(46,80,82,112),'left':(35,79,51,98),'right':(81,78,96,98),'legs':[(49,111,63,131),(65,111,79,131)],'shoulder':86},
 'tori':{'head':(36,7,92,82),'body':(47,83,84,112),'left':(40,79,56,100),'right':(76,78,92,100),'legs':[(47,108,66,128),(66,108,85,128)],'shoulder':90},
 'nabi':{'head':(37,10,94,60),'body':(46,59,82,94),'left':(37,58,51,78),'right':(80,57,94,79),'legs':[(47,94,64,116),(65,94,81,116)],'shoulder':66},
 'bori':{'head':(35,9,94,65),'body':(44,63,87,97),'left':(32,61,47,83),'right':(84,43,110,66),'legs':[(44,96,63,117),(65,96,85,117)],'shoulder':70}}
imgs={id:Image.open(R/f'characters/{id}/{id}_idle.png').convert('RGBA') for id in rigs}
names={'kongi':'콩이','tori':'토리','nabi':'나비','bori':'보리'}
def limb(layer,part,anchor,angle):
 # Original rigid limb pivoted around its attachment; no face deformation.
 pad=Image.new('RGBA',(128,144));pad.alpha_composite(part,(64-part.width//2,72));pad=pad.rotate(angle,Image.Resampling.BICUBIC,center=(64,72));layer.alpha_composite(pad,(int(anchor[0]-64),int(anchor[1]-72)))
def figure(id,move,t):
 cfg=rigs[id];src=imgs[id];out=Image.new('RGBA',(160,165));d=ImageDraw.Draw(out)
 body=cfg['body'];hip=body[3]-1;floor=hip+26
 d.ellipse((24,floor+2,136,floor+8),fill='#ddd6c7');d.rounded_rectangle((43,body[1]+4,117,hip+6),radius=7,fill='#d1b89a',outline='#a98e6a',width=2)
 d.line((46,hip+4,43,floor+2),fill='#a98e6a',width=5);d.line((114,hip+4,117,floor+2),fill='#a98e6a',width=5)
 d.rounded_rectangle((39,hip-1,121,hip+7),radius=4,fill='#b59b77')
 layer=Image.new('RGBA',(128,144));phase=(1-math.cos(min(t,3)*math.pi/1.5))/2
 for i,box in enumerate(cfg['legs']):
  leg=src.crop(box);ang=(-10 if i==0 else 10)
  if move in ['heel-right','knee-right'] and i==0:ang-=18*phase
  if move in ['heel-left','knee-left'] and i==1:ang+=18*phase
  if move=='toes':ang+=(-10 if i==0 else 10)*phase
  limb(layer,leg,((box[0]+box[2])/2,hip-2),ang)
 # Fixed torso and head are layered over the limb joints.
 layer.alpha_composite(src.crop(body),(body[0],body[1]))
 angles=[18,-18];sy=cfg['shoulder'];hands=[]
 if move in ['arms-forward','hands-open','hands-close','hands-chest','clap','clap-one','wrist-right','wrist-left']:angles=[-65,65]
 if move in ['arm-right','wave','thumbsup']:angles[0]=-145+(8*math.sin(t*2) if move=='wave' else 0)
 if move=='arm-left':angles[1]=145
 if move=='both-up':angles=[-145,145]
 if move=='arms-side':angles=[-88,88]
 if move in ['clap','clap-one']:
  count=2 if move=='clap' else 1;beat=t%5;close=math.sin(min(beat,count*.8)*math.pi/.8)**2 if beat<count*.8 else 0;angles=[-65-45*close,65+45*close]
 if move=='shoulder-up':sy-=3*math.sin(min(t,3)*math.pi/3)
 if move.startswith('shoulder-'):sy-=2*math.sin(t*1.5)
 for i,key in enumerate(['left','right']):
  part=src.crop(cfg[key]);part=part.rotate(180) # source paws face upwards; neutral palms hang comfortably
  limb(layer,part,((body[0]+2 if i==0 else body[2]-2),sy),angles[i])
 head=src.crop(cfg['head']);hx,hy=cfg['head'][:2]
 # Only small in-plane head tilt in this 2D preview; no fabricated 3D face turn.
 if move.startswith('neck-'):head=head.rotate(7 if move=='neck-right' else -7,Image.Resampling.BICUBIC,expand=False)
 layer.alpha_composite(head,(hx,hy));out.alpha_composite(layer,(16,0));return out

def render(time):
 e=next((e for e in P['events'] if e['start']<=time<e['end']),P['events'][-1]);c=P['chapters'][e['chapter']];id=e['character'];t=time-e['start']
 out=Image.new('RGB',(960,540),'#fbf7ee');d=ImageDraw.Draw(out)
 d.rounded_rectangle((28,22,932,504),radius=24,fill='#fffdf7',outline='#e5ddcd',width=2)
 d.text((54,39),f"{e['chapter']+1} / 8  {c['title']}",font=fonts[28],fill='#475b43')
 d.text((905,41),f'{int(time)//60:02}:{int(time)%60:02} / 20:00',font=fonts[24],fill='#706348',anchor='ra')
 avatar=figure(id,e['move'],t);avatar=avatar.resize((320,330),Image.Resampling.LANCZOS);out.paste(avatar,(320,87),avatar)
 d.text((480,83),names[id],font=fonts[24],fill='#856a3b',anchor='mt')
 text=e['text'];lines=[];line=''
 for word in text.split():
  if d.textlength(line+' '+word,font=fonts[28])>830:lines.append(line);line=word
  else:line=(line+' '+word).strip()
 if line:lines.append(line)
 for i,line in enumerate(lines):d.text((480,423+i*35),line,font=fonts[28],fill='#342e28',anchor='mt')
 d.text((480,515),'앉아서 천천히 · 불편하면 잠시 쉬어요',font=fonts[20],fill='#695e4b',anchor='mt')
 d.rectangle((50,493,910,497),fill='#ece5d7');d.rectangle((50,493,50+860*time/1200,497),fill='#89a67e')
 return out
if __name__=='__main__':
 if '--preview' in sys.argv:
  board=Image.new('RGB',(960,540*4))
  for i,t in enumerate([51,330,500,672]):board.paste(render(t),(0,540*i))
  board.save(D/'rig-preview.jpg');print('Saved articulated character preview')
 else:
  raise RuntimeError('검수 탈락한 관절 시안입니다. 완성 수업 렌더링에 사용할 수 없습니다.')
  ff=R/'.video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';out=R/'assets/videos/chair-class-20min.mp4'
  proc=subprocess.Popen([str(ff),'-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','960x540','-r','10','-i','pipe:0','-i',str(D/'audio/class-20min.wav'),'-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-t','1200','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
  for i in range(12000):
   proc.stdin.write(render(i/10).tobytes())
   if i%600==0:print(f'Rendered {i/10:.0f}/1200 seconds',flush=True)
  proc.stdin.close();assert proc.wait()==0;render(0).save(D/'poster.png');print('Completed 20-minute narrated character exercise video')
