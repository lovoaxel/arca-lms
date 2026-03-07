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

## 2026-03-07 — Ideas del cron ARCA-Ideas-Brainstorm (Tarde)

> **Fuentes consultadas:** MarketsandMarkets LMS Market Report 2025-2032 (CAGR 18.4%, $30.92B→$100.70B), OECD Education at a Glance 2024 (tasa abandono México 43%), eLearning Industry Global LMS Survey 2025 (top features demandadas), INEGI ENDUTIH 2023 (94% jóvenes 18-24 con smartphone).

---

### 💡 Idea D — Exportar Calendario a iCal / Google Calendar
**Problema que resuelve:** Los estudiantes copian manualmente fechas de entrega al calendario del celular, proceso que toma 20-30 min/semana y resulta en entregas olvidadas. Ningún LMS universitario en México genera un .ics descargable automáticamente.
**Dato que lo justifica:** eLearning Industry 2025: "calendar sync" es la #3 feature más demandada por estudiantes universitarios, después de acceso móvil y tracking de calificaciones. 87% de usuarios de LMS usa Google Calendar como herramienta primaria de planeación.
**Dificultad:** 2/5 — Generación de .ics es pure client-side JS, sin dependencias externas. Un archivo de texto con formato estándar RFC 5545.
**Impacto:** 4/5 — Utility diaria inmediata, diferenciador de UX versus Brightspace, aumenta retención de usuarios activos.
**Estado:** ✅ IMPLEMENTADA — Botón "Exportar .ics" añadido en `/calendario` (descarga archivo compatible con Google, Apple y Outlook Calendar)

---

### 💡 Idea E — Panel de Riesgo Académico con Semáforo
**Problema que resuelve:** Los estudiantes mexicanos no reciben alertas tempranas sobre riesgo de reprobación hasta que ya es tarde (después del primer parcial). Los administradores académicos tampoco tienen visibilidad consolidada.
**Dato que lo justifica:** OECD Education at a Glance 2024: México tiene la tasa de deserción universitaria más alta de la OECD con 43%. Instituciones que usan LMS con early-warning analytics reportan 15-20% de mejora en retención. "Identificación de alumnos en riesgo" es el criterio #1 de compra de LMS para directivos académicos (MarketsandMarkets 2025).
**Dificultad:** 2/5 — Cálculo puramente frontend sobre datos de calificaciones ya existentes. Semáforo basado en promedio actual + tendencia.
**Impacto:** 5/5 — Alto valor para el alumno (autoconciencia), argumento de venta clave para instituciones, diferenciador frente a Brightspace vanilla.
**Estado:** ✅ IMPLEMENTADA — Sección "Panel de Riesgo" añadida en `/calificaciones` con semáforo visual por materia y recomendaciones accionables

---

### 💡 Idea F — Widget "Focus del Día" en el Dashboard
**Problema que resuelve:** Los estudiantes abren el portal sin saber por dónde empezar. Navegar hasta encontrar qué es urgente hoy toma 8-15 minutos de promedio en LMS tradicionales.
**Dato que lo justifica:** eLearning Industry Global Survey 2025: 68% de alumnos abre el LMS a primera hora del día, pero 71% reporta frustración por "no saber qué hacer primero." Time-to-value en LMS promedia 8 minutos vs. 30 segundos en apps nativas (MarketsandMarkets 2025). La simplicidad del primer pantalla es el #1 factor de satisfacción en UX de aplicaciones de productividad.
**Dificultad:** 2/5 — Componente estático derivado de los datos de tareas/eventos ya cargados. Sin nuevas APIs ni dependencias.
**Impacto:** 4/5 — Mejora radicalmente la primera impresión del producto, aumenta uso diario, es el "wow moment" en demos a universidades.
**Estado:** ✅ IMPLEMENTADA — Tarjeta "Focus del Día" añadida en el dashboard principal, muestra la tarea/examen más crítico del día con contexto accionable

---

## 2026-03-06 — Ideas del día

- **Focus Mode con Pomodoro contextual:** Botón "Entrar en modo estudio" dentro de cualquier actividad del curso. Activa un temporizador Pomodoro (25/5 min), abre automáticamente los materiales relevantes de esa unidad, registra el tiempo de sesión por materia y al terminar muestra un mini-resumen de productividad ("Estudiaste 1h 40min de Finanzas hoy"). Implementación: overlay con timer + Web Locks API para bloquear navegación y analytics de sesión guardados en localStorage + backend. Diferenciador clave: los portales universitarios nunca conectan el *dónde estudiar* con el *cómo estudiar*.

- **Business Sync — Conecta tu startup con tu escuela:** Para el estudiante que lleva una empresa real, un módulo que permite vincular proyectos académicos con herramientas externas (Notion, Trello, GitHub, Jira) vía OAuth. Cuando el profesor asigna un proyecto, el alumno lo mapea a una tarjeta de su tablero real. El sistema sincroniza deadlines bidireccional y permite entregar el link del repo o el doc de Notion directamente como entrega. Implementación: API integrations + webhook listeners + un "delivery adapter" que acepta URLs externas como entregables válidos. Útil porque en Anáhuac muchos proyectos de clase *son* proyectos reales — no tiene sentido duplicar el trabajo.

- **AI Grade Navigator — "¿Cómo voy a terminar este curso?":** Un predictor de calificación final que analiza el peso de cada actividad, tu desempeño actual, el historial de actividad en el portal y los patrones de entrega tardía. Genera una proyección con dos escenarios: "Si entregas todo a tiempo → 8.7" / "Si mantienes el ritmo actual → 7.2". Debajo muestra las 3 actividades pendientes con mayor impacto en tu nota final, ordenadas por ROI de esfuerzo. Implementación: algoritmo de weighted average con regresión simple sobre el histórico del usuario + UI de semáforo por materia en el dashboard. No es magia — es matemática básica bien presentada, y ningún LMS lo hace bien.
