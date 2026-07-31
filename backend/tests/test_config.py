"""Tests for the application configuration."""

import os
from unittest.mock import patch

from src.core.config import Settings, get_settings


def test_settings_defaults():
    """Test that default settings are loaded correctly."""
    # Ensure no env vars interfere
    with patch.dict(os.environ, clear=True):
        settings = Settings()
        assert settings.port == 8000
        assert settings.workers == 1
        assert settings.confidence_threshold == 0.40
        assert settings.inference_image_size == 416
        assert settings.max_upload_size_bytes == 10 * 1024 * 1024
        assert "http://localhost:5173" in settings.allowed_origins
        assert "https://aegislogix.vercel.app" in settings.allowed_origins


def test_settings_from_env():
    """Test that environment variables override defaults."""
    env = {
        "AEGIS_PORT": "8080",
        "AEGIS_WORKERS": "4",
        "AEGIS_LOG_LEVEL": "debug",
    }
    with patch.dict(os.environ, env, clear=True):
        settings = Settings()
        assert settings.port == 8080
        assert settings.workers == 4
        assert settings.log_level == "debug"


def test_get_settings_singleton():
    """Test that get_settings() caches the instance."""
    # Clear cache to ensure clean state
    get_settings.cache_clear()
    
    settings_1 = get_settings()
    settings_2 = get_settings()
    
    assert settings_1 is settings_2
