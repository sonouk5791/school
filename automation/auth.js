"use strict";
const crypto = require("node:crypto");
const hash = (token) => crypto.createHash("sha256").update(token).digest("hex");
const encode = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" + crypto.scryptSync(password, salt, 64).toString("hex");
};
const verify = (password, value) => {
  if (!value) return false;
  const [salt, expected] = value.split(":");
  const actual = crypto.scryptSync(password, salt, 64),
    target = Buffer.from(expected, "hex");
  return (
    target.length === actual.length && crypto.timingSafeEqual(actual, target)
  );
};
function bootstrap(state) {
  state.admins = state.admins || {};
  state.authSessions = state.authSessions || {};
  if (!state.admins.primary) {
    const initial = process.env.ADMIN_INITIAL_PASSWORD;
    if (!initial || initial.length < 12)
      throw Object.assign(Error("최초 관리자 비밀번호 설정이 필요합니다."), {
        status: 503,
      });
    state.admins.primary = {
      password: encode(initial),
      mustChange: true,
      failures: 0,
      lockedUntil: 0,
    };
  }
}
function login(state, password, now = Date.now()) {
  bootstrap(state);
  const a = state.admins.primary;
  if (a.lockedUntil > now)
    return {
      error: "로그인이 잠시 제한되었습니다. 15분 후 다시 시도해주세요.",
      status: 429,
    };
  if (!verify(password, a.password)) {
    a.failures++;
    if (a.failures >= 5) {
      a.lockedUntil = now + 15 * 60000;
      a.failures = 0;
    }
    return { error: "비밀번호를 확인해주세요.", status: 401 };
  }
  a.failures = 0;
  const token = crypto.randomBytes(32).toString("hex");
  state.authSessions[hash(token)] = { lastSeen: now, createdAt: now };
  return { token, mustChange: a.mustChange };
}
function check(state, req, now = Date.now()) {
  const cookie = String(req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("school_admin="))
    ?.slice(13);
  const session = cookie && state.authSessions?.[hash(cookie)];
  if (
    !session ||
    now - session.lastSeen > 20 * 60000 ||
    now - session.createdAt > 8 * 3600000
  )
    throw Object.assign(Error("선생님 로그인이 필요합니다."), { status: 401 });
  session.lastSeen = now;
  return { cookie, session };
}
module.exports = { hash, encode, verify, bootstrap, login, check };
