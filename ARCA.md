# ARCA — LMS de Nueva Generación

> *Todo el conocimiento de una institución, en un solo lugar.*

---

## Visión

ARCA es un LMS (Learning Management System) moderno, rápido e inteligente diseñado para universidades mexicanas. Nació como alternativa superior a Brightspace, Canvas y Moodle — construido por un estudiante que vivió el problema desde adentro.

**Diferenciadores clave:**
- Mobile-first — funciona perfectamente en celular, a diferencia de los LMS actuales
- IA integrada — borradores de tareas, predicción de calificaciones, alertas inteligentes
- Multi-tenant — una sola plataforma para múltiples instituciones
- Tiempo real — notificaciones por Telegram/WhatsApp, no por email que nadie lee

---

## Modelo de Negocio

**SaaS por estudiante activo:**
- $20-50 MXN por estudiante activo por mes
- Universidad Anáhuac (~14,000 estudiantes) = $280,000-700,000 MXN/mes
- Meta: 10 universidades en 3 años = $2.8M-7M MXN/mes

**Fases de venta:**
1. MVP funcional con datos reales (prueba interna)
2. Beta con 20-50 estudiantes Anáhuac
3. Presentación a Dirección de Tecnología Anáhuac
4. Expansión a otras universidades del sistema

---

## Arquitectura Multi-Tenant

Cada universidad es un **tenant** independiente con:
- Sus propios datos aislados
- Su dominio personalizado (`arca.anahuac.mx`)
- Su identidad visual (logo, colores)
- Su LMS de origen configurado (Brightspace, Moodle, Canvas, Blackboard)
- Su proveedor de autenticación (Microsoft, Google, SAML)

```
arca.anahuac.mx  →  Tenant: Anáhuac  →  LMS: Brightspace
arca.tec.mx      →  Tenant: Tec      →  LMS: Canvas
arca.ibero.mx    →  Tenant: Ibero    →  LMS: Moodle
```

---

## Roadmap

### Fase 1 — MVP Funcional (actual)
- [x] UI completa: Dashboard, Cursos, Tareas, Calendario, Calificaciones
- [x] Arquitectura multi-tenant base
- [x] Scraper Brightspace con Playwright
- [ ] Conectar scraper con sesión real
- [ ] Deploy en Vercel

### Fase 2 — Producto Real
- [ ] Autenticación Microsoft OAuth funcional
- [ ] Notificaciones Telegram en tiempo real
- [ ] Calculadora de calificación final
- [ ] Búsqueda global entre materias
- [ ] PWA — instalable en celular

### Fase 3 — IA Integrada
- [ ] Borrador AI de tareas con aprobación manual
- [ ] Predictor de calificación ("necesitas X para pasar")
- [ ] Detección de riesgo académico
- [ ] Resumen de contenido de materias

### Fase 4 — Escala
- [ ] API oficial D2L/LTI para integración institucional
- [ ] Dashboard de analítica para directivos
- [ ] Soporte Moodle y Canvas
- [ ] App nativa iOS/Android

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Estado | Zustand |
| Auth | NextAuth.js + Microsoft Azure AD |
| Scraping | Playwright |
| Cache | Sistema de archivos + TTL |
| DB (futuro) | PostgreSQL + Prisma |
| Deploy | Vercel |
| Notificaciones | Telegram Bot API |

---

*Construido por Axel Emmanuel Lovo Álvarez — Universidad Anáhuac, 2026*
