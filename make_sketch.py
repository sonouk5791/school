import os
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

def make_clean_coloring_sketch(input_path, output_path):
    img = Image.open(input_path).convert('RGB')
    w, h = img.size
    
    # 1. Clean top-left watermark if blue Ps badge was present (especially on nostalgic_village)
    arr = np.array(img)
    if 'nostalgic_village' in input_path:
        sky_sample = arr[30:70, 150:200].mean(axis=(0,1))
        arr[0:70, 0:70] = sky_sample
        img = Image.fromarray(arr)
        img.save(input_path, quality=95)
    
    gray = img.convert('L')
    
    # 2. Aggressive noise reduction for high frequency texture while keeping edges
    med1 = gray.filter(ImageFilter.MedianFilter(size=7))
    med2 = med1.filter(ImageFilter.MedianFilter(size=5))
    
    # 3. High-precision Multi-scale Difference of Gaussians (DoG)
    g_fine = np.array(med2.filter(ImageFilter.GaussianBlur(radius=1.2)), dtype=np.float32)
    g_mid  = np.array(med2.filter(ImageFilter.GaussianBlur(radius=3.0)), dtype=np.float32)
    g_wide = np.array(med2.filter(ImageFilter.GaussianBlur(radius=8.0)), dtype=np.float32)
    
    dog_fine = g_fine - 0.97 * g_mid
    dog_wide = g_fine - 0.92 * g_wide
    
    # Combined bold edge strength
    edge = np.maximum(-dog_fine * 9.5, -dog_wide * 5.5)
    edge = np.clip(edge, 0, 255.0)
    
    # 4. Remove isolated speckle noise
    norm_edge = edge / 255.0
    norm_edge = np.where(norm_edge < 0.12, 0.0, norm_edge) # cut low noise
    norm_edge = np.power(norm_edge, 0.7) * 1.6
    norm_edge = np.clip(norm_edge, 0.0, 1.0)
    
    # Convert to dark ink on white paper
    ink = (1.0 - norm_edge) * 255.0
    
    # Clean sky (top 25% of image) if outdoor landscape
    if 'village' in input_path or 'flowers' in input_path or 'sunset' in input_path:
        ink[:int(h * 0.25), :] = np.where(ink[:int(h * 0.25), :] > 140, 255.0, ink[:int(h * 0.25), :])
    
    # Deepen dark lines and clean background
    ink = np.where(ink > 190, 255.0, ink)
    ink = np.where(ink < 85, 20.0, ink)
    
    sketch = Image.fromarray(ink.astype(np.uint8)).convert('RGB')
    
    # Smooth line edges slightly for natural pencil/ink feel
    sketch = sketch.filter(ImageFilter.MedianFilter(size=3))
    sketch = ImageEnhance.Contrast(sketch).enhance(1.35)
    sketch = ImageEnhance.Sharpness(sketch).enhance(1.4)
    
    sketch.save(output_path, quality=95)
    print(f"Crisp coloring sketch saved successfully: {output_path}")

if __name__ == '__main__':
    import sys
    if len(sys.argv) >= 3:
        make_clean_coloring_sketch(sys.argv[1], sys.argv[2])
    else:
        images = [
            ('assets/images/nostalgic_village.jpg', 'assets/images/nostalgic_village_sketch.jpg'),
            ('assets/images/village_green_mountain.jpg', 'assets/images/village_green_mountain_sketch.jpg'),
            ('assets/images/village_clear_stream.jpg', 'assets/images/village_clear_stream_sketch.jpg'),
            ('assets/images/spring_flowers.jpg', 'assets/images/spring_flowers_sketch.jpg'),
            ('assets/images/spring_apricot_blossom.jpg', 'assets/images/spring_apricot_blossom_sketch.jpg'),
            ('assets/images/spring_fresh_green_hill.jpg', 'assets/images/spring_fresh_green_hill_sketch.jpg'),
            ('assets/images/korean_sunflower.jpg', 'assets/images/korean_sunflower_sketch.jpg'),
            ('assets/images/sunflower_near_pots.jpg', 'assets/images/sunflower_near_pots_sketch.jpg'),
            ('assets/images/sunflower_seed_head.jpg', 'assets/images/sunflower_seed_head_sketch.jpg'),
            ('assets/images/ai_puppy_friend.jpg', 'assets/images/ai_puppy_friend_sketch.jpg'),
            ('assets/images/baduki_running_yard.jpg', 'assets/images/baduki_running_yard_sketch.jpg'),
            ('assets/images/baduki_lying_porch.jpg', 'assets/images/baduki_lying_porch_sketch.jpg'),
            ('assets/images/warm_jujube_tea.jpg', 'assets/images/warm_jujube_tea_sketch.jpg'),
            ('assets/images/teacup_ceramic_antique.jpg', 'assets/images/teacup_ceramic_antique_sketch.jpg'),
            ('assets/images/teacup_jujube_garnish.jpg', 'assets/images/teacup_jujube_garnish_sketch.jpg'),
            ('assets/images/fruits_basket.jpg', 'assets/images/fruits_basket_sketch.jpg'),
            ('assets/images/nostalgic_village_sunset.jpg', 'assets/images/nostalgic_village_sunset_sketch.jpg'),
            ('assets/images/ai_puppy_heart.jpg', 'assets/images/ai_puppy_heart_sketch.jpg'),
        ]
        for src, dst in images:
            if os.path.exists(src):
                make_clean_coloring_sketch(src, dst)
