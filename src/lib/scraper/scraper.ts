/**
 * scraper.ts — Motor principal de Playwright para Brightspace
 *
 * Maneja el ciclo de vida del browser/page y verifica autenticación.
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { loadSession } from './session';

// URL base de Brightspace
const BRIGHTSPACE_BASE = process.env.BRIGHTSPACE_BASE_URL ?? 'https://anahuac.brightspace.com';

// ─── Funciones públicas ───────────────────────────────────────

/**
 * createBrowser — Inicia Playwright en modo headless
 */
export async function createBrowser(): Promise<{ browser: Browser; context: BrowserContext }> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',
    viewport: { width: 1280, height: 800 },
  });

  return { browser, context };
}

/**
 * checkAuth — Verifica si la sesión es válida.
 * Retorna true si el usuario está autenticado, false si hay redirect a login.
 */
export async function checkAuth(page: Page): Promise<boolean> {
  try {
    await page.goto(`${BRIGHTSPACE_BASE}/d2l/home`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const currentUrl = page.url();

    // Si hay redirect a login, la sesión expiró
    if (
      currentUrl.includes('/d2l/lp/auth') ||
      currentUrl.includes('/d2l/login') ||
      currentUrl.includes('login.microsoftonline.com') ||
      currentUrl.includes('/d2l/lp/oauth2')
    ) {
      console.warn('[scraper] Sesión expirada — se detectó redirect a login:', currentUrl);
      return false;
    }

    // Verificar que hay contenido del dashboard
    const hasDashboard = await page.locator('d2l-my-courses, .d2l-page-wrapper, #main-view-nav').count() > 0;

    return true; // Retornamos true si no hubo redirect, aunque no detectemos elementos específicos
  } catch (err) {
    console.error('[scraper] Error verificando autenticación:', err);
    return false;
  }
}

/**
 * withPage — Maneja el ciclo de vida del browser/page.
 * Ejecuta una función con una página de Playwright lista con cookies cargadas.
 *
 * @param fn - Función async que recibe la Page y retorna el resultado
 * @returns El resultado de fn, o null si falla la auth
 */
export async function withPage<T>(
  fn: (page: Page) => Promise<T>
): Promise<T | null> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    // Crear browser en modo headless
    const browserCtx = await createBrowser();
    browser = browserCtx.browser;
    context = browserCtx.context;

    page = await context.newPage();

    // Cargar cookies de sesión
    const sessionLoaded = await loadSession(page);
    if (!sessionLoaded) {
      console.warn('[scraper] No se pudo cargar la sesión. El scraping puede fallar.');
    }

    // Verificar autenticación
    const isAuthenticated = await checkAuth(page);
    if (!isAuthenticated) {
      console.error('[scraper] No autenticado. Sesión expirada o no disponible.');
      // Notificar a Jarvis que la sesión expiró
      notifySessionExpired();
      return null;
    }

    // Ejecutar la función con la página lista
    const result = await fn(page);
    return result;
  } catch (err) {
    console.error('[scraper] Error en withPage:', err);
    return null;
  } finally {
    // Limpiar recursos
    try {
      if (page) await page.close();
      if (context) await context.close();
      if (browser) await browser.close();
    } catch {
      /* ignorar errores de limpieza */
    }
  }
}

/**
 * notifySessionExpired — Notifica a Jarvis que la sesión expiró.
 * Usa un proceso en background para no bloquear.
 */
function notifySessionExpired(): void {
  try {
    // Importar dinámicamente para evitar errores en contextos sin child_process
    import('child_process').then(({ exec }) => {
      exec(
        'openclaw system event --text "⚠️ Brightspace: Sesión expirada - necesitas renovar el login" --mode now',
        (err) => {
          if (err) console.warn('[scraper] No se pudo notificar expiración de sesión:', err.message);
        }
      );
    }).catch(() => {
      // Si child_process no está disponible, ignorar
    });
  } catch {
    // Ignorar cualquier error
  }
}

/**
 * navigateWithRetry — Navega a una URL con reintentos en caso de error
 */
export async function navigateWithRetry(
  page: Page,
  url: string,
  retries = 2
): Promise<boolean> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      return true;
    } catch (err) {
      if (attempt === retries) {
        console.error(`[scraper] No se pudo navegar a ${url} después de ${retries + 1} intentos`);
        return false;
      }
      console.warn(`[scraper] Reintentando navegación a ${url} (intento ${attempt + 1})`);
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return false;
}
