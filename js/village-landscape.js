/* Lilac Village Walk Map Landscape & Curved Footpaths */
window.VillageLandscape = {
 mount(grid) {
  const layer = grid.querySelector('.village-landscape');
  if (!layer) return;

  layer.innerHTML = `
   <svg class="village-nature" viewBox="0 0 1200 700" preserveAspectRatio="none" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient id="lilacSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#edf4ff" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#fff9ec" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#eaf3db" stop-opacity="0.7"/>
      </linearGradient>
      <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#dfebd0"/>
        <stop offset="100%" stop-color="#d1e3bd"/>
      </linearGradient>
      <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e3ebd5"/>
        <stop offset="100%" stop-color="#d6e6c4"/>
      </linearGradient>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff8db" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#fffae8" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="lilacFlowerGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#e2c8f7"/>
        <stop offset="70%" stop-color="#c6a3ea"/>
        <stop offset="100%" stop-color="#a478d4"/>
      </radialGradient>
    </defs>
    <!-- Background Sky -->
    <rect width="1200" height="700" fill="url(#lilacSkyGrad)" />
    <!-- Distant Forest & Gentle Hills -->
    <path d="M0 130 Q180 40 390 100 T820 90 T1200 120 V700 H0Z" fill="url(#hillGrad1)" opacity=".75"/>
    <path d="M0 380 Q210 320 460 390 T900 370 T1200 340 V700 H0Z" fill="url(#hillGrad2)" opacity=".55"/>
    <path d="M0 580 Q280 520 560 565 T1200 535 V700 H0Z" fill="#cfdfb5" opacity=".45"/>
    <!-- Distant Soft Trees / Forest Canopy -->
    <g fill="#abc693" opacity=".6">
      <ellipse cx="80" cy="95" rx="35" ry="20"/>
      <ellipse cx="125" cy="85" rx="42" ry="24"/>
      <ellipse cx="170" cy="100" rx="30" ry="18"/>
      <ellipse cx="980" cy="80" rx="40" ry="22"/>
      <ellipse cx="1030" cy="70" rx="48" ry="26"/>
      <ellipse cx="1085" cy="85" rx="36" ry="20"/>
    </g>
    <!-- Soft Sunlight & Clouds -->
    <circle cx="1040" cy="80" r="110" fill="url(#sunGlow)"/>
    <g fill="#ffffff" opacity=".75">
      <ellipse cx="210" cy="45" rx="75" ry="16"/>
      <ellipse cx="240" cy="38" rx="50" ry="20"/>
      <ellipse cx="880" cy="40" rx="90" ry="18"/>
      <ellipse cx="850" cy="34" rx="60" ry="22"/>
    </g>
    <!-- Lilac Wild Flower Clusters in Landscape -->
    <g fill="url(#lilacFlowerGrad)">
      <circle cx="95" cy="270" r="8"/>
      <circle cx="108" cy="265" r="7"/>
      <circle cx="102" cy="278" r="7.5"/>
      <circle cx="1120" cy="250" r="8"/>
      <circle cx="1135" cy="245" r="7"/>
      <circle cx="1128" cy="258" r="7.5"/>
      <circle cx="120" cy="520" r="8.5"/>
      <circle cx="134" cy="514" r="7"/>
      <circle cx="1080" cy="540" r="8.5"/>
      <circle cx="1095" cy="535" r="7"/>
    </g>
   </svg>

   <!-- Dynamic Curved Footpaths linking Shelter to 4 Houses -->
   <svg class="village-paths" focusable="false" aria-hidden="true"></svg>

   <!-- Central Lilac Village Shelter Plaza -->
   <div class="village-rest">
     <div class="rest-plaza-bg"></div>
     <div class="rest-lawn"></div>
     <div class="rest-lilac-cluster" title="라일락 꽃밭">
       <span class="lilac-petal lp-1">🌸</span>
       <span class="lilac-petal lp-2">🪻</span>
       <span class="lilac-petal lp-3">🌸</span>
     </div>
     <div class="rest-tree" title="쉼터 그늘 나무"></div>
     <div class="rest-tree rest-tree-small"></div>
     <div class="rest-bench" title="쉼터 나무 벤치">
       <span class="bench-slat"></span>
     </div>
     <div class="rest-lamp-post" title="마을 따뜻한 가로등">🏮</div>
     <div class="rest-sign-board">
       <div class="rest-sign-post"></div>
       <div class="rest-sign">라일락 마을 쉼터</div>
     </div>
     <div class="rest-quote" role="note">“라일락 마을 쉼터에서 잠시 쉬어가요”</div>
   </div>

   <!-- Village Decor: Shrubs, Flowerbeds, Street Signs & Lamp Posts -->
   <div class="village-shrub shrub-north" title="초록 덤불"></div>
   <div class="village-shrub shrub-east" title="초록 덤불"></div>
   <div class="village-shrub shrub-west" title="초록 덤불"></div>
   <div class="village-flowerbed flowers-north" title="향기로운 라일락 화단"></div>
   <div class="village-flowerbed flowers-south" title="알록달록 꽃밭"></div>
   <div class="village-lantern lantern-left" title="마을 등불">🏮</div>
   <div class="village-lantern lantern-right" title="마을 등불">🏮</div>
  `;

  const paths = layer.querySelector('.village-paths');
  const rest = layer.querySelector('.village-rest');

  function draw() {
    const box = grid.getBoundingClientRect();
    if (!box.width || !box.height) return;

    const cards = [...grid.querySelectorAll('.home-friend')];
    const scenes = cards.map(c => c.querySelector('.village-scene')?.getBoundingClientRect());
    if (scenes.length !== 4 || scenes.some(s => !s)) return;

    const mobile = matchMedia('(max-width: 680px)').matches;
    const w = box.width;
    const h = box.height;
    paths.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const centerX = w * 0.5;
    // Compute center Y based on cards
    const topRowBottom = Math.max(cards[0].getBoundingClientRect().bottom, cards[1].getBoundingClientRect().bottom);
    const bottomRowTop = Math.min(cards[2].getBoundingClientRect().top, cards[3].getBoundingClientRect().top);
    const centerY = (topRowBottom + bottomRowTop) / 2 - box.top;

    const routes = [];

    if (mobile) {
      // Mobile vertical walking trail
      rest.style.left = `${Math.max(10, centerX - 130)}px`;
      rest.style.top = '10px';

      // Main central curvy avenue
      routes.push({
        d: `M ${centerX} 120 C ${centerX - 35} ${h * 0.3} ${centerX + 35} ${h * 0.55} ${centerX - 20} ${h * 0.8} S ${centerX + 15} ${h * 0.95} ${centerX} ${h}`,
        width: 26
      });

      // Connections to each house
      scenes.forEach((s, i) => {
        const hx = s.left - box.left + s.width * 0.5;
        const hy = s.bottom - box.top - 10;
        const side = i % 2 === 0 ? -1 : 1;
        routes.push({
          d: `M ${centerX} ${hy - 25} Q ${centerX + side * 45} ${hy - 5} ${hx} ${hy}`,
          width: 20
        });
      });
    } else {
      // Desktop & Tablet Organic Plaza Layout
      // Position central shelter right in the open meadow between houses
      rest.style.left = `${centerX - 135}px`;
      rest.style.top = `${centerY - 75}px`;

      // Main winding village boulevard from bottom to top passing through shelter plaza
      routes.push({
        d: `M ${centerX - 30} ${h + 20} C ${centerX + 60} ${h * 0.82} ${centerX - 50} ${centerY + 85} ${centerX} ${centerY} S ${centerX + 40} ${h * 0.18} ${centerX - 15} -20`,
        width: 38
      });

      // 4 Organic Curved Paths branching from Central Shelter to each Character House
      scenes.forEach((s, i) => {
        const hx = s.left - box.left + s.width * 0.55;
        const hy = s.bottom - box.top - 12;

        // Custom curve inflection for each quadrant to feel like a real village stroll
        let cp1x, cp1y, cp2x, cp2y;
        if (i === 0) {
          // Top-Left: Kongi (Exercise House)
          cp1x = centerX - 80;
          cp1y = centerY - 25;
          cp2x = hx + 50;
          cp2y = hy + 40;
        } else if (i === 1) {
          // Top-Right: Tori (Play House)
          cp1x = centerX + 85;
          cp1y = centerY - 30;
          cp2x = hx - 45;
          cp2y = hy + 45;
        } else if (i === 2) {
          // Bottom-Left: Nabi (Study House)
          cp1x = centerX - 75;
          cp1y = centerY + 35;
          cp2x = hx + 40;
          cp2y = hy - 35;
        } else {
          // Bottom-Right: Bori (Hobby House)
          cp1x = centerX + 80;
          cp1y = centerY + 30;
          cp2x = hx - 45;
          cp2y = hy - 30;
        }

        routes.push({
          d: `M ${centerX} ${centerY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${hx} ${hy}`,
          width: i % 2 === 0 ? 32 : 30
        });
      });
    }

    // Render 2 layers of paths: outer earth border + inner warm stone paving
    paths.innerHTML = routes.map(r => `
      <path d="${r.d}" fill="none" stroke="#cfbe98" stroke-width="${r.width + 6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      <path d="${r.d}" fill="none" stroke="#f6e8cc" stroke-width="${r.width}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${r.d}" fill="none" stroke="#fff8ea" stroke-width="${r.width * 0.4}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="12 18" opacity="0.6"/>
    `).join('');
  }

  const observer = new ResizeObserver(draw);
  observer.observe(grid);
  grid.querySelectorAll('.village-scene').forEach(s => observer.observe(s));
  // Initial draw
  draw();
  // Ensure layout settles after images/fonts load
  setTimeout(draw, 150);
 }
};
