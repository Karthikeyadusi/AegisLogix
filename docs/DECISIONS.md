
This document explains the reasoning behind the project's major architectural and engineering decisions. It is intended to provide context for reviewers and interviewers beyond what is visible in the source code.

# Engineering Decisions

This document records the key engineering decisions made during AegisLogix development, including the reasoning, alternatives considered, and trade-offs accepted.

---

## Why YOLOv5s (Not YOLOv8m)

**Decision**: Use YOLOv5s (~9.1M parameters) as the detection backbone.

**Why**: The initial attempt with YOLOv8m (~25.8M parameters) failed on two fronts. First, accuracy was poor (mAP50 0.217) due to the Kaggle dataset's limited quality. Second, the model was too large for the target edge deployment platform (NVIDIA Jetson Nano), where GPU memory is constrained.

YOLOv5s has 3× fewer parameters, significantly reduced training time under the project's training configuration, and fits comfortably within Jetson Nano memory at 416×416 inference resolution.

**Alternatives considered**:
- **YOLOv8s**: Similar parameter count to v5s but newer. Not chosen because Ultralytics' YOLOv5s had more established ONNX export stability at the time of development.
- **YOLOv8n (nano)**: Even smaller, but the reduced capacity risked underfitting on 5 damage classes.

**Trade-off**: YOLOv5s has a slightly older architecture than v8. The detection head design is less optimized. However, the practical difference is minimal at this dataset scale, and the deployment benefits outweigh the marginal accuracy loss.

---

## Why ONNX (Not PyTorch or TensorRT)

**Decision**: Export the trained model to ONNX format for inference.

**Why**: ONNX provides platform-independent inference. The backend does not need PyTorch, CUDA, or any training framework installed at runtime. This significantly reduces the Docker image size and RAM footprint.

**Alternatives considered**:
- **PyTorch (native)**: Would require `torch` (~2 GB) in the container, pushing RAM well beyond free-tier limits.
- **TensorRT**: Offers faster inference but requires NVIDIA GPU hardware and CUDA toolkit. Not available on CPU-only deployment targets.
- **OpenVINO**: Intel-optimized runtime. Not chosen because the deployment target was initially NVIDIA hardware (Jetson Nano).

**Trade-off**: ONNX on CPU is slower than TensorRT on GPU. For this prototype, inference speed (~5 ms on Tesla T4, higher on CPU) is acceptable. GPU optimization is deferred to a future version.

---

## Why FastAPI (Not Flask or Django)

**Decision**: Use FastAPI as the backend framework.

**Why**: FastAPI provides native support for `UploadFile` with multipart form parsing, automatic request validation, and auto-generated OpenAPI documentation. Its ASGI architecture supports concurrent request handling without additional configuration.

**Alternatives considered**:
- **Flask**: Simpler, but lacks native async support and automatic type validation. Would require additional libraries (`flask-cors`, `flask-uploads`) for equivalent functionality.
- **Django**: Too heavy for a single-endpoint API. Django's ORM, template engine, and admin panel are unnecessary overhead.

**Trade-off**: FastAPI's ASGI model adds slight complexity compared to Flask's WSGI. However, the benefits (auto-docs, type safety, native file handling) outweigh this for an API-first application.

---

## Why React (Not Vanilla JS or Vue)

**Decision**: Use React 19 with TypeScript for the frontend.

**Why**: The dashboard requires interactive state management (upload flow, loading states, result toggling, error display) and smooth animations. React's component model and hooks provide a clean way to manage this complexity.

**Alternatives considered**:
- **Vanilla JavaScript**: Would work but requires manual DOM manipulation for the interactive upload/result workflow. Error-prone at this UI complexity level.
- **Vue**: Viable alternative. React was chosen due to developer familiarity.

**Trade-off**: React adds a build toolchain (Vite, TypeScript compilation) and a ~45 KB runtime. For a single-page dashboard, this is acceptable.

---

ONNX Runtime was selected because it provides optimized execution providers, broad operator support, and a straightforward deployment path for exported YOLO models. OpenCV DNN was considered but offers fewer optimization opportunities and less flexibility for future execution providers.

## Why REST (Not WebSockets or gRPC)

**Decision**: Use a synchronous REST endpoint (`POST /analyze`) for image analysis.

**Why**: The analysis workflow is request-response: upload one image, receive one result. There is no streaming, no real-time updates, and no bidirectional communication requirement. REST is the simplest correct solution.

**Alternatives considered**:
- **WebSockets**: Would allow progress updates during inference, but inference completes in milliseconds to low seconds. The added complexity is not justified.
- **gRPC**: Efficient for service-to-service communication. Adds protobuf compilation and client library requirements. Unnecessary for a browser-to-server workflow.

**Trade-off**: REST limits the client to polling if inference were ever slow enough to require progress updates. At current inference speeds, this is not a concern.

---

## Why CPU Inference (Not GPU)

**Decision**: Deploy with `onnxruntime` (CPU execution provider).

**Why**: The deployment target for the backend API is free-tier cloud hosting (e.g., Render), which does not provide GPU instances. The CPU execution provider keeps the dependency chain simple and the container portable.

**Alternatives considered**:
- **`onnxruntime-gpu`**: Requires CUDA toolkit and an NVIDIA GPU. Not available on free-tier hosting.
- **TensorRT**: NVIDIA-specific, requires GPU.

**Trade-off**: CPU inference is slower than GPU inference. For single-image, on-demand analysis, the latency is acceptable. Batch processing or real-time video analysis would require GPU acceleration.

---

## Why 416×416 Inference Resolution

**Decision**: Fix the model input size to 416×416 pixels.

**Why**: This resolution was chosen specifically for NVIDIA Jetson Nano compatibility. The Jetson Nano has 4 GB of shared CPU/GPU memory. Running YOLO at 640×640 risks memory exhaustion during inference, especially when combined with the OS and other processes.

416×416 provides sufficient spatial resolution to detect container-scale damage (dents, holes, rust patches), which are typically large relative to the image frame.

**Alternatives considered**:
- **640×640**: Standard YOLO resolution. Better accuracy for small objects, but exceeds Jetson Nano memory budget and increases inference time.
- **320×320**: Faster inference, but risks losing detection accuracy for smaller damage types (Minor-Dent).

**Trade-off**: Reduced resolution means smaller defects may be harder to detect. The training metrics show this is acceptable for the current 5-class problem.

---

## Why Fine-Tuning (Not Training from Scratch)

**Decision**: Fine-tune from Ultralytics' pretrained YOLO weights rather than training from scratch.

**Why**: The training dataset contains ~1,150 images. Training a detection model from randomly initialized weights on a dataset this small would severely overfit. Pretrained weights (trained on COCO with 330K images) provide feature extractors that generalize well, and fine-tuning adapts the pretrained network to the container damage domain.

**Alternatives considered**:
- **Training from scratch**: Requires significantly more data (10K+ images minimum) and training time.
- **Frozen backbone**: Fine-tuning only the detection head. Not chosen because the domain (container damage) is sufficiently different from COCO that backbone adaptation helps.

**Trade-off**: Dependence on pretrained weights means the model inherits COCO's biases. For container damage detection, this is not a significant concern because the target objects (damage patterns) are visually distinct from COCO categories.

---

## Why Dataset Engineering

**Decision**: Invest time in debugging and correcting the dataset rather than finding a new one.

**Why**: The Roboflow dataset had the correct class taxonomy and reasonable annotation quality. The problems were structural (directory naming, label format) rather than fundamental. Fixing these bugs was faster and more reliable than sourcing and annotating a new dataset.

**Alternatives considered**:
- **New dataset**: Would require manual annotation of hundreds of images, a multi-day effort with no guarantee of better quality.
- **Ignoring the bugs**: Would result in continued silent data loss during training, producing an undertrained model.

**Trade-off**: The corrected dataset is still relatively small (~1,150 images). Production deployment would require further dataset expansion regardless of this fix.
