# 일상형 건강체조 의상 및 화면 변경 — 2026-09-28

## 요청 및 반영
- 기존 얼굴·종족·역할을 참고한 의상 전용 편집. 콩이 노랑 운동복, 토리 코랄/민트 활동복, 나비 라벤더/연하늘 활동복, 보리 크림/연갈색 활동복.
- 운동 시작 제목: **천천히 몸을 움직여볼까요?**
- 보조 문구: **앉아서도 따라할 수 있는 쉬운 10가지 건강 체조**
- 시작 버튼 하나와 기존 시작/진행/완료 흐름 유지. 네 친구의 작은 소개를 시작 버튼 위에 배치.
- 메인·네 방의 명절 배너, 시즌 추천 노출, 전통 배경, 명절 인사 및 절하기 스크립트 연결 해제. 이전 파일은 호환/원본 보존용으로 남김.
- 네 방과 보리 미디어 교실에 새 의상 연결. 기존 메인 네 친구 일러스트와 메뉴/링크는 유지.
- 체조의 기존 입체 삽화 7장(심호흡, 어깨, 팔, 박수, 발목, 손, 마무리)에 같은 의상 방향 반영. 나머지 콩이 장면 3장은 이미 노랑 운동복으로 적합하여 유지.
- 별도 실시간 2.5D 운동 엔진은 확인되지 않음. 현재 실제 재생되는 10장 삽화 기반 체조 화면을 수정했으며 새로운 동작 영상 제작으로 보고하지 않음.

## 주요 파일
- [운동 시작 화면](file:///J:/sh/senior-exercise.html)
- [일상형 화면 연결](file:///J:/sh/js/everyday-characters.js)
- [일상형 스타일](file:///J:/sh/css/everyday-characters.css)
- [기존 표정 호환 렌더러](file:///J:/sh/js/hanbok-character.js)
- [독립 캐릭터 상태](file:///J:/sh/js/character-animation.js)
- [체조 장면 데이터](file:///J:/sh/assets/senior-exercise/program.json)
- [콩이](file:///J:/sh/assets/images/everyday/kongi-active.png), [토리](file:///J:/sh/assets/images/everyday/tori-active.png), [나비](file:///J:/sh/assets/images/everyday/nabi-active.png), [보리](file:///J:/sh/assets/images/everyday/bori-active.png)
- 장면 편집본: `assets/senior-exercise/images/everyday/scene{02,04,05,06,08,09,10}_*.png`
- [반응형/표정 검증](file:///J:/sh/tests/everyday-exercise.cjs)

## 보존한 항목
운동 10단계의 시간·안내·순서·완료 기록, MP4/WebM 지원과 이미지 fallback, 기존 활동 데이터·localStorage·페이지 URL·선생님 공간·20분 및 정규수업 유지. Google/Gemini 음성 API·환경설정은 수정하지 않음. 기존 5개 입모양과 캐릭터별 음성 상태 이벤트 연결 유지. 학습/회상 콘텐츠에 들어 있는 명절 문제는 교육 데이터이므로 삭제하지 않음.

## 이미지 편집 기록
내장 imagegen 편집 모드 사용. 각 원본을 직접 확인한 뒤 캐릭터 4장과 체조 장면 7장을 각각 편집. 원본 자산은 덮어쓰지 않음. 출력은 위 프로젝트 경로에 복사.

캐릭터 공통 프롬프트: “Clothing-only edit of this exact character. Preserve the exact face, fur markings, ears, eyes, mouth, head shape, facial expression, head position, proportions, gentle plush 3D style and original portrait framing. Replace ALL hanbok clothing. No traditional collar, ribbons, sash, holiday decoration or text. Same full body front facing pose, hands relaxed in front. Transparent alpha background.”

의상 지시: Kongi “yellow zip-up sports tracksuit with cream trim and yellow/white sneakers”; Tori “coral crewneck sweatshirt, mint jogger pants and cream sneakers”; Nabi “pastel lavender cardigan, cream undershirt, light blue pants”; Bori “cream soft sweatshirt, beige collar/cuffs, light brown jogger pants”.

장면 공통 프롬프트: “Edit only the animal characters' CLOTHING in this exact senior chair-exercise scene. Preserve faces, species, expressions, exercise poses, hands, body positions, human seniors, chairs, room, camera framing, lighting, background text and soft 2.5D clay illustration style.” 위 의상 지시를 함께 적용. 얼굴의 시각적 정체성을 확인했으며 생성 편집 결과가 원본과 픽셀 단위로 동일하다는 의미는 아님.

## 검증
- `tests/everyday-exercise.cjs`: 네 방 × 1920×1080 / 1600×900 / 1366×768 / 768×1024 / 390×844 / 320×900, 활동 진입, 이미지, 가로 넘침, JS 오류, 저장값 보존, 5개 입모양 표시와 독립 음성 이벤트 통과.
- `tests/exercise-follow-along.cjs`: 시작 버튼 하나, 진행 4개 조작, 10단계 완료 조건, 기록 보존, 다시하기, MP4/WebM 재생·일시정지·없는 영상 fallback 통과. 장면 변경 후 재실행 통과.
- `tests/exercise-caption-sync.cjs`: 음성 대기/취소 분리, 자막 동기화, 일시정지/복귀 통과.
- `tests/operations-production-smoke.cjs` 로컬: 메인 3개 수업 버튼, 친구방 4개 링크, 7개 관련 URL, 5개 화면 크기 통과.
- `tests/bori-media-browser.cjs`: 보리 업로드·재생·회상·기록·가사·속도·일시정지 회귀 검증 통과.
- JS 문법 검사 및 기존 welcome 녹음 manifest 빌드 통과.
- 실제 유료 TTS 합성 호출은 새로 실행하지 않음. 기존 음성 코드를 유지하고 음성 이벤트/재생 흐름을 검증함.

배포 결과는 아래와 오늘 작업 일지에 이어 기록한다.

## 운영 반영 결과
- 기능 커밋 `7c7ca62` → 기존 GitHub `origin/main` 푸시 완료.
- 기존 Vercel `school` 프로젝트 배포 `dpl_Ap5rfv5hBr5fGW8xWYsRAtztkTse`, 상태 `READY`.
- 운영 주소: https://school-tau-pearl.vercel.app (기존 별칭 유지).
- `tests/everyday-deployment.cjs`: 실제 운영 HTML/JS/CSS/프로그램/캐릭터/장면 22개 파일 SHA256 일치.
- `tests/everyday-exercise.cjs https://school-tau-pearl.vercel.app`: 네 방 × 6개 화면 크기 및 10개 장면 HTTP 확인 최종 통과.
- 운영 최초 이미지 검사에서 다운로드 미완료와 1회 대기 시간 초과가 발생. 로딩 완료 대기 및 진단을 포함하여 다시 실행한 전체 검증은 통과. 지속 재현되는 이미지 오류는 확인되지 않음.
- `js/character-voice-system.js` 기존 SHA256 `067BB64B0291085326809BCB098D7E54EDA9AEDAD32EB94DABAA19A2F1E4AD3D` 유지.
