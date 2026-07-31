# ---------------------------------------------------------------------------
# AegisLogix Backend — Production Dockerfile
# ---------------------------------------------------------------------------
# Multi-stage considerations omitted intentionally: the image is small
# enough (~500 MB with Ultralytics) that a single stage is practical.
# ---------------------------------------------------------------------------
FROM python:3.10-slim

# -- Environment variables (overridable at runtime) -------------------------
ENV AEGIS_PORT=10000 \
    AEGIS_WORKERS=1 \
    AEGIS_LOG_LEVEL=info

WORKDIR /app

# -- System dependencies for OpenCV ----------------------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgl1 \
        libglib2.0-0 \
        libsm6 \
        libxext6 \
        libxrender-dev \
        libxcb1 \
        curl \
    && rm -rf /var/lib/apt/lists/*

# -- Python dependencies ----------------------------------------------------
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# -- Application code -------------------------------------------------------
COPY . .

# -- Non-root user (principle of least privilege) ---------------------------
RUN useradd --create-home appuser
USER appuser

# -- Expose port -------------------------------------------------------------
EXPOSE ${AEGIS_PORT}

# -- Health check (used by Docker, Render, and orchestrators) ---------------
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${AEGIS_PORT}/health || exit 1

# -- Start with Gunicorn (process manager) + Uvicorn (ASGI worker) ----------
# Gunicorn supervises the worker process and automatically restarts it
# on crashes, which raw Uvicorn does not do.  The worker count is kept
# at 1 by default to stay within 512 MB RAM limits on free-tier hosting.
CMD gunicorn src.main:app \
    --worker-class uvicorn.workers.UvicornWorker \
    --workers ${AEGIS_WORKERS} \
    --bind 0.0.0.0:${AEGIS_PORT} \
    --log-level ${AEGIS_LOG_LEVEL} \
    --timeout 120 \
    --graceful-timeout 30