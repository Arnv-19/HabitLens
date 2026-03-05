import os
import math
from PIL import Image
from typing import List
from app.core.config import settings


def create_collage(image_paths: List[str], output_filename: str = "collage.jpg") -> str:
    """
    Create a chronological collage from a list of image paths.
    Grid layout: 2x2 (<=4), 3x2 (<=6), 3x3 (<=9).
    Returns the path to the generated collage.
    """
    if not image_paths:
        raise ValueError("No images provided for collage.")

    count = len(image_paths)

    if count <= 4:
        cols, rows = 2, 2
    elif count <= 6:
        cols, rows = 3, 2
    else:
        cols, rows = 3, 3

    # Limit to max grid size
    max_images = cols * rows
    image_paths = image_paths[:max_images]

    tile_size = 300
    collage_width = cols * tile_size
    collage_height = rows * tile_size

    collage = Image.new("RGB", (collage_width, collage_height), color=(0, 0, 0))

    for idx, path in enumerate(image_paths):
        row = idx // cols
        col = idx % cols
        try:
            img = Image.open(path)
            img = img.resize((tile_size, tile_size), Image.LANCZOS)
            collage.paste(img, (col * tile_size, row * tile_size))
        except Exception:
            continue

    output_path = os.path.join(settings.UPLOAD_DIR, output_filename)
    collage.save(output_path, "JPEG", quality=90)
    return output_path


def save_upload(file_bytes: bytes, filename: str) -> str:
    """Save uploaded image bytes to disk and return the path."""
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(file_bytes)
    return filepath
