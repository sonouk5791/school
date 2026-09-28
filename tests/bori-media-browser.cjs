const { chromium } = require("playwright"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true }),
    page = await browser.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      "school_character_voice_prefs_v1",
      JSON.stringify({ muted: true }),
    ),
  );
  await page.goto("http://localhost:8085/index.html");
  await page.locator("#btnTeacherSpace").click();
  await page.locator("#inputTeacherPin").fill("media-test-password");
  await page.locator("#btnSubmitTeacherPin").click();
  await page.waitForSelector(".operations-panel");
  await page.locator(".operations-menu summary").click();
  await page.locator("[data-op=tab][data-tab=media]").click();
  await page.locator("[data-media-action=add-theater]").click();
  let form = page.locator("#mediaContentForm");
  await form.locator("[name=title]").fill("검증용 추억 영상");
  await form.locator("[name=videoType]").selectOption("local");
  await page
    .locator("#mediaUpload")
    .setInputFiles(path.resolve(".bori-backup/test-video.mp4"));
  await form.locator("[name=rights]").check();
  await form.locator("[type=submit]").click();
  await page.waitForSelector(".media-admin-list article");
  await page.locator("[data-media-action=add-song]").click();
  form = page.locator("#mediaContentForm");
  await form.locator("[name=title]").fill("검증용 노래");
  await form.locator("[name=videoType]").selectOption("local");
  await page
    .locator("#mediaUpload")
    .setInputFiles(path.resolve(".bori-backup/test-audio.wav"));
  await form.locator("[name=rights]").check();
  await form.locator("details summary").click();
  await form.locator("[data-media-action=add-cue]").click();
  await form.locator("[data-cue=end]").fill("3");
  await form.locator("[data-cue=text]").fill("검증 안내 하나");
  await form.locator("[data-media-action=add-cue]").click();
  await form.locator("[data-cue=end]").nth(1).fill("6");
  await form.locator("[data-cue=text]").nth(1).fill("검증 안내 둘");
  await form.locator("[name=lyricsRights]").check();
  await form.locator("[type=submit]").click();
  await page.waitForFunction(() => BoriMediaStore.read().contents.length === 2);
  for (const [width, height] of [
    [1920, 1080],
    [1366, 768],
    [768, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://localhost:8085/bori-hobby.html");
    assert.equal(await page.locator(".media-entry:visible").count(), 2);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    await page.goto("http://localhost:8085/bori-memory-theater.html");
    await page.waitForSelector("[data-content]");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    await page.screenshot({ path: `tests/bori-media-select-${width}.png` });
  }
  await page.locator("[data-content]").click();
  await page.locator("#mediaParticipants input").first().check();
  await page.locator("[data-action=start]").click();
  await page.waitForFunction(
    () => document.querySelector("video")?.currentTime > 0.5,
  );
  await page.locator("#autoNext").uncheck();
  await page.locator("#manualNext button").waitFor({ state: "visible" });
  assert.equal(await page.locator("[data-response]").count(), 0);
  await page.locator("#manualNext button").click();
  await page.locator('[data-response="이야기하고 싶음"]').click();
  await page.locator('[data-mood="좋음"]').click();
  let data = await page.evaluate(() => OperationsStore.get());
  assert.equal(data.participationRecords.length, 1);
  assert(data.dailyReports[0].text.includes("이야기하고 싶음"));
  assert(!data.dailyReports[0].text.includes("적극"));
  assert(data.participationRecords[0].durationSeconds > 4);
  await page.screenshot({ path: "tests/bori-media-recall-390.png" });
  await page.goto("http://localhost:8085/bori-song-class.html");
  await page.locator("[data-content]").click();
  await page.locator("#mediaParticipants input").first().check();
  await page.locator("#mediaParticipants input").nth(1).check();
  await page.locator("[data-action=start]").click();
  await page.locator("#autoNext").check();
  await page.waitForFunction(
    () => document.querySelector("audio")?.currentTime > 0.4,
  );
  assert.equal(
    await page.locator("#mediaLyrics").innerText(),
    "검증 안내 하나",
  );
  await page.locator("[data-action=slow]").click();
  assert.equal(
    await page.locator("audio").evaluate((a) => a.playbackRate),
    0.75,
  );
  await page.locator("[data-action=pause]").click();
  const elapsed = await page.evaluate(
    () => BoriMediaPlayer.getState().record.watchedSeconds,
  );
  await page.waitForTimeout(500);
  assert.equal(
    await page.evaluate(() => BoriMediaPlayer.getState().record.watchedSeconds),
    elapsed,
  );
  await page.reload();
  await page.locator("[data-content]").click();
  await page.locator("[data-action=resume]").click();
  await page.waitForFunction(
    () => document.querySelector("audio")?.currentTime > 3.2,
  );
  assert.equal(await page.locator("#mediaLyrics").innerText(), "검증 안내 둘");
  await page.locator('[data-mood="좋음"]').waitFor();
  await page.locator('[data-mood="좋음"]').click();
  data = await page.evaluate(() => OperationsStore.get());
  const songs = data.participationRecords.filter(
    (r) => r.programTitle === "보리 옛 노래 교실",
  );
  assert.equal(songs.length, 2);
  assert.equal(songs[0].mood, "좋음");
  assert.equal(songs[1].mood, "");
  await page.locator("[data-action=again]").click();
  await page.waitForFunction(
    () => document.querySelector("audio")?.currentTime > 0.5,
  );
  assert.equal(
    await page.evaluate(() => BoriMediaPlayer.getState().record.replayCount),
    1,
  );
  await page.locator("[data-action=stop]").click();
  assert(!(await page.locator("h2").innerText()).includes("정말 잘"));
  assert.equal(
    await page.evaluate(() => BoriMediaPlayer.getState().record.completed),
    false,
  );
  await page.goto("http://localhost:8085/index.html#teacher");
  await page.waitForSelector(".operations-panel");
  await page.locator(".operations-menu summary").click();
  await page.locator("[data-op=tab][data-tab=media]").click();
  const ids = await page.evaluate(() =>
    Object.fromEntries(
      BoriMediaStore.read().contents.map((c) => [c.kind, c.id]),
    ),
  );
  await page
    .locator(`[data-media-action=edit][data-id="${ids.theater}"]`)
    .click();
  await page
    .locator("#mediaContentForm [name=title]")
    .fill("수정한 영상 <안내>");
  await page.locator("#mediaContentForm [type=submit]").click();
  await page.waitForFunction(() =>
    BoriMediaStore.read().contents.some(
      (c) => c.title === "수정한 영상 <안내>",
    ),
  );
  await page
    .locator(`[data-media-action=toggle][data-id="${ids.theater}"]`)
    .click();
  assert.equal(
    await page.evaluate(
      () =>
        ProgramLibrary.getAll().find((p) => p.id === "BORI_MEMORY_THEATER")
          .enabled,
    ),
    false,
  );
  await page
    .locator(`[data-media-action=toggle][data-id="${ids.theater}"]`)
    .click();
  await page.locator(`[data-media-action=up][data-id="${ids.song}"]`).click();
  await page.waitForFunction(
    () =>
      BoriMediaStore.read().contents.find((c) => c.kind === "song").order === 0,
  );
  await page.locator("[data-note-for]").first().fill("실제 관찰 메모");
  await page.locator("[data-media-action=save-note]").first().click();
  await page.waitForFunction(() =>
    OperationsStore.get().dailyReports.some((r) =>
      r.text.includes("실제 관찰 메모"),
    ),
  );
  page.once("dialog", (d) => d.accept());
  await page
    .locator(`[data-media-action=delete][data-id="${ids.theater}"]`)
    .click();
  await page.waitForFunction(() =>
    BoriMediaStore.read().contents.some((c) => c.deletedAt),
  );
  assert.equal(
    await page.evaluate(() => BoriMediaStore.read().records.length),
    2,
  );
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS admin MP4/WAV upload, four responsive layouts, real media ended/auto-next OFF/recall/journal, timed lyrics/slow/pause/resume/replay, independent participant moods, interrupted record",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
