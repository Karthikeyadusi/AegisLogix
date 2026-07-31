"""Analyzer service — orchestrates the image analysis workflow.

This module sits between the API layer and the ML engine.  It
coordinates validation, decoding, inference, and response encoding
so that the route handler stays thin and each step is independently
testable.
"""

import logging

from src.api.schemas import AnalysisResponse, DetectionDetail
from src.core.config import Settings
from src.ml.engine import AegisGuard
from src.utils.imaging import decode_image, encode_to_base64_jpeg

logger = logging.getLogger(__name__)


class AnalyzerService:
    """Stateless service that converts raw image bytes into an analysis response.

    Args:
        engine: A loaded ``AegisGuard`` instance.
        settings: Application settings (used for image dimension limits).
    """

    def __init__(self, engine: AegisGuard, settings: Settings) -> None:
        self._engine = engine
        self._settings = settings

    def analyze(self, data: bytes, *, filename: str) -> AnalysisResponse:
        """Run the full analysis pipeline on raw image bytes.

        Steps:
            1. Decode bytes → BGR ``np.ndarray`` (with dimension guard).
            2. Run YOLO inference via ``AegisGuard.scan()``.
            3. Encode annotated image → Base64 JPEG.
            4. Build and return the typed ``AnalysisResponse``.

        Args:
            data: Raw image bytes (already size-validated by the upload reader).
            filename: Original filename, used for logging only.

        Returns:
            A fully populated ``AnalysisResponse``.
        """
        logger.info("Analyzing '%s' (%d bytes)", filename, len(data))

        # 1. Decode + dimension guard.
        img = decode_image(data, max_dimension=self._settings.max_image_dimension)

        # 2. Inference.
        annotated_img, raw_detections = self._engine.scan(img)

        # 3. Encode annotated image.
        image_b64 = encode_to_base64_jpeg(annotated_img)

        # 4. Build typed response.
        details = [
            DetectionDetail(
                class_name=det["class"],
                confidence=det["conf"],
                bbox=det["bbox"],
            )
            for det in raw_detections
        ]

        logger.info("Analysis complete: %d issues found", len(details))

        return AnalysisResponse(
            status="success",
            total_issues=len(details),
            details=details,
            image_data=image_b64,
        )
