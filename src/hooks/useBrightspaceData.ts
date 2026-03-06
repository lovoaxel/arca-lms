/**
 * useBrightspaceData.ts — Hooks para consumir las API routes de Brightspace
 *
 * Provee hooks con loading state, error handling y fallback a mock data.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Course, Assignment, CourseGradeSummary } from '@/types';

// ─── Tipos ────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  source: 'cache' | 'scraper' | 'mock';
  warning?: string;
  error?: string;
}

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  source: 'cache' | 'scraper' | 'mock' | null;
  warning: string | null;
  refetch: () => void;
}

// ─── Hook genérico ────────────────────────────────────────────

function useApiData<T>(url: string): UseDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'cache' | 'scraper' | 'mock' | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const json: ApiResponse<T> = await response.json();

      if (!json.success && !json.data) {
        throw new Error(json.error ?? 'Error desconocido del servidor');
      }

      setData(json.data);
      setSource(json.source ?? null);
      setWarning(json.warning ?? null);

      if (!json.success && json.error) {
        // Tenemos data de fallback pero hubo un error
        setError(`Mostrando datos de respaldo: ${json.error}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'No se pudo conectar con el servidor';

      setError(errorMessage);
      console.error(`[useBrightspaceData] Error cargando ${url}:`, err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    source,
    warning,
    refetch: fetchData,
  };
}

// ─── Hooks especializados ─────────────────────────────────────

/**
 * useCourses — Hook para obtener la lista de cursos
 *
 * @example
 * const { data: courses, loading, error } = useCourses();
 */
export function useCourses(): UseDataState<Course[]> {
  return useApiData<Course[]>('/api/brightspace/cursos');
}

/**
 * useAssignments — Hook para obtener todas las tareas
 *
 * @example
 * const { data: assignments, loading, error, source } = useAssignments();
 */
export function useAssignments(): UseDataState<Assignment[]> {
  return useApiData<Assignment[]>('/api/brightspace/tareas');
}

/**
 * useGrades — Hook para obtener todas las calificaciones
 *
 * @example
 * const { data: grades, loading, error } = useGrades();
 */
export function useGrades(): UseDataState<CourseGradeSummary[]> {
  return useApiData<CourseGradeSummary[]>('/api/brightspace/calificaciones');
}

// ─── Hook de estado de sesión ─────────────────────────────────

interface SessionStatus {
  hasSession: boolean;
  savedAt: string | null;
  cookieCount: number;
  status: 'valid' | 'expired' | 'not_found';
}

interface UseSessionState {
  sessionStatus: SessionStatus | null;
  loading: boolean;
  error: string | null;
  exportSession: () => Promise<{ success: boolean; message?: string; error?: string }>;
  refetch: () => void;
}

/**
 * useBrightspaceSession — Hook para manejar la sesión de Brightspace
 *
 * @example
 * const { sessionStatus, exportSession } = useBrightspaceSession();
 */
export function useBrightspaceSession(): UseSessionState {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brightspace/session/export');
      const json = await res.json();
      setSessionStatus(json);
      setError(null);
    } catch (err) {
      setError('No se pudo verificar el estado de la sesión');
      console.error('[useBrightspaceSession] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const exportSession = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch('/api/brightspace/session/export', {
        method: 'POST',
      });
      const json = await res.json();

      if (json.success) {
        await fetchStatus(); // Actualizar estado
      }

      return json;
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error exportando sesión',
      };
    }
  };

  return {
    sessionStatus,
    loading,
    error,
    exportSession,
    refetch: fetchStatus,
  };
}

// ─── Hook compuesto para el dashboard ─────────────────────────

interface DashboardData {
  courses: Course[] | null;
  assignments: Assignment[] | null;
  grades: CourseGradeSummary[] | null;
  loading: boolean;
  errors: {
    courses: string | null;
    assignments: string | null;
    grades: string | null;
  };
  sources: {
    courses: string | null;
    assignments: string | null;
    grades: string | null;
  };
  refetchAll: () => void;
}

/**
 * useDashboardData — Hook que carga todos los datos del dashboard a la vez
 *
 * @example
 * const { courses, assignments, grades, loading } = useDashboardData();
 */
export function useDashboardData(): DashboardData {
  const coursesState = useCourses();
  const assignmentsState = useAssignments();
  const gradesState = useGrades();

  const loading = coursesState.loading || assignmentsState.loading || gradesState.loading;

  const refetchAll = () => {
    coursesState.refetch();
    assignmentsState.refetch();
    gradesState.refetch();
  };

  return {
    courses: coursesState.data,
    assignments: assignmentsState.data,
    grades: gradesState.data,
    loading,
    errors: {
      courses: coursesState.error,
      assignments: assignmentsState.error,
      grades: gradesState.error,
    },
    sources: {
      courses: coursesState.source,
      assignments: assignmentsState.source,
      grades: gradesState.source,
    },
    refetchAll,
  };
}
