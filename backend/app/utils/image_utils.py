import base64
import io
import math
from PIL import Image
from typing import List

def create_collage(image_data_list: List[str]) -> str:
    """
    Create a chronological collage from a list of base64 image strings.
    Grid layout: 2x2 (<=4), 3x2 (<=6), 3x3 (<=9).
    Returns the generated collage as a base64 string.
    """
    if not image_data_list:
        raise ValueError("No images provided for collage.")

    count = len(image_data_list)

    if count <= 4:
        cols, rows = 2, 2
    elif count <= 6:
        cols, rows = 3, 2
    else:
        cols, rows = 3, 3

    # Limit to max grid size
    max_images = cols * rows
    image_data_list = image_data_list[:max_images]

    tile_size = 300
    collage_width = cols * tile_size
    collage_height = rows * tile_size

    collage = Image.new("RGB", (collage_width, collage_height), color=(0, 0, 0))

    for idx, b64_str in enumerate(image_data_list):
        row = idx // cols
        col = idx % cols
        try:
            # Decode base64 to image
            image_bytes = base64.b64decode(b64_str.split(",")[1] if "," in b64_str else b64_str)
            img = Image.open(io.BytesIO(image_bytes))
            
            # Crop to square before resizing to avoid squishing
            width, height = img.size
            min_dim = min(width, height)
            left = (width - min_dim) / 2
            top = (height - min_dim) / 2
            right = (width + min_dim) / 2
            bottom = (height + min_dim) / 2
            img = img.crop((left, top, right, bottom))
            
            img = img.resize((tile_size, tile_size), Image.LANCZOS)
            collage.paste(img, (col * tile_size, row * tile_size))
        except Exception as e:
            print(f"Error processing image for collage: {e}")
            continue

    # Convert collage to base64
    buffered = io.BytesIO()
    collage.save(buffered, format="JPEG", quality=90)
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{img_str}"


def process_upload(file_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    """Process uploaded image bytes and return as a compressed base64 string."""
    try:
        # Open and compress the image before saving to DB
        img = Image.open(io.BytesIO(file_bytes))
        
        # Convert to RGB if RGBA (e.g. PNG with transparency)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Resize if too large (max 800x800 for database storage)
        img.thumbnail((800, 800), Image.LANCZOS)
        
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG", quality=80)
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/jpeg;base64,{img_str}"
    except Exception:
        # Fallback to direct encoding if Pillow fails
        img_str = base64.b64encode(file_bytes).decode("utf-8")
        return f"data:{mime_type};base64,{img_str}"
