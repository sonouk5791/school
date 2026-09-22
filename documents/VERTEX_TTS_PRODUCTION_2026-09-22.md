# Vertex AI Gemini TTS Production 진단 — 2026-09-22

## 원인과 기존 방식
- 변경 전 Production POST /api/tts: 404 NOT_FOUND.
- 저장소에 api/tts 또는 Google SDK가 없었다. server.cjs의 로컬 /api/tts/typecast 및 browser SpeechSynthesis 경로만 존재했다.
- Achird/Aoede/Gacrux/Charon은 프론트 설정만 있었고 Google 합성 요청은 연결되지 않았다.
- Vercel school Production 환경변수 목록은 0개였다. 로컬에도 Google 인증 설정이 확인되지 않았다.
- 따라서 classic SDK 혼용이 발견된 것이 아니라 서버/인증 부재가 직접 원인이다. 공식 문서는 Cloud TTS와 Vertex 양쪽 Gemini 지원을 명시하므로 SDK 이름만으로 잘못된 API라고 단정하지 않는다.

## 수정 구조
POST /api/tts → Vercel Node Function api/tts.js → OAuth 서비스 계정 인증 → Vertex REST generateContent → PCM 24kHz/16-bit/mono → WAV → Blob/Object URL → Audio.
Google SDK 의존성 없음. Node crypto/fetch를 사용하며 OAuth 토큰은 서버 메모리에서만 캐시한다.
모델: gemini-3.1-flash-tts-preview
Endpoint: https://aiplatform.googleapis.com/v1beta1/projects/{project}/locations/{location}/publishers/google/models/gemini-3.1-flash-tts-preview:generateContent
speech_config.language_code, voice_config.prebuilt_voice_config.voice_name을 서버에서 구성한다.
서버 매핑: kongi Achird, tori Aoede, nabi Gacrux, bori Charon; 모두 ko-KR.
브라우저는 characterId/text만 전송한다. 전달된 voice 값은 사용하지 않는다.

## 환경변수
최종 Production은 아래 OIDC 설정을 사용한다. 서비스 계정 JSON 키는 조직 정책으로 생성되지 않았으며 불필요하다.
- GOOGLE_CLOUD_PROJECT: project-433739f7-afa3-44cc-a64
- GOOGLE_WORKLOAD_IDENTITY_PROVIDER: projects/477210085621/locations/global/workloadIdentityPools/school-vercel/providers/vercel
- GOOGLE_SERVICE_ACCOUNT_EMAIL: school-vertex-tts@project-433739f7-afa3-44cc-a64.iam.gserviceaccount.com
- Vercel OIDC: enabled=true, issuerMode=team. 런타임 x-vercel-oidc-token 사용.
- Google STS 토큰 교환 → IAM Credentials generateAccessToken → Vertex generateContent.
- issuer https://oidc.vercel.com/sonouk5791s-projects, audience https://vercel.com/sonouk5791s-projects.
- google.subject=assertion.sub; 조건은 owner:sonouk5791s-projects:project:school:environment:production과 정확히 일치.
- 해당 Production 주체만 서비스 계정의 roles/iam.workloadIdentityUser를 가진다. 계정은 프로젝트 roles/aiplatform.user를 사용한다.
- iam.disableServiceAccountKeyCreation 정책을 변경하지 않았다.

아래 JSON 방식은 이전 준비 구성으로, 대체 경로 지원만 유지한다:
Vercel school → Settings → Environment Variables → Production:
- GOOGLE_CLOUD_PROJECT: Google Cloud 프로젝트 ID
- GOOGLE_SERVICE_ACCOUNT_JSON: type=service_account, client_email, private_key가 포함된 서비스 계정 JSON 전체. 서버 전용이며 공개 prefix를 붙이지 않는다.
- GOOGLE_CLOUD_LOCATION: 선택, 기본 us-central1
Gemini Developer API의 GEMINI_API_KEY나 Typecast 키는 이 Vertex 서비스 계정 경로의 인증에 사용하지 않는다.
설정 후 재배포 필요.

## Google 프로젝트 설정
- 결제 연결, aiplatform.googleapis.com 활성화.
- 서비스 계정에 대상 프로젝트의 roles/aiplatform.user (aiplatform.endpoints.predict).
- quota project 사용 권한 오류 발생 시 serviceusage.services.use 권한(roles/serviceusage.serviceUsageConsumer) 확인.
- private key/credential은 클라이언트·Git에 넣지 않는다.
- 401/403 등 Google status/message는 서버 로그에 기록한다. 환경변수 누락은 503 TTS_NOT_CONFIGURED로 요청 전 차단한다.

## Fallback 및 재생
Google 합성/인증 오류에서만 'Google TTS failed - browser fallback used' 로그를 남기고 이미 배정된 고유 브라우저 음성이 있을 때 사용한다. 환경변수 누락·재생 실패에는 fallback하지 않는다. 브라우저 음성도 없으면 실패 안내. 녹음은 별도 버튼이며 TTS 성공으로 표시하지 않는다.

## Production 실제 결과
최종 OIDC 배포: https://school-o2o338q5g-sonouk5791s-projects.vercel.app (READY)
- 운영 /api/tts GET 200 configured=true.
- kongi: 200 Achird, WAV 193964 bytes, 24000Hz.
- tori: 200 Aoede, WAV 209324 bytes, 24000Hz.
- nabi: 200 Gacrux, WAV 186284 bytes, 24000Hz.
- bori: 200 Charon, WAV 203564 bytes, 24000Hz.
- 실제 Google 합성 4/4 성공. Browser fallback이 아닌 Vertex 음성 응답.

인증 설정 전 진단 이력:
배포 READY: https://school-ka55z6m7s-sonouk5791s-projects.vercel.app
운영 별칭: https://school-tau-pearl.vercel.app
- GET /api/tts: 200, provider vertex-ai, configured=false, 지정 모델·4개 음성 정상 표시.
- POST kongi/tori/nabi/bori: 모두 503 TTS_NOT_CONFIGURED.
- 누락: GOOGLE_CLOUD_PROJECT, GOOGLE_SERVICE_ACCOUNT_JSON.
- 실제 Google 호출/네 음성 합성·청취는 인증 부재로 검증되지 않음. 음성 완전 복구 완료가 아님.

## 검증
- tests/vertex-tts.cjs: 환경변수 누락, 실제 endpoint/payload 구성, 캐릭터별 매핑, PCM/WAV, 잘못된 입력, Google403, 오디오 누락/MIME 오류.
- tests/vertex-tts-browser.cjs: 4개 POST ID, voice 미전송, 모의 WAV 브라우저 재생 완료, 설정 누락 fallback 금지.
- tests/character-voices.cjs: fallback URI 중복 금지/새로고침 유지/default Vertex.
- Vercel Production build 완료. 실제 Production API 테스트는 위 실패 원인 그대로 기록.

## 사용자가 보낸 ADC 명령
https://storage.googleapis.com/cloud-samples-data/adc/setup_adc.sh 내용을 읽어서 확인했다. Linux/macOS용 gcloud 설치/로컬 사용자 ADC 로그인/프로젝트 설정/텍스트 Gemini 테스트 스크립트다. Windows에는 bash/gcloud가 발견되지 않아 실행하지 않았다. 이 스크립트 자체가 Vercel 환경변수나 서비스 계정 권한을 설정하지는 않는다.

공식 문서: https://docs.cloud.google.com/text-to-speech/docs/gemini-tts

## 최종 브라우저 확인
운영 character-voice-test.html에서 네 캐릭터 각각 Google 음성 재생 완료 표시 확인. 콘솔 오류 없음. 기존 저장된 음소거 설정은 홈의 소리 켜기로 해제 후 검증. 음색의 주관적 자연스러움/선호도는 사용자가 테스트 페이지에서 확인 가능.

