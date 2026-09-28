const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://localhost:8085';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}});
 await page.addInitScript(()=>localStorage.setItem('digital_school_muted','true'));
 await page.goto(base+'/daycare-class.html?session=am');
 await page.locator('[name=attendanceElder]').first().check();await page.locator('#btnStartClass').click();await page.locator('#nextPhase').click();
 await page.waitForFunction(()=>{const f=document.querySelector('.activity-frame');return f?.contentDocument?.querySelector('#btnStart')&&parseFloat(f.style.height)>560;});
 const activity=page.frameLocator('.activity-frame');
 await activity.locator('#btnStart').click();
 await activity.locator('#viewPlaying').waitFor({state:'visible'});
 await page.waitForFunction(()=>{const f=document.querySelector('.activity-frame');return f.contentDocument.documentElement.scrollHeight<=f.clientHeight;});
 const sizes=await page.evaluate(()=>{const f=document.querySelector('.activity-frame'),h=document.querySelector('#act1Content');return {frame:f.clientWidth,host:h.clientWidth,inner:f.contentWindow.innerWidth,scroll:f.contentDocument.documentElement.scrollHeight,height:f.clientHeight,overflow:document.documentElement.scrollWidth>innerWidth+1};});
 assert(sizes.frame>=sizes.host-2,JSON.stringify(sizes));assert.equal(sizes.overflow,false);if(width>=1366)assert(sizes.inner>900,JSON.stringify(sizes));
 assert(sizes.scroll<=sizes.height,JSON.stringify(sizes));
 await page.screenshot({path:`tests/class-frame-${width}.png`,fullPage:true});console.log(width,sizes);await page.close();
}console.log('PASS desktop/tablet/mobile activity width and no nested vertical scrollbar');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
