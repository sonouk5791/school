const { chromium } = require("playwright"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true }),
    p = await b.newPage(),
    errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.route("https://media.test/fixture.mp4", (route) =>
    route.fulfill({
      contentType: "video/mp4",
      body: fs.readFileSync(".bori-backup/test-video.mp4"),
    }),
  );
  await p.addInitScript(() =>
    localStorage.setItem(
      "school_character_voice_prefs_v1",
      JSON.stringify({ muted: true }),
    ),
  );
  await p.clock.install();
  await p.goto("http://localhost:8085/index.html");
  await p.evaluate(() => {
    const c = BoriMediaDomain.validate({
      id: "media-fixture",
      kind: "theater",
      title: "기관 영상 테스트",
      videoType: "mp4",
      videoUrl: "https://media.test/fixture.mp4",
      rightsConfirmed: true,
    });
    BoriMediaStore.saveContent(c);
    const s = OperationsStore.get(),
      date = SchoolOperations.dateKey();
    s.programs.push({
      id: "test-approved",
      status: "active",
      start: date,
      end: date,
      days: [
        {
          date,
          am: { activities: [] },
          pm: {
            activities: [
              { id: "TORI_01", title: "같은 그림 찾기", character: "tori" },
              {
                id: "BORI_MEMORY_THEATER",
                title: "보리 추억극장",
                character: "bori",
                mediaKind: "theater",
              },
            ],
          },
        },
      ],
    });
    OperationsStore.save();
  });
  await p.goto("http://localhost:8085/daycare-class.html?session=pm");
  await p.locator("[name=attendanceElder]").first().check();
  await p.locator("#btnStartClass").click();
  await p.locator("#nextPhase").click();
  await p.locator("#nextPhase").click();
  await p.locator("#nextPhase").click();
  const frame = p.frameLocator("iframe.activity-frame");
  await frame.locator("[data-content]").waitFor();
  await p
    .locator("iframe.activity-frame")
    .evaluate((e) => (e.dataset.testIdentity = "keep"));
  await p.clock.runFor(181000);
  assert.equal(
    await p.locator("iframe.activity-frame").getAttribute("data-test-identity"),
    "keep",
  );
  await frame.locator("[data-content]").click();
  await frame.locator("[data-action=start]").click();
  await p.waitForTimeout(1200);
  await p.locator("#btnClassPause").click();
  assert.equal(await frame.locator("video").evaluate((v) => v.paused), true);
  await p.locator("#btnClassPause").click();
  await frame.locator("[data-action=play]").click();
  await p.waitForTimeout(800);
  await p.clock.runFor(1500);
  await p.locator("#nextPhase").click();
  await p.locator("#nextPhase").click();
  await p.locator("#saveAssessment").click();
  const s = await p.evaluate(() => OperationsStore.get());
  assert.equal(s.sessions.length, 1);
  assert.equal(s.participationRecords.length, 1);
  assert(s.dailyReports[0].text.includes("기관 영상 테스트"));
  assert(s.sessions[0].mediaResults.length === 1);
  await p.goto("http://localhost:8085/bori-memory-theater.html");
  await p.evaluate(() =>
    BoriMediaStore.saveContent(
      BoriMediaDomain.validate({
        id: "media-broken",
        kind: "theater",
        title: "오류 점검",
        videoType: "mp4",
        videoUrl: "https://media.test/broken.mp4",
        rightsConfirmed: true,
      }),
    ),
  );
  await p.route("https://media.test/broken.mp4", (r) =>
    r.fulfill({ status: 404, body: "missing" }),
  );
  await p.reload();
  await p.locator("[data-content=media-broken]").click();
  await p.locator("[data-action=start]").click();
  await p.locator("#mediaError").waitFor({ state: "visible" });
  assert(
    (await p.locator("#mediaStatus").innerText()).includes("불러오지 못했어요"),
  );
  assert.equal(await p.locator("[data-action=retry]").count(), 1);
  assert.deepEqual(errors, []);
  await b.close();
  console.log(
    "PASS approved PM media route, no 3-minute replacement, parent pauses video, single combined lesson journal, missing-media recovery",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
