/**
 * POST /api/brightspace/session/export
 *
 * Exporta las cookies de Brightspace desde el browser de OpenClaw.
 * Debe llamarse manualmente cuando la sesión expira.
 */

import { NextResponse } from 'next/server';
import { exportSession, hasValidSession, loadSessionFromDisk } from '@/lib/scraper/session';
import { clearAllCache } from '@/lib/cache/cache';

export async function POST(): Promise<NextResponse> {
  try {
    console.log('[API session/export] Iniciando exportación de sesión...');

    // Intentar exportar la sesión desde el perfil de OpenClaw
    const sessionData = await exportSession();

    if (!sessionData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se pudo exportar la sesión. Asegúrate de que el browser de OpenClaw tenga la sesión de Brightspace activa.',
        },
        { status: 400 }
      );
    }

    // Limpiar caché para que se re-scrapeé con la nueva sesión
    clearAllCache();

    return NextResponse.json({
      success: true,
      message: `Sesión exportada correctamente. ${sessionData.cookies.length} cookies guardadas.`,
      savedAt: sessionData.savedAt,
      cookieCount: sessionData.cookies.length,
    });
  } catch (err) {
    console.error('[API session/export] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: `Error exportando sesión: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    // Verificar estado de la sesión actual
    const isValid = hasValidSession();
    const sessionData = loadSessionFromDisk();

    return NextResponse.json({
      success: true,
      hasSession: isValid,
      savedAt: sessionData?.savedAt ?? null,
      cookieCount: sessionData?.cookies.length ?? 0,
      status: isValid ? 'valid' : sessionData ? 'expired' : 'not_found',
    });
  } catch (err) {
    console.error('[API session/export GET] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: String(err),
        hasSession: false,
      },
      { status: 500 }
    );
  }
}
