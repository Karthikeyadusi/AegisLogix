"""AegisLogix application factory.

Creates and configures the FastAPI application:
  - Structured logging
  - CORS middleware
  - Exception handlers
  - Lifespan events (model load / unload)
  - Router registration
"""

import logging
import sys
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import get_settings
from src.core.exceptions import register_exception_handlers
from src.ml.engine import AegisGuard
from src.services.analyzer import AnalyzerService

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def _lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application startup and shutdown.

    On startup:
      - Load the ONNX model into an ``AegisGuard`` instance.
      - Create the ``AnalyzerService`` and attach both to ``app.state``.

    On shutdown:
      - Log graceful shutdown.
    """
    settings = get_settings()

    logger.info("Loading AegisGuard engine from %s …", settings.onnx_model_path)
    engine = AegisGuard(
        model_path=settings.onnx_model_path,
        confidence_threshold=settings.confidence_threshold,
        inference_image_size=settings.inference_image_size,
    )

    app.state.engine = engine
    app.state.analyzer = AnalyzerService(engine=engine, settings=settings)

    logger.info("AegisLogix v%s ready — accepting requests", settings.app_version)

    yield  # Application is running.

    logger.info("Shutting down AegisLogix …")


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app() -> FastAPI:
    """Build and return the fully configured FastAPI application."""
    settings = get_settings()

    # -- Logging -------------------------------------------------------------
    logging.basicConfig(
        level=settings.log_level.upper(),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
        force=True,
    )

    # -- App -----------------------------------------------------------------
    application = FastAPI(
        title="AegisLogix Control API",
        version=settings.app_version,
        description="Industrial computer vision API for shipping-container damage detection.",
        lifespan=_lifespan,
    )

    # -- CORS ----------------------------------------------------------------
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # -- Exception handlers --------------------------------------------------
    register_exception_handlers(application)

    # -- Routers -------------------------------------------------------------
    # Import here to avoid circular imports; routes depend on app.state
    # which is populated during lifespan.
    from src.api.routes import health_router, v1_router

    application.include_router(health_router)
    application.include_router(v1_router)

    return application


# ---------------------------------------------------------------------------
# Module-level app instance (used by Uvicorn / Gunicorn).
# ---------------------------------------------------------------------------
app = create_app()


if __name__ == "__main__":
    import uvicorn

    _settings = get_settings()
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=_settings.port,
        log_level=_settings.log_level,
        reload=True,
    )