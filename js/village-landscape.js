/* Lilac Village Illustration Interactive Layout & Landscape */
window.VillageLandscape = {
 mount(grid) {
  const layer = grid.querySelector('.village-landscape');
  if (!layer) return;

  layer.innerHTML = `
   <div class="village-art-canvas" aria-hidden="true">
     <div class="village-bg-illustration"></div>
     
     <!-- Top-Left Village Sign Board -->
     <div class="village-header-sign">
       <div class="header-sign-inner">
         <span class="sign-title">라일락 마을</span>
         <span class="sign-sub">오늘도 좋은 하루에요 <span class="heart-pink">♡</span></span>
       </div>
     </div>

     <!-- Top-Left Standing Motto Board -->
     <div class="village-motto-board board-left">
       <div class="motto-inner">
         <span>함께하는</span>
         <span>건강한 하루</span>
         <span>더 행복한</span>
         <span>내일 <span class="heart-pink">♡</span></span>
       </div>
       <div class="motto-post post-left"></div>
       <div class="motto-post post-right"></div>
     </div>

     <!-- Top-Right Poetic Quote Banner -->
     <div class="village-quote-banner">
       <span class="quote-text">“좋은 사람들과, 즐거운 시간을 만드는 특별한 마을” <span class="heart-pink">♡</span></span>
     </div>

     <!-- Central Lilac Gazebo / Pergola Shelter -->
     <div class="village-rest">
       <div class="pergola-dome">
         <span class="pergola-lilac-vine vine-1">🪻</span>
         <span class="pergola-lilac-vine vine-2">🌸</span>
         <span class="pergola-lilac-vine vine-3">🪻</span>
         <span class="pergola-lilac-vine vine-4">🌸</span>
         <span class="pergola-lilac-vine vine-5">🪻</span>
       </div>
       <div class="pergola-roof-sign">
         <span class="pergola-sign-text">라일락 마을 쉼터</span>
       </div>
       <div class="pergola-interior">
         <div class="pergola-bench pergola-bench-left"></div>
         <div class="pergola-bench pergola-bench-right"></div>
       </div>
       <div class="pergola-bottom-sign">
         <span>라일락 마을 쉼터에서 잠시 쉬어가요 <span class="heart-pink">♡</span></span>
       </div>
       <!-- Fluttering Butterflies near Shelter -->
       <div class="shelter-butterfly bf-yellow">🦋</div>
       <div class="shelter-butterfly bf-purple">🦋</div>
     </div>

     <!-- Bottom Left Vegetable Garden Link Area -->
     <a href="our-home.html#garden" class="village-garden-sign" title="우리 텃밭 가꾸러 가기">
       <div class="garden-sign-post"></div>
       <div class="garden-sign-board">우리 텃밭</div>
       <div class="garden-watering-can">🪴 💧</div>
     </a>

     <!-- Bottom Center Friendship Board -->
     <div class="village-motto-board board-bottom">
       <div class="motto-inner">
         <span>좋은 친구</span>
         <span>좋은 시간</span>
         <span>행복한 우리 <span class="heart-pink">♡</span></span>
       </div>
       <div class="motto-post post-left"></div>
       <div class="motto-post post-right"></div>
     </div>

     <!-- Right Stone Wall Sleeping Cat -->
     <div class="village-cat" title="돌담 위 낮잠 자는 고양이">
       <span class="cat-emoji">🐱💤</span>
     </div>
   </div>
  `;

  // Draw dynamic alignment if necessary
  function align() {
    const box = grid.getBoundingClientRect();
    if (!box.width || !box.height) return;
  }

  const observer = new ResizeObserver(align);
  observer.observe(grid);
  align();
 }
};
