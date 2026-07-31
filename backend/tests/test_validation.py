"""Tests for the imaging utilities and validation functions."""

import pytest
import numpy as np

from src.utils.imaging import (
    validate_content_type,
    decode_image,
    encode_to_base64_jpeg
)
from src.core.exceptions import ImageValidationError


def test_validate_content_type_valid():
    """Test valid content types pass."""
    allowed = {"image/jpeg", "image/png"}
    # Should not raise
    validate_content_type("image/jpeg", allowed=allowed)


def test_validate_content_type_invalid():
    """Test invalid content types raise ImageValidationError."""
    allowed = {"image/jpeg"}
    with pytest.raises(ImageValidationError) as exc_info:
        validate_content_type("text/plain", allowed=allowed)
    assert exc_info.value.code == "invalid_content_type"


def test_decode_image_success(sample_image_bytes):
    """Test decoding a valid image."""
    img = decode_image(sample_image_bytes, max_dimension=8192)
    assert isinstance(img, np.ndarray)
    # The sample image is 1x1 pixel
    assert img.shape[:2] == (10, 10)


def test_decode_image_decompression_bomb(sample_image_bytes):
    """Test decompression bomb protection (max dimension)."""
    with pytest.raises(ImageValidationError) as exc_info:
        # Force a failure by setting max_dimension to 0
        decode_image(sample_image_bytes, max_dimension=0)
    assert exc_info.value.code == "image_too_large"


def test_encode_to_base64_jpeg():
    """Test encoding a numpy array to base64."""
    # Create a 10x10 black image
    img = np.zeros((10, 10, 3), dtype=np.uint8)
    b64_str = encode_to_base64_jpeg(img)
    assert isinstance(b64_str, str)
    assert len(b64_str) > 0
