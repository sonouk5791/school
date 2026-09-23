# 추석 연휴 전날 시즌

- 적용: index, senior-exercise, tori-play, nabi-learn, bori-hobby의 html[data-season="chuseok"]. 속성을 제거하면 기본 캐릭터 리그가 다시 사용된다. 메인 인사/배너와 정적 SVG 이미지도 기본 버전으로 복원해야 전체 시즌 해제가 된다.
- 메인 인사: 추석 연휴를 앞두고, 반가워요! / 한복 입은 친구들과 따뜻한 하루 보내요.
- 배너: 달처럼 환한 마음으로, 따뜻한 추석 보내세요. / 오늘도 천천히, 즐겁게 함께해요.
- 크림 배경, 옅은 창살 문양과 달. 네 캐릭터의 얼굴/종족/대표색을 기준으로 한복 이미지 제작. 원본 파일 보존.
- 각 방 선택/시작 화면에 같은 한복과 명절 인사 적용. 운동 미디어, 활동 데이터, TTS, localStorage, 링크 변경 없음.
- 별도 시즌 활동은 추가하지 않음. 첫 화면 선택을 늘리지 않고 기존 운동/계절 놀이/추억 이야기 등을 유지.
- 시즌 이미지는 정적인 전신 그림이며 기존 부위 리그의 입/팔 변형을 적용하지 않는다. 캐릭터 음성과 음성 상태 연결은 유지한다.

## kongi
- Asset: assets/images/chuseok/kongi-hanbok.png
- Tool: built-in image_gen (identity-preserve edit)
- Prompt: Use case: identity-preserve. Edit target: attached official kongi character. Change ONLY the clothing into a simple authentic Korean hanbok in warm yellow with cream collar and small tied goreum ribbon. Preserve the exact face, species, eyes, glasses if present, ears, fur markings, head proportions, expression, hands, pose and friendly soft 3D rendering. Full body same centered framing, no clipping. Calm cute Chuseok holiday outfit for senior education platform. No hats, props, text, lettering, watermark or scenery. Genuinely transparent background. High resolution single character asset.

## tori
- Asset: assets/images/chuseok/tori-hanbok.png
- Tool: built-in image_gen (identity-preserve edit)
- Prompt: Use case: identity-preserve. Edit target: attached official tori character. Change ONLY the clothing into a simple authentic Korean hanbok in soft pink with cream collar and small tied goreum ribbon. Preserve the exact face, species, eyes, glasses if present, ears, fur markings, head proportions, expression, hands, pose and friendly soft 3D rendering. Full body same centered framing, no clipping. Calm cute Chuseok holiday outfit for senior education platform. No hats, props, text, lettering, watermark or scenery. Genuinely transparent background. High resolution single character asset.

## nabi
- Asset: assets/images/chuseok/nabi-hanbok.png
- Tool: built-in image_gen (identity-preserve edit)
- Prompt: Use case: identity-preserve. Edit target: attached official nabi character. Change ONLY the clothing into a simple authentic Korean hanbok in lavender purple with cream collar and small tied goreum ribbon. Preserve the exact face, species, eyes, glasses if present, ears, fur markings, head proportions, expression, hands, pose and friendly soft 3D rendering. Full body same centered framing, no clipping. Calm cute Chuseok holiday outfit for senior education platform. No hats, props, text, lettering, watermark or scenery. Genuinely transparent background. High resolution single character asset.

## bori
- Asset: assets/images/chuseok/bori-hanbok.png
- Tool: built-in image_gen (identity-preserve edit)
- Prompt: Use case: identity-preserve. Edit target: attached official bori character. Change ONLY the clothing into a simple authentic Korean hanbok in sky blue with cream collar and small tied goreum ribbon. Preserve the exact face, species, eyes, glasses if present, ears, fur markings, head proportions, expression, hands, pose and friendly soft 3D rendering. Full body same centered framing, no clipping. Calm cute Chuseok holiday outfit for senior education platform. No hats, props, text, lettering, watermark or scenery. Genuinely transparent background. High resolution single character asset.

## 메인 절하기 인사
- CSS 상체 16도 앞으로 숙이기, 2.2초, 허리 기준 변형과 고정된 하체.
- 첫 화면 노출 시 각 캐릭터 1회 순차 인사. hover/키보드 초점 재인사는 전체 30초 간격. 클릭 이동을 지연하지 않는다.
- 움직임 줄이기 설정에서는 정지. 탭을 숨기면 진행 중 인사 취소. 기존 손 그림은 유지하고 상체 폭을 4% 모아 안쪽으로 모이는 느낌만 적용하며 실제 합장 자세로 바꾸지는 않는다.
- js/chuseok-bow.js, css/chuseok-bow.css는 메인에만 연결. 음성/활동/저장 로직 변경 없음.

## 각 방 시즌 연결 보강
- 콩이: 노랑 생활 한복 유지, 옅은 창살, 명절을 앞두고 천천히 몸을 움직여볼까요. 운동 중 자막 이름 옆 작은 한복 안내 캐릭터. 기존 운동 영상·이미지는 수정하지 않음.
- 토리: 분홍 한복, 작은 색동 복주머니 실루엣. 명절을 앞두고, 토리와 즐겁게 놀아볼까요?
- 나비: 보라 한복, 옅은 창살과 연보라 배경. 나비와 함께 차분하게 생각해볼까요?
- 보리: 파랑 한복, 작은 달과 따뜻한 빛 배경. 보리와 함께 따뜻한 시간을 보내볼까요? 말풍선: 명절을 앞두고, 편안하게 함께해요.
- 세 방 활동 도구줄에 작은 한복 캐릭터 추가. 장식은 문제와 운동 미디어 밖에만 표시. 고대비에서는 장식 제거. 기존 질문/기록/TTS/링크 유지.

## 명절 전날 특별 배너 간소화
- 기존 배너를 중복 없이 교체: 🌕 명절 연휴 전날, 네 친구와 따뜻한 하루 보내요.
- 4캐릭터 아래 연한 크림 카드, 20~22px 글씨, 정적 표시. 폰트 로딩 후 동일 화면 비교에서 CTA가 기존 대비 30~41px 위로 이동(1440/768/390/320).
