# AGENTS.md — Brightspace Plus

## Qué es este proyecto
Brightspace Plus es una reimaginación moderna del portal universitario Brightspace de la Universidad Anáhuac.
Mantiene todas las funcionalidades del sistema original pero con una interfaz moderna, intuitiva y mejorada.
El proyecto es desarrollado por Axel Lovo (señor Lovo), estudiante de la Anáhuac, con asistencia del sistema Jarvis.

## Objetivo
Construir un cliente web moderno que consuma los datos de Brightspace (anahuac.brightspace.com) y los presente
en una interfaz superior: más rápida, más limpia, con IA integrada y notificaciones inteligentes.

## Stack tecnológico
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **UI Components:** shadcn/ui
- **Auth:** OAuth Microsoft (SSO Anáhuac) — mismo login que Brightspace
- **Integración:** D2L Brightspace API + Playwright como fallback para scraping
- **Deploy:** Vercel
- **Estado:** Zustand
- **Package manager:** npm

## Funcionalidades principales
1. Dashboard moderno con vista de cursos y tareas pendientes
2. Calendario de entregas con prioridades y alertas
3. Vista de calificaciones mejorada
4. Notificaciones inteligentes vía Telegram
5. Modo oscuro nativo
6. Subida de archivos con drag & drop
7. Asistente Jarvis integrado

## Estructura de carpetas esperada
```
brightspace-plus/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Rutas autenticadas
│   ├── (public)/        # Rutas públicas
│   └── api/             # API routes
├── components/           # Componentes reutilizables
├── lib/                  # Utilidades y configuración
├── hooks/                # Custom hooks
├── types/                # TypeScript types
└── public/               # Assets estáticos
```

## Convenciones
- TypeScript estricto en todo el proyecto
- Componentes funcionales con hooks
- Nombrado: PascalCase para componentes, camelCase para funciones
- Commits en inglés, descriptivos
- Comentarios en español cuando sea necesario

## Instrucciones para el agente
- Siempre correr `npm run build` antes de reportar que algo está listo
- Si hay errores de TypeScript, corregirlos antes de continuar
- Crear commits descriptivos por cada feature completada
- Reportar a Jarvis cuando termines usando: `openclaw system event --text "Done: [resumen]" --mode now`
- Priorizar: funcionalidad > estética, pero sin descuidar el diseño
