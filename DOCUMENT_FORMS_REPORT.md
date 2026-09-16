# 대상자 서류 양식 8종 구현 및 검증

- 선생님 공간의 관리자 설정 → 동의서·서류 양식 8종, 또는 대상자 작은 방 → 양식 작성·확인에서 이용합니다.
- 개인정보, 사진, 보호자, 프로그램 동의서와 장기요양인정서 제출·확인서, 개인별장기요양이용계획서 제출·설명 확인서, 기관 이용 계약서, 욕구사정 기록을 제공합니다.
- 기관 정보·보유기간·서명 확인·첨부파일을 대상자별로 보관합니다. 작성본은 이 브라우저에 저장되며 전체 기록 JSON 백업에 포함됩니다. 저장만으로 기존 동의 상태를 바꾸지 않습니다.
- 공단 발급 2종은 원본을 대체하지 않습니다. 발급 원본을 제출받아 대조하고 함께 보관해야 합니다. 공단 자동 전송 기능은 아닙니다.
- 계약 기간·비용·해지·환불 등은 기관의 실제 조건으로 작성해야 합니다. 욕구사정은 실제 면담·관찰 내용을 기록하며 점수나 진단을 자동 생성하지 않습니다.
- 8개 독립 HTML 양식: documents/consent0.html, consent3.html, consent1.html, consent2.html, recognition.html, careplan.html, contract.html, assessment.html. 다운로드 후 인쇄 / PDF 저장 가능.

## 검증
- tests/consent-rooms.cjs: 8종 저장, 첨부, 새로고침 유지, 기존 동의 상태 유지, 모바일 화면, JS 오류 없음.
- tests/document-templates.cjs: 8종 빈 양식, 공단 원본 구분, 모바일/데스크톱 가로 넘침 없음, 인쇄 버튼 숨김.
- tests/participant-archive.cjs: 대상자 격리, 체크 목록, 첨부 파일, 백업·복원, 중복 복원 방지 통과.

## 작성 참고
- [개인정보 보호법](https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1025128631)
- [장기요양기관 및 관련 법령 안내](https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=3&cciNo=2&cnpClsNo=1&csmSeq=2038&popMenu=ov)
- 기관에서 사용하는 기본 작성안이며 공단 공식 서식 또는 기관별 법률 검토를 대신하지 않습니다.

- **배포 완료 / 2026-09-16 14:40**: 소스 커밋 `3d15ee5` GitHub main 푸시 성공. Vercel `dpl_D5FXbGLM3DJ8WxeWfkx6qABjNvAb` READY. https://school-tau-pearl.vercel.app/ 에서 8종 HTML 양식 및 실행 파일 4개 HTTP 200·SHA-256 일치 확인.
