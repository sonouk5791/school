const assert = require("node:assert/strict"),
  vm = require("node:vm"),
  fs = require("node:fs");
(async () => {
  const values = new Map();
  let release;
  const context = {
    localStorage: {
      getItem: (k) => values.get(k) || null,
      setItem: (k, v) => values.set(k, v),
    },
    Event: class {},
    dispatchEvent() {},
    fetch: () =>
      new Promise((resolve) => {
        release = resolve;
      }),
  };
  context.window = context;
  vm.runInNewContext(
    fs.readFileSync("js/bori-media-store.js", "utf8"),
    context,
  );
  const S = context.BoriMediaStore,
    record = {
      id: "media-session-test",
      startedAt: "2026-09-28T01:00:00Z",
      savedAt: "first",
      watchedSeconds: 1,
    };
  S.saveRecord(record);
  const pending = S.flushRecords();
  S.saveRecord({ ...record, savedAt: "newer", watchedSeconds: 12 });
  release({ ok: true });
  await pending;
  assert.equal(S.read().records[0].watchedSeconds, 12);
  assert.equal(S.read().synced[record.id], "first");
  console.log(
    "PASS in-flight media sync preserves newer local progress and leaves it pending",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
