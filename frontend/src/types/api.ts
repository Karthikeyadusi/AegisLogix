/**
 * AegisLogix API Contract Type Definitions
 * Strictly aligned with FastAPI backend Pydantic schemas (src/api/schemas.py).
 */

export interface DetectionDetail {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] in pixel coordinates
}

export interface AnalysisResponse {
  status: string;
  total_issues: number;
  details: DetectionDetail[];
  image_data: string; // Base64 JPEG string
}

export interface HealthResponse {
  status: string;
  version: string;
}

export interface ReadinessResponse {
  status: string;
  model_loaded: boolean;
  model_path: string;
}

export interface ApiErrorDetail {
  code: string;
  detail: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}
