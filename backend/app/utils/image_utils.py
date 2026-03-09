import base64
import io
import math
from PIL import Image
from typing import List

def create_collage(image_data_list: List[str]) -> str:
    """
    Create a chronological collage from a list of base64 image strings.
    Grid layout: up to 3x3. Centers rows with fewer items.
    Returns the generated collage as a base64 string.
    """
    if not image_data_list:
        raise ValueError("No images provided for collage.")

    # Limit to max grid size of 9
    max_images = 9
    image_data_list = image_data_list[:max_images]
    count = len(image_data_list)

    if count <= 2:
        cols, rows = count, 1
    elif count <= 4:
        cols, rows = 2, 2
    elif count <= 6:
        cols, rows = 3, 2
    else:
        cols, rows = 3, 3

    tile_size = 300
    collage_width = cols * tile_size
    collage_height = rows * tile_size

    collage = Image.new("RGB", (collage_width, collage_height), color=(0, 0, 0))

    from PIL import ImageDraw, ImageFont

    for idx, b64_str in enumerate(image_data_list):
        row = idx // cols
        col_in_row = idx % cols
        
        # Calculate how many items are in this current row to center it
        items_in_row = min(cols, count - row * cols)
        row_offset_x = (collage_width - (items_in_row * tile_size)) // 2
        
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
            
            # Add simple timestamp or border if desired, here just paste
            x_pos = row_offset_x + col_in_row * tile_size
            y_pos = row * tile_size
            collage.paste(img, (x_pos, y_pos))
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
        # Verify it's actually an image
        img_verify = Image.open(io.BytesIO(file_bytes))
        img_verify.verify()

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
    except Exception as e:
        raise ValueError("Invalid image file format")

