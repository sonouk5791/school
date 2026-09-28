const { chromium } = require("playwright"),
  assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true }),
    p = await b.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.addInitScript(() => {
    localStorage.setItem("school_character_voice_prefs_v1", '{"muted":true}');
    localStorage.setItem(
      "school_bori_media_v1",
      JSON.stringify({
        contents: [
          {
            id: "media-yt",
            kind: "song",
            title: "공식 임베드 API 검증",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/watch?v=abcdefghijk",
            enabled: true,
            order: 0,
            lyrics: [{ start: 0, end: 10, text: "테스트 안내" }],
          },
        ],
        records: [],
      }),
    );
    window.YT = {
      Player: class {
        constructor(el, config) {
          this.config = config;
          this.position = 0;
          this.volume = 50;
          this.rate = 1;
          window.testYT = this;
          el.textContent = "YouTube API test double";
          setTimeout(() => config.events.onReady(), 0);
        }
        playVideo() {
          this.config.events.onStateChange({ data: 1 });
        }
        pauseVideo() {
          this.config.events.onStateChange({ data: 2 });
        }
        getCurrentTime() {
          return this.position;
        }
        getDuration() {
          return 10;
        }
        seekTo(n) {
          this.position = n;
        }
        getVolume() {
          return this.volume;
        }
        setVolume(n) {
          this.volume = n;
        }
        getAvailablePlaybackRates() {
          return [0.75, 1];
        }
        setPlaybackRate(n) {
          this.rate = n;
          this.config.events.onPlaybackRateChange({ data: n });
        }
        destroy() {
          this.destroyed = true;
        }
      },
    };
  });
  await p.goto("http://localhost:8085/bori-song-class.html");
  await p.locator("[data-content]").click();
  await p.locator("[data-action=start]").click();
  await p.locator("[data-action=slow]").click();
  assert.equal(await p.evaluate(() => testYT.rate), 0.75);
  await p.locator("[data-action=louder]").click();
  assert.equal(await p.evaluate(() => testYT.volume), 65);
  await p.evaluate(() => {
    testYT.position = 10;
    testYT.config.events.onStateChange({ data: 0 });
  });
  await p.locator("[data-mood]").first().waitFor();
  assert.equal(
    await p.evaluate(() => BoriMediaPlayer.getState().record.completed),
    true,
  );
  await p.locator("[data-action=again]").click();
  await p.locator("[data-action=play]").waitFor();
  assert.equal(
    await p.evaluate(() => BoriMediaPlayer.getState().record.replayCount),
    1,
  );
  assert.deepEqual(errors, []);
  await b.close();
  console.log(
    "PASS YouTube adapter API test double: ready/play/rate/volume/ended/replay; no claim of real external video embedding test",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
