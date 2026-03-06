/**
 * GET /api/brightspace/cursos
 *
 * Retorna la lista de cursos del usuario.
 * Usa caché de 24 horas. Si el caché expiró, scrapeará Brightspace.
 */

import { NextResponse } from 'next/server';
import { getCache, setCache, CACHE_TTL, CACHE_KEYS } from '@/lib/cache/cache';
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
      return NextResponse.json({
        success: true,
        data: cached,
        source: 'cache',
      });
    }

    // 2. Scraping con Playwright
    const courses = await withPage(async (page) => {
      return await scrapeCourses(page);
    });

    // 3. Si el scraper retornó datos, guardar en caché
    if (courses && courses.length > 0) {
      setCache(CACHE_KEYS.cursos, courses, CACHE_TTL.CURSOS);
      return NextResponse.json({
        success: true,
        data: courses,
        source: 'scraper',
      });
    }

    // 4. Fallback: datos mock
    console.warn('[API cursos] Scraper no retornó datos, usando mock data');
    return NextResponse.json({
      success: true,
      data: MOCK_COURSES,
      source: 'mock',
      warning: 'Usando datos de ejemplo. Exporta tu sesión de Brightspace para obtener datos reales.',
    });
  } catch (err) {
    console.error('[API cursos] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener cursos',
        data: MOCK_COURSES,
        source: 'mock',
      },
      { status: 500 }
    );
  }
}
