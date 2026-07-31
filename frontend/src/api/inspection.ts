import { apiRequest } from './client';
import type {
  AnalysisResponse,
  HealthResponse,
  ReadinessResponse,
} from '../types/api';

/**
 * Inspection API Services matching AegisLogix API v1.1.0 contract.
 */
export const inspectionApi = {
  /**
   * Submit a container image for neural damage detection.
   */
  async analyzeContainer(file: File): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<AnalysisResponse>('/api/v1/analyze', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Check backend process liveness.
   */
  async getHealth(): Promise<HealthResponse> {
    return apiRequest<HealthResponse>('/health', {
      method: 'GET',
    });
  },

  /**
   * Check backend model readiness.
   */
  async getReadiness(): Promise<ReadinessResponse> {
    return apiRequest<ReadinessResponse>('/ready', {
      method: 'GET',
    });
  },
};
