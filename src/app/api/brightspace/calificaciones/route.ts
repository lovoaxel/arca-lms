/**
 * GET /api/brightspace/calificaciones
 *
 * Retorna todas las calificaciones de todos los cursos del usuario.
 * Usa caché de 60 minutos.
 */

import { NextResponse } from 'next/server';
import { getCache, setCache, CACHE_TTL, CACHE_KEYS } from '@/lib/cache/cache';
import { hasValidSession } from '@/lib/scraper/session';
import { withPage } from '@/lib/scraper/scraper';
import { scrapeCourses } from '@/lib/scraper/parsers/courses';
import { scrapeGrades } from '@/lib/scraper/parsers/grades';
import type { Grade, CourseGradeSummary } from '@/types';

// Calificaciones de ejemplo (fallback)
const MOCK_GRADES: CourseGradeSummary[] = [
  {
    courseId: 'mock-1',
    courseName: 'Fundamentos de Programación',
    currentGrade: 88.5,
    letterGrade: 'B+',
    grades: [
      {
        id: 'g1', courseId: 'mock-1', courseName: 'Fundamentos de Programación',
        assignmentTitle: 'Examen Parcial 1', grade: 90, maxGrade: 100,
        percentage: 90, gradedAt: new Date().toISOString(), category: 'Examen',
      },
      {
        id: 'g2', courseId: 'mock-1', courseName: 'Fundamentos de Programación',
        assignmentTitle: 'Tarea 1 — Variables', grade: 95, maxGrade: 100,
        percentage: 95, gradedAt: new Date().toISOString(), category: 'Tarea',
      },
    ],
    gradesByCategory: {},
  },
  {
    courseId: 'mock-2',
    courseName: 'Cálculo Diferencial',
    currentGrade: 76,
    letterGrade: 'C+',
    grades: [
      {
        id: 'g3', courseId: 'mock-2', courseName: 'Cálculo Diferencial',
        assignmentTitle: 'Examen Parcial 1', grade: 76, maxGrade: 100,
        percentage: 76, gradedAt: new Date().toISOString(), category: 'Examen',
      },
    ],
    gradesByCategory: {},
  },
];

export async function GET(): Promise<NextResponse> {
  try {
    // 1. Verificar caché
    const cached = getCache<CourseGradeSummary[]>(CACHE_KEYS.calificaciones, CACHE_TTL.CALIFICACIONES);
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
      console.warn('[API calificaciones] No hay sesión válida, usando mock data');
      const res = NextResponse.json({
        success: true,
        data: MOCK_GRADES,
        source: 'mock',
        warning: 'No hay sesión de Brightspace. Exporta tu sesión para obtener datos reales.',
      });
      res.headers.set('X-Data-Source', 'mock');
      return res;
    }

    // 3. Scraping: obtener cursos y luego calificaciones de cada uno
    const allGrades = await withPage(async (page) => {
      const courses = await scrapeCourses(page);
      if (!courses || courses.length === 0) return null;

      const summaries: CourseGradeSummary[] = [];
      const BATCH_SIZE = 3;

      for (let i = 0; i < courses.length; i += BATCH_SIZE) {
        const batch = courses.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(async (course) => {
            const grades = await scrapeGrades(page, course.id);

            // Añadir nombre del curso a cada calificación
            const enrichedGrades: Grade[] = grades.map((g) => ({
              ...g,
              courseName: course.name,
            }));

            // Calcular promedio
            const avg = enrichedGrades.length > 0
              ? enrichedGrades.reduce((sum, g) => sum + g.percentage, 0) / enrichedGrades.length
              : 0;

            // Agrupar por categoría
            const gradesByCategory: Record<string, Grade[]> = {};
            for (const grade of enrichedGrades) {
              const cat = grade.category ?? 'General';
              if (!gradesByCategory[cat]) gradesByCategory[cat] = [];
              gradesByCategory[cat].push(grade);
            }

            return {
              courseId: course.id,
              courseName: course.name,
              currentGrade: Math.round(avg * 100) / 100,
              letterGrade: gradeToLetter(avg),
              grades: enrichedGrades,
              gradesByCategory,
            } satisfies CourseGradeSummary;
          })
        );
        summaries.push(...batchResults);
      }

      return summaries;
    });

    // 4. Guardar en caché
    if (allGrades && allGrades.length > 0) {
      setCache(CACHE_KEYS.calificaciones, allGrades, CACHE_TTL.CALIFICACIONES);
      const res = NextResponse.json({
        success: true,
        data: allGrades,
        source: 'scraper',
      });
      res.headers.set('X-Data-Source', 'real');
      return res;
    }

    // 5. Fallback
    console.warn('[API calificaciones] Scraper no retornó datos, usando mock data');
    const res = NextResponse.json({
      success: true,
      data: MOCK_GRADES,
      source: 'mock',
      warning: 'Usando datos de ejemplo. Exporta tu sesión de Brightspace para obtener datos reales.',
    });
    res.headers.set('X-Data-Source', 'mock');
    return res;
  } catch (err) {
    console.error('[API calificaciones] Error:', err);
    const res = NextResponse.json(
      {
        success: false,
        error: 'Error al obtener calificaciones',
        data: MOCK_GRADES,
        source: 'mock',
      },
      { status: 500 }
    );
    res.headers.set('X-Data-Source', 'mock');
    return res;
  }
}

/**
 * gradeToLetter — Convierte un porcentaje a letra
 */
function gradeToLetter(percentage: number): string {
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'B+';
  if (percentage >= 80) return 'B';
  if (percentage >= 75) return 'C+';
  if (percentage >= 70) return 'C';
  if (percentage >= 65) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
}
