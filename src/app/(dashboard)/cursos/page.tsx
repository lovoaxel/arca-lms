import {
  BookOpen,
  Clock,
  TrendingUp,
  ChevronRight,
  Users,
  Award,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types";

// ─── Mock Data — Materias del señor Lovo ──────────────────────
const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    name: "Precálculo",
    shortName: "PRECAL",
    code: "MAT-110",
    professor: "Dr. Ramírez García",
    credits: 6,
    status: "active",
    progress: 42,
    color: "from-purple-600 to-purple-800",
    currentGrade: 8.2,
    description: "Fundamentos matemáticos: álgebra, funciones, trigonometría y límites.",
    nextDeadline: {
      id: "a2",
      title: "Examen Parcial 1",
      courseId: "c1",
      courseName: "Precálculo",
      dueDate: "2026-03-07T10:00:00",
      status: "pending",
      priority: "urgent",
      maxGrade: 100,
    },
  },
  {
    id: "c2",
    name: "Sistemas Operativos",
    shortName: "SO",
    code: "ING-230",
    professor: "Mtra. López Hernández",
    credits: 6,
    status: "active",
    progress: 38,
    color: "from-cyan-600 to-cyan-800",
    currentGrade: 9.1,
    description: "Gestión de procesos, memoria, sistemas de archivos y concurrencia.",
    nextDeadline: {
      id: "a4",
      title: "Tarea 4 — Scheduling",
      courseId: "c2",
      courseName: "Sistemas Operativos",
      dueDate: "2026-03-11T23:59:00",
      status: "pending",
      priority: "medium",
      maxGrade: 100,
    },
  },
  {
    id: "c3",
    name: "Bases de Datos",
    shortName: "BD",
    code: "ING-240",
    professor: "Ing. Martínez Torres",
    credits: 6,
    status: "active",
    progress: 55,
    color: "from-blue-600 to-blue-800",
    currentGrade: 8.8,
    description: "Diseño relacional, SQL avanzado, normalización e integridad de datos.",
    nextDeadline: {
      id: "a1",
      title: "Práctica 3 — Normalización",
      courseId: "c3",
      courseName: "Bases de Datos",
      dueDate: "2026-03-06T23:59:00",
      status: "pending",
      priority: "urgent",
      maxGrade: 100,
    },
  },
  {
    id: "c4",
    name: "Habilidades para el Emprendimiento",
    shortName: "EMPREND",
    code: "ADM-150",
    professor: "Dr. Sánchez Morales",
    credits: 4,
    status: "active",
    progress: 60,
    color: "from-green-600 to-green-800",
    currentGrade: 9.5,
    description: "Innovación, canvas de negocio, pitch y metodologías ágiles de emprendimiento.",
    nextDeadline: {
      id: "a3",
      title: "Proyecto Fase 2 — Canvas",
      courseId: "c4",
      courseName: "Habilidades para el Emprendimiento",
      dueDate: "2026-03-10T23:59:00",
      status: "pending",
      priority: "high",
      maxGrade: 100,
    },
  },
  {
    id: "c5",
    name: "Equipo Representativo Deportivo",
    shortName: "DEPORTE",
    code: "DEP-010",
    professor: "Lic. Vargas Ochoa",
    credits: 2,
    status: "active",
    progress: 50,
    color: "from-yellow-500 to-orange-600",
    currentGrade: 10.0,
    description: "Fútbol soccer. Representación universitaria y desarrollo deportivo integral.",
    nextDeadline: {
      id: "e3",
      title: "Práctica — Cancha Principal",
      courseId: "c5",
      courseName: "Equipo Representativo Deportivo",
      dueDate: "2026-03-08T08:00:00",
      status: "pending",
      priority: "low",
      maxGrade: 100,
    },
  },
];

// ─── Helpers ───────────────────────────────────────────────────

function formatDueDateShort(iso: string): { label: string; urgent: boolean } {
  const due = new Date(iso);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffMs < 0) return { label: "Vencida", urgent: true };
  if (diffH < 24) return {
    label: `Hoy ${due.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`,
    urgent: true,
  };
  if (diffD === 1) return { label: "Mañana", urgent: true };
  if (diffD < 7) return { label: `En ${diffD} días`, urgent: false };
  return {
    label: due.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
    urgent: false,
  };
}

function gradeColor(g: number): string {
  if (g >= 9) return "text-green-400";
  if (g >= 8) return "text-yellow-400";
  if (g >= 7) return "text-orange-400";
  return "text-red-400";
}

// Ícono especial para el deporte
function CourseIcon({ courseId }: { courseId: string }) {
  if (courseId === "c5") return <Dumbbell className="w-5 h-5 text-white/80" />;
  return <BookOpen className="w-5 h-5 text-white/80" />;
}

// ─── Course Card ───────────────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  const { label: dueLabel, urgent } = course.nextDeadline
    ? formatDueDateShort(course.nextDeadline.dueDate)
    : { label: "Sin entregas próximas", urgent: false };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-200 group flex flex-col">
      {/* Header de la card con gradiente */}
      <div className={`bg-gradient-to-br ${course.color} p-5 relative`}>
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <CourseIcon courseId={course.id} />
          </div>
          <div className="text-right">
            <span className="inline-block text-[10px] font-bold text-white/60 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full">
              {course.shortName}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-base font-bold text-white leading-snug">
            {course.name}
          </h3>
          <p className="text-xs text-white/60 mt-0.5">{course.code} · {course.credits} créditos</p>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/60 font-medium">Avance del curso</span>
            <span className="text-[10px] text-white font-bold">{course.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/70 rounded-full transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cuerpo de la card */}
      <div className="flex-1 p-4 space-y-3">
        {/* Profesor */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{course.professor}</span>
        </div>

        {/* Calificación */}
        {course.currentGrade !== undefined && (
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span className="text-xs text-slate-500">Calificación actual:</span>
            <span className={`text-sm font-bold ${gradeColor(course.currentGrade)}`}>
              {course.currentGrade.toFixed(1)}
            </span>
          </div>
        )}

        {/* Descripción */}
        {course.description && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {course.description}
          </p>
        )}
      </div>

      {/* Footer — próxima entrega */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/60">
        {course.nextDeadline ? (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <Clock className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${urgent ? "text-red-400" : "text-slate-600"}`} />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wide">
                  Próxima entrega
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {course.nextDeadline.title}
                </p>
              </div>
            </div>
            <span className={`text-xs font-semibold flex-shrink-0 ${urgent ? "text-red-400" : "text-slate-500"}`}>
              {dueLabel}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-600 text-center">Sin entregas próximas</p>
        )}
      </div>
    </div>
  );
}

// ─── Stats rápidos ─────────────────────────────────────────────
function QuickStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
      <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />
      <div>
        <p className="text-lg font-bold text-slate-100 leading-tight">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function CursosPage() {
  const avgGrade =
    MOCK_COURSES.reduce((sum, c) => sum + (c.currentGrade ?? 0), 0) /
    MOCK_COURSES.length;

  const avgProgress =
    MOCK_COURSES.reduce((sum, c) => sum + c.progress, 0) / MOCK_COURSES.length;

  const totalCredits = MOCK_COURSES.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      {/* ── Encabezado ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Mis Cursos</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {MOCK_COURSES.length} materias · Semestre 3 · 2026-1
          </p>
        </div>
        <Link
          href="/calificaciones"
          className="flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors"
        >
          Ver calificaciones
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Stats rápidos ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <QuickStat
          icon={TrendingUp}
          label="Promedio general"
          value={avgGrade.toFixed(1)}
        />
        <QuickStat
          icon={BookOpen}
          label="Avance promedio"
          value={`${Math.round(avgProgress)}%`}
        />
        <QuickStat
          icon={Award}
          label="Créditos totales"
          value={String(totalCredits)}
        />
      </div>

      {/* ── Grid de cursos ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
