const assert = require("node:assert/strict"),
  D = require("../automation/domain"),
  engine = require("../automation/engine"),
  library = require("../automation/library.json"),
  auth = require("../automation/auth");
(async () => {
  let s = D.empty();
  const p = D.generateProgram(s, "2026-10-05", library);
  assert.equal(p.days.length, 6);
  assert.equal(p.status, "pending");
  assert.equal(D.activate(s, "2026-10-05"), null);
  D.approve(s, p.id, new Date("2026-10-03T06:00:00Z"));
  assert.equal(D.activate(s, "2026-10-04"), null);
  assert.equal(D.activate(s, "2026-10-05").id, p.id);
  const second = D.generateProgram(s, "2026-10-05", library);
  D.activate(s, "2026-10-05");
  assert.equal(p.status, "active");
  assert.equal(second.status, "pending");
  const a = D.createSession(
    "am",
    ["S1", "S2"],
    { id: p.id, title: "체조와 기억" },
    new Date("2026-10-05T01:00:00Z"),
  );
  D.tick(a, 300);
  assert.equal(a.phase, 1);
  a.status = "paused";
  D.tick(a, 800);
  assert.equal(a.elapsedSeconds, 300);
  a.status = "running";
  D.tick(a, 3300, new Date("2026-10-05T02:00:00Z"));
  assert.equal(a.status, "completed");
  assert.equal(a.elapsedSeconds, 3600);
  assert.equal(a.phaseTimes.break, 120);
  D.saveEvaluation(s, a, {
    S1: {
      participation: "보통",
      assistance: "부분 도움",
      mood: "좋음",
      expression: "편안함",
      notes: "손 동작 도움",
    },
    S2: {},
  });
  D.saveEvaluation(s, a, { S1: { participation: "보통" }, S2: {} });
  assert.equal(s.sessions.length, 1);
  assert.equal(s.participationRecords.length, 2);
  assert.equal(s.dailyReports.length, 2);
  assert(
    !s.dailyReports.find((r) => r.seniorId === "S2").text.includes("적극"),
  );
  assert.equal(s.dailyReports[0].status, "pending");
  assert.equal(D.report(s, "weekly", "2026-10-05", "2026-10-10").count, 2);
  const checkAssets = async () => {};
  s = await engine.run(
    s,
    { library, checkAssets },
    new Date("2026-10-05T04:31:00Z"),
  );
  assert.equal(s.prepared["2026-10-05:am"].status, "ready");
  assert.equal(s.prepared["2026-10-05:pm"].status, "ready");
  const count = s.automationLogs.length;
  s = await engine.run(
    s,
    { library, checkAssets },
    new Date("2026-10-05T04:31:01Z"),
  );
  assert.equal(s.automationLogs.length, count);
  let r = D.empty();
  r.automationJobs = [
    { id: "test", kind: "test", status: "pending", attempts: 0 },
  ];
  r.settings.enabled = {
    programs: false,
    prepare: false,
    daily: false,
    weekly: false,
    monthly: false,
  };
  const ctx = {
    library,
    checkAssets,
    runJob: async (state, j) => {
      if (j.id === "test") {
        state.seniors.push({ id: "must-rollback" });
        throw Error("temporary");
      }
    },
  };
  r = await engine.run(r, ctx, new Date("2026-10-05T01:00:00Z"));
  assert.equal(r.automationJobs[0].status, "retry");
  assert.equal(r.seniors.length, 0);
  r = await engine.run(r, ctx, new Date("2026-10-05T01:05:00Z"));
  assert.equal(r.automationJobs[0].nextAttemptAt, "2026-10-05T01:20:00.000Z");
  r = await engine.run(r, ctx, new Date("2026-10-05T01:20:00Z"));
  assert.equal(r.automationJobs[0].status, "failed");
  assert(r.notifications.length);
  process.env.ADMIN_INITIAL_PASSWORD = "unit-test-initial-password";
  const security = {};
  for (let i = 0; i < 5; i++) auth.login(security, "wrong", 1000);
  assert.equal(
    auth.login(security, "unit-test-initial-password", 2000).status,
    429,
  );
  assert(auth.login(security, "unit-test-initial-password", 1000000).token);
  delete process.env.ADMIN_INITIAL_PASSWORD;
  const schedule = require("../automation/scheduler");
  const endJobs = schedule.due(D.empty(), new Date("2026-10-31T09:01:00Z"));
  for (const kind of ["program", "weekly", "monthly", "next-month", "daily"])
    assert(
      endJobs.some((j) => j.kind === kind && j.date === "2026-10-31"),
      kind,
    );
  let monthly = await engine.run(
    D.empty(),
    { library, checkAssets },
    new Date("2026-10-31T09:01:00Z"),
  );
  assert(monthly.monthlyReports.some((r) => r.start === "2026-10-01"));
  assert(
    monthly.monthCandidates.some(
      (r) => r.month === "2026-11" && r.status === "pending",
    ),
  );
  assert(monthly.programs.every((p) => p.status === "pending"));
  const disabled = D.empty();
  disabled.settings.enabled.weekly = false;
  disabled.automationJobs = [
    { id: "off", kind: "weekly", status: "retry", attempts: 1 },
  ];
  const stopped = await engine.run(
    disabled,
    { library, checkAssets },
    new Date("2026-10-05T01:00:00Z"),
  );
  assert.equal(stopped.automationJobs.find((j) => j.id === "off").attempts, 1);
  console.log(
    "PASS approval gate, 60-minute clock/pause, idempotent evaluations, truthful drafts, prepare AM/PM, job dedup, retry 5/15min/terminal, rollback, admin lockout",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
