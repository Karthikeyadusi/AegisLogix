# Known Limitations

This document describes the current technical limitations of AegisLogix. These are engineering constraints, not bugs. Each limitation exists for a specific reason and has a known mitigation path.

---

## CPU-Only Inference

**Limitation**: The backend uses `onnxruntime` with the CPU execution provider. Inference runs on the CPU, not the GPU.

**Why this exists**: The deployment target is free-tier cloud hosting (e.g., Render's free plan), which does not provide GPU instances. Using `onnxruntime-gpu` would require CUDA toolkit installation and NVIDIA GPU hardware.

**Impact**: Inference is slower than GPU execution. On a modern CPU, single-image inference takes tens to low hundreds of milliseconds. This is acceptable for on-demand analysis but would be insufficient for batch processing or real-time video feeds.

**Mitigation path**: Switch the dependency from `onnxruntime` to `onnxruntime-gpu` and deploy on a GPU-equipped instance. No code changes are required — ONNX Runtime automatically selects the CUDA provider when available.

---

## Single Worker Process

**Limitation**: The Dockerfile configures Uvicorn with `--workers 1`.

**Why this exists**: The ONNX model is loaded into memory at startup. Each worker loads its own copy of the model. With a ~35 MB ONNX model and the Ultralytics runtime, each worker consumes approximately 350 MB of RAM. Free-tier hosting typically provides 512 MB. Running 2+ workers would exceed this limit and trigger OOM termination.

**Impact**: Requests are processed sequentially. Under concurrent load, requests queue behind the active inference.

**Mitigation path**: Deploy on a host with more RAM. At 1 GB RAM, 2 workers are feasible. Alternatively, use a dedicated model server (e.g., Triton Inference Server) that shares a single model instance across workers.

---

## Dataset Scale

**Limitation**: The training dataset contains approximately 1,150 images (894 training, 256 validation) across 5 classes.

**Why this exists**: The dataset was sourced from Roboflow as a curated export. Expanding the dataset requires additional annotation effort (bounding box labeling) which was outside the scope of this prototype.

**Impact**: The model achieves mAP50 of 0.561. While this demonstrates the concept, production-quality detection models typically require 5,000–50,000+ annotated images to achieve mAP50 above 0.80.

**Specific weaknesses**:
- `Hole` class has only 17 validation instances — metrics for this class are statistically unreliable
- `Deframe` class has only 26 validation instances
- The model may struggle with damage types or container appearances not represented in the training set

**Mitigation path**: Expand the dataset with diverse container images, additional damage severity levels, and varied lighting/angle conditions. Active learning (using the current model to pre-annotate new images for human review) would accelerate this process.

---

## Model Accuracy

**Limitation**: The best overall mAP50 is 0.561. Several classes have recall below 0.50.

| Class | Recall |
|---|---|
| Deframe | 0.385 |
| Hole | 0.448 |
| Rust | 0.445 |
| Minor-Dent | 0.446 |
| Dent | 0.880 |

**Why this exists**: This is a direct consequence of the dataset scale limitation. With ~1,150 training images and only 30 fine-tuning epochs, the model has limited exposure to the full visual diversity of container damage.

**Impact**: The model will miss approximately half of Deframe, Hole, Rust, and Minor-Dent instances. It performs well on Dent (recall 0.880), likely because dents are the most represented class in the dataset.

**Mitigation path**: More data, longer training, and potentially a larger model architecture (YOLOv5m or YOLOv8s) once edge deployment constraints are relaxed.

---

## No Authentication

**Limitation**: The API has no authentication mechanism. Any client that can reach the server can submit images for analysis.

**Why this exists**: This is a prototype. Adding authentication (API keys, OAuth, JWT) was outside the development scope. The deployment is intended for demonstration, not public access.

**Impact**: In a production deployment, the API would be vulnerable to unauthorized access and abuse (e.g., denial-of-service via rapid upload requests).

**Mitigation path**: Add API key validation middleware in FastAPI. For enterprise deployment, integrate with an identity provider via OAuth 2.0.

---

## No Persistence

**Limitation**: Scan results are returned to the client and not stored. There is no database, no scan history, and no audit trail.

**Why this exists**: Adding a database (PostgreSQL, SQLite) and ORM (SQLAlchemy) would expand the backend's complexity and hosting requirements beyond the prototype scope.

**Impact**: Users cannot review past scans. There is no data available for trend analysis, compliance reporting, or model retraining feedback loops.

**Mitigation path**: Add a lightweight SQLite database for local deployments or PostgreSQL for hosted deployments. Store scan metadata (timestamp, filename, detection counts, confidence scores) without storing the full images.

---

## Prototype Deployment

**Limitation**: The application is deployed on free-tier cloud hosting with significant resource constraints.

**Why this exists**: The project is a portfolio prototype, not a production system. Free-tier hosting demonstrates deployment capability without ongoing costs.

**Impact**:
- Cold starts: The free tier sleeps after inactivity. First request after sleep may take 30–60 seconds as the container restarts and loads the ONNX model.
- Resource limits: 512 MB RAM, single CPU, limited bandwidth.
- No SLA: Free-tier hosting provides no uptime guarantees.

**Mitigation path**: Upgrade to a paid hosting tier or deploy on institutional infrastructure.

---

## Upload Size Limit

**Limitation**: Uploaded images are capped at 10 MB.

**Why this exists**: The backend reads the entire file into memory before processing. Large uploads would consume excessive RAM on the resource-constrained deployment.

**Impact**: Very high-resolution images (e.g., 30+ MP industrial cameras) may exceed 10 MB when saved as PNG. Users would need to resize or compress before uploading.

**Mitigation path**: Implement streaming upload handling or server-side resize before inference. The 10 MB limit is sufficient for typical container inspection images.
