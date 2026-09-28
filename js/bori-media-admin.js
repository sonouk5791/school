(() => {
  "use strict";
  const M = BoriMediaDomain,
    S = BoriMediaStore,
    esc = (s) =>
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
  let host,
    editing = null;
  const btn = (label, action, id = "") =>
    `<button type="button" data-media-action="${action}" data-id="${esc(id)}">${label}</button>`;
  async function persist(row) {
    if (AdminAccess.isCloud() && row.videoType !== "local") {
      await AdminAccess.api("media-save", { content: row });
      row.cloud = true;
    }
    S.saveContent(row);
  }
  function cue(c = { start: 0, end: 8, text: "" }) {
    const row = document.createElement("div");
    row.className = "media-admin-cue";
    row.innerHTML = `<label>시작 초<input data-cue="start" type="number" min="0" step="0.1" value="${c.start}" required></label><label>종료 초<input data-cue="end" type="number" min="0" step="0.1" value="${c.end}" required></label><label>가사 (1~2줄)<textarea data-cue="text" maxlength="120" rows="2" required>${esc(c.text)}</textarea></label>${btn("구간 삭제", "remove-cue")}`;
    host.querySelector("#mediaCues").append(row);
  }
  function form(item) {
    editing = item?.id || null;
    const c = item || {
      kind: "theater",
      videoType: "mp4",
      enabled: true,
      category: "옛 드라마",
    };
    host.querySelector("#mediaEditor").innerHTML =
      `<h3>${item?.id ? "콘텐츠 수정" : "콘텐츠 추가"}</h3><form class="media-form" id="mediaContentForm"><label>종류<select name="kind"><option value="theater">추억극장</option><option value="song">옛 노래 교실</option></select></label><label>제목<input name="title" maxlength="100" value="${esc(c.title || "")}" required></label><label>카테고리<select name="category"></select></label><label>재생 방식<select name="videoType"><option value="mp4">MP4 / 기관·외부 저장소 영상 주소</option><option value="mp3">MP3 음원 주소</option><option value="wav">WAV 음원 주소</option><option value="youtube">공식 임베드 허용 YouTube 영상</option><option value="local">직접 업로드 · 이 기기에 저장</option></select></label><label>HTTPS 영상·음원 주소<input type="url" name="videoUrl" value="${esc(c.videoUrl || "")}"></label><label>직접 업로드할 파일 (200MB 이하)<input id="mediaUpload" type="file" accept="video/mp4,audio/mpeg,audio/wav,.wav,.mp3,.mp4"></label><p>직접 업로드한 파일은 이 브라우저에만 저장됩니다. 다른 기기에서는 기관 저장소의 HTTPS 주소를 사용해주세요. 브라우저 자료 삭제 시 기기 파일이 지워질 수 있습니다.</p><label>썸네일 HTTPS 이미지 주소<input type="url" name="thumbnail" value="${esc(c.thumbnail || "")}"></label><label>전체 길이 (초, 선택)<input type="number" name="duration" min="0" max="86400" value="${c.duration || 0}"></label><label><input type="checkbox" name="enabled" ${c.enabled ? "checked" : ""}>사용함</label><p>기관이 이용 권한을 보유했거나 공식적으로 임베드가 허용된 영상만 등록해 주세요.</p><label><input type="checkbox" name="rights" required ${c.rightsConfirmed ? "checked" : ""}>영상·음원 이용 권한을 확인했습니다.</label><details ${c.lyrics?.length ? "open" : ""}><summary>가사와 표시 시간 등록</summary><p>이용 권한을 확인한 가사만 직접 입력해주세요. 자동으로 가사를 가져오지 않습니다. 구간은 시간순으로 1~2줄씩 등록해주세요.</p><div id="mediaCues"></div>${btn("가사 구간 추가", "add-cue")}<label><input type="checkbox" name="lyricsRights" ${c.lyricsRightsConfirmed ? "checked" : ""}>가사 이용 권한도 확인했습니다.</label></details><div class="operations-actions"><button type="submit">콘텐츠 저장</button>${btn("닫기", "close-editor")}</div></form>`;
    const f = host.querySelector("form");
    f.elements.kind.value = c.kind;
    f.elements.videoType.value = c.videoType;
    function categories() {
      f.elements.category.replaceChildren(
        ...M.categories[f.elements.kind.value].map((v) => new Option(v, v)),
      );
    }
    categories();
    f.elements.category.value = c.category;
    f.elements.kind.onchange = categories;
    for (const line of c.lyrics || []) cue(line);
    f.onsubmit = async (e) => {
      e.preventDefault();
      try {
        let fileId = c.fileId,
          mime = c.mime;
        const upload = host.querySelector("#mediaUpload").files[0];
        if (f.elements.videoType.value === "local" && upload) {
          const saved = await S.upload(upload);
          fileId = saved.id;
          mime = saved.mime;
        }
        const lyrics = [...host.querySelectorAll(".media-admin-cue")].map(
          (row) =>
            Object.fromEntries(
              [...row.querySelectorAll("[data-cue]")].map((i) => [
                i.dataset.cue,
                i.value,
              ]),
            ),
        );
        const row = M.validate({
          id: editing || undefined,
          kind: f.elements.kind.value,
          title: f.elements.title.value,
          category: f.elements.category.value,
          videoType: f.elements.videoType.value,
          videoUrl: f.elements.videoUrl.value.trim(),
          fileId,
          mime,
          thumbnail: f.elements.thumbnail.value.trim(),
          duration: f.elements.duration.value,
          enabled: f.elements.enabled.checked,
          order: c.order ?? S.read().contents.length,
          lyrics,
          rightsConfirmed: f.elements.rights.checked,
          lyricsRightsConfirmed: f.elements.lyricsRights.checked,
        });
        await persist(row);
        render();
        status("콘텐츠를 저장했어요.");
      } catch (error) {
        status(error.message);
      }
    };
  }
  function status(text) {
    host.querySelector("#mediaAdminStatus").textContent = text;
  }
  function render() {
    if (!host) return;
    const s = S.read();
    host.innerHTML = `<h2>영상·음악 콘텐츠 관리</h2><p>기존 보리와 함께 감상 → 회상 → 기록으로 이어집니다.</p><div class="operations-actions">${btn("영상 추가", "add-theater")}${btn("노래 추가", "add-song")}${btn("등록 목록 새로 확인", "refresh")}</div><p id="mediaAdminStatus" role="status"></p><section id="mediaEditor"></section><div class="media-admin-list">${
      s.contents
        .filter((c) => !c.deletedAt)
        .sort((a, b) => a.order - b.order)
        .map(
          (c) =>
            `<article><h3>${esc(c.title)}</h3><p>${c.kind === "song" ? "옛 노래 교실" : "추억극장"} · ${esc(c.category)} · ${c.enabled ? "사용 중" : "사용 안 함"} · ${c.videoType === "local" ? "이 기기 파일" : c.cloud ? "서버 등록" : "이 기기 등록"}</p>${c.thumbnail ? `<img src="${esc(c.thumbnail)}" alt="등록 썸네일">` : ""}<div class="operations-actions">${btn("수정", "edit", c.id)}${btn(c.enabled ? "사용 끄기" : "사용 켜기", "toggle", c.id)}${btn("위로", "up", c.id)}${btn("아래로", "down", c.id)}${btn("삭제", "delete", c.id)}</div></article>`,
        )
        .join("") ||
      "<p>등록한 콘텐츠가 없습니다. 이용 권한이 있는 자료를 추가해주세요.</p>"
    }</div><h3>감상 기록과 선생님 메모 · 최근 30건</h3><p>‘이야기하고 싶어요’ 선택을 실제 적극적 대화로 자동 판단하지 않습니다. 관찰한 내용만 적어주세요.</p>${s.records
      .slice()
      .reverse()
      .slice(0, 30)
      .map(
        (r) =>
          `<article class="media-admin-record"><h4>${esc(r.title)}</h4><p>${esc(r.participants.join(", ") || "체험")} · ${esc(r.startedAt || "재생 전")} → ${esc(r.endedAt || "중단·진행 중")}<br>실제 재생 ${Math.round(r.watchedSeconds)}초 · 완료 ${r.completed ? "예" : "아니오"} · 시청 시간 비율 ${r.completionPercent || 0}% · 다시보기 ${r.replayCount}회</p><label>회상 반응<select data-response-for="${esc(r.id)}">${["", "기억남", "잘 모르겠음", "이야기하고 싶음", "적극적 대화", "반응 없음"].map((v) => `<option ${r.memoryResponse === v ? "selected" : ""}>${v}</option>`).join("")}</select></label><label>선생님 메모<textarea data-note-for="${esc(r.id)}" maxlength="1500">${esc(r.notes || "")}</textarea></label>${btn("메모·반응 저장", "save-note", r.id)}</article>`,
      )
      .join("")}`;
  }
  window.BoriMediaAdmin = {
    render(container) {
      host = container;
      render();
      host.onclick = async (e) => {
        const b = e.target.closest("[data-media-action]");
        if (!b) return;
        try {
          const action = b.dataset.mediaAction,
            id = b.dataset.id,
            s = S.read(),
            item = s.contents.find((c) => c.id === id);
          if (action.startsWith("add-") && action !== "add-cue")
            form({
              kind: action === "add-song" ? "song" : "theater",
              videoType: action === "add-song" ? "mp3" : "mp4",
              enabled: true,
              category: action === "add-song" ? "가요" : "옛 드라마",
            });
          if (action === "edit") form(item);
          if (action === "close-editor")
            host.querySelector("#mediaEditor").replaceChildren();
          if (action === "add-cue") {
            const rows = host.querySelectorAll(".media-admin-cue");
            const end = rows.length
              ? Number(
                  rows[rows.length - 1].querySelector("[data-cue=end]").value,
                )
              : 0;
            cue({ start: end, end: end + 8, text: "" });
          }
          if (action === "remove-cue") b.closest(".media-admin-cue").remove();
          if (action === "toggle") {
            item.enabled = !item.enabled;
            await persist(item);
            render();
          }
          if (action === "delete") {
            if (
              !confirm(
                "선택한 콘텐츠를 목록에서 삭제할까요? 감상 기록과 원본 파일은 보존합니다.",
              )
            )
              return;
            if (item.cloud) {
              await AdminAccess.api("media-delete", { id });
            }
            item.deletedAt = new Date().toISOString();
            item.enabled = false;
            S.saveContent(item);
            render();
          }
          if (action === "up" || action === "down") {
            const rows = s.contents
                .filter((c) => !c.deletedAt)
                .sort((a, b) => a.order - b.order),
              i = rows.findIndex((c) => c.id === id),
              j = i + (action === "up" ? -1 : 1);
            if (rows[j]) {
              [rows[i], rows[j]] = [rows[j], rows[i]];
              for (let k = 0; k < rows.length; k++) {
                rows[k].order = k;
                await persist(rows[k]);
              }
              render();
            }
          }
          if (action === "refresh") {
            await S.refresh();
            render();
          }
          if (action === "save-note") {
            const r = s.records.find((r) => r.id === id);
            r.notes = host.querySelector(`[data-note-for="${id}"]`).value;
            r.memoryResponse = host.querySelector(
              `[data-response-for="${id}"]`,
            ).value;
            r.savedAt = new Date().toISOString();
            S.saveRecord(r);
            const state = OperationsStore.get(),
              session = state.sessions.find(
                (s) => s.id === (r.parentSessionId || r.id),
              );
            if (
              session &&
              ["completed", "cancelled"].includes(session.status)
            ) {
              const evaluations = {};
              for (const senior of session.participants) {
                const old = state.participationRecords.find(
                  (x) => x.sessionId === session.id && x.seniorId === senior,
                );
                if (old)
                  evaluations[senior] = {
                    participation: old.participation,
                    expression: old.expression,
                    assistance: old.assistance,
                    mood: old.mood,
                    notes: r.parentSessionId
                      ? (old.notes + "\n추가 관찰: " + M.notes(r)).slice(-2000)
                      : M.notes({
                          ...r,
                          mood: r.responses?.[senior]?.mood || "",
                          memoryResponse:
                            r.participants.length > 1
                              ? r.responses?.[senior]?.memoryResponse || ""
                              : r.memoryResponse,
                        }),
                  };
              }
              SchoolOperations.saveEvaluation(state, session, evaluations);
              OperationsStore.save();
              await OperationsSync.flush().catch(() => {});
            }
            status(
              "메모를 저장했습니다. 일지 초안은 선생님 공간에서 확인해주세요.",
            );
          }
        } catch (error) {
          status(error.message);
        }
      };
    },
  };
  window.addEventListener("load", () => {
    if (location.hash === "#teacher")
      document.getElementById("btnTeacherSpace")?.click();
  });
})();
