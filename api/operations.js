"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const D = require("../automation/domain"),
  db = require("../automation/database"),
  auth = require("../automation/auth"),
  engine = require("../automation/engine"),
  library = require("../automation/library.json");
function safeEqual(a, b) {
  const x = Buffer.from(a || ""),
    y = Buffer.from(b || "");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
const fail = (message, status = 400) =>
  Object.assign(Error(message), { status });
const publicState = (s) =>
  Object.fromEntries(
    Object.entries(s).filter(
      ([key]) => !["admins", "authSessions"].includes(key),
    ),
  );
const validTime = (s) =>
  typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
function settings(value) {
  const out = {};
  for (const k of [
    "weekGeneration",
    "amPrepare",
    "pmPrepare",
    "dailyCheck",
    "weeklyReport",
    "monthlyReport",
  ])
    if (k in value) {
      if (!validTime(value[k])) throw fail("시간 형식을 확인해주세요.");
      out[k] = value[k];
    }
  if ("weekDay" in value) {
    if (
      !Number.isInteger(value.weekDay) ||
      value.weekDay < 0 ||
      value.weekDay > 6
    )
      throw fail("요일 오류");
    out.weekDay = value.weekDay;
  }
  if (value.enabled)
    out.enabled = Object.fromEntries(
      ["programs", "prepare", "daily", "weekly", "monthly"].map((k) => [
        k,
        value.enabled[k] === true,
      ]),
    );
  if (value.events) {
    if (!Array.isArray(value.events) || value.events.length > 500)
      throw fail("특별일 개수 오류");
    out.events = value.events.map((e) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || typeof e.title !== "string")
        throw fail("특별일 형식 오류");
      return { date: e.date, title: e.title.slice(0, 100) };
    });
  }
  return out;
}
async function assets(day) {
  if (!day.am?.activities?.length || !day.pm?.activities?.length)
    throw fail("활동 자료가 없습니다.");
  for (const id of ["kongi", "tori", "nabi", "bori"])
    if (
      !fs.existsSync(
        path.join(process.cwd(), "assets/images/uniform-" + id + ".png"),
      )
    )
      throw fail("캐릭터 이미지 확인이 필요합니다.");
  if (!process.env.GOOGLE_CLOUD_PROJECT)
    throw fail("Google 음성 설정 확인이 필요합니다.");
}
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const action =
    req.query?.action ||
    new URL(req.url, "https://school.invalid").searchParams.get("action") ||
    "status";
  try {
    if (action === "status") {
      return res
        .status(200)
        .json({
          configured: !!process.env.DATABASE_URL,
          authConfigured: !!process.env.ADMIN_INITIAL_PASSWORD,
          schedulerConfigured: !!process.env.CRON_SECRET,
          message: process.env.DATABASE_URL
            ? "서버 연결 설정 있음"
            : "서버 연결 필요",
        });
    }
    const cron =
      action === "run" &&
      !!process.env.CRON_SECRET &&
      safeEqual(req.headers.authorization, "Bearer " + process.env.CRON_SECRET);
    if (req.method !== "GET" && req.method !== "POST")
      throw fail("허용하지 않는 요청입니다.", 405);
    if (!cron && req.method === "POST") {
      const origin = req.headers.origin;
      if (!origin || new URL(origin).host !== req.headers.host)
        throw fail("요청 출처를 확인해주세요.", 403);
    }
    let body = req.body || {};
    if (typeof body === "string") body = JSON.parse(body);
    if (Buffer.byteLength(JSON.stringify(body)) > 512000)
      throw fail("요청이 너무 큽니다.", 413);
    const result = await db.transaction(async (raw) => {
      let state = D.normalize(raw);
      Object.assign(raw, state);
      let identity = null;
      if (action === "today" && req.method === "GET") {
        const date = D.dateKey();
        const program = raw.programs.find(
          (p) => p.status === "active" && p.start <= date && p.end >= date,
        );
        return {
          program: program || null,
          prepared: raw.prepared || {},
          lastServerRun: raw.lastServerRun || null,
        };
      }
      if (action === "login") {
        if (
          req.method !== "POST" ||
          typeof body.password !== "string" ||
          body.password.length > 256
        )
          throw fail("비밀번호를 입력해주세요.");
        const result = auth.login(raw, body.password);
        if (result.token) {
          res.setHeader(
            "Set-Cookie",
            `school_admin=${result.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1200`,
          );
          delete result.token;
        }
        return result;
      }
      if (!cron) {
        identity = auth.check(raw, req);
        if (
          raw.admins?.primary.mustChange &&
          !["password", "logout"].includes(action)
        )
          throw fail("최초 비밀번호를 먼저 변경해주세요.", 403);
        res.setHeader(
          "Set-Cookie",
          `school_admin=${identity.cookie}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1200`,
        );
      }
      if (action === "logout") {
        delete raw.authSessions[auth.hash(identity.cookie)];
        res.setHeader(
          "Set-Cookie",
          "school_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
        );
        return { ok: true };
      }
      if (action === "password") {
        if (
          req.method !== "POST" ||
          typeof body.password !== "string" ||
          body.password.length < 12 ||
          body.password.length > 256
        )
          throw fail("12자 이상의 새 비밀번호를 입력해주세요.");
        if (auth.verify(body.password, raw.admins.primary.password))
          throw fail("기존과 다른 비밀번호를 입력해주세요.");
        raw.admins.primary.password = auth.encode(body.password);
        raw.admins.primary.mustChange = false;
        raw.authSessions = { [auth.hash(identity.cookie)]: identity.session };
        return { ok: true };
      }
      if (action === "state") return { state: publicState(raw) };
      if (action === "run") {
        const next = await engine.run(raw, {
          library,
          checkAssets: assets,
          generateDraft: (records) =>
            require("../automation/reportGenerator")(records, req),
        });
        Object.assign(raw, next);
        return { ok: true, lastRun: raw.lastServerRun };
      }
      if (req.method !== "POST") throw fail("POST 요청이 필요합니다.", 405);
      if (action === "generate") {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(body.start) ||
          D.weekday(body.start) !== 1
        )
          throw fail("월요일 날짜를 선택해주세요.");
        D.generateProgram(
          raw,
          body.start,
          library,
          raw.settings.events || [],
          raw.settings.offDays || [],
        );
      } else if (action === "approve") D.approve(raw, body.id);
      else if (action === "reject") {
        const p = raw.programs.find((p) => p.id === body.id);
        if (!p || !["draft", "pending"].includes(p.status))
          throw fail("초안만 반려할 수 있습니다.");
        p.status = "rejected";
      } else if (action === "settings")
        raw.settings = { ...raw.settings, ...settings(body.settings || {}) };
      else if (action === "journal-ai") {
        const r = raw.dailyReports.find((r) => r.id === body.id);
        if (!r) throw fail("일지 없음", 404);
        const text = await require("../automation/reportGenerator")(
          raw.participationRecords.filter(
            (x) => x.date === r.date && x.seniorId === r.seniorId,
          ),
          req,
        );
        raw.audit.push({
          kind: "journal-ai",
          id: r.id,
          before: structuredClone(r),
          at: new Date().toISOString(),
        });
        r.text = text;
        r.source = "google-ai";
        r.status = "pending";
      } else if (action === "senior") {
        const v = body.senior;
        if (
          !v ||
          typeof v.id !== "string" ||
          typeof v.name !== "string" ||
          !v.name.trim()
        )
          throw fail("대상자 이름을 입력해주세요.");
        const row = {};
        for (const k of [
          "id",
          "name",
          "masked",
          "birthYear",
          "gender",
          "grade",
          "cognition",
          "mobility",
          "note",
          "preferences",
        ])
          row[k] = String(v[k] || "").slice(0, k === "note" ? 500 : 100);
        D.upsert(raw.seniors, row);
      } else if (action === "report") {
        if (
          !["weekly", "monthly"].includes(body.kind) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(body.start) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(body.end)
        )
          throw fail("보고서 기간 오류");
        D.upsert(
          raw[body.kind + "Reports"],
          D.report(raw, body.kind, body.start, body.end),
        );
      } else if (action === "edit-program") {
        const p = raw.programs.find((p) => p.id === body.id);
        if (
          !p ||
          !["pending", "draft"].includes(p.status) ||
          !Array.isArray(body.days) ||
          body.days.length !== 6
        )
          throw fail("승인 전 초안만 수정할 수 있습니다.");
        for (let i = 0; i < 6; i++) {
          const d = body.days[i];
          if (d.date !== D.addDays(p.start, i))
            throw fail("프로그램 날짜 오류");
          if (d.off) continue;
          for (const [type, roles] of [
            ["am", ["kongi", "nabi"]],
            ["pm", ["tori", "bori"]],
          ]) {
            if (d[type]?.activities?.length !== 2) throw fail("활동 개수 오류");
            d[type].activities = d[type].activities.map((a, j) => {
              const item = library.find(
                (p) => p.id === a.id && p.character === roles[j],
              );
              if (!item) throw fail("캐릭터 활동 오류");
              return item;
            });
          }
        }
        p.days = body.days;
        p.status = "pending";
      } else if(action==='approve-month'){const m=raw.monthCandidates?.find(m=>m.id===body.id);if(!m)throw fail('콘텐츠 후보 없음',404);m.status='approved';
      } else if (action === "report-review") {
        const row = [
          ...raw.dailyReports,
          ...raw.weeklyReports,
          ...raw.monthlyReports,
        ].find((r) => r.id === body.id);
        if (!row) throw fail("보고서 없음", 404);
        raw.audit.push({
          kind: "report-review",
          id: row.id,
          before: structuredClone(row),
          at: new Date().toISOString(),
        });
        if (typeof body.text === "string") row.text = body.text.slice(0, 20000);
        row.status = body.approve ? "approved" : "pending";
      } else if (action === "sync") {
        if (!Array.isArray(body.sessions) || !Array.isArray(body.records))
          throw fail("잘못된 수업 자료");
        for (const s of body.sessions) {
          if (
            typeof s.id !== "string" ||
            s.id.length > 100 ||
            !["completed", "cancelled"].includes(s.status) ||
            !["am", "pm"].includes(s.type) ||
            !Array.isArray(s.participants) ||
            s.participants.length > 200 ||
            !Number.isFinite(s.elapsedSeconds) ||
            s.elapsedSeconds < 0 ||
            s.elapsedSeconds > 86400
          )
            throw fail("수업 자료 오류");
          const incoming = body.records.filter((r) => r.sessionId === s.id);
          const prior = raw.sessions.find((old) => old.id === s.id);
          if (
            prior &&
            incoming.every((r) => {
              const old = raw.participationRecords.find(
                (x) => x.id === s.id + ":" + r.seniorId,
              );
              return (
                old &&
                [
                  "participation",
                  "expression",
                  "assistance",
                  "mood",
                  "notes",
                ].every((k) => String(old[k] || "") === String(r[k] || ""))
              );
            })
          )
            continue;
          const evaluations = {};
          for (const r of body.records.filter((r) => r.sessionId === s.id)) {
            evaluations[r.seniorId] = Object.fromEntries(
              [
                "participation",
                "expression",
                "assistance",
                "mood",
                "notes",
              ].map((k) => [k, String(r[k] || "").slice(0, 2000)]),
            );
          }
          D.saveEvaluation(raw, s, evaluations);
          if (process.env.JOURNAL_MODEL)
            for (const id of s.participants) {
              const jobId = "ai:" + s.id + ":" + id;
              if (!raw.automationJobs.some((j) => j.id === jobId))
                raw.automationJobs.push({
                  id: jobId,
                  kind: "ai-daily",
                  date: s.date,
                  payload: { seniorId: id },
                  status: "pending",
                  attempts: 0,
                  nextAttemptAt: null,
                });
            }
        }
      } else throw fail("지원하지 않는 작업입니다.", 404);
      raw.audit.push({ kind: action, at: new Date().toISOString() });
      return { ok: true, state: publicState(raw) };
    });
    return res.status(result.status || 200).json(result);
  } catch (e) {
    const status = e.status || 500;
    return res
      .status(status)
      .json({
        error:
          status === 500
            ? "서버 작업을 완료하지 못했습니다. 다시 시도해주세요."
            : e.message,
        code: e.code || "OPERATIONS_ERROR",
      });
  }
};
module.exports.settings = settings;
