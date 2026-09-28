/* Map approved activity descriptors to existing room controls; retain every original URL. */
window.SchoolActivityRoutes = {
  resolve(activity, character) {
    const text = (activity?.title || "") + " " + (activity?.domain || "");
    if (character === "kongi")
      return { url: "senior-exercise.html", selector: "#btnStart" };
    if (character === "tori") {
      const kind = /색/.test(text)
        ? "color"
        : /동물/.test(text)
          ? "animal"
          : /과일/.test(text)
            ? "fruit"
            : /계절/.test(text)
              ? "season"
              : /물건|생활/.test(text)
                ? "objects"
                : /다른/.test(text)
                  ? "different"
                  : "match";
      return { url: "tori-play.html", extension: kind };
    }
    if (character === "nabi") {
      const topic = [
        "고향",
        "학교",
        "가족",
        "결혼",
        "자녀",
        "직업",
        "시장",
        "음식",
        "명절",
        "농촌",
      ].find((t) => text.includes(t));
      if (topic) return { url: "nabi-learn.html", extension: topic };
      return {
        url: "nabi-learn.html",
        selector: /숫자|계산/.test(text)
          ? '[data-learn="number"]'
          : /속담|언어/.test(text)
            ? '[data-learn="proverb"]'
            : /계절/.test(text)
              ? '[data-learn="season"]'
              : '[data-learn="today"]',
      };
    }
    if (
      character === "bori" &&
      (activity?.mediaKind || /추억극장|옛 노래 교실/.test(text))
    )
      return {
        url:
          activity?.mediaKind === "theater" || /추억극장/.test(text)
            ? "bori-memory-theater.html"
            : "bori-song-class.html",
        media: true,
      };
    return {
      url: "bori-hobby.html",
      selector: /색칠|미술|그림/.test(text)
        ? '[data-tab="color"]'
        : /수수께끼/.test(text)
          ? '[data-tab="riddle"]'
          : /이야기|회상/.test(text)
            ? '[data-tab="story"]'
            : '[data-tab="song"]',
    };
  },
};
