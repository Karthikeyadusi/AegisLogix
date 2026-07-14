import os
import base64
import logging

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.config import ALLOWED_CONTENT_TYPES, MAX_UPLOAD_SIZE_BYTES
from src.engine import AegisGuard

logger = logging.getLogger(__name__)

app = FastAPI(title="AegisLogix Control API")

# Define allowed origins (Local dev + dynamic Vercel deploy via env)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

guard = AegisGuard()


@app.post("/analyze")
def analyze_container(file: UploadFile = File(...)) -> JSONResponse:
    """Accept an uploaded image, run damage detection, and return findings."""

    # --- Validate content type ---
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        logger.warning("Rejected upload with content type: %s", file.content_type)
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Accepted types: JPEG, PNG, WebP, BMP, TIFF.",
        )

    # --- Read and validate size ---
    data: bytes = file.file.read()

    if len(data) > MAX_UPLOAD_SIZE_BYTES:
        size_mb = len(data) / (1024 * 1024)
        logger.warning("Rejected oversized upload: %.1f MB", size_mb)
        raise HTTPException(
            status_code=400,
            detail=f"File size ({size_mb:.1f} MB) exceeds the maximum allowed size of {MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # --- Decode image ---
    nparr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        logger.warning("cv2.imdecode returned None for file: %s", file.filename)
        raise HTTPException(
            status_code=400,
            detail="Unable to decode image. The file may be corrupted or in an unsupported format.",
        )

    # --- Run the AI scan ---
    logger.info("Starting scan for '%s' (%d bytes)", file.filename, len(data))
    processed_img, findings = guard.scan(img)
    logger.info("Scan complete: %d issues found", len(findings))

    # --- Encode image to Base64 ---
    _, buffer = cv2.imencode('.jpg', processed_img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')

    # --- Return the Dashboard Data Payload ---
    return JSONResponse(content={
        "status": "success",
        "total_issues": len(findings),
        "details": findings,
        "image_data": img_base64
    })


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "AegisLogix Online"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)