import os
import cv2
import numpy as np
import base64
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from engine import AegisGuard

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
async def analyze_container(file: UploadFile = File(...)):
    # 1. Read the uploaded image
    data = await file.read()
    nparr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 2. Run the AI scan
    processed_img, findings = guard.scan(img)

    # 3. Encode image to Base64
    _, buffer = cv2.imencode('.jpg', processed_img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')

    # 4. Return the Dashboard Data Payload
    return JSONResponse(content={
        "status": "success",
        "total_issues": len(findings),
        "details": findings,
        "image_data": img_base64
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)