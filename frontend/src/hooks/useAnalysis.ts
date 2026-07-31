import { useReducer, useCallback } from 'react';
import { inspectionApi } from '../api/inspection';
import { ApiError } from '../api/client';
import type { AnalysisResponse } from '../types/api';

type AnalysisState =
  | { status: 'idle'; data: null; error: null; errorCode: null }
  | { status: 'analyzing'; data: null; error: null; errorCode: null }
  | { status: 'success'; data: AnalysisResponse; error: null; errorCode: null }
  | { status: 'error'; data: null; error: string; errorCode: string };

type AnalysisAction =
  | { type: 'START' }
  | { type: 'SUCCESS'; payload: AnalysisResponse }
  | { type: 'ERROR'; message: string; code: string }
  | { type: 'RESET' };

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case 'START':
      return { status: 'analyzing', data: null, error: null, errorCode: null };
    case 'SUCCESS':
      return { status: 'success', data: action.payload, error: null, errorCode: null };
    case 'ERROR':
      return { status: 'error', data: null, error: action.message, errorCode: action.code };
    case 'RESET':
      return { status: 'idle', data: null, error: null, errorCode: null };
    default:
      return state;
  }
}

const initialState: AnalysisState = {
  status: 'idle',
  data: null,
  error: null,
  errorCode: null,
};

/**
 * Custom React hook for image analysis async state machine.
 * Guarantees zero impossible states (e.g. concurrent loading and error states).
 */
export function useAnalysis() {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  const analyze = useCallback(async (file: File) => {
    dispatch({ type: 'START' });
    try {
      const response = await inspectionApi.analyzeContainer(file);
      dispatch({ type: 'SUCCESS', payload: response });
    } catch (err) {
      if (err instanceof ApiError) {
        dispatch({ type: 'ERROR', message: err.message, code: err.code });
      } else {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        dispatch({ type: 'ERROR', message, code: 'UNKNOWN_ERROR' });
      }
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    status: state.status,
    data: state.data,
    error: state.error,
    errorCode: state.errorCode,
    isAnalyzing: state.status === 'analyzing',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    analyze,
    reset,
  };
}
