import os
from PIL import Image

output_dir = r'J:\sh\assets\exercise-20min\gifs'
public_dir = r'J:\sh\assets\exercise-20min'
os.makedirs(output_dir, exist_ok=True)

def create_gif(frames, output_path, duration_ms=450):
    # RGB 변환 후 GIF 저장
    rgb_frames = [f.convert('RGBA') for f in frames]
    # 팔레트 양자화로 고품질 GIF 생성
    quantized_frames = []
    for f in rgb_frames:
        # 배경 합성 (흰색)
        bg = Image.new('RGB', f.size, (255, 255, 255))
        bg.paste(f, mask=f.split()[3])
        # Adaptive palette
        q = bg.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
        quantized_frames.append(q)
    
    quantized_frames[0].save(
        output_path,
        save_all=True,
        append_images=quantized_frames[1:],
        duration=duration_ms,
        loop=0,
        optimize=True
    )
    print(f"Created GIF: {output_path} ({len(frames)} frames, {duration_ms}ms per frame)")

# 1. GIF 1: 손 흔들기 (exercise_wave.gif)
# 부드러운 손 흔들기 시퀀스
wave_frames = [
    Image.open(os.path.join(output_dir, "exercise_wave_tl.png")),
    Image.open(os.path.join(output_dir, "exercise_wave_tr.png")),
    Image.open(os.path.join(output_dir, "exercise_wave_br.png")),
    Image.open(os.path.join(output_dir, "exercise_wave_bl.png")),
    Image.open(os.path.join(output_dir, "exercise_wave_tr.png")),
]
create_gif(wave_frames, os.path.join(output_dir, "exercise_wave.gif"), duration_ms=500)
create_gif(wave_frames, os.path.join(public_dir, "exercise_wave.gif"), duration_ms=500)

# 2. GIF 2: 두 팔 올리기 (exercise_arms_up.gif)
# 천천히 올렸다가 천천히 내리는 스트레칭 시퀀스
arms_up_frames = [
    Image.open(os.path.join(output_dir, "exercise_arms_up_tl.png")), # 준비
    Image.open(os.path.join(output_dir, "exercise_arms_up_tr.png")), # 올리기 시작
    Image.open(os.path.join(output_dir, "exercise_arms_up_bl.png")), # 귀 옆
    Image.open(os.path.join(output_dir, "exercise_arms_up_br.png")), # 만세!
    Image.open(os.path.join(output_dir, "exercise_arms_up_bl.png")), # 천천히 내리기
    Image.open(os.path.join(output_dir, "exercise_arms_up_tr.png")), # 준비로 복귀
]
create_gif(arms_up_frames, os.path.join(output_dir, "exercise_arms_up.gif"), duration_ms=600)
create_gif(arms_up_frames, os.path.join(public_dir, "exercise_arms_up.gif"), duration_ms=600)

# 3. GIF 3: 박수 치기 (exercise_clap.gif)
# 짝짝 리듬감 있는 박수 시퀀스
clap_frames = [
    Image.open(os.path.join(output_dir, "exercise_clap_tl.png")), # 손 벌리기
    Image.open(os.path.join(output_dir, "exercise_clap_tr.png")), # 짝! 박수
    Image.open(os.path.join(output_dir, "exercise_clap_bl.png")), # 손 벌리기 반짝
    Image.open(os.path.join(output_dir, "exercise_clap_br.png")), # 짝짝! 박수
]
create_gif(clap_frames, os.path.join(output_dir, "exercise_clap.gif"), duration_ms=450)
create_gif(clap_frames, os.path.join(public_dir, "exercise_clap.gif"), duration_ms=450)

# 4. GIF 4: 무릎 들기 (exercise_knee_lift.gif)
# 오른 무릎 -> 내리기 -> 왼 무릎 -> 내리기 의자 하체 체조 시퀀스
knee_lift_frames = [
    Image.open(os.path.join(output_dir, "exercise_knee_lift_tl.png")), # 오른 무릎 들기
    Image.open(os.path.join(output_dir, "exercise_knee_lift_tr.png")), # 오른발 내리기
    Image.open(os.path.join(output_dir, "exercise_knee_lift_bl.png")), # 왼 무릎 들기
    Image.open(os.path.join(output_dir, "exercise_knee_lift_br.png")), # 왼발 내리기 & 바운스
]
create_gif(knee_lift_frames, os.path.join(output_dir, "exercise_knee_lift.gif"), duration_ms=550)
create_gif(knee_lift_frames, os.path.join(public_dir, "exercise_knee_lift.gif"), duration_ms=550)

print("All 4 Exercise GIFs successfully generated!")
