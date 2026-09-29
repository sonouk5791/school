/* Preserve old storage keys; v3 is an additive local outbox, never a fake server. */
(() => {
  "use strict";
  const key = "digital_school_operations_v3";
  let state;
  try {
    state = SchoolOperations.normalize(
      JSON.parse(localStorage.getItem(key) || "{}"),
    );
  } catch {
    state = SchoolOperations.empty();
  }
  let storageError = null;
  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      storageError = null;
      window.dispatchEvent(new Event("operations-updated"));
      return true;
    } catch (e) {
      storageError = "저장 공간이 부족합니다. 선생님께 알려주세요.";
      return false;
    }
  };
  window.OperationsStore = {
    get: () => state,
    save,
    getError: () => storageError,
    replace: (s) => {
      state = SchoolOperations.normalize(s);
      return save();
    },
    key,
  };
})();
