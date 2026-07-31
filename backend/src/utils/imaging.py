"""Image utility functions: upload streaming, decoding, encoding.

These helpers isolate all raw image I/O so that neither routes nor
services need to touch OpenCV or Base64 directly.
"""

import base64
import logging

import cv2
import numpy as np
from fastapi import UploadFile

from src.core.exceptions import ImageValidationError

logger = logging.getLogger(__name__)

# Size of each chunk read from the upload stream (1 MB).
_CHUNK_SIZE: int = 1_048_576


def read_upload_streaming(file: UploadFile, *, max_size: int) -> bytes:
    """Read an uploaded file in chunks, aborting if *max_size* is exceeded.

    This prevents memory-exhaustion attacks where a malicious client sends
    a multi-gigabyte payload that would otherwise be buffered entirely into
    RAM before the size check runs.

    Args:
        file: The FastAPI ``UploadFile`` wrapper.
        max_size: Maximum allowed file size in bytes.

    Returns:
        The complete file contents as ``bytes``.

    Raises:
        ImageValidationError: If the file exceeds *max_size* or is empty.
    """
    chunks: list[bytes] = []
    total = 0

    while True:
        chunk = file.file.read(_CHUNK_SIZE)
        if not chunk:
            break
        total += len(chunk)
        if total > max_size:
            max_mb = max_size / (1024 * 1024)
            raise ImageValidationError(
                code="file_too_large",
                detail=(
                    f"Upload exceeds the maximum allowed size of {max_mb:.0f} MB. "
                    f"Read aborted after {total / (1024 * 1024):.1f} MB."
                ),
            )
        chunks.append(chunk)

    data = b"".join(chunks)

    if len(data) == 0:
        raise ImageValidationError(
            code="empty_file",
            detail="Uploaded file is empty.",
        )

    return data


def validate_content_type(content_type: str | None, *, allowed: set[str]) -> None:
    """Reject uploads whose MIME type is not in *allowed*.

    Args:
        content_type: The ``Content-Type`` header value from the upload.
        allowed: Set of acceptable MIME types.

    Raises:
        ImageValidationError: If *content_type* is missing or not in *allowed*.
    """
    if content_type is None or content_type not in allowed:
        raise ImageValidationError(
            code="invalid_content_type",
            detail=(
                f"Unsupported file type '{content_type}'. "
                f"Accepted types: {', '.join(sorted(allowed))}."
            ),
        )


def decode_image(data: bytes, *, max_dimension: int) -> np.ndarray:
    """Decode raw bytes into a BGR NumPy array via OpenCV.

    After decoding, the image dimensions are validated against
    *max_dimension* to prevent decompression bombs (e.g. a 50 KB PNG
    that expands into a 100-megapixel array in RAM).

    Args:
        data: Raw image bytes (JPEG, PNG, etc.).
        max_dimension: Maximum allowed width or height in pixels.

    Returns:
        A BGR ``np.ndarray`` suitable for OpenCV / YOLO processing.

    Raises:
        ImageValidationError: If decoding fails or dimensions are too large.
    """
    nparr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ImageValidationError(
            code="decode_failed",
            detail="Unable to decode image. The file may be corrupted or in an unsupported format.",
        )

    height, width = img.shape[:2]
    if width > max_dimension or height > max_dimension:
        raise ImageValidationError(
            code="image_too_large",
            detail=(
                f"Image dimensions ({width}×{height}) exceed the maximum "
                f"allowed dimension of {max_dimension}px."
            ),
        )

    return img


def encode_to_base64_jpeg(image: np.ndarray, *, quality: int = 90) -> str:
    """Compress a BGR image to JPEG and return as a Base64-encoded string.

    Args:
        image: BGR ``np.ndarray`` to encode.
        quality: JPEG quality (0–100). Default 90.

    Returns:
        Base64 string of the JPEG bytes.
    """
    encode_params = [cv2.IMWRITE_JPEG_QUALITY, quality]
    success, buffer = cv2.imencode(".jpg", image, encode_params)

    if not success:
        raise RuntimeError("cv2.imencode failed to produce JPEG output.")

    return base64.b64encode(buffer).decode("utf-8")
