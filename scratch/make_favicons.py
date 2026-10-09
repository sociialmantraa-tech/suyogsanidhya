import base64
from PIL import Image

def generate_favicons():
    # Load emblem image
    img = Image.open('frontend/public/emblem.png')
    
    # Get non-transparent bounding box
    bbox = img.getbbox()
    cropped = img.crop(bbox)
    
    # Create square canvas with transparent background
    square_size = max(cropped.width, cropped.height)
    square_img = Image.new('RGBA', (square_size, square_size), (0, 0, 0, 0))
    
    # Center the emblem inside the square canvas
    offset_x = (square_size - cropped.width) // 2
    offset_y = (square_size - cropped.height) // 2
    square_img.paste(cropped, (offset_x, offset_y), cropped)
    
    # Resize to standard icon sizes
    f512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
    f192 = square_img.resize((192, 192), Image.Resampling.LANCZOS)
    f180 = square_img.resize((180, 180), Image.Resampling.LANCZOS)
    f48 = square_img.resize((48, 48), Image.Resampling.LANCZOS)
    f32 = square_img.resize((32, 32), Image.Resampling.LANCZOS)
    f16 = square_img.resize((16, 16), Image.Resampling.LANCZOS)
    
    # Save PNG favicons in frontend/public/
    f512.save('frontend/public/favicon-512.png')
    f192.save('frontend/public/favicon-192.png')
    f180.save('frontend/public/apple-touch-icon.png')
    f48.save('frontend/public/favicon-48.png')
    f32.save('frontend/public/favicon-32.png')
    f16.save('frontend/public/favicon-16.png')
    
    # Save ICO file
    f32.save('frontend/public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    
    # Also copy to frontend/src/app/ if Next.js app router uses favicon.ico
    f32.save('frontend/src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    
    # Create SVG favicon
    with open('frontend/public/favicon-512.png', 'rb') as f:
        b64_str = base64.b64encode(f.read()).decode('utf-8')
        
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <image href="data:image/png;base64,{b64_str}" x="0" y="0" width="512" height="512" />
</svg>
'''
    with open('frontend/public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
        
    print("Successfully generated all square logo favicons (PNG, ICO, SVG, Apple Touch Icon)!")

if __name__ == '__main__':
    generate_favicons()
