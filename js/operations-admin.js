/* Teacher-only control surface: local proposals are explicitly not server scheduling. */
(() => {
  "use strict";
  const D = SchoolOperations,
    S = OperationsStore;
  let host,
    tab = "overview",
    cloudLoaded = false;
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
  const button = (label, action, data = "") =>
    `<button type="button" data-op="${action}" ${data}>${label}</button>`;
  function current() {
    return S.get();
  }
  function persist() {
    if (!S.save()) throw Error(S.getError());
  }
  function notice(text) {
    const e = host?.querySelector("[role=status]");
    if (e) e.textContent = text;
  }
  async function command(action, body, local) {
    if (AdminAccess.isCloud()) {
      const result = await AdminAccess.api(action, body);
      if (result.state) mergeServer(result.state);
    } else {
      local();
      persist();
    }
    render();
  }
  function mergeServer(server) {
    server.seniors = (server.seniors || []).map((s) => ({
      id: s.id,
      masked: s.masked,
    }));
    const local = S.get();
    server.syncMarks = local.syncMarks || {};
    const roster = DaycareSchedule.getElders();
    for (const senior of server.seniors)
      D.upsert(roster, { ...senior, name: senior.masked });
    DaycareSchedule.saveElders(roster);
    for (const key of ["sessions", "participationRecords"])
      for (const row of local[key])
        if (!server[key].some((r) => r.id === row.id)) server[key].push(row);
    S.replace(server);
  }
  function summary() {
    const s = current(),
      today = D.dateKey(),
      sessions = s.sessions.filter((x) => x.date === today),
      records = s.participationRecords.filter((r) => r.date === today);
    return `<nav class="hw-course-links" aria-label="수업 시작"><a href="daycare-class.html?session=am">오전 수업 시작 · 60분</a><a href="daycare-class.html?session=pm">오후 수업 시작 · 60분</a><a href="daily-course.html">간편 수업 · 20분</a></nav><h2>오늘 수업</h2><p>${today} · 완료 수업 ${sessions.filter((x) => x.status === "completed").length}회 · 참여 어르신 ${new Set(records.map((r) => r.seniorId)).size}명</p><p>확인할 일지 ${s.dailyReports.filter((r) => r.status !== "approved").length}건 · 승인 대기 프로그램 ${s.programs.filter((p) => p.status === "pending").length}건</p><p>서버 최근 실행: ${esc(s.lastServerRun || "실행 확인 전")}</p>${(
      s.notifications || []
    )
      .filter((n) => !n.read)
      .slice(-5)
      .map((n) => `<p>${esc(n.text)}</p>`)
      .join("")}`;
  }
  function programs() {
    const s = current(),
      start = D.addDays(D.monday(D.dateKey()), 7);
    return `<h2>다음 주 프로그램</h2><label>시작 월요일 <input type="date" id="opsWeekStart" value="${start}"></label>${button("다음 주 초안 생성", "generate")}<p>최근 14일 활동은 가능한 한 제외합니다. 후보가 부족하면 반복 표시를 확인해주세요.</p>${s.programs
      .slice()
      .reverse()
      .map(
        (p) =>
          `<article><h3>${esc(p.start)} ~ ${esc(p.end)} · ${esc(p.status)}</h3>${p.days.map((d) => `<p>${esc(d.date)} ${d.off ? "휴무" : esc([...d.am.activities, ...d.pm.activities].map((a) => a.title + (a.repeated ? " (최근 활동 반복)" : "")).join(" · "))}</p>`).join("")}${["pending", "draft"].includes(p.status) ? button("승인", "approve", `data-id="${esc(p.id)}"`) + button("수정", "edit-program", `data-id="${esc(p.id)}"`) + button("반려", "reject", `data-id="${esc(p.id)}"`) : ""}</article>`,
      )
      .join("")}`;
  }
  function records() {
    const s = current();
    return `<h2>대상자별 수업 기록</h2>${s.participationRecords.length ? "" : "<p>아직 평가 기록이 없습니다.</p>"}<div class="table-scroll"><table><thead><tr><th>날짜 / 대상자</th><th>수업 / 시간</th><th>평가</th></tr></thead><tbody>${s.participationRecords
      .slice()
      .reverse()
      .map(
        (r) =>
          `<tr><td>${esc(r.date)} / ${esc(r.seniorId)}</td><td>${esc(r.programTitle)} / ${(r.durationSeconds / 60).toFixed(1)}분</td><td>${esc(r.participation || "미입력")} · ${esc(r.assistance || "미입력")} · ${esc(r.mood || "미입력")}</td></tr>`,
      )
      .join(
        "",
      )}</tbody></table></div>${button("서버로 미전송 기록 동기화", "sync")}`;
  }
  function reports() {
    const s = current();
    return `<h2>일지와 보고서</h2><p>관찰 기록으로 만든 초안입니다. 선생님 확인 전에는 확정되지 않습니다.</p>${button("이번 주 보고서 만들기", "weekly")}${button("이번 달 보고서 만들기", "monthly")}${[
      ...s.dailyReports,
      ...s.weeklyReports,
      ...s.monthlyReports,
    ]
      .slice()
      .reverse()
      .map(
        (r) =>
          `<article><h3>${esc(r.id)} · ${esc(r.status)}</h3>${
            r.text !== undefined
              ? `<textarea data-report="${esc(r.id)}" aria-label="일지 수정">${esc(r.text)}</textarea>`
              : `<p>참여 ${r.count}회 · ${(r.durationSeconds / 60).toFixed(1)}분 · 평균 참여도 ${r.averageParticipation === null ? "자료 없음" : r.averageParticipation.toFixed(1)}</p>${Object.entries(
                  r.domains,
                )
                  .map(
                    ([k, v]) =>
                      `<label>${k} ${(v / 60).toFixed(1)}분<progress max="${Math.max(1, ...Object.values(r.domains))}" value="${v}" aria-label="${k} 시간"></progress></label>`,
                  )
                  .join(
                    "",
                  )}<p>이전 기간 대비 참여 횟수: ${r.change === null ? "비교 자료 없음" : r.change}</p><p>특이사항: ${esc(r.notes.map((n) => n.text).join(" / ") || "입력 없음")}</p>`
          }${r.text !== undefined ? button("AI 작성 (서버)", "journal-ai", `data-id="${esc(r.id)}"`) : ""}${button("수정 저장", "save-report", `data-id="${esc(r.id)}"`)}${button("확인·확정", "approve-report", `data-id="${esc(r.id)}"`)}</article>`,
      )
      .join("")}${button("인쇄", "print")}`;
  }
  function automation() {
    const s = current();
    return `<h2>자동화 관리</h2><p>예약 실행은 서버에서만 수행합니다. 이 화면을 열어두어도 예약 작업이 대신 실행되지는 않습니다.</p><p>서버 최근 실행: ${esc(s.lastServerRun || "없음 · 연결 및 호출 확인 필요")}</p>${button("서버 연결 확인", "check-server")}${button("서버에서 예정 작업 확인", "run-server")}<h3>실행 시간 (한국 시간)</h3>${[
      ["weekGeneration", "다음 주 생성"],
      ["amPrepare", "오전 준비"],
      ["pmPrepare", "오후 준비"],
      ["dailyCheck", "일일 기록 점검"],
      ["weeklyReport", "주간 보고서"],
      ["monthlyReport", "말일 보고서"],
    ]
      .map(
        ([k, label]) =>
          `<label>${label}<input type="time" data-setting="${k}" value="${s.settings[k]}"></label>`,
      )
      .join(
        "",
      )}<label>주간 생성 요일<select id="weekDay">${["일", "월", "화", "수", "목", "금", "토"].map((d, i) => `<option value="${i}" ${i === s.settings.weekDay ? "selected" : ""}>${d}요일</option>`).join("")}</select></label>${[
      ["programs", "프로그램 생성"],
      ["prepare", "수업 준비"],
      ["daily", "일일 점검"],
      ["weekly", "주간 보고서"],
      ["monthly", "월간 보고서"],
    ]
      .map(
        ([k, l]) =>
          `<label><input type="checkbox" data-enabled="${k}" ${s.settings.enabled[k] ? "checked" : ""}>${l} 켜기</label>`,
      )
      .join(
        "",
      )}${button("자동화 설정 저장", "settings")}<h3>특별일 등록</h3><label>날짜<input type="date" id="eventDate"></label><label>특별일 이름<input id="eventTitle" maxlength="100" placeholder="추석, 어버이날, 기관 행사"></label>${button("특별일 저장", "event")}<p>${esc((s.settings.events || []).map((e) => e.date + " " + e.title).join(" / "))}</p><h3>최근 실행 기록</h3>${
      s.automationLogs
        .slice(-20)
        .reverse()
        .map(
          (j) =>
            `<p>${esc(j.at)} · ${esc(j.kind)} · ${esc(j.status)} ${esc(j.error || "")}</p>`,
        )
        .join("") || "<p>실행 기록이 없습니다.</p>"
    }<h3>다음 달 콘텐츠 후보</h3>${(s.monthCandidates || []).map((m) => `<article><p>${esc(m.month)} · ${esc(m.status)} · ${m.activities.length}개 후보</p>${m.status === "pending" ? button("후보 확인·승인", "approve-month", `data-id="${esc(m.id)}"`) : ""}</article>`).join("") || "<p>아직 후보가 없습니다.</p>"}<h3>재시도 예정</h3>${
      s.automationJobs
        .filter((j) => j.status === "retry")
        .map((j) => `<p>${esc(j.kind)} · ${esc(j.nextAttemptAt)}</p>`)
        .join("") || "<p>없음</p>"
    }`;
  }
  function seniors() {
    return `<h2>어르신 등록</h2><p>필요한 정보만 입력해주세요. 서버 연결 전에는 가상 대상자로 점검해주세요. 이 기기의 화면 잠금은 서버 접근 제어를 대신하지 않습니다.</p><form id="seniorForm">${[
      ["name", "이름"],
      ["birthYear", "생년"],
      ["gender", "성별"],
      ["grade", "장기요양등급"],
      ["cognition", "인지 상태"],
      ["mobility", "이동 상태"],
      ["note", "주의사항"],
      ["preferences", "선호 활동"],
    ]
      .map(
        ([k, label]) =>
          `<label>${label}<input name="${k}" ${k === "name" ? "required" : ""} maxlength="${k === "note" ? 500 : 100}"></label>`,
      )
      .join("")}<button>어르신 등록</button></form>${DaycareSchedule.getElders()
      .map((e) => `<p>${esc(e.masked)} · ${esc(e.id)}</p>`)
      .join("")}`;
  }
  function library() {
    return `<h2>프로그램 검색</h2><details><summary>사용 허가된 음원 등록</summary><label>HTTPS 음원 주소<input id="approvedAudioUrl" type="url"></label><label><input id="audioRights" type="checkbox">기관에서 사용 가능한 음원임을 확인했습니다.</label>${button("음원 등록", "audio")}</details><label>검색<input id="activitySearch" placeholder="운동, 계절, 명절, 제목"></label><div id="activityResults"></div>`;
  }
  function media() { return '<section id="boriMediaAdmin"></section>'; }
  function render() {
    if (
      !host ||
      sessionStorage.getItem("digital_school_teacher_authed") !== "true"
    )
      return;
    host.classList.add("operations-panel");
    host.innerHTML = `<p class="operations-warning">${AdminAccess.isCloud() ? "서버 연결 모드 · 예약 작업의 실제 실행 여부는 마지막 실행 기록을 확인해주세요." : "서버 연결 필요 · 현재 기록과 초안은 이 기기에만 저장됩니다. 예약 작업은 실행되지 않습니다."}</p><details class="operations-menu"><summary>관리 메뉴 선택</summary><nav>${[
      ["overview", "오늘 운영"],
      ["programs", "프로그램 승인"],
      ["seniors", "어르신 관리"],
      ["records", "수업 기록"],
      ["reports", "일지·보고서"],
      ["automation", "자동화 관리"],
      ["library", "프로그램 검색"],
      ["media", "영상·음악 콘텐츠 관리"],
    ]
      .map(([k, l]) => button(l, "tab", `data-tab="${k}"`))
      .join(
        "",
      )}${button("잠그기", "logout")}${button("운영 데이터 백업", "backup")}</nav></details><p role="status"></p>${({ overview: summary, programs, records, reports, automation, seniors, library, media }[tab] || summary)()}`;
    host.onclick = (e) => {
      const b = e.target.closest("[data-op]");
      if (b) act(b).catch((e) => notice(e.message));
    };
    host
      .querySelector("#activitySearch")
      ?.addEventListener("input", (e) => search(e.target.value));
    if (tab === "library") search("");
    if (tab === "media") BoriMediaAdmin.render(host.querySelector('#boriMediaAdmin'));
    host.querySelector("#seniorForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const values = Object.fromEntries(new FormData(e.target));
        const row = {
          ...values,
          id: "S" + crypto.randomUUID().slice(0, 8),
          masked:
            values.name.slice(0, 1) +
            "○".repeat(Math.max(1, values.name.length - 1)),
        };
        if (AdminAccess.isCloud())
          await AdminAccess.api("senior", { senior: row });
        const elders = DaycareSchedule.getElders();
        elders.push(
          AdminAccess.isCloud()
            ? { id: row.id, masked: row.masked, name: row.masked }
            : row,
        );
        localStorage.setItem(
          "digital_school_daycare_elders_v1",
          JSON.stringify(elders),
        );
        D.upsert(
          current().seniors,
          AdminAccess.isCloud() ? { id: row.id, masked: row.masked } : row,
        );
        persist();
        render();
      } catch (e) {
        notice(e.message);
      }
    });
  }
  function search(q) {
    host.querySelector("#activityResults").innerHTML = ProgramLibrary.getAll()
      .filter((p) =>
        [p.title, p.role, p.domain, p.season, p.holiday].join(" ").includes(q),
      )
      .map(
        (p) =>
          `<article><strong>${esc(p.title)}</strong><p>${esc(p.characterName)} · ${esc(p.difficulty)} · ${esc(p.season)}</p></article>`,
      )
      .join("");
  }
  async function act(b) {
    const op = b.dataset.op,
      id = b.dataset.id;
    if (op === "tab") {
      tab = b.dataset.tab;
      render();
      return;
    }
    if (op === "logout") {
      AdminAccess.logout();
      return;
    }
    if (op === "print") {
      print();
      return;
    }
    if (op === "backup") {
      const url = URL.createObjectURL(
          new Blob([JSON.stringify(current(), null, 2)], {
            type: "application/json",
          }),
        ),
        a = document.createElement("a");
      a.href = url;
      a.download = "학교-운영-백업-" + D.dateKey() + ".json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }
    if (op === "audio") {
      const url = host.querySelector("#approvedAudioUrl").value;
      if (
        !host.querySelector("#audioRights").checked ||
        !/^https:\/\//.test(url)
      )
        throw Error("사용 권한과 HTTPS 음원 주소를 확인해주세요.");
      localStorage.setItem("school_approved_audio_url_v3", url);
      notice("사용 가능한 음원 주소를 이 기기에 등록했습니다.");
      return;
    }
    if (op === "event") {
      const date = host.querySelector("#eventDate").value,
        title = host.querySelector("#eventTitle").value.trim();
      if (!date || !title) throw Error("특별일 날짜와 이름을 입력해주세요.");
      const events = [
        ...(current().settings.events || []).filter((e) => e.date !== date),
        { date, title },
      ];
      await command(
        "settings",
        { settings: { events } },
        () => (current().settings.events = events),
      );
      return;
    }
    if (op === "generate") {
      const start = host.querySelector("#opsWeekStart").value;
      if (D.weekday(start) !== 1) throw Error("월요일을 선택해주세요.");
      await command("generate", { start }, () =>
        D.generateProgram(
          current(),
          start,
          ProgramLibrary.getAll(),
          AutoScheduler.getEvents(),
          AutoScheduler.getOffDays(),
        ),
      );
      return;
    }
    if (op === "approve") {
      await command("approve", { id }, () => D.approve(current(), id));
      return;
    }
    if (op === "reject") {
      await command("reject", { id }, () => {
        current().programs.find((p) => p.id === id).status = "rejected";
      });
      return;
    }
    if (op === "edit-program") {
      editProgram(id);
      return;
    }
    if (op === "approve-month") {
      await command("approve-month", { id }, () => {
        current().monthCandidates.find((m) => m.id === id).status = "approved";
      });
      return;
    }
    if (op === "settings") {
      const settings = {
        enabled: {},
        weekDay: Number(host.querySelector("#weekDay").value),
      };
      host
        .querySelectorAll("[data-setting]")
        .forEach((i) => (settings[i.dataset.setting] = i.value));
      host
        .querySelectorAll("[data-enabled]")
        .forEach((i) => (settings.enabled[i.dataset.enabled] = i.checked));
      await command(
        "settings",
        { settings },
        () => (current().settings = { ...current().settings, ...settings }),
      );
      return;
    }
    if (op === "check-server") {
      const result = await AdminAccess.api("status");
      notice(
        result.message +
          " · 예약 실행 연결은 마지막 실행 기록으로 확인해주세요.",
      );
      return;
    }
    if (op === "run-server") {
      if (!AdminAccess.isCloud())
        throw Error("PostgreSQL과 서버 관리자 계정을 먼저 연결해주세요.");
      await AdminAccess.api("run", {});
      mergeServer((await AdminAccess.api("state")).state);
      render();
      return;
    }
    if (op === "sync") {
      await window.OperationsSync.flush();
      notice("서버 기록 동기화를 확인했습니다.");
      return;
    }
    if (op === "weekly" || op === "monthly") {
      const today = D.dateKey(),
        start = op === "weekly" ? D.monday(today) : today.slice(0, 7) + "-01";
      await command("report", { kind: op, start, end: today }, () =>
        D.upsert(
          current()[op + "Reports"],
          D.report(current(), op, start, today),
        ),
      );
      return;
    }
    if (op === "journal-ai") {
      if (!AdminAccess.isCloud())
        throw Error(
          "DB와 AI 모델 연결 후 사용할 수 있습니다. 현재는 기록 기반 초안입니다.",
        );
      await command("journal-ai", { id }, () => {});
      return;
    }
    if (op === "save-report" || op === "approve-report") {
      const text = [...host.querySelectorAll("[data-report]")].find(
          (e) => e.dataset.report === id,
        )?.value,
        approve = op === "approve-report";
      await command("report-review", { id, text, approve }, () => {
        const r = [
          ...current().dailyReports,
          ...current().weeklyReports,
          ...current().monthlyReports,
        ].find((r) => r.id === id);
        current().audit.push({
          kind: "report-review",
          id,
          before: structuredClone(r),
          at: new Date().toISOString(),
        });
        if (text !== undefined) r.text = text;
        r.status = approve ? "approved" : "pending";
      });
    }
  }
  function editProgram(id) {
    const p = current().programs.find((p) => p.id === id),
      lib = ProgramLibrary.getAll();
    host.innerHTML =
      '<h2>승인 전 프로그램 수정</h2><form id="editProgramForm">' +
      p.days
        .filter((d) => !d.off)
        .map(
          (d) =>
            `<fieldset><legend>${esc(d.date)}</legend>${["am", "pm"]
              .flatMap((type) =>
                d[type].activities.map(
                  (a, i) =>
                    `<label>${type === "am" ? "오전" : "오후"} ${esc(a.characterName)}<select data-date="${d.date}" data-type="${type}" data-index="${i}">${lib
                      .filter((x) => x.character === a.character)
                      .map(
                        (x) =>
                          `<option value="${x.id}" ${x.id === a.id ? "selected" : ""}>${esc(x.title)}</option>`,
                      )
                      .join("")}</select></label>`,
                ),
              )
              .join("")}</fieldset>`,
        )
        .join("") +
      '<button>수정 저장 · 승인 대기로 유지</button></form><p role="status"></p>';
    host.querySelector("form").onsubmit = async (e) => {
      e.preventDefault();
      try {
        const patch = structuredClone(p.days);
        host.querySelectorAll("select").forEach(
          (el) =>
            (patch.find((d) => d.date === el.dataset.date)[
              el.dataset.type
            ].activities[Number(el.dataset.index)] = {
              ...lib.find((a) => a.id === el.value),
            }),
        );
        await command("edit-program", { id, days: patch }, () => {
          p.days = patch;
          p.status = "pending";
        });
      } catch (e) {
        notice(e.message);
      }
    };
  }
  document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.getElementById("teacherModalTabs");
    if (tabs) {
      const more = document.createElement("details");
      more.className = "teacher-legacy-options";
      more.innerHTML = "<summary>기존 관리 기능</summary>";
      tabs.before(more);
      more.append(tabs);
    }
  });
  window.renderOperationsPanel = async (container) => {
    host = container;
    render();
    if (AdminAccess.isCloud()) {
      try {
        mergeServer((await AdminAccess.api("state")).state);
        cloudLoaded = true;
        render();
      } catch (e) {
        notice(e.message);
      }
    }
  };
})();
