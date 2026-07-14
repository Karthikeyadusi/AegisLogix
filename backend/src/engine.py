# src/engine.py
"""AegisGuard — ONNX-based container damage detection engine."""

import logging
from typing import Any

import cv2
import numpy as np
from ultralytics import YOLO

from src.config import CONFIDENCE_THRESHOLD, INFERENCE_IMAGE_SIZE, MODEL_PATH

logger = logging.getLogger(__name__)


class AegisGuard:
    """Wraps a YOLOv5s ONNX model for shipping-container damage detection."""

    def __init__(self, model_path: str = MODEL_PATH) -> None:
        self.model: YOLO = YOLO(model_path, task='detect')
        logger.info("AegisGuard engine loaded: %s", model_path)

    def scan(self, frame: np.ndarray) -> tuple[np.ndarray, list[dict[str, Any]]]:
        """Run inference on a BGR image and return the annotated frame and findings.

        Args:
            frame: A BGR numpy array as returned by cv2.imdecode.

        Returns:
            A tuple of (annotated_image, detections) where detections is a list
            of dicts with 'class' and 'conf' keys.
        """
        # Run inference (imgsz 416 keeps it fast on local hardware)
        results = self.model.predict(
            source=frame,
            conf=CONFIDENCE_THRESHOLD,
            imgsz=INFERENCE_IMAGE_SIZE,
            verbose=False,
        )

        # Plot the bounding boxes custom onto the image
        annotated_frame = frame.copy()
        for box in results[0].boxes:
            conf = float(box.conf[0])
            cls_name = self.model.names[int(box.cls[0])]

            # Formatted Label: Class (XX%)
            label = f"{cls_name.capitalize()} ({int(conf * 100)}%)"

            # Severity color coding (BGR)
            if conf >= 0.70:
                color = (0, 0, 255)   # Red for high confidence/severity
            elif conf >= 0.40:
                color = (0, 255, 255) # Yellow for medium
            else:
                color = (0, 255, 0)   # Green for low

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
            (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
            cv2.rectangle(annotated_frame, (x1, y1 - 25), (x1 + w, y1), color, -1)
            cv2.putText(annotated_frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

        # Extract damage metrics
        detections: list[dict[str, Any]] = [
            {"class": self.model.names[int(box.cls[0])], "conf": float(box.conf[0])}
            for box in results[0].boxes
        ]

        return annotated_frame, detections