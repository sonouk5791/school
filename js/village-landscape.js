/* Decorative only: paths follow existing house positions without changing links or state. */
window.VillageLandscape = {
 mount(grid) {
  const layer=grid.querySelector('.village-landscape');
  layer.innerHTML=`<svg class="village-nature" viewBox="0 0 1200 600" preserveAspectRatio="none" focusable="false">
   <path d="M0 95 Q170 10 365 70 T770 60 T1200 90 V600 H0Z" fill="#e3ebce" opacity=".65"/>
   <path d="M0 405 Q170 340 400 423 T830 435 T1200 375 V600 H0Z" fill="#dce7c5" opacity=".45"/>
   <path d="M0 575 Q255 520 515 560 T1200 535 V600 H0Z" fill="#cfdfb5" opacity=".4"/>
   <g fill="#fffdf1" opacity=".7"><ellipse cx="154" cy="27" rx="90" ry="18"/><ellipse cx="1050" cy="32" rx="110" ry="20"/></g>
  </svg><svg class="village-paths" focusable="false"></svg>
  <div class="village-rest"><span class="rest-lawn"></span><span class="rest-tree"></span><span class="rest-tree rest-tree-small"></span><span class="rest-bench"></span><span class="rest-flowers"></span><span class="rest-sign"></span></div>
  <span class="village-shrub shrub-north"></span><span class="village-shrub shrub-east"></span><span class="village-shrub shrub-west"></span><span class="village-flowerbed flowers-north"></span><span class="village-flowerbed flowers-south"></span>`;
  layer.querySelector('.rest-sign').textContent='작은 쉼터';
  const paths=layer.querySelector('.village-paths'),rest=layer.querySelector('.village-rest');
  function draw(){
   const box=grid.getBoundingClientRect();if(!box.width||!box.height)return;
   const cards=[...grid.querySelectorAll('.home-friend')],scenes=cards.map(c=>c.querySelector('.village-scene').getBoundingClientRect());
   if(scenes.length!==4)return;
   const mobile=matchMedia('(max-width:600px)').matches,w=box.width,h=box.height;
   paths.setAttribute('viewBox',`0 0 ${w} ${h}`);
   const center=w*.5,mid=(cards[0].getBoundingClientRect().bottom+cards[2].getBoundingClientRect().top)/2-box.top;
   const routes=[];
   if(mobile){
    routes.push({d:`M28 0 C8 ${h*.22} 42 ${h*.35} 26 ${h*.5} S10 ${h*.8} 30 ${h}`,width:24});
    scenes.forEach(s=>{const x=s.left-box.left+s.width*.55,y=s.bottom-box.top-6;routes.push({d:`M26 ${y} C28 ${y-22} ${x-65} ${y+6} ${x} ${y}`,width:19});});
   }else{
    routes.push({d:`M${center-25} ${h+10} C${center+55} ${h*.82} ${center-45} ${mid+70} ${center} ${mid} S${center+28} ${h*.17} ${center-8} -10`,width:31});
    scenes.forEach((s,i)=>{
     const x=s.left-box.left+s.width*.55,y=s.bottom-box.top-8;
     const bend=i<2?mid:Math.min(h-10,y+35);
     routes.push({d:`M${center} ${i<2?mid:h-7} C${center+(i%2?55:-65)} ${bend+12} ${x-18} ${bend+18} ${x} ${y}`,width:i%2?25:28});
    });
    rest.style.left=`${center-66}px`;rest.style.top=`${mid-48}px`;
   }
   paths.innerHTML=routes.map(r=>`<path d="${r.d}" fill="none" stroke="#d8c69e" stroke-width="${r.width+4}" stroke-linecap="round"/><path d="${r.d}" fill="none" stroke="#efe0bd" stroke-width="${r.width}" stroke-linecap="round"/>`).join('');
  }
  const observer=new ResizeObserver(draw);observer.observe(grid);grid.querySelectorAll('.village-scene').forEach(s=>observer.observe(s));draw();
 }
};
