# ARCHITECTURE.md — Brightspace Plus

## ¿Cómo funciona este proyecto?

Brightspace Plus es un portal universitario alternativo que extrae datos reales de
Brightspace Anáhuac usando automatización de navegador (Playwright), los procesa y
los muestra en una interfaz moderna.

---

## Diagrama general

```
[Usuario] → [Brightspace Plus Frontend (Next.js)]
                        ↓
            [API Routes Next.js /api/brightspace/*]
                        ↓
            [Capa de Scraping (Playwright)]
                        ↓
            [Brightspace Anáhuac (anahuac.brightspace.com)]
                        ↓ (datos reales)
            [Caché local (JSON en servidor)]
                        ↓
            [De vuelta al frontend como JSON]
```

---

## Componentes principales

### 1. Frontend (Next.js + TypeScript + Tailwind)
- **Ubicación:** `src/app/`
- **Qué hace:** Interfaz de usuario moderna con dark mode
- **Páginas:** Dashboard, Cursos, Tareas, Calendario, Calificaciones
- **Auth:** NextAuth.js con Microsoft OAuth (mismo SSO que Brightspace)

### 2. API Routes (Next.js API)
- **Ubicación:** `src/app/api/brightspace/`
- **Endpoints:**
  - `GET /api/brightspace/cursos` — Lista de cursos activos
  - `GET /api/brightspace/tareas` — Tareas de todos los cursos
  - `GET /api/brightspace/calificaciones` — Calificaciones por materia
  - `GET /api/brightspace/calendario` — Eventos y fechas de entrega
  - `POST /api/brightspace/refresh` — Forzar actualización de caché

### 3. Capa de Scraping (Playwright)
- **Ubicación:** `src/lib/scraper/`
- **Cómo funciona:**
  1. Usa las cookies de sesión de Brightspace (guardadas en `brightspace-session.json`)
  2. Abre Chromium en modo headless (sin interfaz visible)
  3. Navega a cada sección de Brightspace
  4. Extrae el HTML relevante y lo convierte a JSON estructurado
  5. Guarda el resultado en caché local
- **Archivos:**
  - `scraper.ts` — Motor principal de Playwright
  - `parsers/` — Funciones para extraer datos de cada página
  - `session.ts` — Manejo de cookies y sesión

### 4. Sistema de Caché
- **Ubicación:** `src/lib/cache/`
- **Cómo funciona:**
  - Los datos se guardan en archivos JSON locales
  - Cada tipo de dato tiene un TTL (tiempo de vida):
    - Cursos: 24 horas
    - Tareas: 30 minutos
    - Calificaciones: 1 hora
    - Calendario: 1 hora
  - Si el caché es válido, se devuelve sin llamar a Playwright
  - Si expiró, se llama al scraper y se actualiza

---

## Flujo de una petición de datos

```
1. Usuario abre "Tareas" en el dashboard
2. Frontend hace GET /api/brightspace/tareas
3. API verifica si el caché de tareas es válido (< 30 min)
   ├── SÍ: devuelve los datos del caché (rápido, ~50ms)
   └── NO: llama al scraper de Playwright
           → Playwright abre Brightspace con las cookies guardadas
           → Navega a cada curso y extrae las tareas
           → Guarda resultado en caché
           → Devuelve los datos al frontend (~5-15s)
4. Frontend muestra las tareas reales del señor Lovo
```

---

## Manejo de sesión de Brightspace

El señor Lovo dejó su sesión de Brightspace permanentemente abierta.
Las cookies de esa sesión se exportan y guardan en `brightspace-session.json`.
Playwright las carga al iniciar, por lo que no necesita hacer login cada vez.

**Si la sesión expira:** El scraper detecta el redirect a login y notifica
a Jarvis, quien le avisa al señor Lovo para que renueve la sesión.

---

## Variables de entorno necesarias

```env
# Autenticación Microsoft (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=secret-aleatorio-seguro
AZURE_AD_CLIENT_ID=id-de-app-en-azure
AZURE_AD_CLIENT_SECRET=secret-de-app-en-azure
AZURE_AD_TENANT_ID=tenant-id-de-anahuac

# Configuración del scraper
BRIGHTSPACE_SESSION_FILE=./brightspace-session.json
BRIGHTSPACE_BASE_URL=https://anahuac.brightspace.com
CACHE_DIR=./cache
```

---

## Stack tecnológico completo

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js | 16.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 4.x |
| Íconos | Lucide React | latest |
| Estado | Zustand | latest |
| Auth | NextAuth.js | 4.x |
| Scraping | Playwright | latest |
| HTTP | Axios | latest |
| Fechas | date-fns | latest |
| Deploy | Vercel | - |

---

## Decisiones de diseño

**¿Por qué scraping y no API oficial de D2L?**
La API oficial de Brightspace requiere aprobación institucional de la universidad.
El scraping con Playwright funciona con cualquier cuenta estudiantil sin permisos especiales.

**¿Por qué caché local y no base de datos?**
Para simplificar el setup inicial. En producción se puede migrar a Redis o similar.

**¿Por qué Next.js y no un backend separado?**
Las API Routes de Next.js son suficientes para este caso de uso y simplifican el deploy en Vercel.

---

*Documentación generada por Jarvis 🎩 — Actualizada: marzo 2026*
