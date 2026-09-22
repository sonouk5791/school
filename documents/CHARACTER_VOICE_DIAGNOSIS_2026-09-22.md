# 캐릭터 음성 분리 진단 및 수정 — 2026-09-22

## 원인
- 기존 VoiceManager는 모든 캐릭터에서 femaleVoice를 먼저 반환했다.
- 토리·나비 방은 첫 한국어 voice, 보리·체조·집 꾸미기는 여성/기본 한국어 음성을 별도로 선택했다.
- 캐릭터 프로필의 이름·pitch·속도는 서로 다른 실제 voiceURI 배정을 보장하지 않았다.

## 적용
- 공통 CharacterVoice / speakAsCharacter 연결: 메인, 세 활동방, 콩이 체조, 집 꾸미기 및 기존 캐릭터 안내 호출.
- browser provider는 한국어 voiceURI를 중복 없이 저장한다. voiceschanged 및 초기 로딩 대기 후 검색한다.
- 알려진 이름으로 우선 배정하며 성별 메타데이터가 없는 미확인 음성은 선생님 테스트에서 직접 선택한다.
- 음성 부족 시 기본 여성 음성으로 대체하지 않고 미배정 안내를 표시한다. pitch는 1로 고정한다.
- 기존 External TTS configure({voiceIds,synthesize}) 인터페이스 유지: 서로 다른 ID 4개 검증. synthesize는 서버를 통해 audio Blob을 반환해야 하며 API 비밀키를 브라우저에 넣으면 안 된다.
- 새 음성은 기존 음성을 취소한다. 같은 문장 연속 요청은 진행 중 Promise를 공유한다.
- 선생님 공간 → character-voice-test.html에서 테스트 문장, 현재 voiceURI/voiceId, 언어, 실제 음성 목록 및 콘솔 출력 확인.
- 기존 캐릭터 이미지, 활동 문제, 기록·도장·저장 데이터와 URL 보존.

## 실제 장치 확인
자동화된 Microsoft Edge의 Web Speech getVoices 결과: ko-KR 1개.
Microsoft Heami - Korean (Korean), localService=true, default=true.

| 캐릭터 | 실제 배정 |
|---|---|
| 콩이 | 미배정: 별도 남성/중성 음성 필요 |
| 토리 | Microsoft Heami - Korean (Korean) |
| 나비 | 미배정: 별도 여성 음성 필요 |
| 보리 | 미배정: 별도 남성 음성 필요 |

다른 브라우저/기기의 목록은 다를 수 있다. 선생님 테스트 화면이 그 브라우저의 실제 상태를 표시한다.
4명의 실제 서로 다른 목소리 제공은 현재 장치만으로 완료되지 않았다. 외부 TTS는 정상 인증과 실제 고정 ID 4개가 준비되어야 연결할 수 있다.

## 검증
- node tests/character-voices.cjs: 1/2/4개 음성, fallback 금지, URI 유지, 중복 클릭, 취소, 중복 배정 거부 통과.
- 변경 JavaScript 문법 검사 통과.
- HTML/정적 JavaScript 프로젝트로 package.json 기반 build/lint 명령 없음.
