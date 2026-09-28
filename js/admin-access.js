/* Local screen lock is not server authorization. Server cookies protect cloud records. */
(() => {
  "use strict";
  const KEY = "digital_school_local_admin_v3";
  let cloud = false,
    last = Date.now();
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  };
  if (!read()) sessionStorage.removeItem("digital_school_teacher_authed");
  const write = (x) => localStorage.setItem(KEY, JSON.stringify(x));
  const hex = (b) =>
    Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join(
      "",
    );
  async function derive(password, salt) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    return hex(
      await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: new TextEncoder().encode(salt),
          iterations: 210000,
          hash: "SHA-256",
        },
        key,
        256,
      ),
    );
  }
  async function setPassword(password) {
    if (password.length < 8) throw Error("8자 이상으로 입력해주세요.");
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
    write({
      salt,
      hash: await derive(password, salt),
      failures: 0,
      lockedUntil: 0,
    });
    localStorage.removeItem("digital_school_admin_pin");
    return true;
  }
  async function api(action, body) {
    const r = await fetch("/api/operations?action=" + action, {
      method: body ? "POST" : "GET",
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await r.json();
    if (!r.ok) throw Error(data.error || "서버 연결 확인이 필요합니다.");
    return data;
  }
  async function verify(password, newPassword) {
    if (cloud) {
      const result = await api("login", { password });
      if (result.mustChange) {
        if (!newPassword)
          throw Error("최초 로그인은 12자 이상의 새 비밀번호도 입력해주세요.");
        await api("password", { password: newPassword });
      }
      return true;
    }
    const current = read(),
      legacy = localStorage.getItem("digital_school_admin_pin");
    if (!current) {
      const attempts = JSON.parse(
        localStorage.getItem("school_legacy_auth_attempts") ||
          '{"failures":0,"lockedUntil":0}',
      );
      if (attempts.lockedUntil > Date.now())
        throw Error("15분 후 다시 시도해주세요.");
      if (legacy && password !== legacy) {
        attempts.failures++;
        if (attempts.failures >= 5) {
          attempts.lockedUntil = Date.now() + 900000;
          attempts.failures = 0;
        }
        localStorage.setItem(
          "school_legacy_auth_attempts",
          JSON.stringify(attempts),
        );
        throw Error("기존 비밀번호를 확인해주세요.");
      }

      if (legacy && password !== legacy)
        throw Error("기존 비밀번호를 확인해주세요.");
      if (legacy && !newPassword)
        throw Error("새 비밀번호를 입력해 변경해주세요.");
      await setPassword(newPassword || password);
      return true;
    }
    if (current.lockedUntil > Date.now())
      throw Error("5회 실패로 잠시 제한되었습니다. 15분 후 다시 시도해주세요.");
    if ((await derive(password, current.salt)) !== current.hash) {
      current.failures++;
      if (current.failures >= 5) {
        current.lockedUntil = Date.now() + 15 * 60000;
        current.failures = 0;
      }
      write(current);
      throw Error("비밀번호를 확인해주세요.");
    }
    current.failures = 0;
    write(current);
    return true;
  }
  function logout() {
    sessionStorage.removeItem("digital_school_teacher_authed");
    document.getElementById("teacherModal")?.classList.remove("active");
    document
      .getElementById("teacherModal")
      ?.setAttribute("aria-hidden", "true");
    const sub = document.getElementById("teacherSubnav");
    if (sub) sub.style.display = "none";
    if (cloud) api("logout", {}).catch(() => {});
  }
  window.AdminAccess = {
    verify,
    setPassword,
    api,
    isCloud: () => cloud,
    logout,
  };
  window.addEventListener("pointerdown", () => (last = Date.now()));
  window.addEventListener("keydown", () => (last = Date.now()));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - last > 20 * 60000) logout();
  });
  setInterval(() => {
    if (Date.now() - last > 20 * 60000) logout();
  }, 30000);
  document.addEventListener("DOMContentLoaded", () => {
    const field = document.getElementById("inputTeacherPin");
    if (field) {
      field.maxLength = 128;
      field.placeholder = "비밀번호 입력";
      const label = document.createElement("label");
      label.textContent = "새 비밀번호 (최초 설정·변경 시)";
      const input = document.createElement("input");
      input.type = "password";
      input.id = "newTeacherPassword";
      input.autocomplete = "new-password";
      input.minLength = 8;
      input.maxLength = 128;
      label.append(input);
      field.after(label);
      const help = document.createElement("p");
      help.id = "adminConnectionNotice";
      help.style.fontSize = "20px";
      help.textContent = read()
        ? "이 기기 보호 · 20분 미사용 시 잠깁니다."
        : "처음 사용 시 8자 이상의 비밀번호를 설정해주세요.";
      label.after(help);
    }
    fetch("/api/operations?action=status")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        cloud = !!s?.configured;
        const notice = document.getElementById("adminConnectionNotice");
        if (cloud && notice)
          notice.textContent =
            "서버 로그인 · 최초 비밀번호는 새 비밀번호로 변경해야 합니다.";
      })
      .catch(() => {});
  });
})();
