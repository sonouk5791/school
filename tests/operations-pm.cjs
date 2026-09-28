const { chromium } = require("playwright"),
  assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true }),
    p = await b.newPage({ viewport: { width: 390, height: 844 } }),
    errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.addInitScript(() => {
    localStorage.setItem("digital_school_muted", "true");
    localStorage.setItem(
      "school_character_voice_prefs_v1",
      JSON.stringify({ muted: true }),
    );
  });
  await p.goto("http://localhost:8085/daycare-class.html?session=pm");
  await p.locator("[name=attendanceElder]").first().check();
  await p.locator("#btnStartClass").click();
  await p.locator("#nextPhase").click();
  await p
    .frameLocator("iframe")
    .locator(".extended-activity-panel:not([hidden])")
    .waitFor();
  assert.equal(
    await p.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
  );
  await p.screenshot({ path: "tests/operations-pm-390.png" });
  await p.locator("#nextPhase").click();
  await p.locator("#nextPhase").click();
  await p.frameLocator("iframe").locator("#panelSong").waitFor();
  await p.locator("#nextPhase").click();
  await p.locator("#nextPhase").click();
  await p.locator("#saveAssessment").click();
  assert.equal(
    await p.evaluate(
      () => OperationsStore.get().participationRecords[0].participation,
    ),
    "",
  );
  for (const file of ["tori-play.html", "nabi-learn.html", "bori-hobby.html"]) {
    await p.goto("http://localhost:8085/" + file);
    await p.locator(".extended-activities>summary").click();
    await p
      .locator(".extended-activities .extension-options button")
      .first()
      .click();
    assert(await p.locator(".extended-activity-panel").isVisible());
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    if (file === "tori-play.html") {
      assert(
        await p.evaluate(() =>
          Object.values(SchoolActivityBank.pools).every(
            (pool) => pool.length >= 30,
          ),
        ),
      );
      const pools = await p.evaluate(() => {
        const first = SchoolActivityBank.draw("animal").map((q) => q.id);
        const second = SchoolActivityBank.draw("animal").map((q) => q.id);
        return first.filter((id) => second.includes(id));
      });
      assert.equal(pools.length, 0);
    }
  }
  assert.deepEqual(errors, []);
  await b.close();
  console.log(
    "PASS PM embedded play/hobby/completion/no fabricated rating, extended 3 rooms, 30+ pools, recent-question avoidance, mobile fit",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
