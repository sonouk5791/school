# 첨부 캐릭터 음성 연결 — 2026-09-22

사용자가 확인한 파일 순서를 그대로 적용했다. 녹음의 음성 모델 이름은 사용자 지정 매핑이며, WAV에서 모델 정체성을 추론한 것은 아니다.

| 원본 | 캐릭터 / 지정 음성 | 저장 경로 | 길이 |
|---|---|---|---|
| speech.wav | 콩이 / Achird | assets/audio/character-samples/kongi.wav | 6.52초 |
| speech (1).wav | 토리 / Aoede | assets/audio/character-samples/tori.wav | 5.68초 |
| speech (2).wav | 나비 / Gacrux | assets/audio/character-samples/nabi.wav | 5.92초 |
| speech (3).wav | 보리 / Charon | assets/audio/character-samples/bori.wav | 6.64초 |

원본 그대로 복사했으며 기존 음원은 삭제하지 않았다. CharacterVoice.playRecording으로 연결하고 기존 캐릭터 인사 버튼과 선생님 테스트에서 사용한다. 임의 활동 문장에는 녹음 파일을 대신 재생하지 않는다. 테스트 화면에서 첨부 녹음과 새 문장 TTS 버튼을 분리했다.

검증: 네 WAV 브라우저 디코딩/길이 확인, 중복 클릭 Promise 공유, 다른 캐릭터 재생 시 취소, 정지 취소, 콘솔 오류 없음. 기존 voice 회귀 테스트 통과. 실제 사람이 청취한 음질 검증은 수행하지 않았다.

## 새 문장 TTS 연결 절차
1. Google AI Studio에서 Gemini API 키를 만든다. https://ai.google.dev/gemini-api/docs/api-key
2. Vercel school 프로젝트 Settings → Environment Variables에 GEMINI_API_KEY를 서버용으로 저장한다. 키는 공개 JS, Git, 대화에 붙여넣지 않는다.
3. 서버 합성 API를 구현해 characterId에 따라 Achird/Aoede/Gacrux/Charon을 선택한다. Gemini의 audio 응답을 재생 가능한 WAV로 변환하고 공통 provider.synthesize에 연결한다.
4. 운영 환경 재배포 후 네 캐릭터 합성·재생을 확인한다. 환경변수만 넣는 것으로는 현재 코드에 TTS가 자동 연결되지 않는다.

공식 음성 API: https://ai.google.dev/gemini-api/docs/speech-generation
환경변수: https://vercel.com/docs/environment-variables/managing-environment-variables

이번 작업에서는 녹음 연결 및 TTS 절차 안내만 수행했다. 합성 서버 구현·인증·원격 배포는 수행하지 않았다.
