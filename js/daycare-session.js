/* Stateful 60-minute class controller; original room URLs and Google TTS are reused. */
(() => {
  "use strict";
  const D = SchoolOperations,
    $ = (id) => document.getElementById(id),
    type =
      new URLSearchParams(location.search).get("session") === "pm"
        ? "pm"
        : "am",
    key = "digital_school_daycare_resume_" + type;
  let session = null,
    frame = null,
    last = performance.now(),
    lastSave = 0,
    topic = -1,
    loaded = false,
    finalized = false;
  const store = OperationsStore,
    elders = DaycareSchedule.getElders(),
    room =
      type === "am"
        ? ["senior-exercise.html", "nabi-learn.html"]
        : ["tori-play.html", "bori-hobby.html"];
  function status(text) {
    $("classNotice").textContent = text;
  }
  function silence() {
    CharacterVoice?.stop();
    try {
      frame?.contentWindow.CharacterVoice?.stop();
    } catch {}
  }
  let childExercisePaused = false;
  function pauseChild(paused) {
    if (!frame) return;
    frame.inert = paused;
    try {
      if (paused) frame.contentWindow.BoriMediaPlayer?.pause();
      const button = frame.contentDocument.getElementById("btnPause");
      if (paused && button?.getAttribute("aria-label") === "체조 잠시 멈춤") {
        button.click();
        childExercisePaused = true;
      } else if (!paused && childExercisePaused) {
        if (button?.getAttribute("aria-label") === "체조 이어서 하기")
          button.click();
        childExercisePaused = false;
      }
      if (paused)
        frame.contentDocument
          .querySelectorAll("audio,video")
          .forEach((media) => media.pause());
    } catch {}
  }
  function save() {
    if (session && !finalized) {
      session.savedAt = new Date().toISOString();
      try {
        localStorage.setItem(key, JSON.stringify(session));
        D.upsert(store.get().sessions, session);
        if (!store.save()) status(store.getError());
      } catch {
        status("진행 상태를 저장하지 못했습니다. 선생님께 알려주세요.");
      }
    }
  }
  function guide() {
    if (!session) return;
    silence();
    const phase = D.phases[session.phase]?.[0],
      id =
        type === "am"
          ? phase === "act2"
            ? "nabi"
            : "kongi"
          : phase === "act2"
            ? "bori"
            : "tori";
    const text = {
      greeting: "안녕하세요. 오늘도 만나서 반가워요. 천천히 함께해요.",
      act1:
        type === "am"
          ? "의자에 편안히 앉아, 아프지 않은 범위에서 천천히 움직여요."
          : "토리와 재미있는 놀이를 해볼까요?",
      break: "잠깐 쉬면서 편안하게 숨을 골라요.",
      act2:
        type === "am"
          ? "정답을 몰라도 괜찮아요. 천천히 생각해봐요."
          : "보리와 편안하게 즐겨봐요.",
      wrapup: "오늘 어떤 활동이 가장 재미있으셨어요? 힘든 활동이 있었나요?",
    }[phase];
    if (text) CharacterVoice.speak(id, text);
  }
  function captureMedia() {
    try {
      const child = frame?.contentWindow.BoriMediaPlayer;
      child?.checkpoint();
      const r = child?.getState().record;
      if (r?.parentSessionId === session.id) {
        session.mediaResults = session.mediaResults || [];
        D.upsert(session.mediaResults, r);
      }
    } catch {}
  }
  function setFrame(force = false) {
    const phase = D.phases[session.phase]?.[0];
    const mediaActivity =
      type === "pm" && phase === "act2"
        ? session.program?.activities?.find((a) => a.character === "bori")
        : null;
    const mediaRoute = mediaActivity
      ? window.SchoolActivityRoutes?.resolve(mediaActivity, "bori")
      : null;
    if (!["act1", "act2"].includes(phase)) {
      captureMedia();
      frame?.remove();
      frame = null;
      return;
    }
    const host = $(phase === "act1" ? "act1Content" : "act2Content"),
      index = mediaRoute?.media ? 0 : Math.floor(session.phaseSeconds / 180);
    if (frame && !force && topic === index) return;
    silence();
    captureMedia();
    frame?.remove();
    topic = index;
    loaded = false;
    frame = document.createElement("iframe");
    frame.className = "activity-frame";
    frame.title = phase === "act1" ? "첫 번째 활동" : "두 번째 활동";
    frame.src =
      (mediaRoute?.media ? mediaRoute.url : room[phase === "act1" ? 0 : 1]) +
      "?embedded=class&level=" +
      recommendLevel() +
      "&participants=" +
      encodeURIComponent(session.participants.join(",")) +
      "&sessionId=" +
      encodeURIComponent(session.id);
    host.replaceChildren(frame);
    frame.addEventListener("load", () => {
      loaded = true;
      if (mediaRoute?.media) return;
      try {
        const doc = frame.contentDocument;
        const nav = doc.querySelector("header");
        if (nav) nav.hidden = true;
        const choices =
          type === "am"
            ? phase === "act1"
              ? ["#btnStart"]
              : [
                  '[data-learn="today"]',
                  '[data-learn="season"]',
                  '[data-learn="number"]',
                  '[data-learn="proverb"]',
                ]
            : phase === "act1"
              ? [
                  '[data-game="match"]',
                  '[data-game="color"]',
                  '[data-game="season"]',
                  '[data-game="animal"]',
                ]
              : [
                  '[data-tab="song"]',
                  '[data-tab="story"]',
                  '[data-tab="color"]',
                  '[data-tab="riddle"]',
                ];
        const extension = frame.contentWindow.ExtendedActivities;
        const character =
          type === "am"
            ? phase === "act1"
              ? "kongi"
              : "nabi"
            : phase === "act1"
              ? "tori"
              : "bori";
        const scheduled = session.program?.activities?.find(
          (a) => a.character === character,
        );
        const route = window.SchoolActivityRoutes?.resolve(
          scheduled,
          character,
        );
        let extended = false;
        if (scheduled && index === 0 && route?.extension && extension) {
          extension.start(route.extension);
          extended = true;
        }
        if (!extended && extension && type === "pm" && phase === "act1") {
          extension.start(
            [
              "match",
              "color",
              "animal",
              "fruit",
              "different",
              "season",
              "objects",
            ][index % 7],
          );
          extended = true;
        } else if (
          !extended &&
          extension &&
          type === "am" &&
          phase === "act2" &&
          index % 2 === 1
        ) {
          extension.start(
            ["고향", "학교", "가족", "음식", "명절", "시장", "어린시절놀이"][
              Math.floor(index / 2) % 7
            ],
          );
          extended = true;
        }
        const button = doc.querySelector(
          scheduled && index === 0 && route?.selector
            ? route.selector
            : choices[index % choices.length],
        );
        if (!extended) button?.click();
        if (!extended && !button) status("화면에서 원하는 활동을 골라주세요.");
        if (session.status === "paused") {
          frame.inert = true;
          silence();
        }
      } catch {
        status("활동을 불러오지 못했어요. 다시하기를 눌러주세요.");
      }
    });
  }
  function recommendLevel() {
    const rows = store
      .get()
      .participationRecords.filter((r) =>
        session.participants.includes(r.seniorId),
      )
      .slice(-10);
    return rows.some(
      (r) => r.participation === "참여 어려움" || r.assistance === "많은 도움",
    )
      ? 1
      : rows.some((r) => r.participation === "적극 참여")
        ? 3
        : 2;
  }
  function paint() {
    if (!session) return;
    const end = ["completed", "cancelled"].includes(session.status),
      phase = end ? "mood" : D.phases[session.phase][0];
    document
      .querySelectorAll(".step-card")
      .forEach((el) =>
        el.classList.toggle("hidden", el.id !== "card_" + phase),
      );
    $("classControls").hidden = end;
    const minutes = Math.floor(session.elapsedSeconds / 60);
    $("timerDisplay").textContent =
      `${type === "am" ? "오전" : "오후"} 수업 · ${minutes}분 / 60분`;
    $("classProgress").value = end
      ? 100
      : Math.min(
          99,
          Math.round(
            (D.phases.slice(0, session.phase).reduce((n, p) => n + p[1], 0) +
              session.phaseSeconds) /
              36,
          ),
        );
    $("btnClassPause").textContent =
      session.status === "paused" ? "▶ 계속하기" : "⏸ 일시정지";
    if (end) {
      frame?.remove();
      frame = null;
      save();
      renderEvaluation();
      return;
    }
    const char =
      type === "am"
        ? phase === "act2"
          ? "nabi"
          : "kongi"
        : phase === "act2"
          ? "bori"
          : "tori";
    $("greetingCharImg").src = "assets/images/uniform-" + char + ".png";
    $("greetingText").textContent = "안녕하세요. 오늘도 만나서 반가워요!";
    $("wrapupDesc").textContent =
      "오늘 어떤 활동이 가장 재미있으셨어요? 운동은 힘들지 않으셨어요?";
    setFrame();
  }
  function move(action) {
    if (!session) return;
    silence();
    if (action === "pause") {
      session.status = session.status === "paused" ? "running" : "paused";
      pauseChild(session.status === "paused");
    } else {
      if (session.status !== "running") return;
      if (action === "next") D.advance(session, true);
      if (action === "prev") D.previous(session);
      if (action === "restart") {
        session.phaseSeconds = 0;
        topic = -1;
        setFrame(true);
      }
    }
    save();
    paint();
    if (
      action !== "pause" &&
      session.status === "running" &&
      !["act1", "act2"].includes(D.phases[session.phase][0])
    )
      guide();
    last = performance.now();
  }
  function start() {
    const selected = [
      ...document.querySelectorAll("[name=attendanceElder]:checked"),
    ].map((el) => el.value);
    if (!selected.length) {
      status("함께하실 어르신을 먼저 선택해주세요.");
      return;
    }
    const active = store
      .get()
      .programs.find(
        (p) =>
          p.status === "active" &&
          p.start <= D.dateKey() &&
          p.end >= D.dateKey(),
      );
    const day = active?.days.find((d) => d.date === D.dateKey());
    const fallback = DaycareSchedule.getTodayProgram()[type];
    const program =
      day && !day.off
        ? {
            id: active.id,
            title: day[type].activities.map((a) => a.title).join(" · "),
            activities: day[type].activities,
          }
        : {
            id: "baseline-" + D.dateKey(),
            title: fallback.activity + " · " + fallback.partnerActivity,
          };
    session = D.createSession(type, selected, program);
    $("attendanceGrid").inert = true;
    save();
    paint();
    guide();
  }
  function renderEvaluation() {
    const host = $("evaluationFields");
    if (host.dataset.session === session.id) return;
    host.dataset.session = session.id;
    host.replaceChildren();
    for (const id of session.participants) {
      const field = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = elders.find((e) => e.id === id)?.masked || id;
      field.append(legend);
      field.dataset.senior = id;
      for (const [name, label, choices] of [
        [
          "participation",
          "참여도",
          ["적극 참여", "보통", "소극적", "참여 어려움"],
        ],
        ["expression", "표정", ["밝음", "편안함", "무표정", "피곤함"]],
        ["assistance", "도움 정도", ["독립", "부분 도움", "많은 도움"]],
        ["mood", "기분", ["매우 좋음", "좋음", "보통", "좋지 않음"]],
      ]) {
        const l = document.createElement("label");
        l.textContent = label;
        const select = document.createElement("select");
        select.name = name;
        select.setAttribute("aria-label", legend.textContent + " " + label);
        for (const c of ["", ...choices])
          select.add(new Option(c || "아직 입력하지 않음", c));
        l.append(select);
        field.append(l);
      }
      const l = document.createElement("label");
      l.textContent = "특이사항";
      const t = document.createElement("textarea");
      t.name = "notes";
      t.maxLength = 2000;
      l.append(t);
      field.append(l);
      host.append(field);
    }
  }
  function finishEvaluation() {
    const evaluations = {};
    $("evaluationFields")
      .querySelectorAll("fieldset")
      .forEach((f) => {
        const e = {};
        f.querySelectorAll("select,textarea").forEach(
          (input) => (e[input.name] = input.value),
        );
        evaluations[f.dataset.senior] = e;
        if (session.mediaResults?.length)
          e.notes = [
            e.notes,
            ...session.mediaResults.map(
              (r) =>
                `감상: ${r.title} · 실제 재생 ${Math.round(r.watchedSeconds)}초 · 다시보기 ${r.replayCount}회 · 회상 ${r.responses?.[f.dataset.senior]?.memoryResponse || "미입력"} · 기분 ${r.responses?.[f.dataset.senior]?.mood || "미입력"}`,
            ),
          ]
            .filter(Boolean)
            .join("\n")
            .slice(0, 2000);
      });
    D.saveEvaluation(store.get(), session, evaluations);
    if (!store.save()) {
      status(store.getError());
      return;
    }
    for (const id of session.participants) {
      const r = store
        .get()
        .participationRecords.find((r) => r.id === session.id + ":" + id);
      if (
        !RecordManager.getAllRecords().some(
          (old) => old.operationsRecordId === r.id,
        )
      )
        RecordManager.saveRecord({
          operationsRecordId: r.id,
          learner: (elders.find((e) => e.id === id)?.masked || id) + " 어르신",
          elder_id: id,
          rawDate: r.date,
          timeSlot: type === "am" ? "오전" : "오후",
          sessionType: type,
          lessonTitle: r.programTitle,
          durationText: (r.durationSeconds / 60).toFixed(1) + "분",
          isCompleted: r.completed,
          participation: r.participation || "미입력",
          assistance: r.assistance || "미입력",
          assistanceNeeded: r.assistance || "미입력",
          mood: r.mood || "미입력",
          notes: r.notes || "입력 없음",
        });
    }
    finalized = true;
    localStorage.removeItem(key);
    document
      .querySelectorAll(".step-card")
      .forEach((el) => el.classList.toggle("hidden", el.id !== "card_done"));
    $("doneSummaryText").textContent =
      `실제 참여 ${(session.elapsedSeconds / 60).toFixed(1)}분 · 평가와 일지 초안을 이 기기에 저장했어요.`;
    $("saveAssessment").disabled = true;
    window.OperationsSync?.flush().catch((e) => status(e.message));
  }
  function init() {
    const notice = document.createElement("p");
    notice.id = "classNotice";
    notice.setAttribute("role", "status");
    document.querySelector("main").prepend(notice);
    const progress = document.createElement("progress");
    progress.id = "classProgress";
    progress.max = 100;
    progress.value = 0;
    progress.setAttribute("aria-label", "수업 진행률");
    document.querySelector(".daycare-timer-wrap").append(progress);
    $("classControls").hidden = true;
    $("sessionBadge").textContent =
      type === "am" ? "🌞 오전 정규 수업" : "🌤 오후 정규 수업";
    $("attendanceGrid").replaceChildren();
    elders.forEach((e) => {
      const label = document.createElement("label");
      label.className = "attendance-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "attendanceElder";
      input.value = e.id;
      label.append(
        input,
        document.createTextNode(e.masked + " (" + e.id + ")"),
      );
      $("attendanceGrid").append(label);
    });
    $("btnStartClass").onclick = start;
    $("btnSelectAllAttendance").onclick = () => {
      const a = [...document.querySelectorAll("[name=attendanceElder]")],
        all = a.every((e) => e.checked);
      a.forEach((e) => (e.checked = !all));
    };
    $("btnClassPause").onclick = () => move("pause");
    $("btnVoiceReplay").onclick = () => {
      if (session?.status === "running") guide();
    };
    $("btnTakeBreak").textContent = "🐢 천천히";
    $("btnTakeBreak").onclick = () => {
      const slow = !CharacterVoice.getState().slow;
      localStorage.setItem(
        "digital_school_voice_speed",
        slow ? "slow" : "normal",
      );
      CharacterVoice.setSlow(slow);
      $("btnTakeBreak").setAttribute("aria-pressed", String(slow));
    };
    for (const id of [
      "btnGreetingNext",
      "btnAct1Next",
      "btnBreakContinue",
      "btnAct2Next",
      "btnWrapupNext",
    ])
      $(id).onclick = () => move("next");
    $("btnAct1Prev").onclick = () => move("prev");
    $("previousPhase").onclick = () => move("prev");
    $("nextPhase").onclick = () => move("next");
    $("restartPhase").onclick = () => move("restart");
    $("saveAssessment").onclick = finishEvaluation;
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (
        saved?.id &&
        saved?.date === D.dateKey() &&
        saved.status === "completed"
      ) {
        session = saved;
        paint();
      } else if (
        saved?.id &&
        saved?.date === D.dateKey() &&
        !["completed", "cancelled"].includes(saved.status)
      ) {
        $("resumeModal").classList.remove("hidden");
        $("btnResumeYes").onclick = () => {
          session = saved;
          session.status = "paused";
          $("resumeModal").classList.add("hidden");
          paint();
        };
        $("btnResumeNo").onclick = () => {
          saved.status = "cancelled";
          saved.endedAt = new Date().toISOString();
          D.upsert(store.get().sessions, saved);
          store.save();
          localStorage.removeItem(key);
          $("resumeModal").classList.add("hidden");
        };
      }
    } catch {
      status("이전 수업 상태를 읽지 못했어요. 새 수업을 시작할 수 있습니다.");
    }
    setInterval(() => {
      const now = performance.now(),
        seconds = Math.min(2, (now - last) / 1000);
      last = now;
      if (session?.status === "running" && !document.hidden) {
        const before = session.phase;
        D.tick(session, seconds);
        if (before !== session.phase) {
          silence();
          topic = -1;
          paint();
          if (
            session.status === "running" &&
            !["act1", "act2"].includes(D.phases[session.phase][0])
          )
            guide();
        } else {
          $("timerDisplay").textContent =
            `${type === "am" ? "오전" : "오후"} 수업 · ${Math.floor(session.elapsedSeconds / 60)}분 / 60분`;
          $("classProgress").value = Math.min(
            99,
            Math.round(
              (D.phases.slice(0, session.phase).reduce((n, p) => n + p[1], 0) +
                session.phaseSeconds) /
                36,
            ),
          );
          if (loaded) setFrame();
        }
        if (now - lastSave > 30000) {
          save();
          lastSave = now;
        }
      }
    }, 500);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && session?.status === "running") {
        session.status = "paused";
        pauseChild(true);
        silence();
        save();
        paint();
      }
      last = performance.now();
    });
    window.addEventListener("pagehide", () => {
      if (session?.status === "running") session.status = "paused";
      silence();
      save();
    });
    window.addEventListener("offline", () =>
      status("인터넷 연결이 끊겼어요. 진행 상태는 이 기기에 저장됩니다."),
    );
    window.addEventListener("online", () => status("인터넷이 연결되었습니다."));
  }
  window.addEventListener("message", (e) => {
    if (
      e.origin === location.origin &&
      e.source === frame?.contentWindow &&
      e.data?.type === "bori-media-result" &&
      session
    ) {
      const r = e.data.record;
      if (r?.parentSessionId !== session.id) return;
      session.mediaResults = session.mediaResults || [];
      D.upsert(session.mediaResults, {
        id: String(r.id).slice(0, 100),
        title: String(r.title).slice(0, 100),
        watchedSeconds: Math.max(
          0,
          Math.min(86400, Number(r.watchedSeconds) || 0),
        ),
        replayCount: Math.max(0, Number(r.replayCount) || 0),
        memoryResponse: String(r.memoryResponse || "").slice(0, 50),
        mood: String(r.mood || "").slice(0, 30),
        responses: Object.fromEntries(
          session.participants.map((id) => [
            id,
            {
              memoryResponse: String(
                r.responses?.[id]?.memoryResponse || "",
              ).slice(0, 50),
              mood: String(r.responses?.[id]?.mood || "").slice(0, 30),
            },
          ]),
        ),
      });
      save();
      return;
    }
    if (
      e.origin !== location.origin ||
      e.source !== frame?.contentWindow ||
      e.data?.type !== "school-activity-result" ||
      session?.status !== "running"
    )
      return;
    session.results.push({
      character: String(e.data.character).slice(0, 10),
      category: String(e.data.category).slice(0, 40),
      questionId: String(e.data.questionId).slice(0, 100),
      correct: e.data.correct === true,
      at: new Date().toISOString(),
    });
    save();
  });
  document.addEventListener("DOMContentLoaded", init);
})();
