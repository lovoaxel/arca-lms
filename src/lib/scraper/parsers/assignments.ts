/**
 * assignments.ts — Parser para extraer tareas de Brightspace
 */

import { Page } from 'playwright';
import { Assignment, AssignmentStatus, AssignmentPriority } from '@/types';

const BRIGHTSPACE_BASE = process.env.BRIGHTSPACE_BASE_URL ?? 'https://anahuac.brightspace.com';

/**
 * scrapeAssignments — Extrae las tareas de un curso específico
 *
 * Navega a la lista de dropbox (entregas) del curso.
 */
export async function scrapeAssignments(page: Page, courseId: string): Promise<Assignment[]> {
  try {
    const url = `${BRIGHTSPACE_BASE}/d2l/lms/dropbox/user/folders_list.d2l?ou=${courseId}`;

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    // Intentar la API interna primero
    const apiAssignments = await extractAssignmentsFromApi(page, courseId);
    if (apiAssignments.length > 0) {
      return apiAssignments;
    }

    // Fallback: scraping HTML
    return await extractAssignmentsFromHTML(page, courseId);
  } catch (err) {
    console.error(`[assignments] Error scraping tareas del curso ${courseId}:`, err);
    return [];
  }
}

/**
 * extractAssignmentsFromApi — Usa la API interna de D2L
 */
async function extractAssignmentsFromApi(page: Page, courseId: string): Promise<Assignment[]> {
  const base = BRIGHTSPACE_BASE;

  const result = await page.evaluate(async (params: { courseId: string; base: string }) => {
    try {
      const res = await fetch(
        `${params.base}/d2l/api/le/1.48/${params.courseId}/dropbox/folders/`,
        { credentials: 'include' }
      );
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }, { courseId, base });

  if (!result || !Array.isArray(result)) return [];

  return result.map((folder: Record<string, unknown>): Assignment => {
    const dueDate = folder.DueDate as string | null;
    const status = determineStatus(folder);
    const maxGrade = extractMaxGrade(folder);

    return {
      id: String(folder.Id ?? ''),
      title: String(folder.Name ?? 'Sin nombre'),
      courseId,
      courseName: '',
      dueDate: dueDate ?? '',
      status,
      priority: calculatePriority(dueDate, status),
      maxGrade,
      description: String((folder.Instructions as Record<string, unknown> | null | undefined)?.Text ?? ''),
    } satisfies Assignment;
  });
}

/**
 * extractAssignmentsFromHTML — Extrae tareas del DOM de la página
 */
async function extractAssignmentsFromHTML(page: Page, courseId: string): Promise<Assignment[]> {
  const assignments = await page.evaluate(() => {
    const results: Array<{
      id: string;
      title: string;
      dueDate: string;
      status: string;
      maxGrade: number;
    }> = [];

    // Filas de la tabla de tareas en D2L
    const rows = document.querySelectorAll(
      'table.d2l-table tbody tr, .d2l-list-item, [class*="folder-row"], [class*="dropbox"]'
    );

    rows.forEach((row) => {
      // Nombre de la tarea
      const nameEl = row.querySelector('a[href*="dropbox"], .d2l-foldername, [class*="name"]');
      if (!nameEl) return;

      const title = nameEl.textContent?.trim() ?? '';
      if (!title) return;

      // Extraer ID del href
      const href = (nameEl as HTMLAnchorElement).href ?? '';
      const idMatch = href.match(/db=(\d+)/) ?? href.match(/folder_id=(\d+)/);
      const id = idMatch ? idMatch[1] : String(Math.random());

      // Fecha de entrega
      const dateEl = row.querySelector('[class*="due"], [class*="date"], td:nth-child(3)');
      const dueDate = dateEl?.textContent?.trim() ?? '';

      // Estado
      const statusEl = row.querySelector('[class*="status"], [class*="submission"]');
      const statusText = statusEl?.textContent?.trim().toLowerCase() ?? '';
      const status = statusText.includes('entregad') || statusText.includes('submit')
        ? 'submitted'
        : 'pending';

      // Puntos
      const pointsEl = row.querySelector('[class*="score"], [class*="points"], [class*="grade"]');
      const pointsText = pointsEl?.textContent?.trim() ?? '0';
      const maxGrade = parseFloat(pointsText.replace(/[^\d.]/g, '')) || 100;

      results.push({ id, title, dueDate, status, maxGrade });
    });

    return results;
  });

  return assignments.map((a) => ({
    id: a.id,
    title: a.title,
    courseId,
    courseName: '',
    dueDate: parseDueDate(a.dueDate),
    status: (a.status as AssignmentStatus),
    priority: calculatePriority(parseDueDate(a.dueDate), a.status as AssignmentStatus),
    maxGrade: a.maxGrade,
  } satisfies Assignment));
}

// ─── Utilidades ───────────────────────────────────────────────

function determineStatus(folder: Record<string, unknown>): AssignmentStatus {
  const completion = folder.CompletionType as number | undefined;
  const isLate = folder.IsLate as boolean | undefined;

  if (isLate) return 'late';

  // D2L CompletionType: 0=no submissions, 1=submitted
  if (completion === 1 || folder.NumberOfSubmissions) return 'submitted';

  return 'pending';
}

function extractMaxGrade(folder: Record<string, unknown>): number {
  if (folder.Grade && typeof folder.Grade === 'object') {
    const grade = folder.Grade as Record<string, unknown>;
    return Number(grade.MaxPoints ?? 100);
  }
  return 100;
}

function parseDueDate(dateStr: string): string {
  if (!dateStr) return '';

  // Intentar parsear formatos comunes de fecha en español
  try {
    // ISO format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) return dateStr;

    // Formato: "DD/MM/YYYY HH:MM"
    const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{2}:\d{2})?/);
    if (match) {
      const [, day, month, year, time] = match;
      const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return time ? `${iso}T${time}:00` : iso;
    }

    return dateStr;
  } catch {
    return dateStr;
  }
}

function calculatePriority(dueDate: string | null | undefined, status: AssignmentStatus): AssignmentPriority {
  if (status === 'submitted' || status === 'graded') return 'low';
  if (!dueDate) return 'medium';

  try {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return 'urgent'; // Vencida
    if (diffDays < 1) return 'urgent'; // Hoy
    if (diffDays < 3) return 'high';   // En 3 días
    if (diffDays < 7) return 'medium'; // Esta semana
    return 'low';
  } catch {
    return 'medium';
  }
}
