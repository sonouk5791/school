(() => {
  "use strict";
  const KEY = "school_bori_media_v1";
  function read() {
    try {
      return (
        JSON.parse(localStorage.getItem(KEY)) || { contents: [], records: [] }
      );
    } catch {
      throw Error("콘텐츠 저장 자료를 읽지 못했습니다. 선생님께 알려주세요.");
    }
  }
  function write(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event("bori-media-updated"));
  }
  function upsert(list, row) {
    const i = list.findIndex((r) => r.id === row.id);
    if (i < 0) list.push(row);
    else list[i] = row;
  }
  function file(action, id, value) {
    return new Promise((resolve, reject) => {
      const opening = indexedDB.open("school-bori-media-files", 1);
      opening.onupgradeneeded = () => opening.result.createObjectStore("files");
      opening.onerror = () => reject(Error("기기 저장소를 열지 못했어요."));
      opening.onsuccess = () => {
        const db = opening.result,
          tx = db.transaction(
            "files",
            action === "get" ? "readonly" : "readwrite",
          ),
          store = tx.objectStore("files");
        let result;
        const req = action === "put" ? store.put(value, id) : store.get(id);
        req.onsuccess = () => {
          result = req.result;
        };
        tx.oncomplete = () => {
          db.close();
          resolve(result);
        };
        tx.onerror = () => {
          db.close();
          reject(Error("파일을 저장하지 못했어요. 저장 공간을 확인해주세요."));
        };
      };
    });
  }
  async function refresh() {
    try {
      const status = await fetch("/api/operations?action=status");
      if (!status.ok || !(await status.json()).configured) return;
      const admin =
        window.AdminAccess?.isCloud() &&
        sessionStorage.getItem("digital_school_teacher_authed") === "true";
      const r = await fetch(
        "/api/operations?action=" + (admin ? "state" : "media-catalog"),
      );
      if (!r.ok) return;
      const d = await r.json(),
        s = read();
      s.contents = [
        ...s.contents.filter((c) => !c.cloud),
        ...(admin ? d.state.mediaContents || [] : d.contents).map((c) => ({
          ...c,
          cloud: true,
        })),
      ];
      if (admin)
        for (const record of d.state.mediaRecords || []) {
          const old = s.records.find((r) => r.id === record.id);
          if (!old || old.savedAt < record.savedAt) upsert(s.records, record);
        }
      write(s);
    } catch {}
  }
  window.BoriMediaStore = {
    read,
    write,
    file,
    refresh,
    async flushRecords() {
      const s = read();
      s.synced = s.synced || {};
      for (const record of s.records.filter((r) => r.startedAt)) {
        if (s.synced[record.id] === record.savedAt) continue;
        const response = await fetch("/api/operations?action=media-record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ record }),
        });
        if (!response.ok)
          throw Error("선생님 로그인 후 감상 기록을 동기화해주세요.");
        s.synced[record.id] = record.savedAt;
      }
      const latest = read();
      latest.synced = { ...(latest.synced || {}), ...s.synced };
      write(latest);
    },
    saveContent(row) {
      const s = read();
      upsert(s.contents, row);
      write(s);
    },
    saveRecord(row) {
      const s = read();
      upsert(s.records, row);
      write(s);
    },
    async upload(fileObject) {
      if (
        ![
          "video/mp4",
          "audio/mpeg",
          "audio/wav",
          "audio/x-wav",
          "audio/wave",
        ].includes(fileObject.type)
      )
        throw Error("MP4, MP3, WAV 파일을 선택해주세요.");
      if (fileObject.size > 200 * 1024 * 1024)
        throw Error(
          "200MB 이하 파일을 사용하거나 기관 저장소 주소를 등록해주세요.",
        );
      const id = "media-" + crypto.randomUUID();
      await file("put", id, fileObject);
      return { id, mime: fileObject.type };
    },
  };
})();
