"""API route definitions for AegisLogix.

Two routers are exported:
  - ``health_router``:  ``GET /health`` and ``GET /ready`` (no prefix).
  - ``v1_router``:      ``POST /api/v1/analyze`` (versioned).

A backward-compatible alias is kept at ``POST /analyze`` so that existing
frontends continue to work during the migration window.
"""

import logging

from fastapi import APIRouter, File, Request, UploadFile

from src.api.schemas import (
    AnalysisResponse,
    ErrorResponse,
    HealthResponse,
    ReadinessResponse,
)
from src.core.config import get_settings
from src.utils.imaging import read_upload_streaming, validate_content_type

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Health / Readiness (no prefix — always reachable)
# ---------------------------------------------------------------------------

health_router = APIRouter(tags=["Health"])


@health_router.get(
    "/health",
    response_model=HealthResponse,
    summary="Liveness probe",
)
def health_check() -> HealthResponse:
    """Return a simple liveness signal.

    Used by Docker HEALTHCHECK and load balancers to verify the process
    is alive and accepting TCP connections.
    """
    settings = get_settings()
    return HealthResponse(status="healthy", version=settings.app_version)


@health_router.get(
    "/ready",
    response_model=ReadinessResponse,
    summary="Readiness probe",
)
def readiness_check(request: Request) -> ReadinessResponse:
    """Return whether the ML model is loaded and ready for inference.

    Kubernetes / orchestrators should gate traffic until this returns
    ``"ready"``.
    """
    engine = request.app.state.engine
    settings = get_settings()
    loaded = engine is not None and engine.model_loaded
    return ReadinessResponse(
        status="ready" if loaded else "not_ready",
        model_loaded=loaded,
        model_path=settings.onnx_model_path,
    )


# ---------------------------------------------------------------------------
# Versioned analysis endpoint
# ---------------------------------------------------------------------------

v1_router = APIRouter(prefix="/api/v1", tags=["Analysis"])


@v1_router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={400: {"model": ErrorResponse}},
    summary="Analyze a container image for structural damage",
)
def analyze_container(
    request: Request,
    file: UploadFile = File(...),
) -> AnalysisResponse:
    """Accept an uploaded image, run YOLO damage detection, and return findings.

    The image is streamed in chunks to prevent memory exhaustion from
    oversized uploads. After validation and decoding, inference is run
    through the ONNX-backed ``AegisGuard`` engine and results are
    returned as typed JSON alongside a Base64-encoded annotated image.
    """
    settings = get_settings()

    # 1. Validate MIME type.
    validate_content_type(
        file.content_type,
        allowed=settings.allowed_content_types,
    )

    # 2. Stream-read with size guard.
    data = read_upload_streaming(file, max_size=settings.max_upload_size_bytes)

    # 3. Delegate to the analyzer service.
    analyzer = request.app.state.analyzer
    return analyzer.analyze(data, filename=file.filename or "unknown")


# ---------------------------------------------------------------------------
# Backward-compatible alias (temporary migration bridge)
# ---------------------------------------------------------------------------

_compat_router = APIRouter(tags=["Analysis (Legacy)"])


@_compat_router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={400: {"model": ErrorResponse}},
    summary="[Legacy] Analyze — use /api/v1/analyze instead",
    deprecated=True,
)
def analyze_container_legacy(
    request: Request,
    file: UploadFile = File(...),
) -> AnalysisResponse:
    """Backward-compatible alias for ``POST /api/v1/analyze``.

    This endpoint is marked deprecated in the OpenAPI docs. It will be
    removed in a future release once all clients have migrated.
    """
    return analyze_container(request=request, file=file)


# Attach the compat router to v1_router so it's included automatically.
v1_router.include_router(_compat_router)
