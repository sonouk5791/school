"use strict";
const D = require("./domain");
const hhmm = (now) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
function due(state, now = new Date()) {
  const settings = D.normalize(state).settings,
    today = D.dateKey(now),
    time = hhmm(now),
    out = [];
  const push = (kind, date, at, payload = {}) => {
    if (date < today || (date === today && at <= time))
      out.push({
        id: kind + ":" + date,
        kind,
        date,
        payload,
        status: "pending",
        attempts: 0,
        nextAttemptAt: null,
      });
  };
  // Catch up after outages without firing a lesson in a user's browser.
  for (let n = -7; n <= 0; n++) {
    const date = D.addDays(today, n),
      day = D.weekday(date),
      last = D.addDays(date, 1).slice(0, 7) !== date.slice(0, 7);
    push("activate", date, "00:00");
    if (day === Number(settings.weekDay) && settings.enabled.programs)
      push("program", date, settings.weekGeneration, {
        start: D.addDays(D.monday(date), 7),
      });
    if (day !== 0 && settings.enabled.prepare && date === today) {
      push("prepare-am", date, settings.amPrepare);
      push("prepare-pm", date, settings.pmPrepare);
    }
    if (settings.enabled.daily) push("daily", date, settings.dailyCheck);
    if (day === 6 && settings.enabled.weekly)
      push("weekly", date, settings.weeklyReport, { start: D.monday(date) });
    if (last && settings.enabled.monthly)
      push("monthly", date, settings.monthlyReport, {
        start: date.slice(0, 7) + "-01",
      });
    if (last && settings.enabled.programs)
      push("next-month", date, settings.monthlyReport, {
        month: D.addDays(date, 1).slice(0, 7),
      });
  }
  return out;
}
module.exports = { due, hhmm };
