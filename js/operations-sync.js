/* Public lesson metadata only. Personal records sync requires a server admin session. */
(() => {
  "use strict";
  let connected = false;
  async function call(action, body) {
    const r = await fetch("/api/operations?action=" + action, {
      method: body ? "POST" : "GET",
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const d = await r.json();
    if (!r.ok) throw Error(d.error || "서버 연결을 확인해주세요.");
    return d;
  }
  const ready = call("status")
    .then(async (status) => {
      connected = status.configured;
      if (!connected) return;
      const data = await call("today");
      const state = OperationsStore.get();
      if (data.program) SchoolOperations.upsert(state.programs, data.program);
      state.prepared = data.prepared || {};
      state.lastServerRun = data.lastServerRun || null;
      OperationsStore.save();
    })
    .catch(() => {});
  window.OperationsSync = {
    ready,
    async flush() {
      await ready;
      if (!connected)
        throw Error(
          "이 기기에 저장했습니다. 서버 동기화는 DB 연결 후 가능합니다.",
        );
      const s = OperationsStore.get();
      s.syncMarks = s.syncMarks || {};
      for (const session of s.sessions.filter((s) =>
        ["completed", "cancelled"].includes(s.status),
      )) {
        const records = s.participationRecords.filter(
          (r) => r.sessionId === session.id,
        );
        const fingerprint = Array.from(
          new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              new TextEncoder().encode(JSON.stringify({ session, records })),
            ),
          ),
          (x) => x.toString(16).padStart(2, "0"),
        ).join("");
        if (s.syncMarks[session.id] === fingerprint) continue;
        if (!records.length)
          await call("sync", { sessions: [session], records: [] });
        for (let i = 0; i < records.length; i += 40)
          await call("sync", {
            sessions: [session],
            records: records.slice(i, i + 40),
          });
        s.syncMarks[session.id] = fingerprint;
        OperationsStore.save();
      }
    },
  };
  window.addEventListener("online", () =>
    OperationsSync.flush().catch(() => {}),
  );
})();
