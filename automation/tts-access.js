'use strict';
// Single-institution safety gate. This is not a multi-tenant authorization model.
const crypto = require('node:crypto');
const db = require('./database');
const auth = require('./auth');
const fail = (code, status, message) => Object.assign(Error(message), {code, status});
async function reserve(req, now = Date.now()) {
  if (process.env.SCHOOL_DYNAMIC_TTS_ENABLED !== 'true')
    throw fail('TTS_DISABLED', 503, '새 음성 생성은 운영자 검증 후 사용할 수 있습니다.');
  const headers = req.headers || {};
  let sameOrigin = false;
  try { sameOrigin = new URL(headers.origin).host === headers.host; } catch {}
  if (!sameOrigin) throw fail('TTS_ORIGIN_DENIED', 403, '요청 출처를 확인해주세요.');
  if (!headers.cookie) throw fail('TTS_LOGIN_REQUIRED', 401, '선생님 로그인이 필요합니다.');
  return db.transaction(state => {
    auth.check(state, {headers}, now);
    if (!state.admins?.primary || state.admins.primary.mustChange)
      throw fail('TTS_PASSWORD_REQUIRED', 403, '관리자 비밀번호 변경이 필요합니다.');
    const day = new Date(now + 9 * 3600000).toISOString().slice(0, 10);
    const usage = state.ttsUsage?.day === day ? state.ttsUsage : {day, count: 0, recent: state.ttsUsage?.recent || [], active: state.ttsUsage?.active || {}};
    usage.recent = usage.recent.filter(t => t > now - 60000);
    usage.active = Object.fromEntries(Object.entries(usage.active).filter(([,until]) => until > now));
    // Count attempts, including failed provider calls, to prevent retry-based cost bypass.
    if (usage.count >= 200 || usage.recent.length >= 10 || Object.keys(usage.active).length >= 2)
      throw fail('TTS_LIMIT_REACHED', 429, '음성 생성 한도에 도달했습니다. 잠시 후 다시 시도해주세요.');
    const id = crypto.randomUUID();
    usage.count++; usage.recent.push(now); usage.active[id] = now + 90000;
    state.ttsUsage = usage;
    return id;
  });
}
async function release(id) {
  if (!id) return;
  try { await db.transaction(state => { if (state.ttsUsage?.active) delete state.ttsUsage.active[id]; }); }
  catch { /* The lease expires; do not print session cookies or provider data. */ }
}
module.exports = {reserve, release};
