"use strict";
const D = require("./domain"),
  scheduler = require("./scheduler"),
  retry = require("./retryHandler"),
  runJob = require("./jobs"),
  notify = require("./notification");
async function run(input, context, now = new Date()) {
  let state = D.normalize(input);
  const started = Date.now();
  for (const job of scheduler.due(state, now))
    if (!state.automationJobs.some((j) => j.id === job.id))
      state.automationJobs.push(job);
  for (const job of [...state.automationJobs]) {
    const toggle = {
      program: "programs",
      "next-month": "programs",
      "prepare-am": "prepare",
      "prepare-pm": "prepare",
      daily: "daily",
      "ai-daily": "daily",
      weekly: "weekly",
      monthly: "monthly",
    }[job.kind];
    if (toggle && state.settings.enabled[toggle] === false) continue;
    if (Date.now() - started > 18000) break;
    if (job.kind === "ai-daily" && Date.now() - started > 2000) continue;
    if (
      !["pending", "retry"].includes(job.status) ||
      (job.nextAttemptAt && new Date(job.nextAttemptAt) > now)
    )
      continue;
    const working = JSON.parse(JSON.stringify(state));
    try {
      await (context.runJob || runJob)(working, job, context);
      state = working;
      const target = state.automationJobs.find((j) => j.id === job.id);
      target.status = "completed";
      target.completedAt = now.toISOString();
      target.attempts++;
      state.automationLogs.push({
        jobId: job.id,
        kind: job.kind,
        status: "success",
        at: now.toISOString(),
      });
    } catch (e) {
      const target = state.automationJobs.find((j) => j.id === job.id);
      retry(target, now, e);
      state.automationLogs.push({
        jobId: job.id,
        kind: job.kind,
        status: target.status,
        error: target.error,
        at: now.toISOString(),
      });
      if (target.status === "failed")
        notify(
          state,
          "failed:" + job.id,
          "자동화 작업 오류: " + job.kind + " · " + target.error,
        );
    }
  }
  state.lastServerRun = now.toISOString();
  return state;
}
module.exports = { run };
