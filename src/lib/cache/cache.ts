/**
 * cache.ts — Sistema de caché local basado en archivos JSON
 *
 * Guarda y recupera datos de Brightspace en disco para
 * evitar scrapar demasiado frecuente.
 *
 * TTLs recomendados:
 *   - cursos:         1440 min (24h)
 *   - tareas:         30 min
 *   - calificaciones: 60 min
 */

import * as fs from 'fs';
import * as path from 'path';

// Directorio donde se guardan los archivos de caché
const CACHE_DIR = process.env.CACHE_DIR ?? './cache';

// ─── Tipos ────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  savedAt: string;   // ISO 8601
  expiresAt: string; // ISO 8601
}

// ─── Utilidades internas ──────────────────────────────────────

/**
 * Asegurar que el directorio de caché exista
 */
function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Retorna la ruta del archivo de caché para una key
 */
function getCachePath(key: string): string {
  // Sanitizar la key para que sea un nombre de archivo válido
  const sanitized = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(CACHE_DIR, `${sanitized}.json`);
}

// ─── API pública ──────────────────────────────────────────────

/**
 * getCache — Lee el caché para una key dada.
 *
 * @param key - Identificador del caché (ej: "cursos", "tareas_12345")
 * @param ttlMinutes - Tiempo de vida en minutos. Si el caché es más viejo, retorna null.
 * @returns Los datos cacheados, o null si el caché expiró o no existe
 */
export function getCache<T>(key: string, ttlMinutes: number): T | null {
  try {
    ensureCacheDir();
    const filePath = getCachePath(key);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const entry = JSON.parse(raw) as CacheEntry<T>;

    // Verificar si el caché expiró
    const expiresAt = new Date(entry.expiresAt);
    const now = new Date();

    if (now > expiresAt) {
      console.log(`[cache] Caché expirado para "${key}" (expiró: ${entry.expiresAt})`);
      return null;
    }

    const remainingMin = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60));
    console.log(`[cache] Cache HIT para "${key}" (expira en ${remainingMin} min)`);
    return entry.data;
  } catch (err) {
    console.error(`[cache] Error leyendo caché para "${key}":`, err);
    return null;
  }
}

/**
 * setCache — Guarda datos en el caché.
 *
 * @param key - Identificador del caché
 * @param data - Datos a guardar
 * @param ttlMinutes - Tiempo de vida en minutos (opcional, default 60)
 */
export function setCache<T>(key: string, data: T, ttlMinutes = 60): void {
  try {
    ensureCacheDir();
    const filePath = getCachePath(key);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    const entry: CacheEntry<T> = {
      data,
      savedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8');
    console.log(`[cache] Guardado "${key}" (expira en ${ttlMinutes} min, a las ${expiresAt.toISOString()})`);
  } catch (err) {
    console.error(`[cache] Error guardando caché para "${key}":`, err);
  }
}

/**
 * invalidateCache — Elimina el caché para una key
 */
export function invalidateCache(key: string): void {
  try {
    const filePath = getCachePath(key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[cache] Caché invalidado para "${key}"`);
    }
  } catch (err) {
    console.error(`[cache] Error invalidando caché para "${key}":`, err);
  }
}

/**
 * clearAllCache — Elimina todos los archivos de caché
 */
export function clearAllCache(): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) return;

    const files = fs.readdirSync(CACHE_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
    }
    console.log(`[cache] Todo el caché eliminado (${files.length} archivos)`);
  } catch (err) {
    console.error('[cache] Error limpiando caché:', err);
  }
}

/**
 * getCacheStatus — Retorna el estado del caché para una key
 */
export function getCacheStatus(key: string): {
  exists: boolean;
  expired: boolean;
  savedAt?: string;
  expiresAt?: string;
  remainingMinutes?: number;
} {
  try {
    const filePath = getCachePath(key);

    if (!fs.existsSync(filePath)) {
      return { exists: false, expired: false };
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const entry = JSON.parse(raw) as CacheEntry<unknown>;

    const expiresAt = new Date(entry.expiresAt);
    const now = new Date();
    const expired = now > expiresAt;
    const remainingMinutes = expired
      ? 0
      : Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60));

    return {
      exists: true,
      expired,
      savedAt: entry.savedAt,
      expiresAt: entry.expiresAt,
      remainingMinutes,
    };
  } catch {
    return { exists: false, expired: false };
  }
}

// ─── TTLs preconfigurados ─────────────────────────────────────

export const CACHE_TTL = {
  CURSOS: 1440,        // 24 horas
  TAREAS: 30,          // 30 minutos
  CALIFICACIONES: 60,  // 1 hora
  CALENDARIO: 60,      // 1 hora
} as const;

// ─── Claves de caché estandarizadas ──────────────────────────

export const CACHE_KEYS = {
  cursos: 'brightspace_cursos',
  tareas: 'brightspace_tareas',
  calificaciones: 'brightspace_calificaciones',
  tareasCurso: (courseId: string) => `brightspace_tareas_${courseId}`,
  calificacionesCurso: (courseId: string) => `brightspace_calificaciones_${courseId}`,
} as const;
