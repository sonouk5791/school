const assert = require("node:assert/strict"),
  fs = require("fs"),
  vm = require("vm");
const box = { window: {} };
vm.runInNewContext(fs.readFileSync("js/korean-visemes.js", "utf8"), box);
assert.equal(
  box.window.KoreanVisemes.tokens("아야어여오우이").join(","),
  "a,ya,eo,yeo,o,u,i",
);
for (const [i, cue] of ["a", "ya", "eo", "yeo", "o", "u", "i"].entries())
  assert.equal(box.window.KoreanVisemes.at("아야어여오우이", i + 0.1, 7), cue);
console.log(
  "PASS 7 vowel cues and audio-time mapping; dedicated seven-shape artwork is not asserted",
);
