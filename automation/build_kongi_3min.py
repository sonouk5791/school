import os
import math
import subprocess
import json
import numpy as np

SAMPLE_RATE = 44100
DURATION = 180.2  # 3 minutes + slight buffer
FFMPEG = r"C:\Program Files (x86)\clipdown\ffmpeg.exe"
AUDIO_DIR = r"c:\Users\windows\OneDrive\Desktop\sh\assets\audio\kongi-3min"
VIDEO_IN = r"c:\Users\windows\OneDrive\Desktop\sh\assets\videos\kongi-3min-exercise.mp4"
VIDEO_OUT = r"c:\Users\windows\OneDrive\Desktop\sh\assets\videos\kongi-3min-exercise-master.mp4"

# Cue timings (calibrated to start ~1s before movement, 2~4s pause between sentences)
CUES = [
    # [0:00~0:15] 인사 및 시작
    {"file": "c01_intro1.mp3", "time": 1.5, "text": "안녕하세요. 콩이예요."},
    {"file": "c02_intro2.mp3", "time": 8.0, "text": "오늘도 저와 함께 천천히 체조해 볼까요?"},

    # [0:15~0:30] 자세 준비
    {"file": "c03_posture1.mp3", "time": 15.0, "text": "허리를 편안하게 펴고,"},
    {"file": "c04_posture2.mp3", "time": 21.0, "text": "두 발을 바닥에 놓아주세요."},

    # [0:30~0:55] 동작: 양팔 크게 올렸다 내리기 (동작 시작 0:30, 음성 시작 0:29)
    {"file": "c05_arms1.mp3", "time": 29.0, "text": "양팔을 천천히 올려볼게요."},
    {"file": "c06_arms2.mp3", "time": 35.5, "text": "하나, 둘."},
    {"file": "c07_arms3.mp3", "time": 41.0, "text": "좋아요."},
    {"file": "c08_arms4.mp3", "time": 46.0, "text": "천천히 내려옵니다."},

    # [0:55~1:20] 동작: 오른팔, 왼팔 번갈아 움직이기 (동작 시작 0:55, 음성 시작 0:54)
    {"file": "c09_altarms1.mp3", "time": 54.0, "text": "이번에는 오른팔입니다."},
    {"file": "c10_altarms2.mp3", "time": 60.0, "text": "크게 한번 올려요."},
    {"file": "c11_altarms3.mp3", "time": 65.5, "text": "좋아요."},
    {"file": "c12_altarms4.mp3", "time": 70.5, "text": "이번에는 왼팔이에요."},

    # [1:20~1:45] 동작: 몸통과 어깨 움직이기 (동작 시작 1:20, 음성 시작 1:19)
    {"file": "c13_shoulder1.mp3", "time": 79.0, "text": "어깨를 편안하게 움직여볼게요."},
    {"file": "c14_shoulder2.mp3", "time": 86.0, "text": "오른쪽, 왼쪽."},
    {"file": "c15_shoulder3.mp3", "time": 92.0, "text": "천천히 따라오세요."},

    # [1:45~2:10] 동작: 손뼉과 앞으로 밀기 (동작 시작 1:45, 음성 시작 1:44)
    {"file": "c16_clap1.mp3", "time": 104.0, "text": "이번에는 박수를 쳐볼까요?"},
    {"file": "c17_clap2.mp3", "time": 110.0, "text": "짝짝."},
    {"file": "c18_clap3.mp3", "time": 115.0, "text": "좋아요."},
    {"file": "c19_clap4.mp3", "time": 120.0, "text": "두 손을 앞으로 쭉 밀어봅니다."},

    # [2:10~2:35] 동작: 발 번갈아 들어 올리기 (동작 시작 2:10, 음성 시작 2:09)
    {"file": "c20_feet1.mp3", "time": 129.0, "text": "오른발을 살짝 들어요."},
    {"file": "c21_feet2.mp3", "time": 135.0, "text": "하나, 둘."},
    {"file": "c22_feet3.mp3", "time": 141.0, "text": "이번에는 왼발입니다."},
    {"file": "c23_feet4.mp3", "time": 147.0, "text": "천천히 들어볼게요."},

    # [2:35~2:50] 동작: 양팔 편안하게 벌리기 (동작 시작 2:35, 음성 시작 2:34)
    {"file": "c24_openarms1.mp3", "time": 154.0, "text": "이제 천천히 마무리할게요."},
    {"file": "c25_openarms2.mp3", "time": 160.0, "text": "양팔을 편안하게 벌려주세요."},

    # [2:50~3:00] 마무리 숨고르기 (동작 시작 2:50, 음성 시작 2:49)
    {"file": "c26_finish1.mp3", "time": 169.0, "text": "크게 숨을 들이마시고,"},
    {"file": "c27_finish2.mp3", "time": 174.0, "text": "후우."},
    {"file": "c28_finish3.mp3", "time": 177.5, "text": "오늘도 정말 잘하셨어요."}
]

def note_freq(midi_pitch):
    return 440.0 * (2.0 ** ((midi_pitch - 69) / 12.0))

def render_piano_note(freq, duration_sec, velocity=0.8):
    total_samples = int(duration_sec * SAMPLE_RATE)
    t = np.linspace(0, duration_sec, total_samples, endpoint=False)
    # Fundamental + harmonic overtones for warm acoustic piano timbre
    h1 = np.sin(2 * np.pi * freq * t) * np.exp(-t * 2.2)
    h2 = np.sin(2 * np.pi * freq * 2 * t) * 0.45 * np.exp(-t * 3.5)
    h3 = np.sin(2 * np.pi * freq * 3 * t) * 0.25 * np.exp(-t * 4.8)
    h4 = np.sin(2 * np.pi * freq * 4 * t) * 0.12 * np.exp(-t * 6.5)
    note = (h1 + h2 + h3 + h4) * velocity
    # Gentle attack envelope to prevent clicks (10ms)
    attack_len = int(SAMPLE_RATE * 0.015)
    if attack_len < total_samples:
        note[:attack_len] *= np.linspace(0, 1, attack_len)
    return note

def generate_soothing_bgm():
    total_samples = int(DURATION * SAMPLE_RATE)
    bgm = np.zeros(total_samples, dtype=np.float32)

    # 60 BPM -> 1 beat = 1.0 second, 1 bar = 4 seconds
    # Beautiful calming progression in F Major / C Major:
    # Bar 1: F Major (F3, C4, F4, A4)
    # Bar 2: G Major (G3, D4, G4, B4)
    # Bar 3: E minor 7 (E3, B3, E4, G4)
    # Bar 4: A minor 7 (A3, C4, E4, A4)
    # Bar 5: D minor 7 (D3, A3, F4, C5)
    # Bar 6: G7 sus4 -> G7 (G3, D4, F4, B4)
    # Bar 7: C Major add9 (C3, G3, E4, D5)
    # Bar 8: C Major (C3, G3, C4, E4)
    
    progression = [
        # (bass, [notes for arpeggio], duration)
        (53, [60, 65, 69, 72, 69, 65]),  # F
        (55, [62, 67, 71, 74, 71, 67]),  # G
        (52, [59, 64, 67, 71, 67, 64]),  # Em
        (57, [60, 64, 69, 72, 69, 64]),  # Am
        (50, [57, 62, 65, 69, 65, 62]),  # Dm
        (55, [59, 62, 67, 71, 67, 62]),  # G7
        (48, [55, 60, 64, 67, 71, 67]),  # C add9
        (48, [55, 60, 64, 67, 64, 60]),  # C
    ]

    bpm = 60.0
    bar_sec = 4.0
    pattern_len_sec = len(progression) * bar_sec  # 32 seconds per cycle

    current_t = 0.0
    while current_t < DURATION:
        for bass_pitch, chord_pitches, in progression:
            if current_t >= DURATION:
                break
            start_sample = int(current_t * SAMPLE_RATE)
            
            # Bass note
            bass_freq = note_freq(bass_pitch)
            bass_wav = render_piano_note(bass_freq, bar_sec * 0.95, velocity=0.45)
            end_sample = min(start_sample + len(bass_wav), total_samples)
            bgm[start_sample:end_sample] += bass_wav[:end_sample - start_sample]

            # Arpeggiated melody across the 4 beats
            step_sec = bar_sec / len(chord_pitches)
            for step_i, pitch in enumerate(chord_pitches):
                note_t = current_t + step_i * step_sec
                if note_t >= DURATION:
                    break
                n_sample = int(note_t * SAMPLE_RATE)
                n_freq = note_freq(pitch)
                n_wav = render_piano_note(n_freq, step_sec * 1.8, velocity=0.25)
                n_end = min(n_sample + len(n_wav), total_samples)
                bgm[n_sample:n_end] += n_wav[:n_end - n_sample]

            current_t += bar_sec

    # Normalize BGM to peak 0.35 (comfortable background level)
    peak = np.max(np.abs(bgm))
    if peak > 0:
        bgm = bgm / peak * 0.35

    # Gentle fade in at 0~2s and fade out at 178~180s
    fade_in_len = int(SAMPLE_RATE * 2.0)
    bgm[:fade_in_len] *= np.linspace(0, 1, fade_in_len)
    fade_out_len = int(SAMPLE_RATE * 2.5)
    bgm[-fade_out_len:] *= np.linspace(1, 0, fade_out_len)

    return bgm

def load_audio_as_wav(mp3_path):
    # Use ffmpeg to decode MP3 to raw PCM float32 at 44100Hz mono
    cmd = [
        FFMPEG, "-v", "quiet", "-i", mp3_path,
        "-f", "f32le", "-ac", "1", "-ar", str(SAMPLE_RATE), "-"
    ]
    p = subprocess.run(cmd, stdout=subprocess.PIPE, check=True)
    return np.frombuffer(p.stdout, dtype=np.float32)

def main():
    print("[1/4] Generating soothing acoustic piano BGM...")
    bgm = generate_soothing_bgm()
    total_samples = len(bgm)

    print("[2/4] Loading voice cues and computing audio ducking envelope...")
    voice_track = np.zeros(total_samples, dtype=np.float32)
    # Ducking envelope: 1.0 = full BGM, 0.22 = ducked during speech
    ducking_envelope = np.ones(total_samples, dtype=np.float32)

    for cue in CUES:
        mp3_path = os.path.join(AUDIO_DIR, cue["file"])
        wav = load_audio_as_wav(mp3_path)
        start_t = cue["time"]
        dur = len(wav) / SAMPLE_RATE
        end_t = start_t + dur

        cue["duration"] = dur
        cue["end_time"] = end_t

        start_s = int(start_t * SAMPLE_RATE)
        end_s = min(start_s + len(wav), total_samples)
        
        # Add voice with clear, comfortable volume
        voice_track[start_s:end_s] += wav[:end_s - start_s] * 1.15

        # Ducking: dip BGM 0.2s before speech, keep low during speech, restore 0.6s after speech
        dip_start_s = max(0, int((start_t - 0.25) * SAMPLE_RATE))
        dip_reach_s = int(start_t * SAMPLE_RATE)
        restore_start_s = int(end_t * SAMPLE_RATE)
        restore_end_s = min(total_samples, int((end_t + 0.65) * SAMPLE_RATE))

        # Fade down
        if dip_reach_s > dip_start_s:
            fade_len = dip_reach_s - dip_start_s
            curve = np.linspace(1.0, 0.22, fade_len)
            ducking_envelope[dip_start_s:dip_reach_s] = np.minimum(ducking_envelope[dip_start_s:dip_reach_s], curve)

        # Hold low
        ducking_envelope[dip_reach_s:restore_start_s] = np.minimum(ducking_envelope[dip_reach_s:restore_start_s], 0.22)

        # Fade up
        if restore_end_s > restore_start_s:
            fade_len = restore_end_s - restore_start_s
            curve = np.linspace(0.22, 1.0, fade_len)
            ducking_envelope[restore_start_s:restore_end_s] = np.minimum(ducking_envelope[restore_start_s:restore_end_s], curve)

    # Save timing manifest as JSON for the web interface
    manifest_path = os.path.join(AUDIO_DIR, "exercise-timing-manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(CUES, f, ensure_ascii=False, indent=2)
    print(f"Timing manifest saved to: {manifest_path}")

    print("[3/4] Applying audio ducking and mixing tracks...")
    ducked_bgm = bgm * ducking_envelope
    final_mix = ducked_bgm + voice_track

    # Soft limiter to prevent clipping
    peak = np.max(np.abs(final_mix))
    if peak > 0.95:
        final_mix = final_mix / peak * 0.95

    # Export mixed audio as MP3
    mixed_audio_path = os.path.join(AUDIO_DIR, "kongi-3min-mixed.mp3")
    proc = subprocess.Popen([
        FFMPEG, "-v", "quiet", "-y",
        "-f", "f32le", "-ar", str(SAMPLE_RATE), "-ac", "1", "-i", "-",
        "-b:a", "192k", mixed_audio_path
    ], stdin=subprocess.PIPE)
    proc.communicate(final_mix.astype(np.float32).tobytes())
    print(f"Master mixed audio saved: {mixed_audio_path}")

    # Also export ducked BGM standalone for interactive web audio option
    bgm_path = os.path.join(AUDIO_DIR, "kongi-3min-bgm-ducked.mp3")
    proc2 = subprocess.Popen([
        FFMPEG, "-v", "quiet", "-y",
        "-f", "f32le", "-ar", str(SAMPLE_RATE), "-ac", "1", "-i", "-",
        "-b:a", "192k", bgm_path
    ], stdin=subprocess.PIPE)
    proc2.communicate(ducked_bgm.astype(np.float32).tobytes())
    print(f"Ducked BGM saved: {bgm_path}")

    print("[4/4] Muxing audio with video to create kongi-3min-exercise-master.mp4...")
    mux_cmd = [
        FFMPEG, "-v", "warning", "-y",
        "-i", VIDEO_IN,
        "-i", mixed_audio_path,
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        VIDEO_OUT
    ]
    subprocess.run(mux_cmd, check=True)
    print(f"Master Video successfully created at: {VIDEO_OUT}")

if __name__ == "__main__":
    main()
