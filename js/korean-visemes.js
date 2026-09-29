/* Seven Korean vowel cues; timing is estimated from sentence duration, not forced alignment. */
window.KoreanVisemes = {
  tokens(text) {
    const vowels = [
      "a",
      "a",
      "ya",
      "ya",
      "eo",
      "eo",
      "yeo",
      "yeo",
      "o",
      "a",
      "a",
      "i",
      "yo",
      "u",
      "eo",
      "e",
      "i",
      "yu",
      "u",
      "i",
      "i",
    ];
    return Array.from(text || "").map((c) => {
      const n = c.charCodeAt(0) - 0xac00;
      return n >= 0 && n < 11172
        ? vowels[Math.floor(n / 28) % 21]
        : /\s|[.,!?]/.test(c)
          ? "closed"
          : "i";
    });
  },
  shape(cue) {
    return (
      {
        a: "mouthA",
        ya: "mouthA",
        eo: "mouthE",
        yeo: "mouthE",
        o: "mouthO",
        yo: "mouthO",
        u: "mouthO",
        yu: "mouthO",
        i: "mouthSmile",
        e: "mouthE",
        closed: "mouthClosed",
      }[cue] || "mouthSmile"
    );
  },
  at(text, time, duration) {
    const tokens = this.tokens(text);
    return (
      tokens[
        Math.min(
          tokens.length - 1,
          Math.floor(
            (Math.max(0, time) / Math.max(0.1, duration)) * tokens.length,
          ),
        )
      ] || "closed"
    );
  },
};
