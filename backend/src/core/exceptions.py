"""Centralized exception definitions and FastAPI exception handlers.

All domain-specific errors inherit from ``ImageValidationError`` so that
a single handler can convert them into consistent JSON responses.
"""

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class ImageValidationError(Exception):
    """Raised when an uploaded image fails any validation check.

    Attributes:
        code: Machine-readable error code (e.g. ``invalid_content_type``).
        detail: Human-readable description of the failure.
        status_code: HTTP status code to return (default 400).
    """

    def __init__(
        self,
        *,
        code: str,
        detail: str,
        status_code: int = 400,
    ) -> None:
        self.code = code
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


def register_exception_handlers(app: FastAPI) -> None:
    """Attach custom exception handlers to the FastAPI application.

    Called once during app creation so that all routes automatically
    benefit from consistent error formatting.
    """

    @app.exception_handler(ImageValidationError)
    async def _handle_image_validation_error(
        request: Request,
        exc: ImageValidationError,
    ) -> JSONResponse:
        logger.warning(
            "Validation error [%s]: %s (path=%s)",
            exc.code,
            exc.detail,
            request.url.path,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "detail": exc.detail,
                }
            },
        )
