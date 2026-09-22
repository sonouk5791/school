# 캐릭터 고정 음성 연결 — 설정 대기

2026-09-22 기존 로컬 TYPECAST_API_KEY로 최신 Typecast 음성 목록 API를 조회했으나 401 인증 오류가 반환되었습니다. 실제 성인 음성 네 개를 확인하거나 합성하지 못했습니다.

## 준비된 공통 구조

`js/character-voice-system.js`는 `speakAsCharacter(characterId, text)`와 `CharacterVoice`를 제공합니다. 속도는 콩이 0.94, 토리 0.98, 나비 0.91, 보리 0.89입니다. 나비 질문 뒤에는 1.8초의 대기 시간을 적용합니다. 기기 기본 음성이나 pitch 변경으로 대체하지 않습니다.

provider는 `voiceIds`에 서로 다른 고정 ID 네 개와 `synthesize({characterId,voiceId,text,speed,style,signal})` 함수를 제공해야 합니다. 함수는 audio MIME type의 Blob을 반환합니다. 키와 인증 요청은 서버에서 관리해야 합니다. 스타일 문자열은 provider가 지원하는 필드로 변환해야 하며 문자열만으로 자연스러운 억양이 보장되지는 않습니다.

동일 문장 재클릭은 진행 중 Promise를 반환합니다. 새 문장은 이전 네트워크 요청과 재생을 취소합니다. 페이지 종료/숨김 시 중단하며 음소거와 느리게 듣기 선택을 localStorage로 유지합니다. `CharacterVoice.mount(element)`로 세 개의 큰 제어 버튼을 생성할 수 있습니다.

## 아직 완료되지 않은 작업

- 유효한 TTS 자격증명과 성인 한국어 남성/중성 1개, 여성 2개, 남성 1개 선정
- 실제 합성 샘플 청취 및 프로필 확정
- 서버 provider 구현과 운영 환경변수 설정
- 각 페이지의 기존 TTS/녹음/재생 완료 콜백/립싱크와 공통 재생 함수 연결
- 모든 음원 간 중복 재생 및 실제 기기에서 재생 검증

현재 모듈은 준비 파일이며 실제 페이지에 연결하지 않았습니다. 기존 기능을 서비스 미설정 상태의 무음으로 교체하지 않았습니다. 고정 음성 적용이 완료된 것으로 간주하면 안 됩니다.

공식 API: https://typecast.ai/developers/api
