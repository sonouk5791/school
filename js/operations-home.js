(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".character-home-hero");
    if (!hero) return;
    hero.querySelector(".home-welcome p").textContent =
      "오늘도 천천히 함께해요.";
    const panel = document.createElement("section");
    panel.id = "friendRooms";
    panel.hidden = true;
    panel.setAttribute("aria-label", "AI 친구방");
    const close = document.createElement("button");
    close.className = "care-btn";
    close.textContent = "◀ 오늘 수업으로";
    close.onclick = () => {
      panel.hidden = true;
      document.getElementById("classChoices").hidden = false;
      document.getElementById("openFriendRooms").focus();
    };
    panel.append(close);
    for (const selector of [
      ".home-friends-grid",
      ".home-one-recommendation",
      "#homeQuickLinks",
      ".home-extra-programs",
    ]) {
      const node = hero.querySelector(selector);
      if (node) panel.append(node);
    }
    hero.append(panel);
    const simple = panel.querySelector(".home-one-recommendation");
    simple.querySelector("h2").textContent = "간편 수업 · 20분";
    simple.querySelector("p").textContent = "네 친구와 5분씩 함께해요";
    const choices = document.createElement("section");
    choices.id = "classChoices";
    choices.innerHTML =
      '<p id="todayClassDate"></p><div class="class-choices"><a class="class-choice" href="daycare-class.html?session=am"><strong>🌞 오전 수업 시작</strong><span>오늘 오전 수업을 시작해요</span><span>10:00 ~ 11:00 · 60분</span><small id="amClassStatus"></small></a><a class="class-choice" href="daycare-class.html?session=pm"><strong>🌤 오후 수업 시작</strong><span>오늘 오후 수업을 시작해요</span><span>14:00 ~ 15:00 · 60분</span><small id="pmClassStatus"></small></a><button class="class-choice" id="openFriendRooms" aria-controls="friendRooms" aria-expanded="false"><strong>🐶 AI 친구방</strong><span>콩이·토리·나비·보리를 만나러 가요</span></button></div><p id="todayProgramSummary"></p>';
    hero.querySelector(".home-welcome").after(choices);
    choices.querySelector("button").onclick = () => {
      choices.hidden = true;
      panel.hidden = false;
      choices.querySelector("button").setAttribute("aria-expanded", "true");
      close.focus();
    };
    close.addEventListener("click", () =>
      choices.querySelector("button").setAttribute("aria-expanded", "false"),
    );
    const date = SchoolOperations.dateKey();
    document.getElementById("todayClassDate").textContent =
      new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(new Date());
    function paint() {
      const state = OperationsStore.get();
      for (const type of ["am", "pm"]) {
        const done = state.sessions.some(
          (s) => s.date === date && s.type === type && s.status === "completed",
        );
        document.getElementById(type + "ClassStatus").textContent = done
          ? "✓ 완료"
          : state.prepared?.[date + ":" + type]?.status === "ready"
            ? "✓ 오늘 " + (type === "am" ? "오전" : "오후") + " 수업 준비 완료"
            : "아직 진행하지 않음";
      }
      const p = state.programs
        .find((p) => p.status === "active" && p.start <= date && p.end >= date)
        ?.days.find((d) => d.date === date);
      const fallback = DaycareSchedule.getTodayProgram();
      document.getElementById("todayProgramSummary").textContent =
        p && !p.off
          ? `오전: ${p.am.activities.map((a) => a.title).join(" · ")} / 오후: ${p.pm.activities.map((a) => a.title).join(" · ")}`
          : `기본 수업 · 오전: ${fallback.am.activity} · ${fallback.am.partnerActivity} / 오후: ${fallback.pm.activity} · ${fallback.pm.partnerActivity}`;
    }
    paint();
    window.addEventListener("operations-updated", paint);
  });
})();
