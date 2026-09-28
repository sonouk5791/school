(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const id = document.body.dataset.activityRoom;
    if (!["tori", "nabi", "bori"].includes(id)) return;
    const menu = document.querySelector(".tp-game-menu,.nl-menu,.bh-menu");
    const details = document.createElement("details");
    details.className = "extended-activities";
    const summary = document.createElement("summary");
    summary.textContent =
      id === "tori"
        ? "더 많은 놀이"
        : id === "nabi"
          ? "추억 이야기"
          : "더 많은 취미";
    details.append(summary);
    const labels =
      id === "tori"
        ? {
            match: "같은 그림 찾기",
            color: "색깔 맞히기",
            animal: "동물 맞히기",
            fruit: "과일 맞히기",
            different: "다른 그림 찾기",
            season: "계절 맞히기",
            objects: "생활용품 맞히기",
          }
        : id === "nabi"
          ? Object.fromEntries(
              Object.keys(SchoolActivityBank.reminiscence).map((k) => [k, k]),
            )
          : Object.fromEntries(
              Object.keys(SchoolActivityBank.hobby).map((k) => [k, k]),
            );
    const chooser = document.createElement("div");
    chooser.className = "extension-options";
    for (const [k, label] of Object.entries(labels)) {
      const b = document.createElement("button");
      b.textContent = label;
      b.onclick = () => begin(k);
      chooser.append(b);
    }
    details.append(chooser);
    menu.after(details);
    const panel = document.createElement("section");
    panel.className = "extended-activity-panel";
    panel.hidden = true;
    details.after(panel);
    let questions = [],
      index = 0,
      result = [],
      category = "",
      level = Number(new URLSearchParams(location.search).get("level")) || 1;
    const speak = (text) => window.CharacterVoice?.speak(id, text);
    function leave() {
      window.CharacterVoice?.stop();
      panel.hidden = true;
      details.hidden = false;
      menu.hidden = false;
      document.querySelector(".tp-hero,.nl-hero,.bh-hero").hidden = false;
      document.body.dataset.activityStatus = "select";
      RoomActivity.activityStatus = "select";
      summary.focus();
    }
    function begin(k) {
      category = k;
      RoomActivity.generation++;
      RoomActivity.activityStatus = "playing";
      document.body.dataset.activityStatus = "playing";
      index = 0;
      result = [];
      questions = id === "tori" ? SchoolActivityBank.draw(k, level) : [];
      document
        .querySelectorAll(
          ".game-panel,.learn-panel,.hobby-panel,.room-flow-toolbar,.tp-hero,.nl-hero,.bh-hero",
        )
        .forEach((e) => (e.hidden = true));
      menu.hidden = true;
      details.hidden = true;
      panel.hidden = false;
      render();
    }
    function btn(text, fn) {
      const b = document.createElement("button");
      b.textContent = text;
      b.onclick = fn;
      return b;
    }
    function done() {
      panel.replaceChildren();
      const h = document.createElement("h2");
      h.textContent = "정말 잘하셨어요!";
      panel.append(
        h,
        btn("다시 하기", () => begin(category)),
        btn("다른 활동 고르기", leave),
      );
      RoomActivity.activityStatus = "completed";
      document.body.dataset.activityStatus = "completed";
      try {
        const rows = JSON.parse(
          localStorage.getItem("school_extended_activity_results_v3") || "[]",
        );
        rows.push({
          id: crypto.randomUUID(),
          character: id,
          category,
          level,
          results: result,
          date: new Date().toISOString(),
        });
        localStorage.setItem(
          "school_extended_activity_results_v3",
          JSON.stringify(rows),
        );
      } catch {}
      speak("정말 잘하셨어요!");
    }
    function render() {
      panel.replaceChildren(btn("◀ 다른 활동 고르기", leave));
      const h = document.createElement("h2");
      h.tabIndex = -1;
      panel.append(h);
      if (id === "tori") {
        const q = questions[index];
        if (!q) {
          done();
          return;
        }
        h.textContent =
          index +
          1 +
          " / " +
          questions.length +
          " · " +
          (category === "match"
            ? "같은 것을 찾아보세요"
            : category === "different"
              ? "다른 하나를 찾아보세요"
              : q.question);
        if (["match", "different"].includes(category)) {
          const sample = document.createElement("p");
          sample.className = "activity-sample";
          sample.textContent =
            category === "match"
              ? q.answer
              : [
                  q.options.find((o) => o !== q.answer),
                  q.answer,
                  q.options.find((o) => o !== q.answer),
                ].join(" / ");
          panel.append(sample);
        }
        const choices = document.createElement("div");
        choices.className = "extension-options";
        const feedback = document.createElement("p");
        feedback.setAttribute("role", "status");
        q.options.forEach((option) => {
          const b = btn(option, () => {
            const correct = option === q.answer;
            feedback.textContent = correct
              ? "잘 찾으셨어요!"
              : "괜찮아요. 천천히 다시 골라봐요.";
            if (correct) {
              choices
                .querySelectorAll("button")
                .forEach((b) => (b.disabled = true));
              result.push({ questionId: q.id, correct: true });
              if (parent !== window)
                parent.postMessage(
                  {
                    type: "school-activity-result",
                    character: id,
                    category,
                    questionId: q.id,
                    correct: true,
                  },
                  location.origin,
                );
              panel.append(
                btn(
                  index === questions.length - 1 ? "활동 마치기" : "다음 문제",
                  () => {
                    index++;
                    render();
                  },
                ),
              );
            }
          });
          choices.append(b);
        });
        panel.append(choices, feedback);
        speak(q.question);
      } else {
        h.textContent = labels[category];
        const p = document.createElement("p");
        p.textContent = (
          id === "nabi"
            ? SchoolActivityBank.reminiscence
            : SchoolActivityBank.hobby
        )[category];
        panel.append(p);
        if (id === "nabi") {
          const note = document.createElement("p");
          note.textContent =
            "정답은 없어요. 이야기하고 싶지 않으면 건너뛰어도 괜찮아요.";
          panel.append(note);
        }
        if (
          id === "bori" &&
          ["꽃꾸미기", "색칠하기", "그림감상"].includes(category)
        ) {
          const art = document.createElement("div");
          art.className = "activity-art";
          art.textContent = category === "꽃꾸미기" ? "🌷 🌼 🌷" : "🌳 🌸 🏡";
          panel.append(art);
          const colors = document.createElement("div");
          colors.className = "extension-options";
          [
            ["분홍", "#ffe1ed"],
            ["노랑", "#fff5bf"],
            ["파랑", "#d9edff"],
          ].forEach(([label, color]) =>
            colors.append(
              btn(label, () => {
                art.style.backgroundColor = color;
                result.push({ color: label });
              }),
            ),
          );
          panel.append(colors);
        }
        if (id === "bori" && ["민요", "동요", "자연소리"].includes(category)) {
          const info = document.createElement("p");
          info.textContent =
            "선생님이 등록한 사용 가능한 음원이 있을 때만 재생합니다.";
          panel.append(info);
          const audio = document.createElement("audio");
          audio.controls = true;
          const url = localStorage.getItem("school_approved_audio_url_v3");
          if (url && /^https:\/\//.test(url)) {
            audio.src = url;
            audio.onplay = () => window.CharacterVoice?.stop();
            panel.append(audio);
          } else {
            info.textContent += " 아직 등록된 음원이 없습니다.";
          }
        }
        panel.append(btn("활동 마치기", done));
        speak(p.textContent);
      }
      h.focus();
    }
    window.ExtendedActivities = { start: begin, leave };
    if (id === "tori") {
      const label = document.createElement("label");
      label.textContent = "놀이 난이도 ";
      const select = document.createElement("select");
      ["매우 쉬움", "쉬움", "보통"].forEach((t, i) =>
        select.add(new Option(t, String(i + 1))),
      );
      select.value = String(level);
      select.onchange = () => (level = Number(select.value));
      label.append(select);
      details.insertBefore(label, chooser);
    }
    const observer = new MutationObserver(() => {
      if (panel.hidden)
        details.hidden = RoomActivity.activityStatus !== "select";
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-activity-status"],
    });
  });
})();
