"""AegisGuard — ONNX-based container damage detection engine.

This module wraps the Ultralytics YOLO inference pipeline for
shipping-container damage detection.  The class accepts all
configuration via constructor parameters so it has no dependency
on global state.
"""

import logging
import time
from typing import Any

import cv2
import numpy as np
from ultralytics import YOLO

logger = logging.getLogger(__name__)

# Severity thresholds for bounding-box colour coding (BGR).
_HIGH_SEVERITY_THRESHOLD: float = 0.70
_COLOR_HIGH: tuple[int, int, int] = (0, 0, 255)    # Red
_COLOR_MEDIUM: tuple[int, int, int] = (0, 255, 255)  # Yellow
_COLOR_LOW: tuple[int, int, int] = (0, 255, 0)      # Green

# Annotation drawing constants.
_FONT = cv2.FONT_HERSHEY_SIMPLEX
_FONT_SCALE: float = 0.6
_FONT_THICKNESS: int = 2
_BOX_THICKNESS: int = 2
_LABEL_BG_HEIGHT: int = 25


class AegisGuard:
    """Wraps a YOLOv5s ONNX model for shipping-container damage detection.

    Args:
        model_path: Filesystem path to the ONNX weights file.
        confidence_threshold: Minimum confidence for a detection to be kept.
        inference_image_size: Input resolution passed to YOLO ``predict()``.
    """

    def __init__(
        self,
        *,
        model_path: str,
        confidence_threshold: float = 0.40,
        inference_image_size: int = 416,
    ) -> None:
        self._model_path = model_path
        self._confidence_threshold = confidence_threshold
        self._inference_image_size = inference_image_size

        self._model: YOLO = YOLO(model_path, task="detect")
        logger.info(
            "AegisGuard engine loaded (model=%s, conf=%.2f, imgsz=%d)",
            model_path,
            confidence_threshold,
            inference_image_size,
        )

    # -- Public API ----------------------------------------------------------

    @property
    def model_loaded(self) -> bool:
        """Return ``True`` if the ONNX model was loaded successfully."""
        return self._model is not None

    @property
    def model_path(self) -> str:
        """Return the filesystem path to the loaded model."""
        return self._model_path

    def scan(
        self, frame: np.ndarray
    ) -> tuple[np.ndarray, list[dict[str, Any]]]:
        """Run inference on a BGR image and return the annotated frame + findings.

        Args:
            frame: A BGR numpy array as returned by ``cv2.imdecode``.

        Returns:
            A tuple of ``(annotated_image, detections)`` where *detections*
            is a list of dicts with ``class``, ``conf``, and ``bbox`` keys.
        """
        start = time.perf_counter()

        results = self._model.predict(
            source=frame,
            conf=self._confidence_threshold,
            imgsz=self._inference_image_size,
            verbose=False,
        )

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info("Inference completed in %.1f ms", elapsed_ms)

        annotated_frame = frame.copy()
        detections: list[dict[str, Any]] = []

        for box in results[0].boxes:
            conf = float(box.conf[0])
            cls_name = self._model.names[int(box.cls[0])]
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Build detection record.
            detections.append(
                {
                    "class": cls_name,
                    "conf": conf,
                    "bbox": [x1, y1, x2, y2],
                }
            )

            # Draw bounding box with severity colour coding.
            color = self._severity_color(conf)
            label = f"{cls_name.capitalize()} ({int(conf * 100)}%)"

            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, _BOX_THICKNESS)

            (tw, _th), _ = cv2.getTextSize(label, _FONT, _FONT_SCALE, _FONT_THICKNESS)
            cv2.rectangle(
                annotated_frame,
                (x1, y1 - _LABEL_BG_HEIGHT),
                (x1 + tw, y1),
                color,
                cv2.FILLED,
            )
            cv2.putText(
                annotated_frame,
                label,
                (x1, y1 - 5),
                _FONT,
                _FONT_SCALE,
                (0, 0, 0),
                _FONT_THICKNESS,
            )

        return annotated_frame, detections

    # -- Private helpers -----------------------------------------------------

    @staticmethod
    def _severity_color(confidence: float) -> tuple[int, int, int]:
        """Return a BGR colour based on the confidence / severity level."""
        if confidence >= _HIGH_SEVERITY_THRESHOLD:
            return _COLOR_HIGH
        if confidence >= 0.40:
            return _COLOR_MEDIUM
        return _COLOR_LOW
