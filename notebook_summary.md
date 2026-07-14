# AegisLogix: Model Training Notebook Summary

This document summarizes [complete_model_notebook.ipynb](file:///c:/Users/Karthikeya%20Dusi/Desktop/Artifacts/AegisLogix/complete_model_notebook.ipynb), which outlines the training, debugging, fine-tuning, and ONNX conversion pipeline for the shipping container damage detection model.

---

## 📅 Summary of Training Stages & Outputs

### 1. Kaggle Dataset Training (YOLOv8m)
*   **Dataset**: `sjqqiu/container-damage-detection` from Kaggle.
*   **Classes (4)**: `dent`, `hole`, `rust`, `scratch`.
*   **Configuration**: Trained a pre-trained `yolov8m.pt` model for 25 epochs at image resolution `imgsz=640` and batch size 16 on a Tesla T4 GPU in Google Colab.
*   **Results**:
    *   **mAP50**: 0.217 (all classes combined)
    *   **mAP50-95**: 0.0818
    *   **Class Metrics**: 
        *   `dent`: mAP50 = 0.0918, Precision = 0.229, Recall = 0.05
        *   `hole`: mAP50 = 0.3100, Precision = 0.477, Recall = 0.301
        *   `rust`: mAP50 = 0.0698, Precision = 0.489, Recall = 0.0417
        *   `scratch`: mAP50 = 0.3970, Precision = 0.362, Recall = 0.474

---

### 2. Roboflow Dataset Fine-Tuning (YOLOv5s)
To optimize the model for edge hardware (specifically NVIDIA Jetson Nano), the architecture was shifted to the lighter **YOLOv5s** model (85 layers, ~9.1M parameters).
*   **Dataset**: Custom Roboflow dataset (`finetuningdata.zip`) unzipped to `/content/dataset`.
*   **Classes (5)**: `Deframe`, `Dent`, `Hole`, `Minor-Dent`, `Rust`.
*   **Configuration**: Trained for 50 epochs with `imgsz=416` (to match the Jetson's speed limits).
*   **Results**:
    *   **mAP50**: 0.485 (all classes combined)
    *   **mAP50-95**: 0.353
    *   **Class Metrics**: 
        *   `Deframe`: mAP50 = 0.376
        *   `Dent`: mAP50 = 0.842
        *   `Hole`: mAP50 = 0.276
        *   `Minor-Dent`: mAP50 = 0.442
        *   `Rust`: mAP50 = 0.490

---

### 3. Debugging & "Surgery" (Rescued Model)
During training fine-tuning, the run crashed/had issue due to two data-compliance bugs:
1.  **Directory naming discrepancy**: Roboflow labeled folders as `labelTxt`, but YOLO expected the exact folder name `labels`. A python script renamed these folders and deleted corrupt `labels.cache` files.
2.  **Malformed label text**: The text files contained label strings (e.g. `'Rust'`) instead of integers (e.g. `4`), which YOLO ignored as corrupt.
*   **The Rescue Run**: After correcting the directory name and labeling data, training completed successfully under the run `jetson_v5s_perfect_finetune` (30 epochs).
*   **Final Rescued Model Metrics**:
    *   **mAP50**: **0.561** (improved performance!)
    *   **mAP50-95**: **0.398**
    *   **Class Metrics**:
        *   `Deframe`: mAP50 = 0.516
        *   `Dent`: mAP50 = 0.830
        *   `Hole`: mAP50 = 0.517
        *   `Minor-Dent`: mAP50 = 0.442
        *   `Rust`: mAP50 = 0.499
        *   *Performance Speed*: 1.3ms preprocess, 5.1ms inference, 2.8ms postprocess per image on Tesla T4.

---

### 4. ONNX Model Export
The rescued PyTorch model (`best.pt`) was converted to ONNX to run efficiently on edge hardware and local APIs without requiring PyTorch.
*   **Export Command**: `model.export(format='onnx', imgsz=416)`
*   **Result**: Generated **`best.onnx`** (34.9 MB) with input shape `(1, 3, 416, 416)`.
*   *Note*: This exported ONNX model is the model running in the AegisLogix dashboard backend today as `aegis_v1.onnx`.

---

### 5. ONNX Inference Verification
A final cell verify-tested the exported model on a sample image `demo2.webp` using ONNX Runtime.
*   **Detections**: Found 9 issues in the test container:
    *   `Hole` (Conf: 0.72)
    *   `Dent` (Conf: 0.56, 0.48, 0.41, 0.30)
    *   `Hole` (Conf: 0.44)
    *   `Rust` (Conf: 0.31, 0.29)
    *   `Minor-Dent` (Conf: 0.28)
