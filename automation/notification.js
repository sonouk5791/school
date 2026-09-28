"use strict";
module.exports = (state, id, text) => {
  if (!state.notifications.some((n) => n.id === id))
    state.notifications.push({
      id,
      text,
      read: false,
      createdAt: new Date().toISOString(),
    });
};
