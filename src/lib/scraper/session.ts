/**
 * session.ts — Manejo de sesión de Brightspace
 *
 * Exporta cookies de la sesión activa de OpenClaw,
 * y provee funciones para guardar/cargar sesión en disco.
 */

import { chromium, BrowserContext, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Ruta donde se guardan las cookies de Brightspace
const SESSION_FILE = process.env.BRIGHTSPACE_SESSION_FILE ?? './brightspace-session.json';

// Perfil del browser de OpenClaw (ya tiene la sesión de Brightspace iniciada)
const OPENCLAW_BROWSER_PROFILE = 'C:\\Users\\lovoa\\.openclaw\\browser\\openclaw';

// URL base de Brightspace
const BRIGHTSPACE_ORIGIN = 'https://anahuac.brightspace.com';

// ─── Tipos ────────────────────────────────────────────────────

export interface BrightspaceCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
}

export interface SessionData {
  cookies: BrightspaceCookie[];
  savedAt: string;
}

// ─── Funciones ────────────────────────────────────────────────

/**
 * exportSession — Abre Chromium con el perfil de OpenClaw que ya
 * tiene la sesión de Brightspace iniciada, extrae las cookies y
 * las guarda en brightspace-session.json.
 */
export async function exportSession(): Promise<SessionData | null> {
  let browser;
  try {
    // Abrimos con el perfil de usuario de OpenClaw (tiene la sesión activa)
    browser = await chromium.launchPersistentContext(OPENCLAW_BROWSER_PROFILE, {
      headless: false, // visible para que el usuario pueda interactuar si es necesario
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Navegar a Brightspace para activar las cookies
    await page.goto(BRIGHTSPACE_ORIGIN, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Esperar a que la página cargue
    await page.waitForTimeout(2000);

    // Guardar sesión
    await saveSession(browser);

    await browser.close();

    // Leer y retornar los datos guardados
    const sessionData = loadSessionFromDisk();
    return sessionData;
  } catch (err) {
    console.error('[session] Error exportando sesión:', err);
    if (browser) {
      try { await browser.close(); } catch { /* ignorar */ }
    }
    return null;
  }
}

/**
 * saveSession — Guarda las cookies del contexto actual en disco
 */
export async function saveSession(context: BrowserContext): Promise<void> {
  try {
    const cookies = await context.cookies([BRIGHTSPACE_ORIGIN]);

    const sessionData: SessionData = {
      cookies: cookies as BrightspaceCookie[],
      savedAt: new Date().toISOString(),
    };

    const sessionDir = path.dirname(SESSION_FILE);
    if (sessionDir && sessionDir !== '.' && !fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2), 'utf-8');
    console.log(`[session] Sesión guardada: ${cookies.length} cookies → ${SESSION_FILE}`);
  } catch (err) {
    console.error('[session] Error guardando sesión:', err);
    throw err;
  }
}

/**
 * loadSession — Carga las cookies guardadas en el page de Playwright
 */
export async function loadSession(page: Page): Promise<boolean> {
  try {
    const sessionData = loadSessionFromDisk();
    if (!sessionData) {
      console.warn('[session] No hay sesión guardada en disco');
      return false;
    }

    // Verificar que las cookies no estén todas expiradas
    const now = Date.now() / 1000;
    const validCookies = sessionData.cookies.filter(
      (c) => c.expires < 0 || c.expires > now
    );

    if (validCookies.length === 0) {
      console.warn('[session] Todas las cookies han expirado');
      return false;
    }

    // Agregar cookies al contexto del browser
    await page.context().addCookies(validCookies);
    console.log(`[session] Sesión cargada: ${validCookies.length} cookies válidas`);
    return true;
  } catch (err) {
    console.error('[session] Error cargando sesión:', err);
    return false;
  }
}

/**
 * loadSessionFromDisk — Lee el archivo de sesión de disco
 */
export function loadSessionFromDisk(): SessionData | null {
  try {
    if (!fs.existsSync(SESSION_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(SESSION_FILE, 'utf-8');
    const data = JSON.parse(raw) as SessionData;
    return data;
  } catch {
    return null;
  }
}

/**
 * hasValidSession — Verifica si hay una sesión válida guardada
 */
export function hasValidSession(): boolean {
  const sessionData = loadSessionFromDisk();
  if (!sessionData) return false;

  const now = Date.now() / 1000;
  const hasValid = sessionData.cookies.some(
    (c) => c.expires < 0 || c.expires > now
  );
  return hasValid;
}
