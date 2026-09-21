from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];chapters=[];events=[];phrases=[]
def chapter(title,id,duration,build):
 start=sum(c['duration'] for c in chapters);local=[]
 def add(seconds,text,move='rest',who=None):
  if text not in phrases:phrases.append(text)
  local.append({'duration':seconds,'text':text,'move':move,'character':who or id,'phrase':phrases.index(text)})
 build(add)
 used=sum(x['duration'] for x in local)
 assert used<=duration,(title,used)
 if used<duration:add(duration-used,'편안하게 쉬어주세요.')
 time=start
 for e in local:e['start']=time;e['end']=time+e['duration'];e['chapter']=len(chapters);time=e['end'];events.append(e)
 chapters.append({'title':title,'character':id,'start':start,'end':start+duration,'duration':duration})
def c1(a):
 a(16,'안녕하세요! 콩이에요. 오늘도 저와 함께 천천히 몸을 움직여 볼까요? 편안하게 따라 해주세요.','wave')
 a(12,'통증이나 어지러움이 느껴지면 운동을 멈추고 쉬어주세요.')
 a(8,'필요한 경우 보호자 또는 직원과 함께 진행해주세요.')
 a(8,'튼튼한 의자에 편안하게 앉아 주세요. 두 발은 바닥에 둡니다.')
 a(6,'두 손을 무릎 위에 올려볼게요.')
 for _ in range(3):a(4,'숨을 천천히 들이마시고.','inhale');a(5,'후, 편안하게 내쉬어요.','exhale')
 for _ in range(3):a(4,'어깨를 살짝 올려요.','shoulder-up');a(4,'천천히 내려요.')
 a(8,'잘하고 계세요. 조금만 움직여도 좋아요.','thumbsup','bori')
def c2(a):
 a(8,'이번에는 토리와 함께 목과 어깨를 움직여요. 목은 작게 움직여요.')
 for _ in range(3):
  a(6,'고개를 천천히 오른쪽으로.','neck-right');a(4,'다시 가운데.');a(6,'이번에는 왼쪽으로.','neck-left');a(4,'다시 가운데.')
 for _ in range(5):a(4,'어깨를 살짝 올려요.','shoulder-up');a(4,'천천히 내려요.')
 for _ in range(4):a(4,'어깨를 앞으로 작게 돌려요.','shoulder-front');a(4,'편안하게 쉬어주세요.')
 for _ in range(4):a(4,'어깨를 뒤로 작게 돌려요.','shoulder-back');a(4,'편안하게 쉬어주세요.')
 a(8,'아주 좋아요. 천천히 하시면 됩니다.','thumbsup','bori')
def c3(a):
 a(8,'이번에는 손과 팔을 움직여요. 두 손을 편하게 보여주세요.','hands-open')
 for _ in range(8):a(4,'손가락을 활짝 펴요.','hands-open');a(4,'살짝 쥐어요.','hands-close')
 for _ in range(5):a(4,'손목을 작게 돌려요.','wrist-right')
 for _ in range(5):a(4,'반대로 작게 돌려요.','wrist-left')
 for _ in range(5):a(5,'두 팔을 앞으로 쭉.','arms-forward');a(5,'다시 편안하게.')
 a(8,'정말 잘하셨어요. 손을 편안하게 내려요.','thumbsup','bori')
def c4(a):
 a(8,'이번에는 나비와 상체를 움직여요. 팔은 편안한 높이까지만 올려요.')
 for _ in range(6):a(5,'두 손을 앞으로 쭉.','arms-forward');a(5,'다시 가슴 앞으로.','hands-chest')
 for _ in range(4):a(4,'오른손을 편안한 높이로.','arm-right');a(4,'천천히 내려요.')
 for _ in range(4):a(4,'왼손을 편안한 높이로.','arm-left');a(4,'천천히 내려요.')
 for _ in range(6):a(3,'옆으로 활짝.','arms-side');a(3,'다시 모아요.','hands-chest')
 a(8,'아주 좋아요. 조금만 움직여도 좋아요.','thumbsup','bori')
def c5(a):
 a(10,'보리와 다리를 움직여요. 앉은 채로 의자를 가볍게 잡아주세요.')
 for _ in range(4):a(5,'오른발 뒤꿈치를 살짝 들어요.','heel-right');a(5,'내리고, 왼발 뒤꿈치를 들어요.','heel-left')
 for _ in range(8):a(5,'뒤꿈치는 두고 발끝을 들어요.','toes');a(5,'발끝을 천천히 내려요.')
 a(10,'가능한 분만 무릎을 조금 들어요. 힘드시면 발을 바닥에 두세요.')
 for _ in range(3):a(5,'오른쪽 무릎을 조금만.','knee-right');a(5,'내리고, 왼쪽을 조금만.','knee-left')
 a(10,'조금만 움직여도 아주 잘하고 계세요. 다리를 편히 쉬어요.','thumbsup')
def c6(a):
 a(8,'나비와 함께 가볍게 박수를 쳐볼까요?','hands-chest')
 for _ in range(6):a(5,'짝, 짝.','clap')
 a(10,'오른쪽이면 오른손, 왼쪽이면 왼손이에요. 한 손씩 해볼게요.')
 for _ in range(3):a(6,'오른쪽!','arm-right');a(6,'왼쪽!','arm-left')
 for _ in range(6):a(4,'짝.','clap-one');a(5,'짝, 짝.','clap');a(5,'잠시 기다려요.')
 a(12,'최고예요! 틀려도 괜찮아요. 함께 움직여서 즐거워요.','thumbsup','bori')
def c7(a):
 a(8,'이번에는 모두 함께 해볼까요? 앉아서 천천히 따라 해요.','wave','kongi')
 for _ in range(4):
  a(6,'손 흔들고.','wave','kongi');a(6,'두 손을 편안한 높이로.','both-up','tori');a(6,'짝, 짝.','clap','nabi');a(6,'최고!','thumbsup','bori')
 a(8,'정말 잘하셨어요. 잠시 쉬어볼까요?','thumbsup','bori')
def c8(a):
 a(4,'이제 마지막이에요.','rest','kongi')
 for _ in range(3):a(4,'숨을 천천히 들이마시고.','inhale','kongi');a(5,'후, 편안하게 내쉬어요.','exhale','kongi')
 a(10,'오늘 정말 잘하셨어요. 조금이라도 몸을 움직이셨다면 성공이에요.','thumbsup','bori')
 a(8,'다음 시간에도 우리 함께 만나요. 안녕히 계세요!','wave','kongi')
for args in [('인사와 준비운동','kongi',120,c1),('목과 어깨','tori',180,c2),('손과 팔','tori',180,c3),('상체 체조','nabi',180,c4),('다리와 발목','bori',180,c5),('박수·리듬·인지','nabi',180,c6),('함께하는 복합 체조','kongi',120,c7),('정리운동과 칭찬','bori',60,c8)]:chapter(*args)
assert sum(c['duration'] for c in chapters)==1200
out={'duration':1200,'bpm':75,'chapters':chapters,'events':events,'phrases':phrases}
(R/'assets/exercise-20min/program.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
(R/'.video-build/chair-class/narration.txt').write_text('\n'.join(phrases),encoding='utf-8')
print(len(events),'events,',len(phrases),'unique phrases,',len('\n'.join(phrases)),'characters')
