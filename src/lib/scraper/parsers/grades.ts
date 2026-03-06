/**
 * grades.ts — Parser para extraer calificaciones de Brightspace
 */

import { Page } from 'playwright';
import { Grade } from '@/types';

const BRIGHTSPACE_BASE = process.env.BRIGHTSPACE_BASE_URL ?? 'https://anahuac.brightspace.com';

/**
 * scrapeGrades — Extrae las calificaciones de un curso específico
 *
 * Navega a la página de calificaciones del estudiante.
 */
export async function scrapeGrades(page: Page, courseId: string): Promise<Grade[]> {
  try {
    const url = `${BRIGHTSPACE_BASE}/d2l/lms/grades/my_grades/main.d2l?ou=${courseId}`;

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    // Intentar API interna de D2L
    const apiGrades = await extractGradesFromApi(page, courseId);
    if (apiGrades.length > 0) {
      return apiGrades;
    }

    // Fallback: scraping HTML
    return await extractGradesFromHTML(page, courseId);
  } catch (err) {
    console.error(`[grades] Error scraping calificaciones del curso ${courseId}:`, err);
    return [];
  }
}

/**
 * extractGradesFromApi — Usa la API interna de D2L para calificaciones
 */
async function extractGradesFromApi(page: Page, courseId: string): Promise<Grade[]> {
  const base = BRIGHTSPACE_BASE;

  const result = await page.evaluate(async (params: { courseId: string; base: string }) => {
    try {
      const res = await fetch(
        `${params.base}/d2l/api/le/1.48/${params.courseId}/grades/values/myGradeValues/`,
        { credentials: 'include' }
      );
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }, { courseId, base });

  if (!result || !result.Objects) return [];

  const grades: Grade[] = [];

  for (const obj of result.Objects) {
    try {
      const gradeObject = obj.GradeObjectType;
      const gradeValue = obj.GradeValue;

      if (!gradeValue) continue;

      const pointsNumerator = Number(gradeValue.PointsNumerator ?? 0);
      const pointsDenominator = Number(gradeValue.PointsDenominator ?? 100);
      const percentage = pointsDenominator > 0
        ? (pointsNumerator / pointsDenominator) * 100
        : 0;

      grades.push({
        id: String(obj.GradeObjectIdentifier ?? ''),
        courseId,
        courseName: '',
        assignmentTitle: String(obj.Name ?? 'Sin nombre'),
        grade: pointsNumerator,
        maxGrade: pointsDenominator,
        percentage: Math.round(percentage * 100) / 100,
        gradedAt: gradeValue.LastModified ?? new Date().toISOString(),
        feedback: gradeValue.DisplayString ?? undefined,
        category: gradeObject === 4 ? 'Final' : gradeObject === 1 ? 'Categoría' : 'Tarea',
      } satisfies Grade);
    } catch {
      // Ignorar items mal formateados
    }
  }

  return grades;
}

/**
 * extractGradesFromHTML — Extrae calificaciones del DOM de la página
 */
async function extractGradesFromHTML(page: Page, courseId: string): Promise<Grade[]> {
  const grades = await page.evaluate(() => {
    const results: Array<{
      id: string;
      title: string;
      grade: number;
      maxGrade: number;
      percentage: number;
      category: string;
    }> = [];

    // Buscar filas de calificaciones en D2L
    const rows = document.querySelectorAll(
      'table.d2l-table tbody tr, .d2l-grades-row, [class*="grade-item"], [class*="gradeItem"]'
    );

    rows.forEach((row, index) => {
      // Nombre del item
      const nameEl = row.querySelector('[class*="name"], [class*="title"], td:first-child a, td:first-child');
      const title = nameEl?.textContent?.trim() ?? '';
      if (!title || title === '') return;

      // Calificación obtenida / máxima
      const gradeEl = row.querySelector('[class*="grade"], [class*="score"], td:nth-child(3)');
      const gradeText = gradeEl?.textContent?.trim() ?? '0';

      // Intentar parsear "8.5 / 10" o "85%"
      let grade = 0;
      let maxGrade = 100;
      let percentage = 0;

      const fractionMatch = gradeText.match(/([\d.]+)\s*\/\s*([\d.]+)/);
      const percentMatch = gradeText.match(/([\d.]+)\s*%/);

      if (fractionMatch) {
        grade = parseFloat(fractionMatch[1]) || 0;
        maxGrade = parseFloat(fractionMatch[2]) || 100;
        percentage = maxGrade > 0 ? (grade / maxGrade) * 100 : 0;
      } else if (percentMatch) {
        percentage = parseFloat(percentMatch[1]) || 0;
        grade = percentage;
        maxGrade = 100;
      } else {
        const num = parseFloat(gradeText.replace(/[^\d.]/g, '')) || 0;
        grade = num;
        maxGrade = 100;
        percentage = num;
      }

      // Categoría (ej. "Examen", "Tarea", "Proyecto")
      const catEl = row.querySelector('[class*="category"], [class*="type"], td:nth-child(2)');
      const category = catEl?.textContent?.trim() ?? 'Calificación';

      results.push({
        id: `${courseId}-grade-${index}`,
        title,
        grade: Math.round(grade * 100) / 100,
        maxGrade: Math.round(maxGrade * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        category,
      });
    });

    return results;
  });

  return grades.map((g) => ({
    id: g.id,
    courseId,
    courseName: '',
    assignmentTitle: g.title,
    grade: g.grade,
    maxGrade: g.maxGrade,
    percentage: g.percentage,
    gradedAt: new Date().toISOString(),
    category: g.category,
  } satisfies Grade));
}
