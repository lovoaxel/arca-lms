import {
  ClipboardList,
  Clock,
  TrendingUp,
  BookOpen,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Flame,
} from "lucide-react";
import Link from "next/link";
import type { Assignment, CalendarEvent } from "@/types";

// ─── Mock Data ─────────────────────────────────────────────────

const MOCK_URGENT_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    title: "Práctica 3 — Normalización de Bases de Datos",
    courseId: "c3",
    courseName: "Bases de Datos",
    courseColor: "bg-blue-500",
    dueDate: "2026-03-06T23:59:00",
    status: "pending",
    priority: "urgent",
    maxGrade: 100,
    description: "Normalizar el esquema ER hasta 3FN.",
  },
  {
    id: "a2",
    title: "Examen Parcial 1 — Precálculo",
    courseId: "c1",
    courseName: "Precálculo",
    courseColor: "bg-purple-500",
    dueDate: "2026-03-07T10:00:00",
    status: "pending",
    priority: "urgent",
    maxGrade: 100,
  },
  {
    id: "a3",
    title: "Proyecto de Emprendimiento — Fase 2",
    courseId: "c4",
    courseName: "Habilidades para el Emprendimiento",
    courseColor: "bg-green-500",
    dueDate: "2026-03-10T23:59:00",
    status: "pending",
    priority: "high",
    maxGrade: 100,
    description: "Presentar canvas de negocio actualizado.",
  },
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
  },
];

const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "e1",
    title: "Examen Parcial — Precálculo",
    courseId: "c1",
    courseName: "Precálculo",
    courseColor: "bg-purple-500",
    date: "2026-03-07",
    startTime: "10:00",
    endTime: "12:00",
    type: "exam",
    isAllDay: false,
    location: "Salón B-204",
  },
  {
    id: "e2",
    title: "Entrega BD — Práctica 3",
    courseId: "c3",
    courseName: "Bases de Datos",
    courseColor: "bg-blue-500",
    date: "2026-03-06",
    startTime: "23:59",
    endTime: "23:59",
    type: "assignment",
    isAllDay: false,
  },
  {
    id: "e3",
    title: "Práctica de Fútbol — Equipo Rep.",
    courseId: "c5",
    courseName: "Equipo Representativo Deportivo",
    courseColor: "bg-yellow-500",
    date: "2026-03-08",
    startTime: "08:00",
    endTime: "10:00",
    type: "class",
    isAllDay: false,
    location: "Cancha Principal",
  },
  {
    id: "e4",
    title: "Entrega Proyecto Emprendimiento",
    courseId: "c4",
    courseName: "Habilidades para el Emprendimiento",
    courseColor: "bg-green-500",
    date: "2026-03-10",
    startTime: "23:59",
    endTime: "23:59",
    type: "assignment",
    isAllDay: false,
  },
];

// ─── Helpers ───────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Buen día";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function formatDueDate(iso: string): { label: string; isUrgent: boolean } {
  const due = new Date(iso);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffMs < 0) return { label: "Vencida", isUrgent: true };
  if (diffH < 24) return { label: `Hoy ${due.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`, isUrgent: true };
  if (diffD === 1) return { label: "Mañana", isUrgent: true };
  if (diffD < 7) return { label: `En ${diffD} días`, isUrgent: false };
  return { label: due.toLocaleDateString("es-MX", { day: "numeric", month: "short" }), isUrgent: false };
}

function formatEventDate(dateStr: string, startTime?: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let label = "";
  if (date.getTime() === today.getTime()) label = "Hoy";
  else if (date.getTime() === tomorrow.getTime()) label = "Mañana";
  else label = date.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });

  if (startTime) label += ` · ${startTime}`;
  return label;
}

const EVENT_TYPE_LABELS: Record<CalendarEvent["type"], string> = {
  assignment: "Entrega",
  exam:       "Examen",
  class:      "Clase",
  reminder:   "Recordatorio",
  holiday:    "Festivo",
};

const PRIORITY_STYLES: Record<Assignment["priority"], string> = {
  urgent: "text-red-400 bg-red-500/10 border-red-500/20",
  high:   "text-orange-400 bg-orange-500/10 border-orange-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low:    "text-slate-400 bg-slate-700/40 border-slate-700",
};

const PRIORITY_LABELS: Record<Assignment["priority"], string> = {
  urgent: "Urgente",
  high:   "Alta",
  medium: "Media",
  low:    "Baja",
};

// ─── Stat Card ─────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accentClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  accentClass: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-4 hover:border-slate-700 transition-colors">
      <div className={`w-10 h-10 rounded-lg ${accentClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100 leading-tight">{value}</p>
        <p className="text-sm font-medium text-slate-400 leading-tight mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const greeting = getGreeting();

  const stats = {
    pendingAssignments: MOCK_URGENT_ASSIGNMENTS.filter((a) => a.status === "pending").length,
    upcomingDeadlines: MOCK_URGENT_ASSIGNMENTS.filter((a) => {
      const diff = new Date(a.dueDate).getTime() - Date.now();
      return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
    }).length,
    overallAverage: 8.6,
    activeCourses: 5,
  };

  return (
    <div className="space-y-8">
      {/* ── Saludo ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">
              {new Date().toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h2 className="text-2xl font-bold text-slate-100">
              {greeting},{" "}
              <span className="text-orange-400">Axel</span> 👋
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Tienes{" "}
              <span className="text-orange-400 font-semibold">
                {stats.pendingAssignments} tareas pendientes
              </span>{" "}
              esta semana.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats cards ────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={ClipboardList}
          label="Tareas pendientes"
          value={stats.pendingAssignments}
          sub="Esta semana"
          accentClass="bg-orange-500/15 text-orange-400"
        />
        <StatCard
          icon={Clock}
          label="Próximas entregas"
          value={stats.upcomingDeadlines}
          sub="En los próximos 7 días"
          accentClass="bg-red-500/15 text-red-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Promedio general"
          value={stats.overallAverage.toFixed(1)}
          sub="Calificación actual"
          accentClass="bg-green-500/15 text-green-400"
        />
        <StatCard
          icon={BookOpen}
          label="Cursos activos"
          value={stats.activeCourses}
          sub="Este semestre"
          accentClass="bg-blue-500/15 text-blue-400"
        />
      </section>

      {/* ── Grid: Tareas + Eventos ──────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas urgentes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-slate-200">Tareas urgentes</h3>
            </div>
            <Link
              href="/tareas"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-400 transition-colors"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <ul className="divide-y divide-slate-800/60">
            {MOCK_URGENT_ASSIGNMENTS.map((assignment) => {
              const { label: dueLabel, isUrgent } = formatDueDate(assignment.dueDate);
              return (
                <li key={assignment.id} className="px-5 py-3.5 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Indicador de prioridad */}
                    <div className="mt-0.5 flex-shrink-0">
                      {assignment.status === "submitted" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className={`w-4 h-4 ${assignment.priority === "urgent" ? "text-red-400" : assignment.priority === "high" ? "text-orange-400" : "text-yellow-400"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {/* Dot de curso */}
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${assignment.courseColor}`} />
                          <span className="text-xs text-slate-500">{assignment.courseName}</span>
                        </div>
                        {/* Prioridad badge */}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PRIORITY_STYLES[assignment.priority]}`}>
                          {PRIORITY_LABELS[assignment.priority]}
                        </span>
                      </div>
                    </div>
                    {/* Fecha */}
                    <div className="flex-shrink-0 text-right">
                      <span className={`text-xs font-medium ${isUrgent ? "text-red-400" : "text-slate-500"}`}>
                        {dueLabel}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Próximos eventos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-slate-200">Próximos eventos</h3>
            </div>
            <Link
              href="/calendario"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-400 transition-colors"
            >
              Ver calendario <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <ul className="divide-y divide-slate-800/60">
            {MOCK_CALENDAR_EVENTS.map((event) => {
              const dateLabel = formatEventDate(event.date, event.startTime);
              return (
                <li key={event.id} className="px-5 py-3.5 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Barra lateral de color */}
                    <div className={`w-1 h-10 rounded-full ${event.courseColor ?? "bg-slate-600"} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{event.courseName}</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                          {EVENT_TYPE_LABELS[event.type]}
                        </span>
                      </div>
                      {event.location && (
                        <p className="text-xs text-slate-600 mt-0.5 truncate">{event.location}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-xs text-slate-500">{dateLabel}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
