"use strict";
const D = require("./domain"),
  notify = require("./notification");
module.exports = async function runJob(state, job, context) {
  const { kind, date, payload } = job;
  if (kind === "ai-daily") {
    const row = state.dailyReports.find(
      (r) => r.seniorId === payload.seniorId && r.date === date,
    );
    if (row && row.status !== "approved") {
      row.text = await context.generateDraft(
        state.participationRecords.filter(
          (r) => r.date === date && r.seniorId === payload.seniorId,
        ),
      );
      row.source = "google-ai";
      row.status = "pending";
    }
  }
  if (kind === "activate") D.activate(state, date);
  if (kind === "program") {
    if (
      !state.programs.some(
        (p) => p.start === payload.start && p.status !== "rejected",
      )
    ) {
      const p = D.generateProgram(
        state,
        payload.start,
        context.library,
        state.settings.events || [],
        state.settings.offDays || [],
      );
      notify(state, p.id, "다음 주 프로그램을 확인하고 승인해주세요.");
    }
  }
  if (kind.startsWith("prepare-")) {
    const active = state.programs.find(
        (p) => p.status === "active" && p.start <= date && p.end >= date,
      ),
      day = active?.days.find((d) => d.date === date);
    if (!day || day.off) throw Error("오늘 적용할 승인 프로그램이 없습니다.");
    await context.checkAssets(day);
    state.prepared = state.prepared || {};
    state.prepared[date + ":" + kind.slice(8)] = {
      status: "ready",
      programId: active.id,
      checkedAt: new Date().toISOString(),
    };
  }
  if (kind === "daily") {
    for (const id of new Set(
      state.participationRecords
        .filter((r) => r.date === date)
        .map((r) => r.seniorId),
    )) {
      const draft = D.journal(state.participationRecords, id, date),
        old = state.dailyReports.find((r) => r.id === draft.id);
      if (!old) D.upsert(state.dailyReports, draft);
    }
    const count = state.dailyReports.filter(
      (r) => r.date === date && r.status !== "approved",
    ).length;
    const missing = state.sessions.filter(
      (s) =>
        s.date === date &&
        s.status === "completed" &&
        s.participants.some(
          (id) =>
            !state.participationRecords.some(
              (r) => r.sessionId === s.id && r.seniorId === id,
            ),
        ),
    ).length;
    if (count || missing)
      notify(
        state,
        "daily:" + date,
        `확인할 일지 ${count}건, 평가 미작성 수업 ${missing}건이 있습니다.`,
      );
  }
  if (kind === "weekly")
    D.upsert(
      state.weeklyReports,
      D.report(state, "weekly", payload.start, date),
    );
  if (kind === "monthly")
    D.upsert(
      state.monthlyReports,
      D.report(state, "monthly", payload.start, date),
    );
  if (kind === "next-month") {
    state.monthCandidates = state.monthCandidates || [];
    const monthNumber = Number(payload.month.slice(5, 7));
    const season =
      monthNumber >= 3 && monthNumber <= 5
        ? "봄"
        : monthNumber >= 6 && monthNumber <= 8
          ? "여름"
          : monthNumber >= 9 && monthNumber <= 11
            ? "가을"
            : "겨울";
    D.upsert(state.monthCandidates, {
      id: payload.month,
      status: "pending",
      month: payload.month,
      activities: context.library
        .filter(
          (p) =>
            p.enabled !== false && (p.season === "공통" || p.season === season),
        )
        .map((p) => p.id),
    });
    notify(
      state,
      "month:" + payload.month,
      "다음 달 콘텐츠 후보를 확인해주세요. 기존 콘텐츠는 유지됩니다.",
    );
  }
};
