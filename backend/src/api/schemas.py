"""Pydantic models defining the API request and response contracts.

Every endpoint returns a typed schema. FastAPI uses these to auto-generate
OpenAPI documentation and to validate outgoing responses at runtime.
"""

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Analysis
# ---------------------------------------------------------------------------

class DetectionDetail(BaseModel):
    """A single detected damage instance."""

    class_name: str = Field(..., description="Damage class label (e.g. 'Dent', 'Rust').")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence score.")
    bbox: list[int] = Field(
        ...,
        min_length=4,
        max_length=4,
        description="Bounding box as [x1, y1, x2, y2] in pixel coordinates.",
    )


class AnalysisResponse(BaseModel):
    """Response payload from the /analyze endpoint."""

    status: str = Field("success", description="Request outcome.")
    total_issues: int = Field(..., ge=0, description="Number of detected damage instances.")
    details: list[DetectionDetail] = Field(
        default_factory=list, description="Per-detection breakdown."
    )
    image_data: str = Field(..., description="Base64-encoded JPEG of the annotated image.")


# ---------------------------------------------------------------------------
# Health / Readiness
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    """Response from GET /health."""

    status: str = Field("healthy", description="Service health indicator.")
    version: str = Field(..., description="Application version string.")


class ReadinessResponse(BaseModel):
    """Response from GET /ready."""

    status: str = Field(..., description="'ready' or 'not_ready'.")
    model_loaded: bool = Field(..., description="Whether the ONNX model is loaded.")
    model_path: str = Field(..., description="Filesystem path to the ONNX weights.")


# ---------------------------------------------------------------------------
# Errors
# ---------------------------------------------------------------------------

class ErrorDetail(BaseModel):
    """Structured error information."""

    code: str = Field(..., description="Machine-readable error code.")
    detail: str = Field(..., description="Human-readable error message.")


class ErrorResponse(BaseModel):
    """Consistent error envelope returned by all error handlers."""

    error: ErrorDetail
