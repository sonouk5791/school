/* Lilac Village 16:9 Landscape Hotspots & Interactive Elements */
window.VillageLandscape = {
 mount(grid) {
  const layer = grid.querySelector('.village-landscape');
  if (!layer) return;

  layer.innerHTML = `
   <div class="village-art-canvas" aria-hidden="true">
     <!-- Central Lilac Shelter Hotspot -->
     <div class="village-rest" title="라일락 마을 쉼터">
       <div class="shelter-butterfly bf-yellow">🦋</div>
       <div class="shelter-butterfly bf-purple">🦋</div>
     </div>

     <!-- Bottom Left Vegetable Garden Hotspot -->
     <a href="our-home.html#garden" class="village-garden-hotspot" title="우리 텃밭 가꾸러 가기"></a>

     <!-- Right Stone Wall Sleeping Cat -->
     <div class="village-cat" title="돌담 위 낮잠 자는 고양이"></div>
   </div>
  `;
 }
};
