"use client";

import { useState } from "react";
import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import type { Assignment } from "@/types";

// ─── Mock Data ─────────────────────────────────────────────────
const MOCK_ASSIGNMENTS: Assignment[] = [
  // Precálculo
  {
    id: "a1",
    title: "Examen Parcial 1",
    courseId: "c1",
    courseName: "Precálculo",
    courseColor: "bg-purple-500",
    dueDate: "2026-03-07T10:00:00",
    status: "pending",
    priority: "urgent",
    maxGrade: 100,
    description: "Examen que cubre funciones, límites y continuidad. Capítulos 1–3 del libro.",
  },
  {
    id: "a2",
    title: "Tarea 2 — Funciones Trigonométricas",
    courseId: "c1",
    courseName: "Precálculo",
    courseColor: "bg-purple-500",
    dueDate: "2026-03-14T23:59:00",
    status: "pending",
    priority: "high",
    maxGrade: 10,
    description: "Ejercicios 1–20 del capítulo 4. Entregar en PDF.",
  },
  {
    id: "a3",
    title: "Tarea 1 — Repaso Álgebra",
    courseId: "c1",
    courseName: "Precálculo",
    courseColor: "bg-purple-500",
    dueDate: "2026-02-21T23:59:00",
    status: "submitted",
    priority: "low",
    maxGrade: 10,
    grade: 8,
  },
  // Sistemas Operativos
  {
    id: "a4",
    title: "Tarea 4 — Scheduling de Procesos",
    courseId: "c2",
    courseName: "Sistemas Operativos",
    courseColor: "bg-cyan-500",
    dueDate: "2026-03-11T23:59:00",
    status: "pending",
    priority: "medium",
    maxGrade: 100,
    description: "Implementar Round Robin y SJF en Python. Comparar tiempos de espera promedio.",
  },
  {
    id: "a5",
    title: "Práctica 2 — Threads en C",
    courseId: "c2",
    courseName: "Sistemas Operativos",
    courseColor: "bg-cyan-500",
    dueDate: "2026-02-28T23:59:00",
    status: "graded",
    priority: "low",
    maxGrade: 100,
    grade: 92,
    description: "Implementar un productor-consumidor con semáforos en C.",
  },
  {
    id: "a6",
    title: "Tarea 3 — Memoria Virtual",
    courseId: "c2",
    courseName: "Sistemas Operativos",
    courseColor: "bg-cyan-500",
    dueDate: "2026-03-20T23:59:00",
    status: "pending",
    priority: "medium",
    maxGrade: 100,
    description: "Analizar los algoritmos de reemplazo de páginas (LRU, FIFO, Óptimo).",
  },
  // Bases de Datos
  {
    id: "a7",
    title: "Práctica 3 — Normalización",
    courseId: "c3",
    courseName: "Bases de Datos",
    courseColor: "bg-blue-500",
    dueDate: "2026-03-06T23:59:00",
    status: "pending",
    priority: "urgent",
    maxGrade: 100,
    description: "Normalizar el esquema ER proporcionado hasta la 3FN. Incluir justificación paso a paso.",
  },
  {
    id: "a8",
    title: "Proyecto Final — Sistema de Inventario",
    courseId: "c3",
    courseName: "Bases de Datos",
    courseColor: "bg-blue-500",
    dueDate: "2026-05-30T23:59:00",
    status: "pending",
    priority: "medium",
    maxGrade: 100,
    description: "Diseñar e implementar un sistema de inventario completo con MySQL y reportes.",
  },
  {
    id: "a9",
    title: "Tarea 2 — Modelo ER",
    courseId: "c3",
    courseName: "Bases de Datos",
    courseColor: "bg-blue-500",
    dueDate: "2026-02-20T23:59:00",
    status: "graded",
    priority: "low",
    maxGrade: 100,
    grade: 87,
  },
  // Emprendimiento
  {
    id: "a10",
    title: "Proyecto Fase 2 — Canvas de Negocio",
    courseId: "c4",
    courseName: "Habilidades para el Emprendimiento",
    courseColor: "bg-green-500",
    dueDate: "2026-03-10T23:59:00",
    status: "pending",
    priority: "high",
    maxGrade: 100,
    description: "Presentar el Business Model Canvas actualizado con validación de mercado. Mínimo 15 slides.",
  },
  {
    id: "a11",
    title: "Fase 1 — Idea de Negocio",
    courseId: "c4",
    courseName: "Habilidades para el Emprendimiento",
    courseColor: "bg-green-500",
    dueDate: "2026-02-14T23:59:00",
    status: "graded",
    priority: "low",
    maxGrade: 100,
    grade: 45,
    description: "Presentación inicial de la idea de negocio.",
  },
  // Equipo Representativo Deportivo
  {
    id: "a12",
    title: "Asistencia — Práctica Semanal",
    courseId: "c5",
    courseName: "Equipo Representativo Deportivo",
    courseColor: "bg-yellow-500",
    dueDate: "2026-03-08T08:00:00",
    status: "pending",
    priority: "medium",
    maxGrade: 10,
    description: "Práctica obligatoria en cancha principal. Traer uniforme completo.",
  },
  {
    id: "a13",
    title: "Reporte de Condición Física",
    courseId: "c5",
    courseName: "Equipo Representativo Deportivo",
    courseColor: "bg-yellow-500",
    dueDate: "2026-03-31T23:59:00",
    status: "pending",
    priority: "low",
    maxGrade: 10,
    description: "Entregar reporte de progreso físico del mes. Incluir métricas de rendimiento.",
  },
];

// ─── AI Drafts ─────────────────────────────────────────────────
const AI_DRAFTS: Record<string, string> = {
  a1: `# Guía de Estudio — Examen Parcial 1 Precálculo

## Temas clave a revisar:
1. **Funciones** — dominio, rango, composición, inversas
2. **Límites** — definición épsilon-delta, límites laterales, límites al infinito
3. **Continuidad** — condiciones, tipos de discontinuidad, teorema del valor intermedio

## Tips para el examen:
- Practica con los ejercicios resueltos del capítulo 1–3
- Enfócate en los límites indeterminados (factorización, conjugado)
- Lleva calculadora científica permitida

## Fórmulas que no puedes olvidar:
\`\`\`
lim(x→a) f(x) = L  ⟺  ∀ε>0 ∃δ>0: |x-a|<δ ⟹ |f(x)-L|<ε
\`\`\``,

  a4: `# Borrador — Tarea 4: Scheduling de Procesos

## Estructura sugerida:

### Introducción (1 página)
Describir el problema del scheduling: cómo el SO decide qué proceso ejecutar.

### Implementación Round Robin
\`\`\`python
def round_robin(procesos, quantum):
    cola = deque(procesos)
    tiempo = 0
    while cola:
        proceso = cola.popleft()
        ejecucion = min(quantum, proceso.burst_restante)
        tiempo += ejecucion
        proceso.burst_restante -= ejecucion
        if proceso.burst_restante > 0:
            cola.append(proceso)
    return tiempo
\`\`\`

### Implementación SJF
- Ordenar procesos por burst time
- Calcular tiempo de espera promedio
- Comparar con Round Robin en tabla`,

  a7: `# Borrador — Práctica 3: Normalización a 3FN

## Proceso de normalización:

### 1FN (Primera Forma Normal)
- Eliminar grupos repetitivos
- Asegurar que cada columna tiene valores atómicos
- Definir clave primaria

### 2FN (Segunda Forma Normal)
- Eliminar dependencias funcionales parciales
- Cada atributo no clave debe depender de toda la clave

### 3FN (Tercera Forma Normal)
- Eliminar dependencias transitivas
- Ningún atributo no clave depende de otro no clave

## Ejemplo de justificación:
> "La tabla EMPLEADO(id, nombre, depto_id, depto_nombre) viola 3FN porque
> depto_nombre depende transitivamente de id a través de depto_id.
> Solución: crear tabla DEPARTAMENTO(id, nombre)."`,

  a10: `# Borrador — Fase 2: Business Model Canvas

## Estructura de la presentación (15 slides):

1. **Slide 1:** Portada + nombre del equipo
2. **Slides 2-3:** Resumen del modelo de negocio
3. **Slides 4-10:** 9 bloques del BMC (uno por slide)
4. **Slide 11:** Validación de mercado (entrevistas realizadas)
5. **Slide 12:** Pivots desde Fase 1
6. **Slide 13:** Métricas clave (KPIs)
7. **Slide 14:** Plan de acción próximas 4 semanas
8. **Slide 15:** Q&A

## Puntos críticos para el profesor:
- Demostrar que hablaron con al menos 10 clientes potenciales
- Incluir datos reales de mercado (no solo suposiciones)
- Mostrar cómo pivotaron desde la Fase 1`,
};

// ─── Types ─────────────────────────────────────────────────────
type FilterTab = "todas" | "pendientes" | "entregadas" | "vencidas";

// ─── Helpers ───────────────────────────────────────────────────
function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

function formatDueDate(iso: string): { label: string; color: string } {
  const due = new Date(iso);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffMs < 0) return { label: "Vencida", color: "text-red-400" };
  if (diffH < 24) return {
    label: `Hoy ${due.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`,
    color: "text-red-400",
  };
  if (diffD === 1) return { label: "Mañana", color: "text-[#D29922]" };
  if (diffD < 7) return { label: `En ${diffD} días`, color: "text-yellow-400" };
  return {
    label: due.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
    color: "text-[#8B949E]",
  };
}

const STATUS_CONFIG: Record<Assignment["status"], { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  pending:   { label: "Pendiente",  icon: Clock,         color: "text-yellow-400" },
  submitted: { label: "Entregada",  icon: CheckCircle2,  color: "text-green-400" },
  graded:    { label: "Calificada", icon: CheckCircle2,  color: "text-blue-400" },
  late:      { label: "Tardía",     icon: AlertCircle,   color: "text-red-400" },
  missing:   { label: "Faltante",   icon: AlertCircle,   color: "text-red-500" },
};

const PRIORITY_CONFIG: Record<Assignment["priority"], { label: string; cls: string }> = {
  urgent: { label: "Urgente", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
  high:   { label: "Alta",    cls: "text-[#818CF8] bg-[#6366F1]/10 border-[#6366F1]/20" },
  medium: { label: "Media",   cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  low:    { label: "Normal",  cls: "text-[#8B949E] bg-[#1C2128] border-[#30363D]" },
};

// ─── AI Draft Modal ────────────────────────────────────────────
function AIDraftModal({
  assignment,
  onClose,
}: {
  assignment: Assignment;
  onClose: () => void;
}) {
  const draft = AI_DRAFTS[assignment.id] ?? `# Borrador IA — ${assignment.title}\n\nEsta es una ayuda generada por Jarvis para orientarte en la tarea.\n\n## Pasos sugeridos:\n1. Lee el enunciado completo\n2. Identifica los requisitos principales\n3. Organiza tu tiempo para completarla antes de ${new Date(assignment.dueDate).toLocaleDateString("es-MX")}\n\n## Descripción:\n${assignment.description ?? "Sin descripción disponible."}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0D1117]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#818CF8]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#E6EDF3]">Borrador IA — Jarvis</p>
              <p className="text-xs text-[#8B949E] truncate max-w-xs">{assignment.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="prose prose-sm prose-invert max-w-none">
            {draft.split("\n").map((line, i) => {
              if (line.startsWith("## "))
                return <h2 key={i} className="text-sm font-semibold text-[#818CF8] mt-4 mb-2">{line.replace("## ", "")}</h2>;
              if (line.startsWith("# "))
                return <h1 key={i} className="text-base font-bold text-[#E6EDF3] mb-3">{line.replace("# ", "")}</h1>;
              if (line.startsWith("### "))
                return <h3 key={i} className="text-sm font-semibold text-[#E6EDF3] mt-3 mb-1">{line.replace("### ", "")}</h3>;
              if (line.startsWith("- "))
                return <p key={i} className="text-sm text-[#8B949E] ml-4">• {line.replace("- ", "")}</p>;
              if (line.startsWith("```"))
                return null;
              if (line.trim() === "")
                return <div key={i} className="h-2" />;
              return <p key={i} className="text-sm text-[#8B949E] leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#30363D] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
          <p className="text-xs text-[#6E7681]">Generado por Jarvis · Solo orientativo, verifica con tu profesor</p>
        </div>
      </div>
    </div>
  );
}

// ─── Assignment Row ────────────────────────────────────────────
function AssignmentRow({
  assignment,
  onViewDraft,
}: {
  assignment: Assignment;
  onViewDraft: (a: Assignment) => void;
}) {
  const { label: dueLabel, color: dueColor } = formatDueDate(assignment.dueDate);
  const statusConfig = STATUS_CONFIG[assignment.status];
  const priorityConfig = PRIORITY_CONFIG[assignment.priority];
  const StatusIcon = statusConfig.icon;
  const overdue = isOverdue(assignment.dueDate) && assignment.status === "pending";

  return (
    <div className={`
      flex items-center gap-4 px-4 py-3.5 hover:bg-[#30363D]/40 transition-colors border-b border-[#30363D]/60 last:border-0
      ${overdue ? "bg-red-500/5" : ""}
    `}>
      {/* Status icon */}
      <StatusIcon className={`w-4 h-4 flex-shrink-0 ${overdue ? "text-red-400" : statusConfig.color}`} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#E6EDF3] truncate">{assignment.title}</p>
        {assignment.description && (
          <p className="text-xs text-[#6E7681] truncate mt-0.5">{assignment.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${priorityConfig.cls}`}>
            {priorityConfig.label}
          </span>
          <span className={`text-xs font-medium ${overdue ? "text-red-400" : dueColor}`}>
            {dueLabel}
          </span>
          {assignment.grade !== undefined && (
            <span className="text-xs text-[#8B949E]">
              Calificación: <span className="text-[#E6EDF3] font-medium">{assignment.grade}/{assignment.maxGrade}</span>
            </span>
          )}
        </div>
      </div>

      {/* AI Draft Button */}
      {(assignment.status === "pending" || assignment.status === "late") && (
        <button
          onClick={() => onViewDraft(assignment)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#818CF8] text-xs font-medium hover:bg-[#6366F1]/20 transition-colors flex-shrink-0"
        >
          <Sparkles className="w-3 h-3" />
          <span className="hidden sm:inline">Ver borrador IA</span>
          <span className="sm:hidden">IA</span>
        </button>
      )}
    </div>
  );
}

// ─── Course Group ──────────────────────────────────────────────
function CourseGroup({
  courseId,
  courseName,
  courseColor,
  assignments,
  onViewDraft,
}: {
  courseId: string;
  courseName: string;
  courseColor: string;
  assignments: Assignment[];
  onViewDraft: (a: Assignment) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pendingCount = assignments.filter((a) => a.status === "pending").length;

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
      {/* Course Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-[#30363D] hover:bg-[#30363D]/40 transition-colors"
      >
        <div className={`w-3 h-3 rounded-full ${courseColor} flex-shrink-0`} />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <BookOpen className="w-3.5 h-3.5 text-[#8B949E]" />
          <span className="text-sm font-semibold text-[#E6EDF3]">{courseName}</span>
          {pendingCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#6366F1]/15 text-[#818CF8] font-medium">
              {pendingCount} pendiente{pendingCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span className="text-xs text-[#6E7681]">{assignments.length} tarea{assignments.length !== 1 ? "s" : ""}</span>
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-[#6E7681]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6E7681]" />
        )}
      </button>

      {/* Assignments */}
      {!collapsed && (
        <div>
          {assignments.map((a) => (
            <AssignmentRow key={a.id} assignment={a} onViewDraft={onViewDraft} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function TareasPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("todas");
  const [draftAssignment, setDraftAssignment] = useState<Assignment | null>(null);

  // Filter assignments
  const filtered = MOCK_ASSIGNMENTS.filter((a) => {
    if (activeFilter === "pendientes") return a.status === "pending";
    if (activeFilter === "entregadas") return a.status === "submitted" || a.status === "graded";
    if (activeFilter === "vencidas") return isOverdue(a.dueDate) && a.status === "pending";
    return true;
  });

  // Group by course
  const courses = Array.from(new Set(filtered.map((a) => a.courseId))).map((courseId) => {
    const first = filtered.find((a) => a.courseId === courseId)!;
    return {
      courseId,
      courseName: first.courseName,
      courseColor: first.courseColor ?? "bg-[#8B949E]",
      assignments: filtered.filter((a) => a.courseId === courseId),
    };
  });

  const FILTERS: { key: FilterTab; label: string; count: number }[] = [
    { key: "todas",      label: "Todas",      count: MOCK_ASSIGNMENTS.length },
    { key: "pendientes", label: "Pendientes", count: MOCK_ASSIGNMENTS.filter((a) => a.status === "pending").length },
    { key: "entregadas", label: "Entregadas", count: MOCK_ASSIGNMENTS.filter((a) => a.status === "submitted" || a.status === "graded").length },
    { key: "vencidas",   label: "Vencidas",   count: MOCK_ASSIGNMENTS.filter((a) => isOverdue(a.dueDate) && a.status === "pending").length },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#E6EDF3]">Tareas</h2>
            <p className="text-sm text-[#8B949E] mt-0.5">
              {MOCK_ASSIGNMENTS.filter((a) => a.status === "pending").length} pendientes · {MOCK_ASSIGNMENTS.length} total
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-[#818CF8]" />
          </div>
        </section>

        {/* Filters */}
        <div className="flex items-center gap-1 p-1 bg-[#161B22] border border-[#30363D] rounded-xl w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                ${activeFilter === f.key
                  ? "bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/20"
                  : "text-[#8B949E] hover:text-[#E6EDF3]"
                }
              `}
            >
              {f.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === f.key ? "bg-[#6366F1]/20 text-[#818CF8]" : "bg-[#30363D] text-[#8B949E]"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Courses grouped */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <CheckCircle2 className="w-10 h-10 text-green-500/50" />
            <p className="text-sm text-[#8B949E]">No hay tareas en esta categoría 🎉</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((c) => (
              <CourseGroup
                key={c.courseId}
                {...c}
                onViewDraft={setDraftAssignment}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Draft Modal */}
      {draftAssignment && (
        <AIDraftModal
          assignment={draftAssignment}
          onClose={() => setDraftAssignment(null)}
        />
      )}
    </>
  );
}
