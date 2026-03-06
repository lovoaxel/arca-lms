/**
 * courses.ts — Parser para extraer cursos de Brightspace
 */

import { Page } from 'playwright';
import { Course } from '@/types';

const BRIGHTSPACE_BASE = process.env.BRIGHTSPACE_BASE_URL ?? 'https://anahuac.brightspace.com';

// Colores por defecto para cursos (rotación)
const COURSE_COLORS = [
  'bg-orange-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

/**
 * scrapeCourses — Extrae la lista de cursos activos del usuario
 *
 * Navega a /d2l/home y extrae las tarjetas de cursos disponibles.
 */
export async function scrapeCourses(page: Page): Promise<Course[]> {
  try {
    await page.goto(`${BRIGHTSPACE_BASE}/d2l/home`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Esperar a que cargue el contenido de cursos
    await page.waitForTimeout(3000);

    // Intentar diferentes selectores para el componente de cursos de D2L
    const courses: Course[] = [];

    // Método 1: Usar la API de cursos de Brightspace
    try {
      const apiCourses = await extractCoursesFromApi(page);
      if (apiCourses.length > 0) {
        return apiCourses;
      }
    } catch {
      console.warn('[courses] API interna no disponible, intentando HTML scraping');
    }

    // Método 2: Scraping del HTML del dashboard
    const htmlCourses = await extractCoursesFromHTML(page);
    return htmlCourses;
  } catch (err) {
    console.error('[courses] Error scraping cursos:', err);
    return [];
  }
}

/**
 * extractCoursesFromApi — Intenta obtener cursos vía endpoint interno de D2L
 */
async function extractCoursesFromApi(page: Page): Promise<Course[]> {
  // Interceptar llamadas internas de D2L para obtener cursos
  const response = await page.evaluate(async () => {
    const res = await fetch('/d2l/api/hm/enrollments/myenrollments/?search=&pageSize=100&sortBy=-LastAccessed', {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return res.json();
  });

  if (!response || !response.Items) return [];

  const courses: Course[] = response.Items.map((item: Record<string, unknown>, index: number) => {
    const orgUnit = item.OrgUnit as Record<string, unknown>;
    const access = item.Access as Record<string, unknown>;
    const orgUnitId = String(orgUnit?.Id ?? '');
    const orgUnitName = String(orgUnit?.Name ?? 'Curso sin nombre');

    return {
      id: orgUnitId,
      name: orgUnitName,
      shortName: generateShortName(orgUnitName),
      code: orgUnitId,
      professor: '',
      credits: 0,
      status: 'active' as const,
      progress: 0,
      color: COURSE_COLORS[index % COURSE_COLORS.length],
      description: '',
    } satisfies Course;
  });

  return courses;
}

/**
 * extractCoursesFromHTML — Extrae cursos del DOM del dashboard
 */
async function extractCoursesFromHTML(page: Page): Promise<Course[]> {
  const courses = await page.evaluate(() => {
    const results: Array<{
      id: string;
      name: string;
      url: string;
    }> = [];

    // Selector para las tarjetas de cursos en D2L Brightspace
    // El componente web d2l-my-courses contiene los cursos
    const courseLinks = document.querySelectorAll(
      'a[href*="/d2l/home/"], a[href*="/d2l/lms/"]'
    );

    courseLinks.forEach((link) => {
      const href = (link as HTMLAnchorElement).href;
      const match = href.match(/\/d2l\/home\/(\d+)/);
      if (!match) return;

      const courseId = match[1];
      // Evitar duplicados
      if (results.some((r) => r.id === courseId)) return;

      // Extraer nombre del curso
      const nameEl = link.querySelector('h3, h2, .d2l-course-name, [class*="course"]');
      const name = nameEl?.textContent?.trim() ?? link.textContent?.trim() ?? `Curso ${courseId}`;

      if (name && courseId) {
        results.push({ id: courseId, name, url: href });
      }
    });

    // También buscar en el componente web personalizado de D2L
    const myCoursesEl = document.querySelector('d2l-my-courses');
    if (myCoursesEl) {
      const shadowCourses = (myCoursesEl as Element).querySelectorAll('d2l-enrollment-card, [data-id]');
      shadowCourses.forEach((card) => {
        const dataId = card.getAttribute('data-id') ?? card.getAttribute('ou');
        if (dataId && !results.some((r) => r.id === dataId)) {
          const nameEl = card.querySelector('[class*="name"], [class*="title"]');
          const name = nameEl?.textContent?.trim() ?? `Curso ${dataId}`;
          results.push({ id: dataId, name, url: `https://anahuac.brightspace.com/d2l/home/${dataId}` });
        }
      });
    }

    return results;
  });

  return courses.map((c, index) => ({
    id: c.id,
    name: c.name,
    shortName: generateShortName(c.name),
    code: c.id,
    professor: '',
    credits: 0,
    status: 'active' as const,
    progress: 0,
    color: COURSE_COLORS[index % COURSE_COLORS.length],
    description: '',
  } satisfies Course));
}

/**
 * generateShortName — Genera un nombre corto para el curso
 */
function generateShortName(name: string): string {
  // Extraer siglas de las primeras letras de cada palabra (máx 4 chars)
  const words = name
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return name.substring(0, 4).toUpperCase();

  const siglas = words
    .map((w) => w[0].toUpperCase())
    .slice(0, 4)
    .join('');

  return siglas || name.substring(0, 4).toUpperCase();
}
