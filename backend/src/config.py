# src/config.py
"""Centralized configuration for the AegisLogix backend."""

from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
# Resolve the model path relative to the backend root directory (one level
# above src/), so the server works regardless of the working directory used
# to launch it.
_BACKEND_DIR: Path = Path(__file__).resolve().parent.parent
MODEL_PATH: str = str(_BACKEND_DIR / "models" / "aegis_v1.onnx")

# ---------------------------------------------------------------------------
# Inference settings
# ---------------------------------------------------------------------------
CONFIDENCE_THRESHOLD: float = 0.40
INFERENCE_IMAGE_SIZE: int = 416

# ---------------------------------------------------------------------------
# Upload constraints
# ---------------------------------------------------------------------------
MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
ALLOWED_CONTENT_TYPES: set[str] = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/tiff",
}
