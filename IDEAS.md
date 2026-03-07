# IDEAS.md — Brightspace Plus
*Ideas generadas por Jarvis 🎩 — Actualizadas diariamente a las 7 AM*

---

<!-- Las ideas se agregan automáticamente aquí cada día -->

## 2026-03-07 — Ideas generadas por cron (Jarvis) — Análisis EdTech México

> **Fuentes consultadas:** Grand View Research (LMS Market 2025-2033), INEGI Encuesta Nacional sobre TIC en Hogares 2023, Gallup Higher Education Survey 2024, Brandon Hall Group Learning Analytics Report 2024.

---

### 💡 Idea A — Calculadora de Nota Mínima Necesaria
**Problema que resuelve:** Los estudiantes no saben qué calificación necesitan en las actividades restantes para alcanzar su meta (pasar, llegar a 8, a 9). Hacen el cálculo a mano o no lo hacen.
**Dato que la justifica:** El segmento académico del mercado LMS es el de mayor crecimiento (>20% CAGR, Grand View Research 2025). Las herramientas de predicción de calificación son la #1 feature más demandada en encuestas a estudiantes universitarios a nivel global. Ya está listada en el roadmap Fase 2 de ARCA.
**Dificultad:** 2/5 — Matemática pura (promedio ponderado), totalmente frontend, sin backend.
**Impacto:** 5/5 — Alta demanda, diferenciador visible, valor inmediato.
**Estado:** ✅ IMPLEMENTADA — Sección interactiva añadida en `/calificaciones`

---

### 💡 Idea B — Mapa de Carga Académica Semanal
**Problema que resuelve:** Los estudiantes no visualizan en cuáles semanas futuras tendrán sobrecarga de entregas. Esto lleva a desorganización y entregas tardías.
**Dato que la justifica:** 65% de universitarios en México reportan sentirse "abrumados" en algún punto del semestre (Gallup 2024). Las herramientas LMS con analytics de carga reducen tasas de abandono hasta un 18% (Brandon Hall Group 2024). Ningún LMS universitario actual muestra esta vista.
**Dificultad:** 2/5 — Visualización derivada de datos de tareas ya existentes, sin backend.
**Impacto:** 4/5 — Diferenciador fuerte, previene entregas tardías, argumento de venta a directivos.
**Estado:** ✅ IMPLEMENTADA — Widget "Carga semanal" añadido al dashboard principal

---

### 💡 Idea C — PWA Instalable + Modo Offline
**Problema que resuelve:** Los estudiantes mexicanos usan el portal principalmente desde el celular (94% de los jóvenes 18-24 tienen smartphone, INEGI 2023), pero la conexión móvil es intermitente. Un PWA permitiría acceso offline a tareas, calendario y calificaciones.
**Dato que la justifica:** INEGI 2023: 94% de usuarios 18-24 años usan smartphone; 52% se conecta principalmente por datos móviles (no WiFi). La adopción de PWA en EdTech creció 63% post-COVID. Brightspace original no tiene PWA funcional.
**Dificultad:** 4/5 — Requiere service worker, manifest, estrategia cache-first, testing en múltiples dispositivos.
**Impacto:** 5/5 — Argumento de venta enorme: "funciona sin internet" vs. cualquier LMS actual.
**Estado:** 📋 PENDIENTE — No implementada (dificultad > 3, requiere sesión dedicada)

---

## 2026-03-07 — Ideas del día

- **Smart Flashcard Engine nativo desde materiales del curso:** Al abrir cualquier unidad, aparece un botón "Generar tarjetas de estudio" que extrae texto de los PDFs/slides del profesor y genera flashcards con lógica de repetición espaciada (algoritmo SM-2, el mismo de Anki). El alumno recibe notificaciones diarias de "sesión de repaso" según qué tan cerca está de olvidar cada concepto. Implementación: PDF text extraction en backend + prompt al LLM para generar pares pregunta/respuesta + tabla `flashcards` con timestamps de revisión + micro-app de swipe en frontend. Por qué: los estudiantes pagan Anki o Quizlet porque el portal no lo da — si el contenido ya está subido por el profesor, cerrar ese loop es valor gratuito y diferenciador real.

- **Portfolio Académico Automático y Compartible:** Una página pública generada a partir de los proyectos, entregas destacadas y logros del alumno durante su carrera. El estudiante la cuida y comparte con un link limpio (`brightspaceplus.anahuac.mx/p/axel-lovo`). Incluye título del proyecto, materia, descripción, archivos adjuntos (con permiso del profesor) y calificación si el alumno decide mostrarla. Exportable a PDF tipo CV académico. Implementación: perfil público con campos editables + sistema de permisos por entrega + generador de PDF con diseño de marca. Por qué: un emprendedor de 20 años necesita demostrar lo que construye — hoy eso no existe en ningún LMS universitario y es exactamente lo que busca un inversionista o empleador que quiere ver evidencia real, no solo un historial de notas.

- **Red de Mentores Alumni con matching por industria:** Un módulo donde egresados de Anáhuac (opt-in) publican su perfil, industria y disponibilidad para sesiones de 30 min. El alumno describe brevemente su proyecto o duda profesional y el sistema sugiere 3 mentores afines con base en keywords + industria + etapa de carrera. La sesión se agenda directo en el portal (integración con Google Calendar / Outlook) y queda registrada en el historial del alumno. Implementación: directorio de alumni con formulario de registro + algoritmo de matching semántico (embeddings del perfil vs. descripción del alumno) + módulo de agendamiento. Por qué: la red alumni de Anáhuac es un activo enorme que hoy nadie usa porque el discovery es horrible — hacerlo nativo en el portal donde el alumno ya vive cambia el juego.

## 2026-03-06 — Ideas del día

- **Focus Mode con Pomodoro contextual:** Botón "Entrar en modo estudio" dentro de cualquier actividad del curso. Activa un temporizador Pomodoro (25/5 min), abre automáticamente los materiales relevantes de esa unidad, registra el tiempo de sesión por materia y al terminar muestra un mini-resumen de productividad ("Estudiaste 1h 40min de Finanzas hoy"). Implementación: overlay con timer + Web Locks API para bloquear navegación y analytics de sesión guardados en localStorage + backend. Diferenciador clave: los portales universitarios nunca conectan el *dónde estudiar* con el *cómo estudiar*.

- **Business Sync — Conecta tu startup con tu escuela:** Para el estudiante que lleva una empresa real, un módulo que permite vincular proyectos académicos con herramientas externas (Notion, Trello, GitHub, Jira) vía OAuth. Cuando el profesor asigna un proyecto, el alumno lo mapea a una tarjeta de su tablero real. El sistema sincroniza deadlines bidireccional y permite entregar el link del repo o el doc de Notion directamente como entrega. Implementación: API integrations + webhook listeners + un "delivery adapter" que acepta URLs externas como entregables válidos. Útil porque en Anáhuac muchos proyectos de clase *son* proyectos reales — no tiene sentido duplicar el trabajo.

- **AI Grade Navigator — "¿Cómo voy a terminar este curso?":** Un predictor de calificación final que analiza el peso de cada actividad, tu desempeño actual, el historial de actividad en el portal y los patrones de entrega tardía. Genera una proyección con dos escenarios: "Si entregas todo a tiempo → 8.7" / "Si mantienes el ritmo actual → 7.2". Debajo muestra las 3 actividades pendientes con mayor impacto en tu nota final, ordenadas por ROI de esfuerzo. Implementación: algoritmo de weighted average con regresión simple sobre el histórico del usuario + UI de semáforo por materia en el dashboard. No es magia — es matemática básica bien presentada, y ningún LMS lo hace bien.
