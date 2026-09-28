(() => {
  "use strict";
  const app = document.getElementById("mediaApp"),
    kind = document.body.dataset.mediaKind,
    M = BoriMediaDomain,
    S = BoriMediaStore,
    D = SchoolOperations;
  const params = new URLSearchParams(location.search),
    embedded = params.get("embedded") === "class";
  const image = "assets/images/everyday/bori-active.png",
    resumeKey = "school_bori_resume_" + kind;
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const button = (text, action) =>
    `<button type="button" data-action="${action}">${text}</button>`;
  const guide = (text) =>
    `<div class="media-guide"><img src="${image}" alt="보리"><p>${text}</p></div>`;
  const format = (n) =>
    `${Math.floor((n || 0) / 60)}분 ${Math.floor((n || 0) % 60)}초`;
  document.body.classList.toggle(
    "media-large",
    ["large", "xlarge"].includes(
      localStorage.getItem("digital_school_font_scale"),
    ),
  );
  document.body.classList.toggle(
    "media-high-contrast",
    localStorage.getItem("digital_school_high_contrast") === "true",
  );
  let content,
    record,
    player,
    video,
    yt,
    url,
    playing = false,
    last = performance.now(),
    lastSave = 0,
    generation = 0,
    finishing = false,
    autoNext = localStorage.getItem("school_bori_auto_next") !== "off",
    participants = [],
    slow = false;
  let state = "select";
  function notice(text) {
    const el = app.querySelector("#mediaStatus");
    if (el) el.textContent = text;
  }
  function speak(text) {
    window.CharacterVoice?.stop();
    window.CharacterVoice?.speak("bori", text).catch(() => {});
  }
  function safeSave(final = false) {
    if (!record) return;
    try {
      record.position = player?.time() || record.position || 0;
      record.mediaDuration =
        player?.duration() || record.mediaDuration || content.duration || 0;
      record.completionPercent = record.mediaDuration
        ? Math.min(
            100,
            Math.round(
              ((record.watchedSeconds || 0) / record.mediaDuration) * 100,
            ),
          )
        : 0;
      record.savedAt = new Date().toISOString();
      record.date=record.startedAt?D.dateKey(record.startedAt):null;
      S.saveRecord(record);
      localStorage.setItem(resumeKey, JSON.stringify(record));
      if (final) saveOperations();
    } catch {
      notice("기록을 저장하지 못했어요. 저장 공간을 확인해주세요.");
    }
  }
  function saveOperations() {
    if (!record || !record.startedAt) return;
    if (embedded) {
      parent.postMessage(
        { type: "bori-media-result", record },
        location.origin,
      );
      return;
    }
    if (!record.participants.length) return;
    const session = {
      id: record.id,
      date: D.dateKey(record.startedAt),
      type: "pm",
      participants: record.participants,
      programId: "BORI_" + kind,
      program: {
        title: kind === "song" ? "보리 옛 노래 교실" : "보리 추억극장",
      },
      status: record.completed ? "completed" : "cancelled",
      startedAt: record.startedAt,
      endedAt: record.endedAt || new Date().toISOString(),
      elapsedSeconds: record.watchedSeconds,
      phaseTimes: { act2: record.watchedSeconds },
      results: [],
      mediaRecordId: record.id,
    };
    const evaluations = Object.fromEntries(
      record.participants.map((id) => [
        id,
        {
          mood:
            record.responses?.[id]?.mood ||
            (record.participants.length === 1 ? record.mood : "") ||
            "",
          notes: M.notes({
            ...record,
            mood: "",
            memoryResponse: "",
            ...record.responses?.[id],
          }),
          participation: "",
          expression: "",
          assistance: "",
        },
      ]),
    );
    D.saveEvaluation(OperationsStore.get(), session, evaluations);
    if (!OperationsStore.save()) throw Error("저장 실패");
    OperationsSync.flush().catch(() => {});
  }
  function pause() {
    if (player) player.pause();
    playing = false;
    safeSave(true);
  }
  function cleanup() {
    generation++;
    if(record?.startedAt&&!record.completed)record.endedAt=new Date().toISOString();
    if (record) pause();
    player?.destroy?.();
    player = null;
    video = null;
    yt = null;
    if (url) {
      URL.revokeObjectURL(url);
      url = null;
    }
    window.CharacterVoice?.stop();
  }
  async function list() {
    cleanup();
    record = null;
    content = null;
    state = "select";
    app.innerHTML = '<p role="status">콘텐츠를 확인하고 있어요.</p>';
    await S.refresh();
    const saved = S.read(),
      items = saved.contents
        .filter((c) => c.kind === kind && c.enabled && !c.deletedAt)
        .sort((a, b) => a.order - b.order),
      recommended = M.recommend(items, saved.records, kind, D.dateKey());
    app.innerHTML =
      guide(
        kind === "song" ? "저와 같이 불러봐요." : "편안하게 추억을 나눠요.",
      ) +
      (items.length
        ? "<h2>함께할 " +
          (kind === "song" ? "노래" : "영상") +
          '를 골라주세요</h2><div class="media-cards">' +
          items
            .map(
              (c) =>
                `<button class="media-card" data-content="${esc(c.id)}">${c.thumbnail ? `<img src="${esc(c.thumbnail)}" alt="">` : ""}<span>${recommended?.id === c.id ? "🌞 오늘 추천 · " : ""}${esc(c.title)}<br><small>${esc(c.category)}${c.videoType === "local" ? " · 이 기기 파일" : ""}</small></span></button>`,
            )
            .join("") +
          "</div>"
        : '<div class="media-panel"><h2>함께 볼 콘텐츠를 준비하고 있어요.</h2><p>선생님 공간의 영상·음악 콘텐츠 관리에서 등록해주세요.</p><a href="bori-hobby.html">보리의 다른 활동 보기</a></div>') +
      '<p id="mediaStatus" role="status"></p>';
  }
  function choose(id) {
    window.scrollTo(0, 0);
    content = S.read().contents.find(
      (c) => c.id === id && c.enabled && !c.deletedAt,
    );
    if (!content) return;
    let resume;
    try {
      resume = JSON.parse(localStorage.getItem(resumeKey));
    } catch {}
    const canResume =
      resume?.contentId === id && !resume.completed && resume.position > 0;
    state = "ready";
    app.innerHTML = `<h2>${esc(content.title)}</h2>${guide("천천히 하셔도 괜찮아요.")}<fieldset id="mediaParticipants"><legend>함께하실 어르신</legend>${
      embedded
        ? "<p>현재 수업 대상자와 연결됩니다.</p>"
        : DaycareSchedule.getElders()
            .map(
              (e) =>
                `<label><input type="checkbox" value="${esc(e.id)}">${esc(e.masked)} (${esc(e.id)})</label>`,
            )
            .join("")
    }</fieldset><p>대상자를 선택하지 않으면 개인 일지 없이 체험 기록만 저장합니다.</p>${canResume ? `<p>${format(resume.position)}부터 이어서 볼까요?</p>` : ""}<div class="media-actions">${canResume ? button("이어서 보기", "resume") : ""}${button(canResume ? "처음부터 보기" : kind === "song" ? "▶ 노래 시작" : "▶ 영상 준비", "start")}${button("다른 콘텐츠 고르기", "list")}</div><p id="mediaStatus" role="status"></p>`;
    if (canResume && !embedded)
      for (const el of app.querySelectorAll("input"))
        el.checked = resume.participants.includes(el.value);
  }
  async function start(resume = false) {
    participants = embedded
      ? (params.get("participants") || "").split(",").filter(Boolean)
      : [...app.querySelectorAll("#mediaParticipants input:checked")].map(
          (e) => e.value,
        );
    const previous = resume
      ? JSON.parse(localStorage.getItem(resumeKey) || "null")
      : null;
    record =
      previous?.contentId === content.id
        ? previous
        : {
            id: "media-session-" + crypto.randomUUID(),
            contentId: content.id,
            kind,
            title: content.title,
            participants,
            startedAt: null,
            endedAt: null,
            watchedSeconds: 0,
            position: 0,
            maxPosition: 0,
            completed: false,
            replayCount: 0,
            memoryResponse: "",
            mood: "",
            notes: "",
            parentSessionId: params.get("sessionId") || null,
          };
    await mount(record.position || 0, true);
  }
  function error() {
    playing = false;
    state = "error";
    app.querySelector("#mediaStatus")?.classList.remove("media-loading");
    notice(
      kind === "song"
        ? "노래를 불러오지 못했어요."
        : "영상을 불러오지 못했어요.",
    );
    if (app.querySelector("#mediaError"))
      app.querySelector("#mediaError").hidden = false;
    safeSave(true);
  }
  async function mount(position, autoplay = false) {
    const token = ++generation;
    player?.destroy?.();
    player = null;
    video = null;
    yt = null;
    if (url) {
      URL.revokeObjectURL(url);
      url = null;
    }
    state = "playing";
    finishing = false;
    playing = false;
    slow = false;
    window.scrollTo(0, 0);
    app.innerHTML = `<h2>${esc(content.title)}</h2><div id="mediaVisual" class="media-visual"></div><p id="mediaStatus" class="media-message media-loading" role="status">영상을 준비하고 있어요.</p><div id="mediaError" hidden class="media-actions">${button("다시 시도", "retry")}${button("다른 영상 보기", "list")}<a href="bori-hobby.html">보리 취미방 홈</a></div><div id="mediaLyrics" class="media-lyrics" ${kind === "song" ? "" : "hidden"}></div><progress id="mediaProgress" max="100" value="0" aria-label="재생 진행률"></progress><p id="mediaTime">0분 0초</p><div class="media-actions">${button(kind === "song" ? "▶ 노래 시작" : "▶ 재생", "play")}${button(kind === "song" ? "⏸ 잠시 쉬기" : "⏸ 일시정지", "pause")}${button(kind === "song" ? "🔁 다시 부르기" : "🔁 다시보기", "replay")}${kind === "song" ? button("🐢 천천히", "slow") : ""}${button("🔉 소리 작게", "quieter")}${button("🔊 소리 크게", "louder")}${button("⛶ 크게 보기", "fullscreen")}${button("감상 마치기", "stop")}</div><label><input id="autoNext" type="checkbox" ${autoNext ? "checked" : ""}>자동 다음 단계</label><div id="manualNext" hidden>${button("이야기 나누기", "finish")}</div>${guide(kind === "song" ? "저와 같이 불러봐요. 힘드시면 잠깐 쉬어가요." : "어떤 장면이 기억에 남으세요?")}`;
    const visual = app.querySelector("#mediaVisual");
    const ready = () => {
      if (token !== generation) return;
      app.querySelector("#mediaStatus")?.classList.remove("media-loading");
      notice("준비됐어요. 재생 버튼을 눌러주세요.");
      if (autoplay)
        Promise.resolve(player?.play()).catch(() =>
          notice("재생 버튼을 눌러주세요."),
        );
    };
    const onPlaying = () => {
      if (token !== generation) return;
      playing = true;
      last = performance.now();
      if (!record.startedAt) record.startedAt = new Date().toISOString();
      if(!record.completed)record.endedAt=null;
      window.CharacterVoice?.stop();
      notice("천천히 함께해요.");
    };
    try {
      if (content.videoType === "youtube") {
        await youtubeReady();
        if (token !== generation) return;
        const target = document.createElement("div");
        visual.append(target);
        yt = new YT.Player(target, {
          host: "https://www.youtube-nocookie.com",
          videoId: M.youtube(content.videoUrl),
          playerVars: { origin: location.origin, playsinline: 1, autoplay: 0 },
          events: {
            onReady: () => {
              if (token !== generation) return;
              yt.seekTo(position, true);
              yt.pauseVideo();
              ready();
            },
            onError: () => {
              if (token === generation) error();
            },
            onStateChange: (e) => {
              if (token !== generation) return;
              if (e.data === 1) onPlaying();
              else {
                playing = false;
                if (e.data === 0) ended();
              }
            },
            onPlaybackRateChange: (e) => {
              slow = e.data < 1;
              notice(slow ? "천천히 재생해요." : "보통 빠르기로 재생해요.");
            },
          },
        });
        player = {
          play: () => yt.playVideo(),
          pause: () => yt.pauseVideo?.(),
          time: () => yt.getCurrentTime?.() || 0,
          duration: () => yt.getDuration?.() || 0,
          seek: (n) => yt.seekTo(n, true),
          volume: (delta) =>
            yt.setVolume(
              Math.min(
                100,
                Math.max(0, (yt.getVolume?.() || 50) + delta * 100),
              ),
            ),
          rate: (n) => {
            if ((yt.getAvailablePlaybackRates?.() || []).includes(n))
              yt.setPlaybackRate(n);
            else notice("이 영상은 해당 재생속도를 지원하지 않아요.");
          },
          destroy: () => yt?.destroy(),
        };
      } else {
        let src = content.videoUrl,
          mime = content.mime;
        if (content.videoType === "local") {
          const blob = await S.file("get", content.fileId);
          if (token !== generation) return;
          if (!blob) throw Error("기기 파일 없음");
          url = URL.createObjectURL(blob);
          src = url;
          mime = blob.type;
        }
        const audio =
          ["mp3", "wav"].includes(content.videoType) ||
          mime?.startsWith("audio/");
        video = document.createElement(audio ? "audio" : "video");
        video.preload = "metadata";
        video.playsInline = true;
        video.controls = true;
        video.src = src;
        video.setAttribute("aria-label", content.title);
        visual.append(video);
        player = {
          play: () => video.play(),
          pause: () => video?.pause(),
          time: () => video?.currentTime || 0,
          duration: () =>
            Number.isFinite(video?.duration) ? video.duration : 0,
          seek: (n) => {
            video.currentTime = n;
          },
          volume: (delta) => {
            video.volume = Math.min(1, Math.max(0, video.volume + delta));
            video.muted = false;
          },
          rate: (n) => {
            video.playbackRate = n;
            slow = n < 1;
          },
          destroy: () => {
            video?.pause();
            video?.removeAttribute("src");
            video?.load();
          },
        };
        video.addEventListener("loadedmetadata", () => {
          if (token !== generation) return;
          video.currentTime = Math.min(position, video.duration || position);
          ready();
        });
        video.addEventListener("playing", onPlaying);
        video.addEventListener("pause", () => {
          if (token !== generation) return;
          playing = false;
          safeSave();
        });
        video.addEventListener("waiting", () => {
          if (token !== generation) return;
          playing = false;
          notice("영상을 준비하고 있어요.");
        });
        video.addEventListener("seeking", () => {
          if (token !== generation) return;
          playing = false;
        });
        video.addEventListener("seeked", () => {
          if (token !== generation) return;
          if (!video.paused) onPlaying();
        });
        video.addEventListener("ended", () => {
          if (token === generation) ended();
        });
        video.addEventListener("error", () => {
          if (token === generation) error();
        });
      }
      setTimeout(() => {
        if (
          token === generation &&
          app.querySelector("#mediaStatus")?.classList.contains("media-loading")
        )
          error();
      }, 20000);
    } catch {
      if (token === generation) error();
    }
  }
  function ended() {
    if (finishing || !record) return;
    playing = false;
    finishing = true;
    record.completed = true;
    record.position = player.time();
    record.maxPosition = Math.max(record.maxPosition, record.position);
    record.endedAt = new Date().toISOString();
    safeSave(true);
    autoNext = app.querySelector("#autoNext")?.checked !== false;
    if (autoNext) finish();
    else {
      notice("재생이 끝났어요. 준비되면 이야기 나누기를 눌러주세요.");
      app.querySelector("#manualNext").hidden = false;
    }
  }
  function finish() {
    if (!record) return;
    pause();
    state = "completed";
    window.scrollTo(0, 0);
    record.endedAt = record.endedAt || new Date().toISOString();
    safeSave(true);
    app.innerHTML = `<h2>${kind === "theater" ? "추억 이야기 나누기" : record.completed ? "정말 잘하셨어요!" : "잠깐 쉬어가요."}</h2>${guide(kind === "theater" ? "가족들과 TV를 같이 보셨나요? 어떤 장면이 가장 기억에 남으세요?" : "오늘도 함께해주셔서 감사해요. 오늘 노래 어떠셨어요?")}<p>실제 재생 참여 ${format(record.watchedSeconds)} · 다시보기 ${record.replayCount}회</p>${
      kind === "theater"
        ? '<div class="media-actions">' +
          [
            ["😊 기억나요", "기억남"],
            ["🤔 잘 모르겠어요", "잘 모르겠음"],
            ["💬 이야기하고 싶어요", "이야기하고 싶음"],
          ]
            .map(([l, v]) => `<button data-response="${v}">${l}</button>`)
            .join("") +
          "</div>"
        : ""
    }<h3>오늘 기분은 어떠셨어요?</h3><div class="media-actions">${[
      ["😊 좋아요", "좋음"],
      ["😐 보통이에요", "보통"],
      ["😥 조금 힘들어요", "조금 힘듦"],
    ]
      .map(([l, v]) => `<button data-mood="${v}">${l}</button>`)
      .join(
        "",
      )}</div><p id="mediaStatus" role="status">${record.participants.length ? "기록을 저장했어요." : "체험 기록을 이 기기에 저장했어요."}</p><div class="media-actions">${button(kind === "song" ? "한 번 더 부르기" : "한 번 더 보기", "again")}${button("다음 활동으로", "next")}</div>`;
    if (record.participants.length > 1) {
      const label = document.createElement("label");
      label.textContent = "마음을 알려주실 어르신";
      const select = document.createElement("select");
      select.id = "mediaRespondent";
      for (const id of record.participants)
        select.add(
          new Option(
            DaycareSchedule.getElders().find((e) => e.id === id)?.masked || id,
            id,
          ),
        );
      label.append(select);
      app.querySelector("h2").after(label);
    }
    speak(
      kind === "theater"
        ? "어떤 장면이 가장 기억에 남으세요?"
        : "오늘 노래 어떠셨어요?",
    );
  }
  async function replay() {
    pause();
    record.replayCount++;
    record.completed = false;
    record.endedAt = null;
    record.position = 0;
    finishing = false;
    await mount(0, true);
  }
  app.addEventListener("change", (e) => {
    if (e.target.id === "autoNext") {
      autoNext = e.target.checked;
      localStorage.setItem("school_bori_auto_next", autoNext ? "on" : "off");
    }
  });
  app.addEventListener("click", async (e) => {
    try {
      const item = e.target.closest("[data-content]");
      if (item) {
        choose(item.dataset.content);
        return;
      }
      const reaction = e.target.closest("[data-response],[data-mood]");
      if (reaction) {
        const respondent =
          app.querySelector("#mediaRespondent")?.value ||
          record.participants[0];
        if (respondent) {
          record.responses = record.responses || {};
          const response = record.responses[respondent] || {};
          if (reaction.dataset.response)
            response.memoryResponse = reaction.dataset.response;
          if (reaction.dataset.mood) response.mood = reaction.dataset.mood;
          record.responses[respondent] = response;
        }
        if (reaction.dataset.response)
          record.memoryResponse = reaction.dataset.response;
        if (reaction.dataset.mood) record.mood = reaction.dataset.mood;
        safeSave(true);
        notice("마음을 알려주셔서 감사해요. 기록에 저장했어요.");
        return;
      }
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "list") await list();
      if (action === "start" || action === "resume")
        await start(action === "resume");
      if (action === "play") {
        window.CharacterVoice?.stop();
        await player?.play();
      }
      if (action === "pause") {
        pause();
        notice("잠시 쉬고 있어요.");
      }
      if (action === "replay" || action === "again") await replay();
      if (action === "retry") {
        cleanup();
        await mount(record.position || 0);
      }
      if (action === "slow") player?.rate(slow ? 1 : 0.75);
      if (action === "quieter" || action === "louder")
        player?.volume(action === "louder" ? 0.15 : -0.15);
      if (action === "fullscreen") {
        document.body.classList.toggle("media-focus");
        if (!document.fullscreenElement)
          await app.requestFullscreen?.().catch(() => {});
        else await document.exitFullscreen();
      }
      if (action === "stop" || action === "finish") finish();
      if (action === "next") {
        cleanup();
        state = "next";
        app.innerHTML =
          '<h2>다음 활동을 골라주세요</h2><div class="media-actions"><a class="media-entry" href="bori-hobby.html?activity=story">추억 이야기</a><a class="media-entry" href="bori-hobby.html?activity=color">그림·색칠하기</a>' +
          button("다른 " + (kind === "song" ? "노래" : "영상"), "list") +
          '<a class="media-entry" href="bori-hobby.html">보리 취미방 홈</a></div>';
      }
    } catch (e) {
      notice(e.message || "다시 시도해주세요.");
    }
  });
  const lyricMeasure = document.createElement("canvas").getContext("2d");
  setInterval(() => {
    const now = performance.now(),
      delta = Math.min(2, (now - last) / 1000);
    last = now;
    if (!record || !player || state !== "playing") return;
    if (playing && !document.hidden) record.watchedSeconds += delta;
    const time = player.time(),
      duration = player.duration();
    record.maxPosition = Math.max(record.maxPosition, time);
    const lyrics = app.querySelector("#mediaLyrics");
    if (lyrics) {
      const style = getComputedStyle(lyrics);
      lyricMeasure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      lyrics.textContent =
        M.lyricPage(
          content.lyrics || [],
          time,
          lyrics.clientWidth -
            parseFloat(style.paddingLeft) -
            parseFloat(style.paddingRight),
          (text) => lyricMeasure.measureText(text).width,
        ) || "♪ 편안하게 들어요.";
    }
    const p = app.querySelector("#mediaProgress");
    if (p) p.value = duration ? (time / duration) * 100 : 0;
    const t = app.querySelector("#mediaTime");
    if (t) t.textContent = `${format(time)} / ${format(duration)}`;
    if (now - lastSave > 5000) {
      safeSave();
      lastSave = now;
    }
  }, 250);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement)
      document.body.classList.remove("media-focus");
  });
  app.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG") {
        if (e.target.getAttribute("src") === image) {
          e.target.alt = "보리 원본 이미지 경로 확인 필요";
          notice("보리 원본 이미지 경로 확인 필요");
        } else e.target.hidden = true;
      }
    },
    true,
  );
  window.addEventListener("pagehide", () => {
    if(record?.startedAt&&!record.completed)record.endedAt=new Date().toISOString();
    pause();
  });
  window.BoriMediaPlayer = {
    pause,
    checkpoint: () => safeSave(true),
    getState: () => ({
      state,
      record: record ? structuredClone(record) : null,
    }),
  };
  let youtubePromise;
  function youtubeReady() {
    if (window.YT?.Player) return Promise.resolve();
    if (youtubePromise) return youtubePromise;
    youtubePromise = new Promise((resolve, reject) => {
      const old = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        old?.();
        resolve();
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => reject(Error("영상 연결 오류"));
      document.head.append(script);
      setTimeout(() => reject(Error("영상 연결 시간 초과")), 15000);
    });
    return youtubePromise;
  }
  list().catch(() => {
    app.textContent =
      "콘텐츠를 불러오지 못했어요. 새로고침하거나 보리 취미방으로 돌아가주세요.";
  });
})();
