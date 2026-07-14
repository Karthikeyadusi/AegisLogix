# Model Training History

This document records the complete model development journey for AegisLogix, including failed approaches, dataset problems, and the decisions that led to the final deployed model.

All metrics are taken directly from training outputs in [`complete_model_notebook.ipynb`](../complete_model_notebook.ipynb).

---

## Stage 1: YOLOv8m on Kaggle Dataset

### Configuration

| Parameter | Value |
|---|---|
| Model | YOLOv8m (pretrained) |
| Parameters | ~25.8M |
| Dataset | Kaggle `sjqqiu/container-damage-detection` |
| Classes | 4: `dent`, `hole`, `rust`, `scratch` |
| Image size | 640 × 640 |
| Batch size | 16 |
| Epochs | 25 |
| Hardware | Tesla T4 (Google Colab) |
| Training time | ~0.846 hours (~50 minutes) |

### Results

| Class | Precision | Recall | mAP50 |
|---|---|---|---|
| dent | 0.229 | 0.050 | 0.092 |
| hole | 0.477 | 0.301 | 0.310 |
| rust | 0.489 | 0.042 | 0.070 |
| scratch | 0.362 | 0.474 | 0.397 |
| **All** | **0.389** | **0.217** | **0.217** |

**mAP50-95**: 0.082

### Problems

1. **Catastrophic recall failure**: The model detected only 5% of dents and 4% of rust. These are the two most common container damages, making the model unusable.
2. **Model too heavy**: YOLOv8m has ~25.8M parameters. At 640×640 resolution, inference is too slow for the target edge hardware (NVIDIA Jetson Nano).
3. **Training time**: 50 minutes for 25 epochs is impractical for iterative experimentation on Colab's session limits.
4. **Dataset limitations**: The Kaggle dataset lacked structural deformation (`Deframe`) and fine-grained dent classification (`Minor-Dent`).

### Outcome

Abandoned this approach entirely. Switched model architecture and dataset.

---

## Stage 2: YOLOv5s on Roboflow Dataset

### Configuration

| Parameter | Value |
|---|---|
| Model | YOLOv5s (pretrained) |
| Parameters | ~9.1M |
| GFLOPs | 23.8 |
| Dataset | Custom Roboflow dataset (`finetuningdata.zip`) |
| Classes | 5: `Deframe`, `Dent`, `Hole`, `Minor-Dent`, `Rust` |
| Image size | 416 × 416 |
| Batch size | 32 |
| Epochs | 50 |
| Hardware | Tesla T4 (Google Colab) |
| Training time | ~0.166 hours (~10 minutes) |

### Why YOLOv5s

- **3× fewer parameters** than YOLOv8m (9.1M vs 25.8M)
- **Jetson Nano compatible** at 416×416 resolution
- **5× faster training** than Stage 1
- Ultralytics provides native ONNX export for YOLOv5s

### Why 416×416

- The NVIDIA Jetson Nano has limited GPU memory. Running inference at 640×640 would exceed memory constraints.
- 416×416 provides a practical balance between detection accuracy and inference speed for edge deployment.

### Results

| Class | mAP50 |
|---|---|
| Deframe | 0.376 |
| Dent | 0.842 |
| Hole | 0.276 |
| Minor-Dent | 0.442 |
| Rust | 0.490 |
| **All** | **0.485** |

**mAP50-95**: 0.353

### Problems

Despite the overall improvement, training logs showed many images were being silently ignored as "corrupt." Investigation revealed this was a dataset formatting issue, not actual image corruption.

### Outcome

The model demonstrated and observed training time decreased substantially compared with Stage 1., but the dataset contained structural bugs that needed to be fixed before the results could be trusted.

---

## Stage 3: Data Surgery and Final Fine-Tuning

### Dataset Bugs Discovered

Two issues were found in the Roboflow dataset:

**Bug 1: Directory naming**
YOLO expects label files in a directory named `labels/`. The Roboflow export used `labelTxt/`. YOLO was unable to correctly interpret the affected annotations, causing many samples to be ignored during training.

**Fix**: Python script renamed `labelTxt/` → `labels/` for both `train/` and `valid/` splits. Deleted stale `.cache` files to force YOLO to rescan.

**Bug 2: Label format**
The label text files contained class name strings (e.g., `Rust 0.45 0.32 0.12 0.08`) instead of integer class indices (e.g., `4 0.45 0.32 0.12 0.08`). YOLO ignored these as malformed.

**Fix**: Python script parsed each label file, mapped class name strings to their integer index based on the `data.yaml` class list, and rewrote the files.

### Configuration

| Parameter | Value |
|---|---|
| Model | YOLOv5s (fine-tuned from Stage 2 best weights) |
| Dataset | Roboflow (cleaned) |
| Training images | 894 |
| Validation images | 256 |
| Total annotations | 527 (validation set) |
| Epochs | 30 |
| Optimizer | AdamW (lr=0.001111, momentum=0.9) |
| Hardware | Tesla T4 (Google Colab) |

### Results

| Class | Precision | Recall | mAP50 | mAP50-95 |
|---|---|---|---|---|
| Deframe | 0.588 | 0.385 | 0.516 | 0.340 |
| Dent | 0.701 | 0.880 | 0.830 | 0.668 |
| Hole | 0.884 | 0.448 | 0.517 | 0.320 |
| Minor-Dent | 0.528 | 0.446 | 0.442 | 0.339 |
| Rust | 0.647 | 0.445 | 0.499 | 0.324 |
| **All** | **0.670** | **0.521** | **0.561** | **0.398** |

### Inference Speed (Tesla T4)

| Phase | Time |
|---|---|
| Preprocess | 1.3 ms |
| Inference | 5.1 ms |
| Postprocess | 2.8 ms |

### Outcome

This is the final model deployed in AegisLogix v1.1. The cleaned dataset resolved the silent training data loss, resulting in meaningful improvements across all classes — particularly `Deframe` (+0.14 mAP50) and `Hole` (+0.24 mAP50).

---

## Stage 4: ONNX Export and Deployment

### Export

```
model.export(format='onnx', imgsz=416, dynamic=False)
```

| Property | Value |
|---|---|
| Format | ONNX (opset 20) |
| Input shape | (1, 3, 416, 416) fixed |
| Output shape | (1, 9, 3549) |
| File size | 34.9 MB |
| Runtime | ONNX Runtime (CPU execution provider) |

### Why ONNX

- **Portability**: Runs on any platform with ONNX Runtime installed, without requiring PyTorch or CUDA.
- **Lightweight deployment**: The backend needs only `onnxruntime` and `ultralytics` at runtime, keeping the Docker image and RAM footprint small (~350 MB).

### Deployment

The exported model is placed at `backend/models/aegis_v1.onnx`. The `AegisGuard` class loads it once at process startup. The backend is containerized via Dockerfile with a single Uvicorn worker to stay within 512 MB RAM limits on free-tier hosting.

---

## Training Evolution Summary

```mermaid
graph LR
    S1["Stage 1<br/>YOLOv8m<br/>mAP50: 0.217"] -->|"❌ Low accuracy<br/>Too heavy"| S2["Stage 2<br/>YOLOv5s<br/>mAP50: 0.485"]
    S2 -->|"🔧 Dataset bugs<br/>discovered"| S3["Stage 3<br/>YOLOv5s (cleaned)<br/>mAP50: 0.561"]
    S3 -->|"📦 Export"| S4["Stage 4<br/>ONNX deployment<br/>34.9 MB"]


    The final training pipeline demonstrated that data quality and dataset correctness had a greater impact on performance than changing model architectures alone. This insight guided the final deployment configuration used in AegisLogix.
```
