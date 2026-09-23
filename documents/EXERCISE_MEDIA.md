# 콩이 운동 영상 데이터

`assets/senior-exercise/program.json`의 기존 `scenes`와 각 `id`는 유지합니다.
`exerciseId`는 `exercise-01`부터 `exercise-10`까지의 미디어 연결용 식별자입니다.

- `title`: 동작 이름
- `video`: 사이트 기준 MP4/WebM 경로, 경로 배열 또는 `null`. 예: `assets/senior-exercise/videos/exercise-01.mp4`
- `image`: 기존 이미지 파일명 또는 사이트 기준 경로. 영상이 없거나 실패하면 표시합니다.
- `instruction`: 짧은 동작 안내
- `audioText`: 시작 및 해당 동작 진입 시 콩이의 Google TTS 안내
- `duration`, `speechSteps`: 기존 진행 시간 및 상세 자막/음성 순서를 유지합니다. 상세 안내가 없으면 `audioText`를 사용합니다.

현재 10개 동작은 기존 이미지를 사용합니다. 개별 동작 영상이 준비되면 파일을 추가하고 `video` 경로만 지정할 수 있습니다. 영상은 음소거·반복 재생하여 콩이 안내와 소리가 겹치지 않으며, 잠깐 쉬기·다시 보기·동작 전환에 맞춰 제어됩니다.
동작을 건너뛰거나 진행 바를 끝으로 이동하는 것만으로는 도장을 지급하지 않습니다.
