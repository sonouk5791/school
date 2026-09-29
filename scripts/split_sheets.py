import os
from PIL import Image

upload_dir = r'C:\Users\myin\.gemini\antigravity-ide\brain\a5eb4275-d3f5-4008-a571-4d26998cbf97\.user_uploaded'
output_dir = r'J:\sh\assets\exercise-20min\gifs'
os.makedirs(output_dir, exist_ok=True)

# 4개 파일 목록
files = [
    'media_1790643469252.jpg',
    'media_1790643469453.jpg',
    'media_1790643469619.jpg',
    'media_1790643469687.jpg'
]

def process_sheet(filepath, out_prefix):
    im = Image.open(filepath)
    w, h = im.size
    mid_x = w // 2
    mid_y = h // 2
    
    # 2x2 그리드 프레임 추출: (top-left, top-right, bottom-right, bottom-left)
    # 또는 애니메이션 순서: TL -> TR -> BR -> BL
    f_tl = im.crop((0, 0, mid_x, mid_y))
    f_tr = im.crop((mid_x, 0, w, mid_y))
    f_br = im.crop((mid_x, mid_y, w, h))
    f_bl = im.crop((0, mid_y, mid_x, h))
    
    # 임시 프레임 저장
    f_tl.save(os.path.join(output_dir, f"{out_prefix}_0_tl.png"))
    f_tr.save(os.path.join(output_dir, f"{out_prefix}_1_tr.png"))
    f_br.save(os.path.join(output_dir, f"{out_prefix}_2_br.png"))
    f_bl.save(os.path.join(output_dir, f"{out_prefix}_3_bl.png"))
    print(f"Processed {filepath} -> size {w}x{h}")

for idx, f in enumerate(files):
    p = os.path.join(upload_dir, f)
    if os.path.exists(p):
        process_sheet(p, f"sheet_{idx}")
