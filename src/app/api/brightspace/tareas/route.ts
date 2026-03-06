/**
 * GET /api/brightspace/tareas
 *
 * Retorna todas las tareas de todos los cursos del usuario.
 * Usa caché de 30 minutos.
 */

import { NextResponse } from 'next/server';
import { getCache, setCache, CACHE_TTL, CACHE_KEYS } from '@/lib/cache/cache';
import { withPage } from '@/lib/scraper/scraper';
import { scrapeCourses } from '@/lib/scraper/parsers/courses';
import { scrapeAssignments } from '@/lib/scraper/parsers/assignments';
import type { Assignment } from '@/types';

// Tareas de ejemplo (fallback)
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'mock-a1',
    title: 'Proyecto Final — Sistema de Gestión',
    courseId: 'mock-1',
    courseName: 'Fundamentos de Programación',
    courseColor: 'bg-orange-500',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high',
    maxGrade: 100,
    description: 'Desarrollar un sistema de gestión completo con CRUD.',
  },
  {
    id: 'mock-a2',
    title: 'Tarea 3 — Derivadas e Integrales',
    courseId: 'mock-2',
    courseName: 'Cálculo Diferencial',
    courseColor: 'bg-blue-500',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'medium',
    maxGrade: 50,
  },
  {
    id: 'mock-a3',
    title: 'Essay — Technology in Modern Life',
    courseId: 'mock-3',
    courseName: 'Inglés Técnico',
    courseColor: 'bg-green-500',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'submitted',
    priority: 'low',
    maxGrade: 100,
    grade: 92,
  },
];

export async function GET(): Promise<NextResponse> {
  try {
    // 1. Verificar caché global de tareas
    const cached = getCache<Assignment[]>(CACHE_KEYS.tareas, CACHE_TTL.TAREAS);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        source: 'cache',
      });
    }

    // 2. Scraping: primero obtener cursos, luego tareas de cada uno
    const allAssignments = await withPage(async (page) => {
      // Obtener lista de cursos
      const courses = await scrapeCourses(page);
      if (!courses || courses.length === 0) return null;

      // Scraping en paralelo (con límite para no sobrecargar)
      const results: Assignment[] = [];
      const BATCH_SIZE = 3; // Procesar 3 cursos a la vez

      for (let i = 0; i < courses.length; i += BATCH_SIZE) {
        const batch = courses.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(async (course) => {
            const assignments = await scrapeAssignments(page, course.id);
            // Añadir nombre del curso a cada tarea
            return assignments.map((a) => ({
              ...a,
              courseName: course.name,
              courseColor: course.color,
            }));
          })
        );
        results.push(...batchResults.flat());
      }

      return results;
    });

    // 3. Guardar en caché si hay datos
    if (allAssignments && allAssignments.length > 0) {
      setCache(CACHE_KEYS.tareas, allAssignments, CACHE_TTL.TAREAS);
      return NextResponse.json({
        success: true,
        data: allAssignments,
        source: 'scraper',
      });
    }

    // 4. Fallback: datos mock
    console.warn('[API tareas] Scraper no retornó datos, usando mock data');
    return NextResponse.json({
      success: true,
      data: MOCK_ASSIGNMENTS,
      source: 'mock',
      warning: 'Usando datos de ejemplo. Exporta tu sesión de Brightspace para obtener datos reales.',
    });
  } catch (err) {
    console.error('[API tareas] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener tareas',
        data: MOCK_ASSIGNMENTS,
        source: 'mock',
      },
      { status: 500 }
    );
  }
}
