const { chromium } = require("playwright"),
  assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const p = await b.newPage(),
    errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.addInitScript(() => {
    localStorage.setItem("digital_school_muted", "true");
    localStorage.setItem(
      "school_character_voice_prefs_v1",
      JSON.stringify({ muted: true }),
    );
  });
  for (const [width, height] of [
    [1920, 1080],
    [1366, 768],
    [768, 1024],
    [390, 844],
  ]) {
    await p.setViewportSize({ width, height });
    await p.goto("http://localhost:8085/index.html", {
      waitUntil: "domcontentloaded",
    });
    if(await p.locator('#friendRooms').isVisible())await p.locator('#replayHomeGreeting').click();
    await p.waitForSelector("#homeGreetingPlay");
    assert.equal(await p.locator(".class-choice:visible").count(), 0);
    assert(!(await p.locator("#friendRooms").isVisible()));
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    await p.screenshot({ path: `tests/operations-home-${width}.png` });
    await p.locator("#skipHomeGreeting").click();
    await p.waitForSelector('#friendRooms:visible');
    assert(await p.locator(".home-friend-kongi").isVisible());
  }
  await p.goto("http://localhost:8085/daycare-class.html?session=am");
  await p.waitForSelector("[name=attendanceElder]");
  assert.equal(await p.locator("[name=attendanceElder]:checked").count(), 0);
  await p.locator("[name=attendanceElder]").first().check();
  await p.locator("#btnStartClass").click();
  assert(await p.locator("#card_greeting").isVisible());
  await p.locator("#nextPhase").click();
  await p.waitForSelector("iframe");
  await p.locator("#btnClassPause").click();
  await p.reload();
  await p.locator("#btnResumeYes").click();
  assert.equal(await p.locator("#btnClassPause").innerText(), "▶ 계속하기");
  await p.locator("#btnClassPause").click();
  await p.locator("#nextPhase").click();
  assert(await p.locator("#card_break").isVisible());
  await p.locator("#nextPhase").click();
  assert(await p.locator("#card_act2").isVisible());
  await p.locator("#nextPhase").click();
  await p.locator("#nextPhase").click();
  assert(await p.locator("#card_mood").isVisible());
  await p.locator("[name=participation]").selectOption("보통");
  await p.locator("[name=assistance]").selectOption("부분 도움");
  await p.locator("#saveAssessment").click();
  assert(await p.locator("#card_done").isVisible());
  const data = await p.evaluate(() => OperationsStore.get());
  assert.equal(data.participationRecords.length, 1);
  assert.equal(data.dailyReports[0].status, "pending");
  assert(!data.dailyReports[0].text.includes("적극 참여"));
  await p.goto("http://localhost:8085/index.html");
  await p.locator("#btnTeacherSpace").click();
  await p.locator("#inputTeacherPin").fill("test-password-9834");
  await p.locator("#btnSubmitTeacherPin").click();
  await p.waitForSelector(".operations-panel");
  assert(
    await p
      .getByRole("heading", { name: "오늘 수업", exact: true })
      .isVisible(),
  );
  await p.locator(".operations-menu>summary").click();
  await p.locator("[data-op=tab][data-tab=reports]").click();
  assert(await p.locator("[data-report]").isVisible());
  await p.screenshot({ path: "tests/operations-reports.png" });
  assert.deepEqual(errors, []);
  await b.close();
  console.log(
    "PASS 4 responsive homes, AM selection/activity/pause/reload/evaluation/draft/admin review E2E",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
