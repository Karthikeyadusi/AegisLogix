"""Shared pytest fixtures for the backend test suite."""

import pytest
from fastapi.testclient import TestClient
import numpy as np

from src.main import app
from src.ml.engine import AegisGuard
from src.core.config import get_settings


class MockAegisGuard:
    """Mock implementation of the ML engine for testing."""
    
    def __init__(self, *args, **kwargs):
        self.model_loaded = True
        self.model_path = "mock/path.onnx"
        
    def scan(self, frame: np.ndarray) -> tuple[np.ndarray, list[dict]]:
        """Return a dummy annotated frame and a fake detection."""
        annotated = frame.copy()
        detections = [{
            "class": "Dent",
            "conf": 0.95,
            "bbox": [10, 10, 50, 50]
        }]
        return annotated, detections


@pytest.fixture
def mock_engine(monkeypatch):
    """Fixture that replaces the real AegisGuard with a mock."""
    engine = MockAegisGuard()
    
    # We also need to patch app.state.engine and app.state.analyzer if they 
    # are used, or better yet, we can override the lifespan by patching the engine
    # before the app starts, or simply override the app state directly in the client fixture.
    return engine


@pytest.fixture
def client(mock_engine):
    """FastAPI TestClient fixture."""
    # Override the app state with our mock engine so we don't load the real model
    # during testing.
    with TestClient(app) as test_client:
        app.state.engine = mock_engine
        
        # We need to recreate the AnalyzerService with the mock engine
        from src.services.analyzer import AnalyzerService
        app.state.analyzer = AnalyzerService(
            engine=mock_engine, 
            settings=get_settings()
        )
        
        yield test_client


@pytest.fixture
def sample_image_bytes():
    """Returns a valid 10x10 JPEG image in bytes."""
    import cv2
    img = np.zeros((10, 10, 3), dtype=np.uint8)
    _, buffer = cv2.imencode(".jpg", img)
    return buffer.tobytes()
