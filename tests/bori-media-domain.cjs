const assert = require("node:assert/strict"),
  M = require("../automation/media");
const base = {
  id: "media-test",
  kind: "song",
  title: "테스트 안내",
  videoType: "mp3",
  videoUrl: "https://example.org/approved.mp3",
  rightsConfirmed: true,
  lyricsRightsConfirmed: true,
  lyrics: [
    { start: 0, end: 3, text: "첫 번째 안내" },
    { start: 3, end: 6, text: "두 번째 안내" },
  ],
};
const c = M.validate(base);
assert.equal(M.lyricAt(c.lyrics, 2.9), "첫 번째 안내");
assert.equal(M.lyricAt(c.lyrics, 3), "두 번째 안내");
assert.equal(M.lyricAt(c.lyrics, 6), "");
assert.throws(() => M.validate({ ...base, rightsConfirmed: false }));
assert.throws(() => M.validate({ ...base, videoUrl: "javascript:alert(1)" }));
assert.throws(() => M.validate({ ...base, thumbnail: "data:text/html,hi" }));
assert.throws(() => M.validate({ ...base, lyricsRightsConfirmed: false }));
assert.throws(() =>
  M.validate({ ...base, lyrics: [{ start: 3, end: 2, text: "invalid" }] }),
);
assert.throws(() =>
  M.validate({
    ...base,
    lyrics: [
      { start: 0, end: 4, text: "one" },
      { start: 3, end: 6, text: "two" },
    ],
  }),
);
assert.throws(() =>
  M.validate(
    { ...base, videoType: "local", fileId: "media-test" },
    { cloud: true },
  ),
);
assert.equal(
  M.youtube("https://www.youtube.com/watch?v=abcdefghijk"),
  "abcdefghijk",
);
assert.equal(
  M.youtube("https://youtube.com.evil.test/watch?v=abcdefghijk"),
  null,
);
const second = { ...c, id: "media-second" },
  disabled = { ...c, id: "media-disabled", enabled: false };
assert.equal(
  M.recommend(
    [c, second, disabled],
    [{ contentId: c.id, startedAt: "2026-09-27T03:00:00Z" }],
    "song",
    "2026-09-28",
  ).id,
  second.id,
);
const r = M.validateRecord({
  id: "media-session-test",
  contentId: c.id,
  kind: "song",
  title: c.title,
  participants: ["S1"],
  startedAt: "2026-09-28T01:00:00Z",
  watchedSeconds: 12,
  completed: false,
});
assert(!M.notes(r).includes("적극"));
assert.equal(r.completed, false);
assert.throws(() => M.validateRecord({ ...r, watchedSeconds: -1 }));
const longCue = [{ start: 0, end: 8, text: "abcdefghijklmnopqr" }];
assert.equal(
  M.lyricPage(longCue, 0, 60, (s) => s.length * 10),
  "abcdef\nghijkl",
);
assert.equal(
  M.lyricPage(longCue, 6, 60, (s) => s.length * 10),
  "mnopqr",
);
console.log(
  "PASS media rights/HTTPS/YouTube host validation, lyric boundaries/overlaps, local file isolation, seven-day recommendations, truthful records",
);
