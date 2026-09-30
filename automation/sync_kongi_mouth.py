import os
import sys
import json
import subprocess
import numpy as np

FFMPEG = r"C:\Program Files (x86)\clipdown\ffmpeg.exe"
VIDEO_IN = r"c:\Users\windows\OneDrive\Desktop\sh\assets\videos\kongi-3min-exercise.mp4"
VIDEO_OUT = r"c:\Users\windows\OneDrive\Desktop\sh\assets\videos\kongi-3min-exercise-master.mp4"
DESKTOP_COPY = r"c:\Users\windows\OneDrive\Desktop\콩이_3분_의자체조_완성본.mp4"
AUDIO_DIR = r"c:\Users\windows\OneDrive\Desktop\sh\assets\audio\kongi-3min"
MIXED_AUDIO = os.path.join(AUDIO_DIR, "kongi-3min-mixed.mp3")
MANIFEST = os.path.join(AUDIO_DIR, "exercise-timing-manifest.json")
SCRATCH_DIR = r"C:\Users\windows\.gemini\antigravity-ide\brain\5fc7c260-dbe4-43ef-aee0-663dd7d97a2c\scratch"

WIDTH = 1280
HEIGHT = 720
FPS = 24.0
FRAME_BYTES = WIDTH * HEIGHT * 3

# Mouth crop coordinates on 1280x720 video
CROP_X = 584
CROP_Y = 296
CROP_W = 76
CROP_H = 50

def make_feather_mask(w, h, feather_px=4):
    mask = np.ones((h, w), dtype=np.float32)
    for i in range(feather_px):
        val = (i + 1) / float(feather_px + 1)
        mask[i, :] = np.minimum(mask[i, :], val)
        mask[h - 1 - i, :] = np.minimum(mask[h - 1 - i, :], val)
        mask[:, i] = np.minimum(mask[:, i], val)
        mask[:, w - 1 - i] = np.minimum(mask[:, w - 1 - i], val)
    return mask[:, :, None]

def main():
    print("[1/5] Loading speech cue manifest and mouth patches...")
    with open(MANIFEST, "r", encoding="utf-8") as f:
        cues = json.load(f)
    print(f"Loaded {len(cues)} speech cues.")

    patch_c = np.load(os.path.join(SCRATCH_DIR, "patch_c.npy")).astype(np.float32)
    patch_m = np.load(os.path.join(SCRATCH_DIR, "patch_m.npy")).astype(np.float32)
    patch_o = np.load(os.path.join(SCRATCH_DIR, "patch_o.npy")).astype(np.float32)

    mask = make_feather_mask(CROP_W, CROP_H, feather_px=4)
    inv_mask = 1.0 - mask

    # Pre-blend patches with mask for fastest runtime
    # blended = patch * mask + bg * (1 - mask)
    print("[2/5] Starting video frame reader and encoder pipeline...")

    reader_cmd = [
        FFMPEG, "-v", "quiet",
        "-i", VIDEO_IN,
        "-r", str(FPS),
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"
    ]

    encoder_cmd = [
        FFMPEG, "-v", "warning", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-r", str(FPS),
        "-i", "-",
        "-i", MIXED_AUDIO,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        VIDEO_OUT
    ]

    reader = subprocess.Popen(reader_cmd, stdout=subprocess.PIPE, bufsize=FRAME_BYTES * 4)
    encoder = subprocess.Popen(encoder_cmd, stdin=subprocess.PIPE, bufsize=FRAME_BYTES * 4)

    frame_idx = 0
    cue_idx = 0
    num_cues = len(cues)

    print("[3/5] Synchronizing mouth movement with speech cues...")
    try:
        while True:
            raw_frame = reader.stdout.read(FRAME_BYTES)
            if not raw_frame or len(raw_frame) < FRAME_BYTES:
                break

            t = frame_idx / FPS

            # Find active cue
            active_cue = None
            for c in cues:
                if c["time"] <= t <= c["end_time"]:
                    active_cue = c
                    break
                elif c["time"] > t:
                    # cues are ordered chronologically
                    break

            if active_cue is None:
                # Silence / resting period: mouth is closed with a natural, gentle smile
                chosen_patch = patch_c
            else:
                # Active speech period: talk animation with natural syllabic cadence
                time_remaining = active_cue["end_time"] - t
                if time_remaining < 0.12:
                    # Closing mouth at end of utterance
                    chosen_patch = patch_c
                else:
                    rel_t = t - active_cue["time"]
                    # 0.28s rhythm cycle (~3.6 syllables per sec, typical Korean speech rate)
                    cycle_pos = rel_t % 0.28
                    if cycle_pos < 0.10:
                        chosen_patch = patch_o
                    elif cycle_pos < 0.17:
                        chosen_patch = patch_m
                    elif cycle_pos < 0.23:
                        chosen_patch = patch_o
                    else:
                        chosen_patch = patch_c

            # Process frame in-place using numpy
            frame = np.frombuffer(raw_frame, dtype=np.uint8).reshape((HEIGHT, WIDTH, 3)).copy()

            # Blend mouth patch into target coordinates
            bg = frame[CROP_Y:CROP_Y + CROP_H, CROP_X:CROP_X + CROP_W].astype(np.float32)
            blended = (chosen_patch * mask + bg * inv_mask).astype(np.uint8)
            frame[CROP_Y:CROP_Y + CROP_H, CROP_X:CROP_X + CROP_W] = blended

            # Write to encoder
            encoder.stdin.write(frame.tobytes())
            frame_idx += 1

            if frame_idx % 240 == 0:
                sec = frame_idx / FPS
                pct = (sec / 180.0) * 100.0
                print(f"Processed {sec:.1f}s / 180s ({pct:.1f}%)")

    except Exception as e:
        print(f"Error during processing: {e}")
        reader.kill()
        encoder.kill()
        raise e
    finally:
        reader.stdout.close()
        reader.wait()
        if encoder.stdin:
            encoder.stdin.close()
        encoder.wait()

    print(f"[4/5] Master video with perfect mouth sync generated: {VIDEO_OUT}")

    print("[5/5] Copying updated master video to Desktop...")
    import shutil
    shutil.copy2(VIDEO_OUT, DESKTOP_COPY)
    print(f"Copied to: {DESKTOP_COPY}")
    print("ALL DONE SUCCESSFULLY!")

if __name__ == "__main__":
    main()
