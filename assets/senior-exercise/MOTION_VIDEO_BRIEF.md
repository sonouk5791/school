# 디지털 AI 학교 — 실제 동작 영상 제작 기준

작성일: 2026-09-21

## 현재 상태
사용자는 기존 이미지 슬라이드와 별도로 캐릭터가 직접 움직이는 운동영상을 요청했다. 연결된 Runway를 재확인했으나 Free 플랜으로 availableVideoModels가 비어 있어 영상 생성은 실행되지 않았다. 완성 MP4는 아직 없다. 기존 senior-exercise.html은 이미지·음성 콘텐츠이며 실제 동작 영상으로 표시하거나 대체하지 않는다.

## 디자인 및 화면 고정
- 참고: images/intro.png, images/neck.png, images/arms.png, images/legs.png, images/breathing.png. 참고 포스터의 글자·화살표·장식은 영상에 포함하지 않는다.
- 정확히 4명: 콩이(둥근 안경, 갈색 귀 강아지, 노랑), 토리(흰 토끼, 분홍), 나비(흰색·회색·주황 삼색 고양이, 보라), 보리(갈색 곰, 파랑).
- 얼굴, 귀, 체형, 의상 색상 유지. 캐릭터 복제·추가·교체 금지. 의상의 로고도 제거하며 색상과 형태는 유지.
- 따뜻한 한국 주간보호센터, 원목 바닥, 베이지 벽, 큰 창과 부드러운 자연광, 뒤쪽 정돈된 의자. 배경 사람 없음.
- 16:9, 정면 고정 카메라, 전신과 모든 손발 노출. 팬·틸트·줌·회전·컷 없음.
- 의자에 앉은 자세, 편안한 미소. 한 클립에서 네 캐릭터 모두 같은 한 가지 동작만 한다.
- 8초 동안 한 번의 느린 동작. 처음과 마지막 자세를 일치시켜 자연스럽게 반복.
- 자막·글자·로고·화살표·숫자·워터마크 없음. 생성 영상은 무음으로 준비해 기존 음성과 별도로 검토한다.

## 공통 생성 프롬프트
Create one continuous 8-second 16:9 full-body 3D animated exercise shot based strictly on the supplied character design references. Exactly four characters sit in a row on stable chairs: Kongi, the brown-eared dog with round glasses in yellow; Tori, the white long-eared rabbit in pink; Nabi, the white/gray/orange calico cat in purple; Bori, the brown bear in blue. Preserve each character's face, ear shape, proportions, clothing design and assigned color throughout. Use a warm Korean senior day-care exercise room with light wood flooring, beige walls, large windows, soft natural daylight and neatly arranged empty chairs behind them. Clean uncluttered composition. Locked frontal camera; no camera movement, zoom, rotation, cuts or transitions. All hands, feet, heads and chairs remain fully visible with generous margins. All four perform only the SINGLE movement specified below, in synchrony, with extremely slow smooth motion and a gentle relaxed smile. Hold the starting pose for 1 second, perform the outward movement during seconds 1–3, hold gently during seconds 3–4, return during seconds 4–7, then hold the exact original pose during seconds 7–8. Natural ease-in/ease-out. Seamless loop, matching first and last poses. No extra movement, no bouncing, no exaggerated expressions. No text, captions, letters, numbers, logos, watermarks, arrows, extra characters or background people. Silent video.

## 독립 클립별 단일 동작
각 항목은 공통 프롬프트에 하나씩만 추가한다. 여러 동작을 한 영상에 합치지 않는다. 아래 목록은 이전 체조 구성에 맞춘 제작안이며 아직 생성하지 않았다.

1. shoulders-8s.mp4 — Slowly lift both shoulders slightly toward the ears, then slowly relax them back to neutral. Hands stay resting on the thighs, heads stay upright, feet stay on the floor.
2. arms-8s.mp4 — Slowly raise both forearms forward to a comfortable chest height, then lower them back to the thighs. Keep shoulders relaxed and feet on the floor. No overhead reach.
3. clap-8s.mp4 — Begin with hands apart at chest height, slowly bring palms together for one gentle clap, then slowly separate back to the exact starting position. No repeated rapid clapping.
4. knee-8s.mp4 — Holding the chair armrests, slowly lift one knee a small comfortable distance, then return that foot to the floor. The opposite foot remains planted. Do not switch legs within this clip.
5. ankle-8s.mp4 — With both heels resting on the floor, slowly lift the toes toward the shins, then lower them to the original position. Keep knees and torso still.
6. breathing-8s.mp4 — Hands rest lightly on the abdomen. Show one subtle slow breathing cycle through a small natural expansion and release of the torso. No large arm movements or head movement.

## 생성 후 검수
- 영상 메타데이터: 8초, 16:9, 전체 프레임 정상 디코딩.
- 시작/중간/끝 및 전체 재생으로 캐릭터 수·의상 색·얼굴·안경 위치·손발 형태·화면 내 전신 확인.
- 한 가지 동작만 1회, 빠른 움직임 없음. 정면 카메라 고정.
- 모든 프레임에 글자·로고·배경 인물 없음.
- 끝→시작 반복 경계에 자세 점프가 없는지 확인.
- 검수 통과한 실제 동작 파일만 홈페이지에 연결한다. 운동의 적합성은 시설 담당자가 참여자의 상태에 맞게 확인한다.
