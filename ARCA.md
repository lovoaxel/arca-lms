# ARCA — LMS Multi-tenant para Universidades Mexicanas

## Vision

ARCA es una plataforma SaaS multi-tenant que unifica la experiencia de aprendizaje para universidades mexicanas. Conecta con LMS existentes (Brightspace, Moodle, Canvas, Blackboard) y ofrece un dashboard moderno, inteligente y personalizable por institución.

## Arquitectura

```
┌──────────────────────────────────────┐
│            ARCA Frontend             │
│  (Next.js App Router + Tailwind)     │
├──────────────────────────────────────┤
│         Tenant Resolver              │
│  dominio → configuración tenant      │
├──────────────────────────────────────┤
│         LMS Adapter Layer            │
│  Brightspace │ Moodle │ Canvas │ ... │
├──────────────────────────────────────┤
│    Auth (Azure AD / Google / SAML)   │
├──────────────────────────────────────┤
│         Base de Datos (futuro)       │
│    Tenant config │ Cache │ Users     │
└──────────────────────────────────────┘
```

## Roadmap

### Fase 1 — Fundación (actual)
- [x] Arquitectura multi-tenant base
- [x] Tenant resolver por dominio
- [x] TenantProvider / useTenant hook
- [x] LMS Adapter interface + Brightspace adapter
- [x] Adapter factory pattern
- [ ] Theming dinámico por tenant

### Fase 2 — Persistencia
- [ ] Base de datos (Postgres + Prisma)
- [ ] CRUD de tenants vía admin panel
- [ ] Cache distribuido (Redis)
- [ ] Migración de cache local a Redis

### Fase 3 — Adaptadores LMS
- [ ] Moodle adapter
- [ ] Canvas adapter
- [ ] Blackboard adapter
- [ ] API unificada de scraping por LMS

### Fase 4 — Inteligencia
- [ ] Analíticas por universidad
- [ ] Predicción de rendimiento (ML)
- [ ] Notificaciones inteligentes
- [ ] Recomendaciones personalizadas

### Fase 5 — Escala
- [ ] Onboarding self-service para universidades
- [ ] Billing y planes de suscripción
- [ ] Marketplace de plugins
- [ ] App móvil (React Native)
