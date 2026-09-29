import os
from PIL import Image

upload_dir = r'C:\Users\myin\.gemini\antigravity-ide\brain\a5eb4275-d3f5-4008-a571-4d26998cbf97\.user_uploaded'
output_dir = r'J:\sh\assets\exercise-20min\gifs'
os.makedirs(output_dir, exist_ok=True)

# 시트 매핑
sheets = {
    "exercise_wave": "media_1790643469687.jpg",       # GIF 1: 손 흔들기
    "exercise_arms_up": "media_1790643469619.jpg",    # GIF 2: 두 팔 올리기
    "exercise_clap": "media_1790643469453.jpg",       # GIF 3: 박수 치기
    "exercise_knee_lift": "media_1790643469252.jpg",   # GIF 4: 무릎 들기
}

def extract_4_frames(im):
    w, h = im.size
    mid_x = w // 2
    mid_y = h // 2
    
    tl = im.crop((0, 0, mid_x, mid_y))
    tr = im.crop((mid_x, 0, w, mid_y))
    bl = im.crop((0, mid_y, mid_x, h))
    br = im.crop((mid_x, mid_y, w, h))
    return tl, tr, bl, br

for name, filename in sheets.items():
    p = os.path.join(upload_dir, filename)
    im = Image.open(p)
    tl, tr, bl, br = extract_4_frames(im)
    
    tl.save(os.path.join(output_dir, f"{name}_tl.png"))
    tr.save(os.path.join(output_dir, f"{name}_tr.png"))
    bl.save(os.path.join(output_dir, f"{name}_bl.png"))
    br.save(os.path.join(output_dir, f"{name}_br.png"))
    print(f"Extracted frames for {name}")
