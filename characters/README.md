# 공식 캐릭터 및 입모양

최신 디자인 참고: `reference/high-resolution/design-reference.jpeg`. 행은 콩이/토리/나비/보리, 열은 아/에/이/오/우이며 시트 이름표 오기는 사용하지 않습니다.

- 공식 파일: `public/characters/{kongi,tori,nabi,bori}/mouth/{id}_{a,e,i,o,u}.png`, 총 20개.
- 각 파일은 새로 생성한 **1254×1254 RGBA PNG**입니다. 원본 시트 crop이나 단순 확대가 아닙니다.
- 캐릭터별 아 렌더를 기준으로 다른 생성 결과의 입 영역만 합성했습니다. 프레임 전환 시 입 밖 픽셀과 알파 채널은 동일합니다.
- 눈썹/안경/코를 유지하며 콩이의 불필요한 베이지색 원형 덩어리는 없습니다.
- 기본 표정은 우 입모양입니다. 별도 닫힌 입 파일은 제작 대상 20장에 포함되지 않습니다.
- `manifest.json` 및 `../js/characters.js`가 재사용 데이터입니다. mouth/stable은 같은 새 파일을 사용합니다.
- 정적 서버 경로는 `/public/characters/`입니다. 기존 `/characters/` 및 `assets/images/friend-*.png` 링크에는 고해상도 호환 복사본을 제공합니다.
- 기존 작은 이미지 백업은 `reference/legacy-lowres-20260921/`에 보관합니다. 이전 추출 스크립트는 고해상도 파일을 덮어쓰지 못하도록 차단했습니다.
- 화면에서는 최대 360px로 표시하며 기존 홈페이지 UI와 오디오 컨트롤을 유지합니다.
- 실제 음성 시계에 맞춘 한국어 모음 보간을 사용합니다. 별도 녹음은 음량 기반 근사이며 정밀 음소 인식은 아닙니다.
- 기존 동작 시트 포즈와 교육 영상/포스터/3D 모델은 이번 입모양 20장 재제작 범위에 포함되지 않습니다. 동작 설명은 ACTIONS.md 참고.

미리보기: `/characters/high-resolution-preview.html`
제작/프롬프트/원본: `reference/high-resolution/`
검증: `../tests/official-character-assets.py`, `../tests/official-characters.cjs`, `../tests/high-resolution-preview.cjs`
