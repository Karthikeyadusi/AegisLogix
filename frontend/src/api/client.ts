import type { ApiErrorResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/**
 * Base HTTP request wrapper with structured error extraction and timeout support.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorJson = (await response
        .json()
        .catch(() => null)) as ApiErrorResponse | null;

      if (errorJson && errorJson.error) {
        throw new ApiError(errorJson.error.code, errorJson.error.detail);
      }

      throw new ApiError(
        'HTTP_ERROR',
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    const message =
      err instanceof Error ? err.message : 'An unexpected network error occurred.';
    throw new ApiError('NETWORK_ERROR', message);
  }
}
