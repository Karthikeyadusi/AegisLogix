import { useState, useEffect, useCallback } from 'react';
import { inspectionApi } from '../api/inspection';

export interface BackendStatusState {
  isChecking: boolean;
  isReady: boolean;
  version: string | null;
  statusText: string;
  error: string | null;
}

/**
 * Custom React hook that checks backend readiness ONCE on component mount.
 * Does NOT perform background polling. Provides an explicit recheck method.
 */
export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatusState>({
    isChecking: true,
    isReady: false,
    version: null,
    statusText: 'Connecting...',
    error: null,
  });

  const checkStatus = useCallback(async () => {
    setStatus((prev) => ({ ...prev, isChecking: true, error: null }));
    try {
      const [health, readiness] = await Promise.all([
        inspectionApi.getHealth(),
        inspectionApi.getReadiness(),
      ]);

      const ready = readiness.model_loaded && readiness.status === 'ready';

      setStatus({
        isChecking: false,
        isReady: ready,
        version: health.version,
        statusText: ready ? 'SYSTEM READY' : 'MODEL INITIALIZING',
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to connect to backend.';
      setStatus({
        isChecking: false,
        isReady: false,
        version: null,
        statusText: 'OFFLINE',
        error: message,
      });
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    ...status,
    recheck: checkStatus,
  };
}
