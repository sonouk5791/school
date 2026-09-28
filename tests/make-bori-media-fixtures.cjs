// Self-authored color/tone fixtures only. No downloaded video, song, or lyrics.
const fs = require("node:fs"),
  path = require("node:path"),
  { execFileSync } = require("node:child_process");
const ffmpeg =
  process.env.FFMPEG_PATH ||
  path.resolve(
    ".video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe",
  );
if (!fs.existsSync(ffmpeg))
  throw Error(
    "Set FFMPEG_PATH to a local FFmpeg executable to generate media test fixtures.",
  );
fs.mkdirSync(".bori-backup", { recursive: true });
execFileSync(ffmpeg, [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-f",
  "lavfi",
  "-i",
  "color=c=lightblue:s=640x360:r=24:d=6",
  "-f",
  "lavfi",
  "-i",
  "sine=frequency=440:duration=6",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "aac",
  "-shortest",
  ".bori-backup/test-video.mp4",
]);
execFileSync(ffmpeg, [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-f",
  "lavfi",
  "-i",
  "sine=frequency=440:duration=6",
  ".bori-backup/test-audio.wav",
]);
console.log(
  "Created self-authored MP4/WAV fixtures outside the release asset folders.",
);
