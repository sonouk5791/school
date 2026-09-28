"use strict";
const delays = [5 * 60000, 15 * 60000];
module.exports = function retry(job, now, error) {
  job.attempts++;
  job.error = String(error?.message || "작업 실패").slice(0, 300);
  job.status = job.attempts >= 3 ? "failed" : "retry";
  job.nextAttemptAt =
    job.status === "retry"
      ? new Date(now.getTime() + delays[job.attempts - 1]).toISOString()
      : null;
};
