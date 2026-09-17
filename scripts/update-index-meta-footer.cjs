const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname, '../school-release/index.html'), 'utf8');

// 1. Add Open Graph meta tags
const ogMeta = `  <!-- 소셜 공유(Open Graph & Twitter) 메타태그 (카카오톡, 문자 링크 미리보기 최적화) -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="디지털 학교">
  <meta property="og:title" content="디지털 학교 - 어르신을 위한 따뜻한 AI 인지 돌봄">
  <meta property="og:description" content="콩이, 토리, 나비, 보리와 함께하는 즐거운 일상 인지 돌봄 및 디지털 배움 교실">
  <meta property="og:image" content="https://school-tau-pearl.vercel.app/assets/images/friend-kongi.png">
  <meta property="og:url" content="https://school-tau-pearl.vercel.app/">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="디지털 학교 - 어르신을 위한 따뜻한 AI 인지 돌봄">
  <meta name="twitter:description" content="콩이, 토리, 나비, 보리와 함께하는 즐거운 일상 인지 돌봄 및 디지털 배움 교실">
  <meta name="twitter:image" content="https://school-tau-pearl.vercel.app/assets/images/friend-kongi.png">
`;

html = html.replace('  <!-- 스타일시트 -->', ogMeta + '\n  <!-- 스타일시트 -->');

// 2. Add Site Footer & Privacy Policy Dialog
const footerAndModal = `
  <!-- =======================================================================
       사이트 하단 푸터 (Site Footer & Privacy Policy)
       ======================================================================= -->
  <footer class="site-footer" style="padding: 36px 20px; text-align: center; background: #FAF6F0; border-top: 1px solid #E8DFD5; margin-top: 60px;">
    <div style="max-width: 960px; margin: 0 auto; color: #73503D; font-size: 15px; line-height: 1.6;">
      <p style="font-weight: 700; margin-bottom: 8px;">🍊 디지털 학교 · 치매/경도인지장애 어르신 맞춤 인지 돌봄 플랫폼</p>
      <p style="margin-bottom: 12px; color: #8C6A58;">어르신의 존엄과 행복을 최우선으로 생각하는 따뜻한 AI 배움 교실입니다.</p>
      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-top: 12px;">
        <button type="button" id="btnOpenPrivacy" class="care-btn" style="min-height: 44px; min-width: 44px; font-size: 15px; padding: 8px 18px; background: #FFFFFF; border: 1px solid #D4C3B3; color: #5A4123; border-radius: 8px; cursor: pointer;" aria-label="개인정보처리방침 보기">
          🔒 개인정보처리방침
        </button>
        <button type="button" onclick="window.scrollTo({top:0, behavior:'smooth'})" class="care-btn" style="min-height: 44px; min-width: 44px; font-size: 15px; padding: 8px 18px; background: #FFFFFF; border: 1px solid #D4C3B3; color: #5A4123; border-radius: 8px; cursor: pointer;" aria-label="화면 상단으로 이동">
          ⬆️ 맨 위로 이동
        </button>
      </div>
    </div>
  </footer>

  <!-- 개인정보처리방침 모달 다이얼로그 -->
  <dialog id="privacyModal" class="care-dialog" style="max-width: 640px; width: 90%; border-radius: 16px; padding: 28px; border: 2px solid #E0D4C5; box-shadow: 0 12px 32px rgba(0,0,0,0.18);" aria-labelledby="privacyHeading">
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F0E6DA; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 id="privacyHeading" style="font-size: 22px; color: #4A3525; margin: 0;">🔒 개인정보처리방침 안내</h2>
      <button type="button" id="btnClosePrivacy" class="care-btn" style="min-height: 44px; min-width: 44px; font-size: 18px; background: transparent; border: none; cursor: pointer;" aria-label="개인정보처리방침 닫기">✕</button>
    </header>
    <div style="max-height: 60vh; overflow-y: auto; color: #4A3525; font-size: 16px; line-height: 1.7;">
      <h3 style="font-size: 17px; color: #E65100; margin-top: 12px;">1. 수집하는 개인정보 항목</h3>
      <p>디지털 학교는 어르신 맞춤형 인지 돌봄 및 사회복지사 돌봄 일지 작성을 위해 최소한의 정보를 다룹니다.</p>
      <ul>
        <li><strong>기본 정보:</strong> 어르신 성명(별칭), 생년월일, 장기요양 등급(선택)</li>
        <li><strong>활동 기록:</strong> 참여 수업명, 참여 일시, 소요 시간, 완료 여부</li>
        <li><strong>정서 및 케어 정보:</strong> 수업 후 선택한 기분 상태, 돌봄 필요 사항(도움 필요도)</li>
      </ul>

      <h3 style="font-size: 17px; color: #E65100; margin-top: 16px;">2. 개인정보의 이용 목적</h3>
      <ul>
        <li>어르신의 인지 상태 및 선호에 맞춘 일상 인지 훈련 수업 제공</li>
        <li>보호자 및 사회복지사용 돌봄 일지 및 주간/월간 케어 리포트 생성</li>
      </ul>

      <h3 style="font-size: 17px; color: #E65100; margin-top: 16px;">3. 보관 기간 및 관리</h3>
      <p>모든 데이터는 브라우저 로컬 저장소(LocalStorage) 및 기관의 안전한 환경에 저장되며, 서비스 이용 기간 동안 보관됩니다. 노인장기요양보험법 등 관계 법령에 따른 서식은 법정 보존 기간(5년) 동안 안전하게 관리됩니다.</p>

      <h3 style="font-size: 17px; color: #E65100; margin-top: 16px;">4. 이용자 및 보호자의 권리 (열람 및 삭제)</h3>
      <p>이용자 본인 또는 법정대리인(보호자)은 언제든지 기록된 개인정보 및 활동 이력의 열람, 정정, 삭제(초기화)를 요청할 수 있습니다.</p>
    </div>
    <footer style="margin-top: 24px; text-align: right; border-top: 1px solid #F0E6DA; padding-top: 16px;">
      <button type="button" id="btnConfirmPrivacy" class="care-btn btn-hero-primary" style="min-height: 44px; min-width: 100px; font-size: 16px; padding: 10px 24px;">
        확인했습니다
      </button>
    </footer>
  </dialog>
`;

const marker = '  <!-- =======================================================================\n       우측 하단 고정 바로가기 버튼';
if (html.includes(marker)) {
  html = html.replace(marker, footerAndModal + '\n' + marker);
} else {
  html = html.replace('  </aside>', '  </aside>\n' + footerAndModal);
}

fs.writeFileSync(path.join(__dirname, '../index.html'), html, 'utf8');
console.log('Successfully updated index.html with OpenGraph meta tags and Privacy Policy modal!');
