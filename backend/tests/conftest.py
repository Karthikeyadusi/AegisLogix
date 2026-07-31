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
    """Returns a valid 1x1 JPEG pixel in bytes."""
    # Minimal 1x1 JPEG
    return b'\\xff\\xd8\\xff\\xe0\\x00\\x10JFIF\\x00\\x01\\x01\\x01\\x00H\\x00H\\x00\\x00\\xff\\xdb\\x00C\\x00\\x03\\x02\\x02\\x02\\x02\\x02\\x03\\x02\\x02\\x02\\x03\\x03\\x03\\x03\\x04\\x06\\x04\\x04\\x04\\x04\\x04\\x08\\x06\\x06\\x05\\x06\\t\\x08\\n\\n\\t\\x08\\t\\t\\n\\x0c\\x0f\\x0c\\n\\x0b\\x0e\\x0b\\t\\t\\r\\x11\\r\\x0e\\x0f\\x10\\x10\\x11\\x10\\n\\x0c\\x12\\x13\\x12\\x10\\x13\\x0f\\x10\\x10\\x10\\xff\\xc0\\x00\\x0b\\x08\\x00\\x01\\x00\\x01\\x01\\x01\\x11\\x00\\xff\\xc4\\x00\\x14\\x00\\x01\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x03\\xff\\xc4\\x00\\x14\\x10\\x01\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\xff\\xda\\x00\\x08\\x01\\x01\\x00\\x00?\\x00?\\xff\\xd9'
