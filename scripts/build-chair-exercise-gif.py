import os
import shutil
from PIL import Image

artifact_dir = r"C:\Users\myin\.gemini\antigravity-ide\brain\3b119ef5-9fe3-4c41-8ab6-a0560b9a9a4f"
target_dir = r"j:\sh\assets\images\chair-exercise"
os.makedirs(target_dir, exist_ok=True)

f1_src = os.path.join(artifact_dir, "kongi_chair_step1_wave_1790658143545.jpg")
f2_src = os.path.join(artifact_dir, "kongi_chair_step2_arms_up_1790658161157.jpg")
f3_src = os.path.join(artifact_dir, "kongi_chair_step3_knees_tap_1790658177355.jpg")
f4_src = os.path.join(artifact_dir, "kongi_chair_step4_finish_wave_1790658192776.jpg")

shutil.copy(f1_src, os.path.join(target_dir, "kongi-chair-1-wave.jpg"))
shutil.copy(f2_src, os.path.join(target_dir, "kongi-chair-2-arms-up.jpg"))
shutil.copy(f3_src, os.path.join(target_dir, "kongi-chair-3-knees-tap.jpg"))
shutil.copy(f4_src, os.path.join(target_dir, "kongi-chair-4-finish.jpg"))

print("Copied 4 high-res source frames.")

# Open and resize for clean, smooth GIF playback
img1 = Image.open(f1_src).convert("RGB")
img2 = Image.open(f2_src).convert("RGB")
img3 = Image.open(f3_src).convert("RGB")
img4 = Image.open(f4_src).convert("RGB")

target_size = (960, 540) # 16:9 optimized size for crisp quality and lightweight loading
img1 = img1.resize(target_size, Image.Resampling.LANCZOS)
img2 = img2.resize(target_size, Image.Resampling.LANCZOS)
img3 = img3.resize(target_size, Image.Resampling.LANCZOS)
img4 = img4.resize(target_size, Image.Resampling.LANCZOS)

def blend(a, b, steps=4):
    res = []
    for i in range(1, steps):
        alpha = i / steps
        blended = Image.blend(a, b, alpha)
        res.append(blended)
    return res

frames = []
durations = []

# Key frame timing (in ms) - 30~40% slower with gentle pauses
# Step 1: 인사 (2500ms)
frames.append(img1)
durations.append(2500)

# Transition 1 -> 2
t1_2 = blend(img1, img2, steps=4)
for f in t1_2:
    frames.append(f)
    durations.append(150)

# Step 2: 양팔 올리기 (3200ms)
frames.append(img2)
durations.append(3200)

# Transition 2 -> 3
t2_3 = blend(img2, img3, steps=4)
for f in t2_3:
    frames.append(f)
    durations.append(150)

# Step 3: 무릎 톡톡 (3200ms)
frames.append(img3)
durations.append(3200)

# Transition 3 -> 4
t3_4 = blend(img3, img4, steps=4)
for f in t3_4:
    frames.append(f)
    durations.append(150)

# Step 4: 마무리 손인사 (2800ms)
frames.append(img4)
durations.append(2800)

# Transition 4 -> 1 loop
t4_1 = blend(img4, img1, steps=4)
for f in t4_1:
    frames.append(f)
    durations.append(150)

# Quantize and save animated GIF
gif_path = os.path.join(target_dir, "kongi-chair-exercise.gif")
palette_img = frames[0].quantize(colors=256, method=Image.Quantize.MEDIANCUT)
quantized_frames = [f.quantize(palette=palette_img) for f in frames]

quantized_frames[0].save(
    gif_path,
    save_all=True,
    append_images=quantized_frames[1:],
    duration=durations,
    loop=0,
    optimize=True
)

print(f"Successfully generated animated GIF: {gif_path} ({os.path.getsize(gif_path)} bytes)")
