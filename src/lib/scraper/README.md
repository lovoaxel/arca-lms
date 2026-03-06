# Scraper de Brightspace — Documentación

## ¿Qué hace?

Este módulo automatiza la extracción de datos de Brightspace Anáhuac
usando Playwright. Simula un navegador real con la sesión del usuario,
navega a cada sección de Brightspace y extrae los datos estructurados.

## Archivos

```
src/lib/scraper/
├── session.ts          # Manejo de cookies y sesión
├── scraper.ts          # Motor principal de Playwright
├── parsers/
│   ├── courses.ts      # Parser para cursos
│   ├── assignments.ts  # Parser para tareas
│   └── grades.ts       # Parser para calificaciones
└── README.md           # Esta documentación
```

## Flujo de funcionamiento

```
1. Frontend hace GET /api/brightspace/tareas
2. API verifica caché (archivo cache/brightspace_tareas.json)
   ├── Válido → Retorna inmediatamente (~50ms)
   └── Expirado → Inicia Playwright
         ↓
3. Playwright se lanza en modo headless
4. Carga las cookies de brightspace-session.json
5. Navega a Brightspace con la sesión ya iniciada
6. Extrae los datos del HTML / API interna de D2L
7. Guarda en caché con timestamp
8. Retorna los datos al frontend
```

## Sesión de Brightspace

El scraper necesita cookies de sesión válidas para funcionar.

### Exportar la sesión

```bash
# Vía API (mientras el servidor dev está corriendo)
curl -X POST http://localhost:3000/api/brightspace/session/export

# Verificar estado
curl http://localhost:3000/api/brightspace/session/export
```

La función `exportSession()` en `session.ts`:
1. Abre Chromium con el perfil de OpenClaw (`C:\Users\lovoa\.openclaw\browser\openclaw`)
2. Navega a Brightspace (que ya tiene la sesión activa)
3. Extrae las cookies y las guarda en `brightspace-session.json`

### Cuándo renovar la sesión

Las sesiones de Brightspace suelen durar entre 8 y 24 horas.
Cuando expiran:
- El scraper detecta el redirect a la página de login
- Notifica a Jarvis vía `openclaw system event`
- Las API routes retornan datos de mock como fallback

## Estrategia dual de extracción

Cada parser intenta dos métodos:

### 1. API interna de D2L (preferido)
D2L expone endpoints internos usados por la interfaz web.
Ejemplo: `GET /d2l/api/le/1.48/{courseId}/dropbox/folders/`

Ventajas:
- Datos estructurados y completos
- Más rápido que parsear HTML
- Menos frágil ante cambios de UI

### 2. Scraping de HTML (fallback)
Si la API interna no está disponible o retorna error,
se parsea el DOM de la página directamente.

## TTLs de caché

| Datos           | TTL    | Archivo                       |
|-----------------|--------|-------------------------------|
| Cursos          | 24h    | cache/brightspace_cursos.json |
| Tareas          | 30 min | cache/brightspace_tareas.json |
| Calificaciones  | 60 min | cache/brightspace_calificaciones.json |

## Manejo de errores

- Si el scraper falla: retorna datos de mock (nunca rompe la app)
- Si la sesión expiró: notifica a Jarvis y usa mock data
- Si hay error de red: retorna datos cacheados si existen

## Variables de entorno

```env
BRIGHTSPACE_SESSION_FILE=./brightspace-session.json
BRIGHTSPACE_BASE_URL=https://anahuac.brightspace.com
CACHE_DIR=./cache
```

---

*Desarrollado para Brightspace Plus — Axel Lovo / Jarvis 🎩 — Marzo 2026*
