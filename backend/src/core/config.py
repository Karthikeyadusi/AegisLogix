"""Centralized, environment-driven configuration for the AegisLogix backend.

Uses pydantic-settings to parse environment variables at startup with
type validation and sensible defaults. All runtime tunables live here —
no magic numbers scattered across the codebase.
"""

import os
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# ---------------------------------------------------------------------------
# Resolve the backend root directory once (two levels above this file:
# src/core/config.py → src/core → src → backend).
# ---------------------------------------------------------------------------
_BACKEND_DIR: Path = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Application settings, loaded from environment variables / .env file."""

    model_config = SettingsConfigDict(
        env_prefix="AEGIS_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # -- Paths ---------------------------------------------------------------
    onnx_model_path: str = str(_BACKEND_DIR / "models" / "aegis_v1.onnx")

    # -- Inference -----------------------------------------------------------
    confidence_threshold: float = 0.40
    inference_image_size: int = 416

    # -- Upload constraints --------------------------------------------------
    max_upload_size_bytes: int = 10 * 1024 * 1024  # 10 MB
    max_image_dimension: int = 8192  # prevent decompression bombs
    allowed_content_types: set[str] = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/bmp",
        "image/tiff",
    }

    # -- CORS / Frontend -----------------------------------------------------
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://aegislogix.vercel.app",
        "https://aegis-logix.vercel.app",
    ]

    # -- Server (Dynamic lookup: PORT -> AEGIS_PORT -> 8000) ----------------
    port: int = int(os.getenv("PORT") or os.getenv("AEGIS_PORT") or 8000)
    workers: int = 1
    log_level: str = "info"

    # -- Application metadata ------------------------------------------------
    app_version: str = "2.0.0"


@lru_cache
def get_settings() -> Settings:
    """Return a cached singleton of the application settings.

    Using ``@lru_cache`` ensures the .env file is parsed only once per
    process lifetime. In tests, call ``get_settings.cache_clear()`` before
    overriding.
    """
    return Settings()
