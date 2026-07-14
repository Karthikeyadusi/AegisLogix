# AegisLogix Inference Pipeline Deep Dive

Here is the exact step-by-step lifecycle of an image uploaded to AegisLogix, unpacking what happens inside [main.py](file:///c:/Users/Karthikeya%20Dusi/Desktop/Artifacts/AegisLogix/backend/src/main.py), [engine.py](file:///c:/Users/Karthikeya%20Dusi/Desktop/Artifacts/AegisLogix/backend/src/engine.py), and the underlying **Ultralytics YOLO** ONNX execution framework.

---

## 🛠️ Step-by-Step Execution Flow

```
[User Uploads Image]
       │
       ▼
1. Send HTTP POST /analyze (Multi-part form bytes)
       │
       ▼
2. Read bytes into memory buffer (main.py)
       │
       ▼
3. Decode to BGR NumPy array via OpenCV (cv2.imdecode)
       │
       ▼
4. Pass BGR image to AegisGuard.scan()
       │
       ▼
5. Convert color space: BGR ──► RGB (YOLO requirement)
       │
       ▼
6. Resize & Padding: Letterbox resize to 416x416 (preserves aspect ratio)
       │
       ▼
7. Normalize values: Scale integers [0, 255] ──► Floats [0.0, 1.0]
       │
       ▼
8. Reorder dimensions: HWC ──► CHW, and add batch dimension (1, 3, 416, 416)
       │
       ▼
9. Initialize ONNX Runtime Session & bind inputs
       │
       ▼
10. ONNX inference (Runs the graph; outputs raw predictions)
       │
       ▼
11. Parse raw model outputs (typically shape: 1, classes+4, candidates)
       │
       ▼
12. Filter by confidence threshold (conf=0.40)
       │
       ▼
13. Apply Non-Maximum Suppression (NMS) to remove overlapping duplicates
       │
       ▼
14. Scale bounding box coordinates back to original image size
       │
       ▼
15. Draw annotated bounding boxes & labels on the original image (cv2.rectangle)
       │
       ▼
16. Compress annotated BGR image ──► JPG byte stream (cv2.imencode)
       │
       ▼
17. Base64 encode the JPG bytes into a UTF-8 string
       │
       ▼
18. Return JSON response payload containing telemetry + Base64 image
```

---

## 🔍 Unpacking the Core Questions

### 1. How is the image decoded? Is it RGB or BGR?
*   **Decoding**: In [main.py](file:///c:/Users/Karthikeya%20Dusi/Desktop/Artifacts/AegisLogix/backend/src/main.py#L33-L35), the raw uploaded file byte stream is loaded via `await file.read()`, parsed into a 1D unsigned 8-bit integer array (`np.frombuffer`), and decoded into a 3D matrix using `cv2.imdecode(..., cv2.IMREAD_COLOR)`.
*   **Color Format**: OpenCV decodes images into **BGR** (Blue, Green, Red) format by default, *not* RGB.

### 2. Is the image resized with padding (letterboxing) or stretched?
*   **Letterboxing**: To avoid distorting container shapes (which would hurt the AI's detection accuracy), YOLO uses **letterbox resizing** rather than stretching. 
*   It resizes the image so its longest side is 416 pixels, and pads the remaining space on the shorter side with a neutral gray background (usually RGB value `(114, 114, 114)`).

### 3. How are tensors created?
Before entering the ONNX graph, the image matrix goes through these preprocessing transformations:
1.  **Color Swap**: Transformed from BGR to RGB.
2.  **Normalization**: Divided by `255.0` to convert pixel values from `[0, 255]` to `[0.0, 1.0]`.
3.  **Dimension Reordering**: Reordered from **HWC** (Height, Width, Channels) to **CHW** (Channels, Height, Width).
4.  **Batch Dimension**: Prepended with a batch size dimension (typically `1`), creating a final tensor shape of `(1, 3, 416, 416)`.

### 4. How is ONNX Runtime called?
*   Ultralytics uses the `onnxruntime.InferenceSession` wrapper. 
*   It binds the preprocessed `(1, 3, 416, 416)` float tensor to the model's input node (usually named `images`) and calls `session.run(None, {input_name: tensor})` to obtain predictions.

### 5. Where does NMS (Non-Maximum Suppression) happen?
*   **Location**: NMS is done on the **CPU** (using highly optimized PyTorch or NumPy routines inside the Ultralytics engine) immediately after ONNX returns the raw outputs.
*   **How it works**: The raw output contains thousands of candidate boxes. NMS sorts boxes by confidence, picks the highest-confidence box, and suppresses (deletes) any other overlapping boxes of the same class that have an Intersection-over-Union (IoU) ratio above a set threshold (e.g., `iou=0.60`).

### 6. How are coordinates transformed back?
*   Since the model made predictions on the padded/letterboxed `416x416` image, the coordinates are in that scaled coordinate system.
*   The engine calculates the scale factors and padding offsets introduced during the letterbox phase.
*   It subtracts the pad offsets and divides the coordinates by the scaling ratios to map the bounding boxes (`x1, y1, x2, y2`) back to the exact dimensions of the **original BGR image**.

### 7. How is the annotated image generated?
*   In [engine.py](file:///c:/Users/Karthikeya%20Dusi/Desktop/Artifacts/AegisLogix/backend/src/engine.py#L15-L37), we loop through the post-processed bounding boxes.
*   We use `cv2.rectangle` to draw borders on the original BGR image.
*   The border color is decided dynamically: **Red `(0,0,255)`** for high confidence ($\ge 70\%$) or **Yellow `(0,255,255)`** for minor confidence ($40\% \le \text{conf} < 70\%$).
*   `cv2.putText` is used to draw the text label background and class name on top of each box.

### 8. How is Base64 produced?
*   The annotated image array is compressed back into a JPEG byte buffer in memory using `cv2.imencode('.jpg', processed_img)`.
*   These bytes are encoded into Base64 using Python's `base64.b64encode(buffer)`.
*   Finally, the `.decode('utf-8')` method turns the raw base64 bytes into a text string that is serialized in the JSON payload returned to the browser.
