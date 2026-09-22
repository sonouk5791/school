# 캐릭터 고정 음성 설정

## 사용자 지정 매핑 (2026-09-22)

- 콩이: Achird
- 토리: Aoede
- 나비: Gacrux
- 보리: Charon

`js/character-voice-system.js`의 읽기 전용 `characterVoices`를 기준으로 프로필의 voiceId와 외부 provider 기본 voiceIds를 공유합니다. 선생님 테스트 화면은 지정 음성과 현재 실제 사용하는 음성을 구분합니다.

이 이름들은 Gemini TTS 음성 이름입니다. 브라우저 SpeechSynthesis의 voiceURI로 대입하면 작동하지 않습니다. 공식 문서: https://ai.google.dev/gemini-api/docs/speech-generation

## 현재 연결 상태

공통 함수 speakAsCharacter는 주요 페이지에 연결되어 있습니다. 현재 실제 엔진은 browser provider이며, 확인한 Edge의 한국어 음성은 Heami 1개입니다. 위 네 음성의 실제 생성·재생은 아직 연결되지 않았습니다. 기존 Typecast 인증 정보는 Gemini 인증에 사용할 수 없습니다. 로컬 환경에 Gemini용 키는 확인되지 않았습니다.

## 외부 provider 연결 계약

```js
CharacterVoice.configure({
  // voiceIds 생략 시 위의 사용자 지정 매핑 사용
  synthesize: async ({characterId, voiceId, text, speed, style, signal}) => {
    // 서버의 TTS 엔드포인트에서 합성한 audio Blob 반환
  }
});
```

합성 서버 및 운영 환경의 인증 설정이 필요합니다. 비밀키는 브라우저 코드나 Git에 넣지 않습니다. 실제 합성·청취 검사 전에는 음성 적용 완료로 표시하지 않습니다.

현재 매핑 저장 변경은 기능/캐릭터 이미지/활동 기록을 변경하지 않습니다.
