/**
 * GET /api/brightspace/cursos
 *
 * Retorna la lista de cursos del usuario.
 * Usa caché de 24 horas. Si el caché expiró, scrapeará Brightspace.
 */

import { NextResponse } from 'next/server';
import { getCache, setCache, CACHE_TTL, CACHE_KEYS } from '@/lib/cache/cache';
import { hasValidSession } from '@/lib/scraper/session';
import { withPage } from '@/lib/scraper/scraper';
import { scrapeCourses } from '@/lib/scraper/parsers/courses';
import type { Course } from '@/types';

// Cursos de ejemplo (fallback si el scraper falla)
const MOCK_COURSES: Course[] = [
  {
    id: 'mock-1',
    name: 'Fundamentos de Programación',
    shortName: 'FP',
    code: 'CSC101',
    professor: 'Dr. García',
    credits: 4,
    status: 'active',
    progress: 65,
    color: 'bg-orange-500',
  },
  {
    id: 'mock-2',
    name: 'Cálculo Diferencial',
    shortName: 'CD',
    code: 'MAT201',
    professor: 'Dra. Martínez',
    credits: 4,
    status: 'active',
    progress: 50,
    color: 'bg-blue-500',
  },
  {
    id: 'mock-3',
    name: 'Inglés Técnico',
    shortName: 'IT',
    code: 'ENG301',
    professor: 'Prof. Johnson',
    credits: 3,
    status: 'active',
    progress: 80,
    color: 'bg-green-500',
  },
];

export async function GET(): Promise<NextResponse> {
  try {
    // 1. Verificar caché
    const cached = getCache<Course[]>(CACHE_KEYS.cursos, CACHE_TTL.CURSOS);
    if (cached) {
      const res = NextResponse.json({
        success: true,
        data: cached,
        source: 'cache',
      });
      res.headers.set('X-Data-Source', 'real');
      return res;
    }

    // 2. Verificar si hay sesión válida antes de lanzar Playwright
    if (!hasValidSession()) {
      console.warn('[API cursos] No hay sesión válida, usando mock data');
      const res = NextResponse.json({
        success: true,
        data: MOCK_COURSES,
        source: 'mock',
        warning: 'No hay sesión de Brightspace. Exporta tu sesión para obtener datos reales.',
      });
      res.headers.set('X-Data-Source', 'mock');
      return res;
    }

    // 3. Scraping con Playwright
    const courses = await withPage(async (page) => {
      return await scrapeCourses(page);
    });

    // 4. Si el scraper retornó datos, guardar en caché
    if (courses && courses.length > 0) {
      setCache(CACHE_KEYS.cursos, courses, CACHE_TTL.CURSOS);
      const res = NextResponse.json({
        success: true,
        data: courses,
        source: 'scraper',
      });
      res.headers.set('X-Data-Source', 'real');
      return res;
    }

    // 5. Fallback: datos mock
    console.warn('[API cursos] Scraper no retornó datos, usando mock data');
    const res = NextResponse.json({
      success: true,
      data: MOCK_COURSES,
      source: 'mock',
      warning: 'Usando datos de ejemplo. Exporta tu sesión de Brightspace para obtener datos reales.',
    });
    res.headers.set('X-Data-Source', 'mock');
    return res;
  } catch (err) {
    console.error('[API cursos] Error:', err);
    const res = NextResponse.json(
      {
        success: false,
        error: 'Error al obtener cursos',
        data: MOCK_COURSES,
        source: 'mock',
      },
      { status: 500 }
    );
    res.headers.set('X-Data-Source', 'mock');
    return res;
  }
}
