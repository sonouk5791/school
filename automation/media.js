/* Shared validation and factual media records. No copyrighted content is bundled. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object") module.exports = api;
  else root.BoriMediaDomain = api;
})(globalThis, () => {
  "use strict";
  const categories = {
    theater: [
      "옛 드라마",
      "옛 생활",
      "옛 시장",
      "농촌",
      "학교",
      "가족",
      "명절",
      "옛 거리",
      "옛 교통",
      "옛날 물건",
    ],
    song: ["가요", "동요", "민요", "계절노래", "추억노래"],
  };
  function https(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch {
      return false;
    }
  }
  function youtube(value) {
    try {
      const u = new URL(value);
      if (u.protocol !== "https:") return null;
      const id =
        u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : [
                "youtube.com",
                "www.youtube.com",
                "www.youtube-nocookie.com",
              ].includes(u.hostname)
            ? u.searchParams.get("v") ||
              u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
            : null;
      return /^[a-zA-Z0-9_-]{11}$/.test(id || "") ? id : null;
    } catch {
      return null;
    }
  }
  function validate(input, { cloud = false } = {}) {
    if (!input || !categories[input.kind])
      throw Error("콘텐츠 종류를 확인해주세요.");
    const title = String(input.title || "").trim();
    if (!title || title.length > 100)
      throw Error("제목은 1~100자로 입력해주세요.");
    if (!input.rightsConfirmed)
      throw Error("영상·음원 이용 권한을 확인해주세요.");
    if (!["mp4", "mp3", "wav", "youtube", "local"].includes(input.videoType))
      throw Error("지원하지 않는 재생 방식입니다.");
    if (input.kind === "theater" && ["mp3", "wav"].includes(input.videoType))
      throw Error("추억극장에는 영상을 등록해주세요.");
    if (
      input.kind === "theater" &&
      input.videoType === "local" &&
      String(input.mime).startsWith("audio/")
    )
      throw Error("추억극장에는 MP4 영상 파일을 선택해주세요.");
    if (input.videoType === "youtube" && !youtube(input.videoUrl))
      throw Error("YouTube 영상 주소를 확인해주세요.");
    if (
      !["youtube", "local"].includes(input.videoType) &&
      !https(input.videoUrl)
    )
      throw Error("HTTPS 미디어 주소를 입력해주세요.");
    if (
      input.videoType === "local" &&
      (cloud || !/^media-[\w-]+$/.test(input.fileId || ""))
    )
      throw Error("기기 파일은 업로드한 기기에서만 사용할 수 있습니다.");
    if (input.thumbnail && !https(input.thumbnail))
      throw Error("썸네일은 HTTPS 이미지 주소를 사용해주세요.");
    const lyrics = input.lyrics || [];
    if (!Array.isArray(lyrics) || lyrics.length > 500)
      throw Error("가사 구간은 500개 이하로 등록해주세요.");
    if (lyrics.length && !input.lyricsRightsConfirmed)
      throw Error("가사 이용 권한도 확인해주세요.");
    let end = 0;
    const cues = lyrics.map((c) => {
      const start = Number(c.start),
        finish = Number(c.end),
        text = String(c.text || "").trim();
      if (
        !Number.isFinite(start) ||
        !Number.isFinite(finish) ||
        start < end ||
        finish <= start ||
        finish > 86400 ||
        !text ||
        text.length > 120 ||
        text.split("\n").length > 2
      )
        throw Error(
          "가사는 겹치지 않는 시작·종료 초와 1~2줄(120자 이하)로 입력해주세요.",
        );
      end = finish;
      return { start, end: finish, text };
    });
    return {
      id: /^media-[\w-]+$/.test(input.id || "")
        ? input.id
        : "media-" + crypto.randomUUID(),
      kind: input.kind,
      title,
      category: categories[input.kind].includes(input.category)
        ? input.category
        : categories[input.kind][0],
      videoType: input.videoType,
      videoUrl: input.videoType === "local" ? "" : String(input.videoUrl),
      fileId: input.videoType === "local" ? input.fileId : null,
      mime: String(input.mime || ""),
      thumbnail: input.thumbnail || "",
      duration: Math.max(0, Math.min(86400, Number(input.duration) || 0)),
      enabled: input.enabled !== false,
      order: Math.max(0, Number(input.order) || 0),
      rightsConfirmed: true,
      lyricsRightsConfirmed: !!input.lyricsRightsConfirmed,
      lyrics: cues,
      updatedAt: new Date().toISOString(),
    };
  }
  function recommend(contents, records, kind, date) {
    const cutoff = new Date(date + "T12:00:00Z").getTime() - 7 * 86400000;
    const used = new Set(
      records
        .filter((r) => Date.parse(r.startedAt) >= cutoff)
        .map((r) => r.contentId),
    );
    const available = contents
      .filter((c) => c.kind === kind && c.enabled && !c.deletedAt)
      .sort((a, b) => a.order - b.order);
    const pool = available.filter((c) => !used.has(c.id));
    const candidates = pool.length ? pool : available;
    if (!candidates.length) return null;
    const day = Math.floor(Date.parse(date + "T12:00:00Z") / 86400000);
    return candidates[day % candidates.length];
  }
  const lyricAt = (lyrics, time) =>
    lyrics.find((c) => time >= c.start && time < c.end)?.text || "";
  function lyricPage(lyrics, time, width, measure) {
    const cue = lyrics.find((c) => time >= c.start && time < c.end);
    if (!cue) return "";
    const lines = [];
    for (const paragraph of cue.text.split("\n")) {
      let line = "";
      for (const char of paragraph) {
        if (line && measure(line + char) > Math.max(40, width)) {
          lines.push(line);
          line = char;
        } else line += char;
      }
      if (line) lines.push(line);
    }
    const pages = Math.max(1, Math.ceil(lines.length / 2)),
      page = Math.min(
        pages - 1,
        Math.floor(((time - cue.start) / (cue.end - cue.start)) * pages),
      );
    return lines.slice(page * 2, page * 2 + 2).join("\n");
  }
  function notes(r) {
    return `콘텐츠: ${r.title}. 재생 종료: ${r.completed ? "예" : "아니오"}. 실제 재생 참여 ${Math.round(r.watchedSeconds)}초, 다시보기 ${r.replayCount}회. 회상 반응: ${r.memoryResponse || "미입력"}. 기분: ${r.mood || "미입력"}. 메모: ${r.notes || "입력 없음"}.`;
  }
  const programs = [
    {
      id: "BORI_MEMORY_THEATER",
      title: "보리 추억극장",
      domain: "회상",
      mediaKind: "theater",
    },
    {
      id: "BORI_OLD_SONG_CLASS",
      title: "보리 옛 노래 교실",
      domain: "음악",
      mediaKind: "song",
    },
  ].map((p) => ({
    ...p,
    character: "bori",
    characterName: "보리",
    role: "취미",
    difficulty: "쉬움",
    season: "공통",
    enabled: true,
    desc: "기관에서 이용 권한을 확인한 콘텐츠로 진행",
    holiday: null,
    lastUsed: null,
    usageCount: 0,
  }));
  function validateRecord(r) {
    if (
      !r ||
      !/^media-session-[\w-]+$/.test(r.id || "") ||
      !["song", "theater"].includes(r.kind) ||
      !Array.isArray(r.participants) ||
      r.participants.length > 200 ||
      !Number.isFinite(r.watchedSeconds) ||
      r.watchedSeconds < 0 ||
      r.watchedSeconds > 86400 ||
      !Number.isFinite(Date.parse(r.startedAt))
    )
      throw Error("감상 기록 형식을 확인해주세요.");
    const text = (v, n) => String(v || "").slice(0, n),
      number = (v) => Math.max(0, Math.min(86400, Number(v) || 0));
    const participants = r.participants.map((id) => text(id, 100));
    return {
      id: r.id,
      contentId: text(r.contentId, 100),
      kind: r.kind,
      title: text(r.title, 100),
      participants,
      startedAt: new Date(r.startedAt).toISOString(),
      date:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(r.startedAt)),
      endedAt: Number.isFinite(Date.parse(r.endedAt))
        ? new Date(r.endedAt).toISOString()
        : null,
      savedAt: Number.isFinite(Date.parse(r.savedAt))
        ? new Date(r.savedAt).toISOString()
        : new Date().toISOString(),
      watchedSeconds: r.watchedSeconds,
      position: number(r.position),
      maxPosition: number(r.maxPosition),
      mediaDuration: number(r.mediaDuration),
      completionPercent: Math.min(100, number(r.completionPercent)),
      completed: r.completed === true,
      replayCount: Math.floor(number(r.replayCount)),
      memoryResponse: text(r.memoryResponse, 50),
      mood: text(r.mood, 30),
      notes: text(r.notes, 1500),
      parentSessionId: text(r.parentSessionId, 100) || null,
      responses: Object.fromEntries(
        participants.map((id) => [
          id,
          {
            memoryResponse: text(r.responses?.[id]?.memoryResponse, 50),
            mood: text(r.responses?.[id]?.mood, 30),
          },
        ]),
      ),
    };
  }
  return {
    validateRecord,
    categories,
    https,
    youtube,
    validate,
    recommend,
    lyricAt,
    lyricPage,
    notes,
    programs,
  };
});
