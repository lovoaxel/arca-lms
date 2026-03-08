"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle,
  Zap,
  BarChart3,
  Activity,
  Target,
  GraduationCap,
  Trophy,
  Info,
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

// Calificaciones bajas
const LOW_GRADE_COURSES = [
  { name: "Precálculo",                          grade: 0,   color: "bg-purple-500" },
  { name: "Habilidades para el Emprendimiento",  grade: 4.2, color: "bg-green-500" },
];

// ─── Helpers ───────────────────────────────────────────────────

function getGreeting(hour: number): string {
  if (hour >= 6 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

// ─── Semester Progress ──────────────────────────────────────────
const SEMESTER_START = new Date("2026-01-20T00:00:00");
const SEMESTER_END = new Date("2026-05-31T23:59:59");

function getSemesterProgress(): { percentage: number; daysLeft: number; totalDays: number; daysPassed: number } {
  const now = new Date();
  const totalMs = SEMESTER_END.getTime() - SEMESTER_START.getTime();
  const elapsedMs = now.getTime() - SEMESTER_START.getTime();
  const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
  const daysPassed = Math.max(0, Math.ceil(elapsedMs / (1000 * 60 * 60 * 24)));
  const daysLeft = Math.max(0, totalDays - daysPassed);
  const percentage = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
  return { percentage, daysLeft, totalDays, daysPassed };
}

// ─── Contextual Motivation ──────────────────────────────────────
function getMotivationMessage(promedio: number): { message: string; type: "warning" | "success" | "neutral" } {
  if (promedio < 7) {
    return {
      message: "Tu promedio está por debajo de 7. Es momento de enfocarte y buscar ayuda con tus profesores o compañeros. ¡Aún puedes mejorar!",
      type: "warning",
    };
  }
  if (promedio > 8) {
    return {
      message: "¡Excelente trabajo! Tu promedio es sobresaliente. Sigue así y mantén el ritmo.",
      type: "success",
    };
  }
  return {
    message: "Vas por buen camino. Con un poco más de esfuerzo puedes alcanzar un promedio aún mejor.",
    type: "neutral",
  };
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

// Check if assignment is within 48 hours
function isWithin48h(iso: string): boolean {
  const due = new Date(iso);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  return diffMs > 0 && diffMs < 48 * 60 * 60 * 1000;
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
  high:   "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low:    "text-[#8B949E] bg-[#30363D]/40 border-[#30363D]",
};

const PRIORITY_LABELS: Record<Assignment["priority"], string> = {
  urgent: "Urgente",
  high:   "Alta",
  medium: "Media",
  low:    "Baja",
};

// ─── Weekly Load Map ───────────────────────────────────────────
interface WeekBucket {
  label: string;
  sublabel: string;
  total: number;
  urgentCount: number;
  highCount: number;
  isCurrentWeek: boolean;
}

function buildWeeklyLoad(assignments: Assignment[]): WeekBucket[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 4 }, (_, i) => {
    const start = new Date(today);
    start.setDate(today.getDate() + i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const weekAssignments = assignments.filter((a) => {
      const due = new Date(a.dueDate);
      return due >= start && due <= end && a.status !== "submitted";
    });

    const fmt = (d: Date) =>
      d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });

    return {
      label:
        i === 0
          ? "Esta semana"
          : i === 1
          ? "Próxima semana"
          : `En ${i} semanas`,
      sublabel: `${fmt(start)} – ${fmt(end)}`,
      total: weekAssignments.length,
      urgentCount: weekAssignments.filter((a) => a.priority === "urgent").length,
      highCount: weekAssignments.filter((a) => a.priority === "high").length,
      isCurrentWeek: i === 0,
    };
  });
}

// ─── Focus del Día ─────────────────────────────────────────────
interface FocusItem {
  title: string;
  courseName: string;
  courseColor: string;
  dueDate: string;
  type: "exam" | "assignment" | "event";
  location?: string;
  tip: string;
}

function getTodaysFocus(assignments: Assignment[], events: CalendarEvent[]): FocusItem | null {
  const now = new Date();

  // First: any exam today
  const examToday = events.find((e) => {
    return e.type === "exam" && e.date === now.toISOString().split("T")[0];
  });
  if (examToday) {
    return {
      title: examToday.title,
      courseName: examToday.courseName ?? "Curso",
      courseColor: examToday.courseColor ?? "bg-[#8B949E]",
      dueDate: examToday.startTime ?? "Hoy",
      type: "exam",
      location: examToday.location,
      tip: "Revisa tus apuntes, descansa bien y llega 10 min antes.",
    };
  }

  // Second: most urgent assignment
  const pending = assignments
    .filter((a) => a.status !== "submitted")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (pending.length === 0) return null;
  const top = pending[0];

  const diffH = Math.floor((new Date(top.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60));
  const tipMap: Record<string, string> = {
    urgent: `Vence en menos de 24h. Prioridad máxima — empieza ahora.`,
    high: `Entrega próxima. Planifica al menos 2h hoy para avanzar.`,
    medium: `Tienes algo de tiempo, pero empieza hoy para evitar la prisa.`,
    low: `Sin presión inmediata, pero un avance temprano siempre ayuda.`,
  };

  return {
    title: top.title,
    courseName: top.courseName,
    courseColor: top.courseColor ?? "bg-[#8B949E]",
    dueDate: diffH <= 0 ? "Vencida" : diffH < 24 ? `Hoy · ${new Date(top.dueDate).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}` : `En ${Math.floor(diffH / 24)} día${Math.floor(diffH / 24) !== 1 ? "s" : ""}`,
    type: "assignment",
    tip: tipMap[top.priority] ?? "Trabaja con foco y sin distracciones.",
  };
}

function FocusDelDia({ assignments, events }: { assignments: Assignment[]; events: CalendarEvent[] }) {
  const focus = getTodaysFocus(assignments, events);
  if (!focus) return null;

  const isExam = focus.type === "exam";

  return (
    <div className={`rounded-xl border p-4 ${isExam ? "bg-red-500/5 border-red-500/25" : "bg-indigo-500/5 border-indigo-500/20"}`}>
      <div className="flex items-center gap-2 mb-3">
        <Target className={`w-4 h-4 ${isExam ? "text-red-400" : "text-indigo-400"}`} />
        <h3 className={`text-sm font-semibold ${isExam ? "text-red-400" : "text-indigo-400"}`}>
          Focus del Día
        </h3>
        <span className="text-xs text-[#6E7681] ml-auto">{isExam ? "📋 Examen" : "📌 Tarea prioritaria"}</span>
      </div>

      <div className="flex items-start gap-3">
        <div className={`w-1 h-full min-h-[48px] rounded-full ${focus.courseColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#E6EDF3] leading-tight">{focus.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-[#8B949E]">{focus.courseName}</span>
            {focus.location && (
              <>
                <span className="text-[#30363D]">·</span>
                <span className="text-xs text-[#6E7681]">{focus.location}</span>
              </>
            )}
            <span className="text-[#30363D]">·</span>
            <span className={`text-xs font-semibold ${isExam ? "text-red-400" : "text-indigo-400"}`}>
              {focus.dueDate}
            </span>
          </div>
          <p className="text-xs text-[#8B949E] mt-2 italic">{focus.tip}</p>
        </div>
      </div>
    </div>
  );
}

function WeeklyLoadMap({ assignments }: { assignments: Assignment[] }) {
  const weeks = buildWeeklyLoad(assignments);
  const maxTotal = Math.max(...weeks.map((w) => w.total), 1);

  const getLoadStyle = (total: number, max: number) => {
    if (total === 0)
      return {
        bar: "bg-[#30363D]",
        badge: "text-[#6E7681]",
        card: "border-[#30363D]",
        label: "Libre",
        labelColor: "text-[#6E7681]",
      };
    const ratio = total / max;
    if (ratio > 0.6)
      return {
        bar: "bg-red-500",
        badge: "text-red-400",
        card: "border-red-500/20 bg-red-500/5",
        label: "Alta",
        labelColor: "text-red-400",
      };
    if (ratio > 0.3)
      return {
        bar: "bg-yellow-500",
        badge: "text-yellow-400",
        card: "border-yellow-500/20 bg-yellow-500/5",
        label: "Media",
        labelColor: "text-yellow-400",
      };
    return {
      bar: "bg-green-500",
      badge: "text-green-400",
      card: "border-green-500/20 bg-green-500/5",
      label: "Baja",
      labelColor: "text-green-400",
    };
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-[#E6EDF3]">Carga académica</h3>
          <span className="text-xs text-[#6E7681]">— próximas 4 semanas</span>
        </div>
      </div>

      {/* Week columns */}
      <div className="p-5 grid grid-cols-4 gap-3">
        {weeks.map((week, i) => {
          const style = getLoadStyle(week.total, maxTotal);
          const barHeight = week.total === 0 ? 4 : Math.max(Math.round((week.total / maxTotal) * 80), 8);

          return (
            <div
              key={i}
              className={`border rounded-xl p-3.5 flex flex-col gap-2 transition-all ${style.card} ${week.isCurrentWeek ? "ring-1 ring-indigo-500/30" : ""}`}
            >
              {/* Week label */}
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${week.isCurrentWeek ? "text-indigo-400" : "text-[#8B949E]"}`}>
                  {week.label}
                </p>
                <p className="text-[9px] text-[#30363D] leading-tight mt-0.5">{week.sublabel}</p>
              </div>

              {/* Bar */}
              <div className="flex items-end justify-center h-[80px]">
                <div
                  className={`w-full rounded-t-md ${style.bar} transition-all duration-700`}
                  style={{ height: `${barHeight}px` }}
                />
              </div>

              {/* Stats */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-black ${style.badge}`}>{week.total}</span>
                  <span className={`text-[10px] font-semibold ${style.labelColor}`}>{style.label}</span>
                </div>
                <p className="text-[10px] text-[#6E7681]">
                  {week.total === 0
                    ? "Sin entregas"
                    : week.total === 1
                    ? "1 entrega"
                    : `${week.total} entregas`}
                </p>
                {week.urgentCount > 0 && (
                  <p className="text-[10px] text-red-400 font-medium">{week.urgentCount} urgente{week.urgentCount > 1 ? "s" : ""}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 pb-3">
        <p className="text-[10px] text-[#30363D]">
          Basado en {assignments.filter((a) => a.status !== "submitted").length} tareas pendientes · Las barras son proporcionales entre sí
        </p>
      </div>
    </div>
  );
}

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
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-start gap-4 hover:border-[#30363D] transition-colors">
      <div className={`w-10 h-10 rounded-lg ${accentClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#E6EDF3] leading-tight">{value}</p>
        <p className="text-sm font-medium text-[#8B949E] leading-tight mt-0.5">{label}</p>
        {sub && <p className="text-xs text-[#6E7681] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const greeting = getGreeting(currentHour);

  // Urgentes (próximas 48h)
  const urgent48h = MOCK_URGENT_ASSIGNMENTS.filter((a) => isWithin48h(a.dueDate));

  const stats = {
    pendingAssignments: MOCK_URGENT_ASSIGNMENTS.filter((a) => a.status === "pending").length,
    upcomingDeadlines: MOCK_URGENT_ASSIGNMENTS.filter((a) => {
      const diff = new Date(a.dueDate).getTime() - Date.now();
      return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
    }).length,
    overallAverage: 6.1,
    activeCourses: 5,
  };

  const semesterProgress = getSemesterProgress();
  const motivation = getMotivationMessage(stats.overallAverage);

  return (
    <div className="space-y-8">
      {/* ── Saludo ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-[#8B949E] mb-1">
              {new Date().toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h2 className="text-2xl font-bold text-[#E6EDF3]">
              {greeting},{" "}
              <span className="text-indigo-400">Axel</span> 👋
            </h2>
            <p className="text-sm text-[#8B949E] mt-1">
              Tienes{" "}
              <span className="text-indigo-400 font-semibold">
                {stats.pendingAssignments} tareas pendientes
              </span>{" "}
              esta semana.
            </p>
          </div>
        </div>
      </section>

      {/* ── Progreso del Semestre ──────────────────────────── */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-[#E6EDF3]">Progreso del semestre</h3>
          <span className="text-xs text-[#6E7681] ml-auto">
            Ene 20 – May 31, 2026
          </span>
        </div>
        <div className="w-full h-3 bg-[#30363D] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
            style={{ width: `${semesterProgress.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[#8B949E]">
            {semesterProgress.daysPassed} de {semesterProgress.totalDays} días transcurridos
          </span>
          <span className="text-sm font-bold text-indigo-400">
            {semesterProgress.percentage.toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-[#6E7681] mt-1">
          {semesterProgress.daysLeft > 0
            ? `Faltan ${semesterProgress.daysLeft} días para terminar el semestre.`
            : "El semestre ha finalizado."}
        </p>
      </section>

      {/* ── Motivación contextual ─────────────────────────── */}
      <section>
        <div
          className={`rounded-xl border p-4 flex items-start gap-3 ${
            motivation.type === "warning"
              ? "bg-red-500/5 border-red-500/25"
              : motivation.type === "success"
              ? "bg-green-500/5 border-green-500/25"
              : "bg-blue-500/5 border-blue-500/25"
          }`}
        >
          {motivation.type === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          ) : motivation.type === "success" ? (
            <Trophy className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p
              className={`text-sm font-semibold ${
                motivation.type === "warning"
                  ? "text-red-400"
                  : motivation.type === "success"
                  ? "text-green-400"
                  : "text-blue-400"
              }`}
            >
              {motivation.type === "warning"
                ? "Atención con tu promedio"
                : motivation.type === "success"
                ? "¡Felicidades!"
                : "Sigue adelante"}
            </p>
            <p className="text-xs text-[#8B949E] mt-1">{motivation.message}</p>
            <p className="text-xs text-[#6E7681] mt-1">
              Promedio actual: <span className="font-semibold text-[#E6EDF3]">{stats.overallAverage.toFixed(1)}</span>/10
            </p>
          </div>
        </div>
      </section>

      {/* ── Focus del Día ───────────────────────────────────── */}
      <FocusDelDia assignments={MOCK_URGENT_ASSIGNMENTS} events={MOCK_CALENDAR_EVENTS} />

      {/* ── Urgente Alert (48h) ─────────────────────────────── */}
      {urgent48h.length > 0 && (
        <section>
          <div className="bg-red-500/5 border border-red-500/25 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-semibold text-red-400">
                ¡Atención! {urgent48h.length} entrega{urgent48h.length > 1 ? "s" : ""} en las próximas 48 horas
              </h3>
            </div>
            <div className="space-y-2">
              {urgent48h.map((a) => {
                const { label } = formatDueDate(a.dueDate);
                return (
                  <div key={a.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-red-500/10 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${a.courseColor} flex-shrink-0`} />
                      <span className="text-sm text-[#E6EDF3] truncate">{a.title}</span>
                      <span className="text-xs text-[#6E7681] hidden sm:inline">— {a.courseName}</span>
                    </div>
                    <span className="text-xs font-semibold text-red-400 flex-shrink-0">{label}</span>
                  </div>
                );
              })}
            </div>
            <Link
              href="/tareas"
              className="mt-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Ver todas las tareas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Low Grade Alert ─────────────────────────────────── */}
      {LOW_GRADE_COURSES.length > 0 && (
        <section>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-semibold text-yellow-400">
                Calificaciones bajas en {LOW_GRADE_COURSES.length} materia{LOW_GRADE_COURSES.length > 1 ? "s" : ""}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {LOW_GRADE_COURSES.map((c) => (
                <div key={c.name} className="flex items-center gap-2 px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${c.color}`} />
                  <span className="text-xs text-[#E6EDF3]">{c.name}</span>
                  <span className={`text-xs font-bold ${c.grade < 6 ? "text-red-400" : "text-yellow-400"}`}>
                    {c.grade.toFixed(1)}/10
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/calificaciones"
              className="mt-3 flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Ver calificaciones completas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Stats cards ────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={ClipboardList}
          label="Tareas pendientes"
          value={stats.pendingAssignments}
          sub="Esta semana"
          accentClass="bg-indigo-500/15 text-indigo-400"
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
          accentClass={stats.overallAverage < 6 ? "bg-red-500/15 text-red-400" : stats.overallAverage < 8 ? "bg-yellow-500/15 text-yellow-400" : "bg-green-500/15 text-green-400"}
        />
        <StatCard
          icon={BookOpen}
          label="Cursos activos"
          value={stats.activeCourses}
          sub="Este semestre"
          accentClass="bg-blue-500/15 text-blue-400"
        />
      </section>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <section>
        <p className="text-xs font-semibold text-[#6E7681] uppercase tracking-widest mb-3">Acciones rápidas</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/tareas"
            className="flex items-center gap-3 p-4 bg-[#161B22] border border-[#30363D] rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
              <ClipboardList className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#E6EDF3]">Ver tareas</p>
              <p className="text-xs text-[#6E7681]">{stats.pendingAssignments} pendientes</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#30363D] ml-auto group-hover:text-indigo-400 transition-colors" />
          </Link>

          <Link
            href="/calendario"
            className="flex items-center gap-3 p-4 bg-[#161B22] border border-[#30363D] rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <CalendarDays className="w-4.5 h-4.5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#E6EDF3]">Ver calendario</p>
              <p className="text-xs text-[#6E7681]">Entregas del semestre</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#30363D] ml-auto group-hover:text-blue-400 transition-colors" />
          </Link>

          <Link
            href="/calificaciones"
            className="flex items-center gap-3 p-4 bg-[#161B22] border border-[#30363D] rounded-xl hover:border-green-500/30 hover:bg-green-500/5 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
              <BarChart3 className="w-4.5 h-4.5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#E6EDF3]">Calificaciones</p>
              <p className="text-xs text-[#6E7681]">2 materias en alerta</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#30363D] ml-auto group-hover:text-green-400 transition-colors" />
          </Link>
        </div>
      </section>

      {/* ── Carga Semanal ───────────────────────────────────── */}
      <WeeklyLoadMap assignments={MOCK_URGENT_ASSIGNMENTS} />

      {/* ── Grid: Tareas + Eventos ──────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas urgentes */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-[#E6EDF3]">Tareas urgentes</h3>
            </div>
            <Link
              href="/tareas"
              className="flex items-center gap-1 text-xs text-[#8B949E] hover:text-indigo-400 transition-colors"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <ul className="divide-y divide-[#30363D]/60">
            {MOCK_URGENT_ASSIGNMENTS.map((assignment) => {
              const { label: dueLabel, isUrgent } = formatDueDate(assignment.dueDate);
              return (
                <li key={assignment.id} className="px-5 py-3.5 hover:bg-[#30363D]/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {assignment.status === "submitted" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className={`w-4 h-4 ${assignment.priority === "urgent" ? "text-red-400" : assignment.priority === "high" ? "text-indigo-400" : "text-yellow-400"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E6EDF3] truncate">
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${assignment.courseColor}`} />
                          <span className="text-xs text-[#8B949E]">{assignment.courseName}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PRIORITY_STYLES[assignment.priority]}`}>
                          {PRIORITY_LABELS[assignment.priority]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className={`text-xs font-medium ${isUrgent ? "text-red-400" : "text-[#8B949E]"}`}>
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
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-[#E6EDF3]">Próximos eventos</h3>
            </div>
            <Link
              href="/calendario"
              className="flex items-center gap-1 text-xs text-[#8B949E] hover:text-indigo-400 transition-colors"
            >
              Ver calendario <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <ul className="divide-y divide-[#30363D]/60">
            {MOCK_CALENDAR_EVENTS.map((event) => {
              const dateLabel = formatEventDate(event.date, event.startTime);
              return (
                <li key={event.id} className="px-5 py-3.5 hover:bg-[#30363D]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 rounded-full ${event.courseColor ?? "bg-[#6E7681]"} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E6EDF3] truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#8B949E]">{event.courseName}</span>
                        <span className="text-[#30363D]">·</span>
                        <span className="text-[10px] font-medium text-[#6E7681] uppercase tracking-wide">
                          {EVENT_TYPE_LABELS[event.type]}
                        </span>
                      </div>
                      {event.location && (
                        <p className="text-xs text-[#6E7681] mt-0.5 truncate">{event.location}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-xs text-[#8B949E]">{dateLabel}</span>
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
