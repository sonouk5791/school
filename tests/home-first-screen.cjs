const assert = require('node:assert/strict');
const {chromium} = require('playwright');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:8085';
    await page.goto(origin);
    await page.waitForSelector('body.character-home.simple-header');
    await page.waitForTimeout(1500);
    assert.equal(await page.evaluate(() => window.voiceRecognizer.isRunning),false,'no automatic microphone on home');
    const links = ['senior-exercise.html','tori-play.html','nabi-learn.html','bori-hobby.html'];
    assert.deepEqual(await page.locator('.home-friend').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), links);
    for (const width of [1440,768,390,320]) {
      await page.setViewportSize({width,height:1000});
      assert.equal(await page.locator('.home-friend:visible').count(),4);
      assert.equal(await page.locator('.header-actions button:visible').count(),5);
      for (const selector of ['#seniorActivitiesSection','#dailyRecommendSection','#characterDoors','#lessons','#morningLauncher','.warmup-intro']) {
        assert.equal(await page.locator(selector).isVisible(),false,selector);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow '+width);
      await page.screenshot({path:`tests/home-first-screen-${width}.png`,fullPage:true});
    }
    assert.equal(await page.locator('.home-start-activity').getAttribute('href'),'daily-course.html');
    await page.locator('#homeMoreOptions>summary').click();
    await page.locator('#btnViewSettings').click();
    assert(await page.locator('#viewSettingsPanel').isVisible());
    await page.locator('.view-close').click();
    assert.equal(await page.locator('#homeMoreOptions a').getAttribute('href'),'character-house.html');
    await page.locator('#homeMoreOptions [data-senior-page="activities"]').click();
    assert(await page.locator('#homeCatalogTools').isVisible());
    assert(await page.locator('#btnTtsToggle').isVisible(),'tools available away from home');
    assert.equal(await page.locator('#aiCoursesGrid').isVisible(),false);
    await page.getByText('디지털 배우기',{exact:true}).click();
    assert(await page.locator('#aiCoursesGrid').isVisible());
    assert.equal(await page.locator('#aiCoursesGrid [data-lesson-id]').count(),6);
    await page.locator('#aiCoursesGrid [data-lesson-id="ai_basic"]').click();
    await page.waitForSelector('#lessonViewport.active');
    await page.evaluate(() => LessonEngine.exitLesson());
    await page.locator('.brand-logo').click();
    await page.locator('#homeQuickLinks>[data-senior-page="history"]').click();
    assert(await page.locator('.senior-history').isVisible());
    await page.locator('.brand-logo').click();
    await page.locator('#btnTeacherSpace').click();
    assert.equal(await page.locator('body').getAttribute('data-senior-page'),'staff');
    await page.locator('.brand-logo').click();
    assert(await page.locator('.character-home-hero').isVisible());
    assert.deepEqual(errors,[]);
    console.log('PASS: 4 viewport sizes, preserved links, folded duplicate sections, settings, digital lessons, history, staff/home navigation, no JS errors');
  } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exitCode=1;});
