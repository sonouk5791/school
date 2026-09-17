# 「흘러가는 옛 노래」 오디오 점검 및 수정

## 확인한 원인
- 프로젝트와 릴리즈에 MP3/WAV/OGG/M4A 등의 실제 노래 음원이 없음. public 폴더도 없으며 정적 루트 배포 구조임.
- 기존 레트로 플레이어에는 audio 요소와 파일 src가 없었음. 따라서 파일 확장자·경로 대소문자 불일치나 기존 audio volume/muted를 원인으로 볼 근거가 없음.
- 버튼은 KaraokeEngine.startKaraoke(0)을 호출했음. 현재 0번은 화면 제목의 고향의 봄과 다른 곡이며 파일 재생이 아닌 합성 반주임.
- 합성 음원은 VoiceManager.isMuted에 의해 소리가 생략될 수 있었으나 버튼과 LP는 실제 재생 확인 없이 재생 상태로 변경됨.
- 실제 파일이 없으므로 실음원 청취는 완료할 수 없음. 가짜 파일·경로·대체 합성 노래는 추가하지 않음.

## 변경
- 기존 카드·색상·캐릭터·LP·외부 YouTube 링크·반주 참여 버튼 유지. 재생 버튼 동작과 상태 안내만 보완.
- 실제 HTML audio를 사용하며 preload=none, 사용자 클릭에서만 play(). 음량 0과 muted 보정.
- playing/pause/waiting/ended/error 이벤트 기반 버튼·상태·LP 표시. 요청 실패를 잡아 안내하며 화면 이동 시 정지.
- 파일 미등록 또는 404: “준비된 노래 파일이 없습니다.” 및 명확한 console.error.
- 브라우저 재생 차단 및 디코딩 오류 구분. 오류 후 멈춤 이벤트가 오류 안내를 덮어쓰지 않도록 보완.
- 등록 위치: js/old-song-player.js의 OLD_SONG_AUDIO. 현재 빈 목록이며 실제 확인된 음원 경로만 hometown-spring 키에 등록할 것. UI상 준비 완료로 위장하지 않음.

## 검증
- 테스트에서만 메모리 WAV 응답을 사용했으며 프로젝트 음원으로 저장하지 않음.
- 미등록·재생/정지/이어서 재생·끝난 후 재시작·음량/음소거·단계 이동 정지·NotAllowedError·404 검사 통과. 미처리 JS 오류 없음.
- 실제 노래 녹음의 음질/청취는 파일 부재로 미검증.
- 운영 배포 미수행.

관련 파일: [재생 처리](file:///J:/sh/js/old-song-player.js), [기존 플레이어 연결](file:///J:/sh/js/lesson-engine.js), [오디오 검사](file:///J:/sh/tests/old-song-player.cjs).

- **최종 검증**: 오디오 오류/상태 테스트, 기존 오전 프로그램·체조·기억활동 연결 검사, Vercel 로컬 production build 모두 통과. 실음원 파일은 없음.

