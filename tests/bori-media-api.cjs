const assert = require("node:assert/strict"),
  db = require("../automation/database");
let state = {};
db.transaction = async (fn) => {
  const working = structuredClone(state);
  const out = await fn(working);
  state = working;
  return out;
};
const api = require("../api/operations");
let cookie = "";
async function call(action, body) {
  let status = 200,
    data;
  const req = {
    method: body ? "POST" : "GET",
    url: "/api/operations",
    query: { action },
    headers: { host: "school.test", origin: "https://school.test", cookie },
    body,
  };
  const res = {
    setHeader(k, v) {
      if (k === "Set-Cookie") cookie = v.split(";")[0];
    },
    status(s) {
      status = s;
      return this;
    },
    json(d) {
      data = d;
      return this;
    },
  };
  await api(req, res);
  return { status, data };
}
(async () => {
  process.env.DATABASE_URL = "test-double-only";
  process.env.ADMIN_INITIAL_PASSWORD = "media-initial-password";
  const content = {
    id: "media-test",
    kind: "theater",
    title: "기관 테스트",
    videoType: "mp4",
    videoUrl: "https://example.org/authorized.mp4",
    rightsConfirmed: true,
    enabled: true,
  };
  assert.equal((await call("media-save", { content })).status, 401);
  await call("login", { password: process.env.ADMIN_INITIAL_PASSWORD });
  await call("password", { password: "media-new-password-123" });
  assert.equal((await call("media-save", { content })).status, 200);
  assert.equal((await call("media-catalog")).data.contents.length, 1);
  assert.equal(
    (
      await call("media-save", {
        content: { ...content, videoUrl: "http://example.org/no" },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await call("media-save", {
        content: { ...content, videoType: "local", fileId: "media-x" },
      })
    ).status,
    400,
  );
  await call("media-save", { content: { ...content, enabled: false } });
  assert.equal((await call("media-catalog")).data.contents.length, 0);
  assert.equal((await call("state")).data.state.mediaContents.length, 1);
  const record = {
    id: "media-session-test",
    kind: "theater",
    contentId: content.id,
    title: content.title,
    participants: ["S1"],
    startedAt: "2026-09-28T01:00:00Z",
    savedAt: "2026-09-28T01:10:00Z",
    watchedSeconds: 42,
    notes: "실제 관찰",
  };
  await call("media-record", { record });
  await call("media-record", { record });
  assert.equal(state.mediaRecords.length, 1);
  await call("media-record", {
    record: { ...record, savedAt: "2026-09-28T01:00:00Z", notes: "stale" },
  });
  assert.equal(state.mediaRecords[0].notes, "실제 관찰");
  await call("media-delete", { id: content.id });
  assert(state.mediaContents[0].deletedAt);
  assert.equal(state.mediaRecords.length, 1);
  assert(
    !JSON.stringify((await call("media-catalog")).data).includes("실제 관찰"),
  );
  delete process.env.DATABASE_URL;
  delete process.env.ADMIN_INITIAL_PASSWORD;
  console.log(
    "PASS server media auth, metadata CRUD/disable/archive, URL/local-file rejection, record dedup/stale protection, public privacy (transaction test double, no live DB)",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
