/* Pure domain logic shared by server jobs and the offline lesson client. No timers or UI. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object") module.exports = api;
  else root.SchoolOperations = api;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";
  const dateKey = (now = new Date()) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(now));
  const addDays = (date, n) =>
    new Date(Date.parse(date + "T12:00:00Z") + n * 86400000)
      .toISOString()
      .slice(0, 10);
  const weekday = (date) => new Date(date + "T12:00:00Z").getUTCDay();
  const monday = (date) =>
    addDays(date, weekday(date) === 0 ? -6 : 1 - weekday(date));
  const defaults = {
    weekGeneration: "15:00",
    weekDay: 6,
    amPrepare: "09:30",
    pmPrepare: "13:30",
    dailyCheck: "18:00",
    weeklyReport: "17:00",
    monthlyReport: "18:00",
    enabled: {
      programs: true,
      prepare: true,
      daily: true,
      weekly: true,
      monthly: true,
    },
    retentionDays: 365,
  };
  function empty() {
    return {
      version: 3,
      programs: [],
      sessions: [],
      seniors: [],
      participationRecords: [],
      dailyReports: [],
      weeklyReports: [],
      monthlyReports: [],
      automationJobs: [],
      automationLogs: [],
      notifications: [],
      audit: [],
      settings: JSON.parse(JSON.stringify(defaults)),
    };
  }
  function normalize(s) {
    const out = { ...empty(), ...s };
    out.settings = {
      ...defaults,
      ...s?.settings,
      enabled: { ...defaults.enabled, ...s?.settings?.enabled },
    };
    return out;
  }
  const phases = [
    ["greeting", 300],
    ["act1", 1080],
    ["break", 120],
    ["act2", 1500],
    ["wrapup", 600],
  ];
  function createSession(type, participants, program, now = new Date()) {
    if (!["am", "pm"].includes(type) || !participants.length)
      throw Error("대상자와 수업을 선택해주세요.");
    return {
      id:
        globalThis.crypto?.randomUUID?.() ||
        "session-" + Date.now() + "-" + Math.random().toString(36).slice(2),
      date: dateKey(now),
      type,
      participants: [...new Set(participants)],
      programId: program?.id || "legacy-" + dateKey(now),
      program: program || null,
      status: "running",
      startedAt: new Date(now).toISOString(),
      endedAt: null,
      phase: 0,
      phaseSeconds: 0,
      elapsedSeconds: 0,
      phaseTimes: {},
      completedActivities: [],
      interruptedActivities: [],
      results: [],
      savedAt: new Date(now).toISOString(),
    };
  }
  function advance(s, manual = false, now = new Date()) {
    if (s.status !== "running") return;
    s[manual ? "interruptedActivities" : "completedActivities"].push(
      phases[s.phase][0],
    );
    s.phase++;
    s.phaseSeconds = 0;
    if (s.phase >= phases.length) {
      s.status = "completed";
      s.endedAt = new Date(now).toISOString();
    }
    s.savedAt = new Date(now).toISOString();
  }
  function tick(s, seconds, now = new Date()) {
    if (s.status !== "running" || !Number.isFinite(seconds) || seconds < 0)
      return;
    let left = seconds;
    while (left > 0 && s.status === "running") {
      const [id, duration] = phases[s.phase],
        delta = Math.min(left, duration - s.phaseSeconds);
      s.phaseSeconds += delta;
      s.elapsedSeconds += delta;
      s.phaseTimes[id] = (s.phaseTimes[id] || 0) + delta;
      left -= delta;
      if (s.phaseSeconds >= duration) advance(s, false, now);
    }
    s.savedAt = new Date(now).toISOString();
  }
  function previous(s) {
    if (s.status !== "running" || s.phase === 0) return;
    s.interruptedActivities.push(phases[s.phase][0]);
    s.phase--;
    s.phaseSeconds = 0;
  }
  function journal(records, senior, date) {
    const rows = records.filter(
      (r) => r.seniorId === senior && r.date === date,
    );
    return {
      id: `daily:${senior}:${date}`,
      seniorId: senior,
      date,
      status: "pending",
      source: "record-summary",
      recordIds: rows.map((r) => r.id),
      text: rows.length
        ? rows
            .map(
              (r) =>
                r.type === "garden" ? `생활 활동: ${r.notes}. 화면 활성 시간 ${r.durationSeconds}초. 참여도·기분은 미입력입니다.` : `${r.type === "am" ? "오전" : "오후"} ${r.programTitle} 수업에 ${Math.round(r.durationSeconds / 60)}분 참여하였다. 참여도: ${r.participation || "미입력"}, 표정: ${r.expression || "미입력"}, 도움: ${r.assistance || "미입력"}, 기분: ${r.mood || "미입력"}. 특이사항: ${r.notes || "입력 없음"}.`,
            )
            .join("\n")
        : "해당 날짜의 평가 기록이 없습니다.",
      updatedAt: new Date().toISOString(),
    };
  }
  function upsert(list, row) {
    const i = list.findIndex((x) => x.id === row.id);
    if (i < 0) list.push(row);
    else list[i] = row;
    return row;
  }
  function saveEvaluation(state, session, evaluations) {
    if (session.status !== "completed" && session.status !== "cancelled")
      throw Error("종료 후 평가해주세요.");
    upsert(state.sessions, session);
    for (const id of session.participants) {
      const e = evaluations[id];
      if (!e) continue;
      const prior = state.participationRecords.find(
        (r) => r.id === session.id + ":" + id,
      );
      if (prior)
        state.audit.push({
          kind: "evaluation",
          id: prior.id,
          before: prior,
          at: new Date().toISOString(),
        });
      const row = {
        id: session.id + ":" + id,
        sessionId: session.id,
        seniorId: id,
        date: session.date,
        type: session.type,
        programId: session.programId,
        programTitle:
          session.program?.title ||
          (session.type === "am"
            ? "콩이 운동·나비 인지"
            : "토리 놀이·보리 취미"),
        durationSeconds: session.elapsedSeconds,
        phaseTimes: { ...session.phaseTimes },
        completed: session.status === "completed",
        ...e,
      };
      upsert(state.participationRecords, row);
      upsert(
        state.dailyReports,
        journal(state.participationRecords, id, session.date),
      );
    }
    return state;
  }
  const score = { "적극 참여": 3, 보통: 2, 소극적: 1, "참여 어려움": 0 };
  function aggregate(records, start, end) {
    const rows = records.filter((r) => r.date >= start && r.date <= end),
      values = rows.map((r) => score[r.participation]).filter(Number.isFinite),
      domains = { 운동: 0, 인지: 0, 놀이: 0, 취미: 0 },
      popular = {};
    for (const r of rows) {
      if(r.type === "garden"){domains["생활 활동"]=(domains["생활 활동"]||0)+(r.durationSeconds||0);continue;}
      domains[r.type === "am" ? "운동" : "놀이"] += r.phaseTimes?.act1 || 0;
      domains[r.type === "am" ? "인지" : "취미"] += r.phaseTimes?.act2 || 0;
      popular[r.programTitle] = (popular[r.programTitle] || 0) + 1;
    }
    return {
      start,
      end,
      count: rows.length,
      durationSeconds: rows.reduce((a, r) => a + r.durationSeconds, 0),
      averageParticipation: values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : null,
      domains,
      popular: Object.entries(popular).sort((a, b) => b[1] - a[1]),
      difficult: rows
        .filter((r) => r.participation === "참여 어려움")
        .map((r) => r.programTitle),
      notes: rows
        .filter((r) => r.notes)
        .map((r) => ({ seniorId: r.seniorId, date: r.date, text: r.notes })),
    };
  }
  function report(state, kind, start, end) {
    const prevEnd = addDays(start, -1),
      prevStart =
        kind === "weekly" ? addDays(start, -7) : prevEnd.slice(0, 7) + "-01",
      current = aggregate(state.participationRecords, start, end),
      prior = aggregate(state.participationRecords, prevStart, prevEnd);
    return {
      id: kind + ":" + start,
      kind,
      status: "pending",
      ...current,
      previous: prior,
      change: prior.count ? current.count - prior.count : null,
      createdAt: new Date().toISOString(),
    };
  }
  function generateProgram(state, start, library, events = [], offDays = []) {
    const season = [
      "겨울",
      "겨울",
      "겨울",
      "봄",
      "봄",
      "봄",
      "여름",
      "여름",
      "여름",
      "가을",
      "가을",
      "가을",
      "겨울",
    ][Number(start.slice(5, 7))];
    const recent = state.programs
      .filter((p) => p.start >= addDays(start, -14) && p.start < start)
      .flatMap((p) =>
        p.days.flatMap((d) => [
          ...(d.am?.activities || []),
          ...(d.pm?.activities || []),
        ]),
      )
      .map((a) => a.id);
    const used = [...recent],
      days = [];
    for (let i = 0; i < 6; i++) {
      const date = addDays(start, i),
        event = events.find(
          (e) =>
            Math.abs(
              Date.parse(e.date + "T12:00:00Z") -
                Date.parse(date + "T12:00:00Z"),
            ) <=
            7 * 86400000,
        );
      if (offDays.includes(date)) {
        days.push({ date, off: true });
        continue;
      }
      const pick = (id) => {
        const choices = library.filter(
          (p) => p.character === id && p.enabled !== false,
        );
        if (!choices.length) throw Error("활동 자료가 없습니다: " + id);
        choices.sort((a, b) => {
          const rank = (p) =>
            (used.includes(p.id) ? 100 : 0) +
            (p.season === "공통" || p.season === season ? 0 : 10) +
            (event && p.holiday === event.title ? -5 : 0);
          return (
            rank(a) - rank(b) ||
            used.lastIndexOf(a.id) - used.lastIndexOf(b.id) ||
            Math.random() - 0.5
          );
        });
        const p = choices[0];
        const repeated = used.includes(p.id);
        used.push(p.id);
        return { ...p, repeated };
      };
      days.push({
        date,
        event: event?.title || null,
        am: { activities: [pick("kongi"), pick("nabi")] },
        pm: { activities: [pick("tori"), pick("bori")] },
      });
    }
    const revision = state.programs.filter((p) => p.start === start).length + 1;
    const p = {
      id: `week:${start}:${revision}`,
      start,
      end: addDays(start, 5),
      status: "pending",
      season,
      days,
      createdAt: new Date().toISOString(),
    };
    state.programs.push(p);
    return p;
  }
  function approve(state, id, now = new Date()) {
    const p = state.programs.find((p) => p.id === id);
    if (!p || !["draft", "pending"].includes(p.status))
      throw Error("승인 대기 프로그램이 아닙니다.");
    p.status = "approved";
    p.approvedAt = new Date(now).toISOString();
    state.audit.push({ kind: "approve", id, at: p.approvedAt });
    return p;
  }
  function activate(state, date) {
    for (const p of state.programs) {
      if (p.status === "active" && p.end < date) p.status = "completed";
    }
    const candidates = state.programs
      .filter(
        (p) => p.status === "approved" && p.start <= date && p.end >= date,
      )
      .sort((a, b) => a.approvedAt.localeCompare(b.approvedAt));
    for (const p of candidates) {
      for (const old of state.programs)
        if (old.status === "active" && old.id !== p.id)
          old.status = "completed";
      p.status = "active";
    }
    return (
      state.programs.find(
        (p) => p.status === "active" && p.start <= date && p.end >= date,
      ) || null
    );
  }
  return {
    dateKey,
    addDays,
    weekday,
    monday,
    defaults,
    empty,
    normalize,
    phases,
    createSession,
    tick,
    advance,
    previous,
    journal,
    saveEvaluation,
    aggregate,
    report,
    generateProgram,
    approve,
    activate,
    upsert,
  };
});
