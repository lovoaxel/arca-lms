# IDEAS.md — Brightspace Plus
*Ideas generadas por Jarvis 🎩 — Actualizadas diariamente a las 7 AM*

---

<!-- Las ideas se agregan automáticamente aquí cada día -->

## 2026-03-06 — Ideas del día

- **Focus Mode con Pomodoro contextual:** Botón "Entrar en modo estudio" dentro de cualquier actividad del curso. Activa un temporizador Pomodoro (25/5 min), abre automáticamente los materiales relevantes de esa unidad, registra el tiempo de sesión por materia y al terminar muestra un mini-resumen de productividad ("Estudiaste 1h 40min de Finanzas hoy"). Implementación: overlay con timer + Web Locks API para bloquear navegación y analytics de sesión guardados en localStorage + backend. Diferenciador clave: los portales universitarios nunca conectan el *dónde estudiar* con el *cómo estudiar*.

- **Business Sync — Conecta tu startup con tu escuela:** Para el estudiante que lleva una empresa real, un módulo que permite vincular proyectos académicos con herramientas externas (Notion, Trello, GitHub, Jira) vía OAuth. Cuando el profesor asigna un proyecto, el alumno lo mapea a una tarjeta de su tablero real. El sistema sincroniza deadlines bidireccional y permite entregar el link del repo o el doc de Notion directamente como entrega. Implementación: API integrations + webhook listeners + un "delivery adapter" que acepta URLs externas como entregables válidos. Útil porque en Anáhuac muchos proyectos de clase *son* proyectos reales — no tiene sentido duplicar el trabajo.

- **AI Grade Navigator — "¿Cómo voy a terminar este curso?":** Un predictor de calificación final que analiza el peso de cada actividad, tu desempeño actual, el historial de actividad en el portal y los patrones de entrega tardía. Genera una proyección con dos escenarios: "Si entregas todo a tiempo → 8.7" / "Si mantienes el ritmo actual → 7.2". Debajo muestra las 3 actividades pendientes con mayor impacto en tu nota final, ordenadas por ROI de esfuerzo. Implementación: algoritmo de weighted average con regresión simple sobre el histórico del usuario + UI de semáforo por materia en el dashboard. No es magia — es matemática básica bien presentada, y ningún LMS lo hace bien.
