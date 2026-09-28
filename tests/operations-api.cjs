const assert = require("node:assert/strict"),
  db = require("../automation/database"),
  D = require("../automation/domain");
let state = {};
db.transaction = async (fn) => {
  const draft = structuredClone(state);
  const result = await fn(draft);
  state = draft;
  return result;
};
const api = require("../api/operations");
let cookie = "";
async function call(action, body, opts = {}) {
  const req = {
    method: body ? "POST" : "GET",
    query: { action },
    url: "/api/operations",
    headers: {
      host: "school.test",
      origin: "https://school.test",
      cookie,
      ...opts.headers,
    },
    body,
  };
  let status = 200,
    output,
    headers = {};
  const res = {
    setHeader: (k, v) => (headers[k] = v),
    status(n) {
      status = n;
      return this;
    },
    json(d) {
      output = d;
      return d;
    },
  };
  await api(req, res);
  if (headers["Set-Cookie"]) cookie = headers["Set-Cookie"].split(";")[0];
  return { status, data: output };
}
(async () => {
  process.env.DATABASE_URL = "test-mock-not-a-real-database";
  process.env.ADMIN_INITIAL_PASSWORD = "bootstrap-test-only-42";
  assert.equal((await call("state")).status, 401);
  assert.equal((await call("login", { password: "wrong" })).status, 401);
  assert.equal(
    (await call("login", { password: process.env.ADMIN_INITIAL_PASSWORD })).data
      .mustChange,
    true,
  );
  assert.equal((await call("state")).status, 403);
  assert.equal(
    (await call("password", { password: "new-unit-test-pass-58" })).status,
    200,
  );
  assert.equal((await call("generate", { start: "2026-10-05" })).status, 200);
  const id = state.programs[0].id;
  assert.equal(state.programs[0].status, "pending");
  await call("approve", { id });
  assert.equal(state.programs[0].status, "approved");
  assert.equal((await call("edit-program", { id, days: [] })).status, 400);
  assert.equal(
    (await call("settings", { settings: { amPrepare: "27:99" } })).status,
    400,
  );
  assert.equal(
    (
      await call(
        "settings",
        { settings: { amPrepare: "09:20" } },
        { headers: { origin: "https://wrong.test" } },
      )
    ).status,
    403,
  );
  const session = D.createSession("am", ["S1"], { id, title: "테스트" });
  D.tick(session, 3600);
  await call("sync", { sessions: [session], records: [] });
  await call("sync", {
    sessions: [session],
    records: [{ sessionId: session.id, seniorId: "S1", participation: "보통" }],
  });
  assert.equal(state.participationRecords.length, 1);
  await call("sync", {
    sessions: [session],
    records: [{ sessionId: session.id, seniorId: "S1", participation: "보통" }],
  });
  assert.equal(state.participationRecords.length, 1);
  assert.equal(state.dailyReports[0].status, "pending");
  const view = (await call("state")).data.state;
  assert(!view.admins);
  assert(!view.authSessions);
  await call("logout", {});
  assert.equal((await call("state")).status, 401);
  delete process.env.DATABASE_URL;
  delete process.env.ADMIN_INITIAL_PASSWORD;
  console.log(
    "PASS API with transaction test double: login/change/CSRF/approval/edit guard/evaluation sync/dedup/private fields/logout. No live PostgreSQL claimed.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
