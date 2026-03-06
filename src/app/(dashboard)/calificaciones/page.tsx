"use client";

import { BarChart3, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────
interface CourseGrade {
  id: string;
  name: string;
  shortName: string;
  color: string;
  currentGrade: number;
  maxGrade: number;
  categories: CategoryGrade[];
  trend: "up" | "down" | "stable";
  professor: string;
}

interface CategoryGrade {
  name: string;
  grade: number;
  maxGrade: number;
  weight: number; // percentage
}

// ─── Mock Data ─────────────────────────────────────────────────
const COURSES: CourseGrade[] = [
  {
    id: "c1",
    name: "Precálculo",
    shortName: "PREC",
    color: "bg-purple-500",
    currentGrade: 0,
    maxGrade: 10,
    trend: "stable",
    professor: "Dra. García",
    categories: [
      { name: "Exámenes parciales", grade: 0,  maxGrade: 10, weight: 60 },
      { name: "Tareas",             grade: 0,  maxGrade: 10, weight: 20 },
      { name: "Participación",      grade: 0,  maxGrade: 10, weight: 20 },
    ],
  },
  {
    id: "c2",
    name: "Sistemas Operativos",
    shortName: "SO",
    color: "bg-cyan-500",
    currentGrade: 8.4,
    maxGrade: 10,
    trend: "up",
    professor: "Ing. Martínez",
    categories: [
      { name: "Exámenes parciales", grade: 8.5, maxGrade: 10, weight: 50 },
      { name: "Prácticas",          grade: 9.2, maxGrade: 10, weight: 30 },
      { name: "Tareas",             grade: 7.0, maxGrade: 10, weight: 20 },
    ],
  },
  {
    id: "c3",
    name: "Bases de Datos",
    shortName: "BD",
    color: "bg-blue-500",
    currentGrade: 8.7,
    maxGrade: 10,
    trend: "up",
    professor: "Mtro. López",
    categories: [
      { name: "Exámenes",           grade: 8.0,  maxGrade: 10, weight: 40 },
      { name: "Prácticas",          grade: 9.4,  maxGrade: 10, weight: 40 },
      { name: "Proyecto final",     grade: 8.5,  maxGrade: 10, weight: 20 },
    ],
  },
  {
    id: "c4",
    name: "Habilidades para el Emprendimiento",
    shortName: "EMP",
    color: "bg-green-500",
    currentGrade: 4.2,
    maxGrade: 10,
    trend: "down",
    professor: "Mtro. Rivera",
    categories: [
      { name: "Fase 1",             grade: 4.5, maxGrade: 10, weight: 25 },
      { name: "Participación",      grade: 5.5, maxGrade: 10, weight: 25 },
      { name: "Proyecto final",     grade: 3.0, maxGrade: 10, weight: 50 },
    ],
  },
  {
    id: "c5",
    name: "Equipo Representativo Deportivo",
    shortName: "DEP",
    color: "bg-yellow-500",
    currentGrade: 9.1,
    maxGrade: 10,
    trend: "stable",
    professor: "Mtro. Torres",
    categories: [
      { name: "Asistencia",         grade: 9.5, maxGrade: 10, weight: 50 },
      { name: "Desempeño",          grade: 8.8, maxGrade: 10, weight: 30 },
      { name: "Reportes",           grade: 9.0, maxGrade: 10, weight: 20 },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────
function getGradeColor(grade: number): { text: string; bg: string; border: string } {
  if (grade < 6)  return { text: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20" };
  if (grade < 8)  return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
  return            { text: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" };
}

function getGradeBarColor(grade: number): string {
  if (grade < 6)  return "bg-red-500";
  if (grade < 8)  return "bg-yellow-500";
  return            "bg-green-500";
}

function calcOverallAverage(courses: CourseGrade[]): number {
  const total = courses.reduce((sum, c) => sum + c.currentGrade, 0);
  return total / courses.length;
}

// ─── Grade Bar ─────────────────────────────────────────────────
function GradeBar({ grade, maxGrade, color }: { grade: number; maxGrade: number; color?: string }) {
  const pct = Math.min((grade / maxGrade) * 100, 100);
  const barColor = color ?? getGradeBarColor(grade);
  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Course Card ───────────────────────────────────────────────
function CourseCard({ course }: { course: CourseGrade }) {
  const colors = getGradeColor(course.currentGrade);
  const pct = (course.currentGrade / course.maxGrade) * 100;
  const isAlert = course.currentGrade < 7;
  const TrendIcon = course.trend === "up" ? TrendingUp : course.trend === "down" ? TrendingDown : Minus;
  const trendColor = course.trend === "up" ? "text-green-400" : course.trend === "down" ? "text-red-400" : "text-slate-500";

  return (
    <div className={`bg-slate-900 border rounded-xl overflow-hidden transition-colors hover:border-slate-700 ${isAlert ? "border-red-500/30" : "border-slate-800"}`}>
      {/* Alert banner */}
      {isAlert && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border-b border-red-500/20">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400 font-medium">
            {course.currentGrade === 0
              ? "Sin calificaciones registradas — Requiere atención urgente"
              : `Calificación baja (${course.currentGrade}/10) — En riesgo de reprobación`
            }
          </p>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-10 rounded-full ${course.color} flex-shrink-0`} />
            <div>
              <p className="text-sm font-semibold text-slate-200">{course.name}</p>
              <p className="text-xs text-slate-600">{course.professor}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${colors.bg} ${colors.border}`}>
              <span className={`text-xl font-bold ${colors.text}`}>{course.currentGrade.toFixed(1)}</span>
              <span className="text-xs text-slate-600">/ {course.maxGrade}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className={`text-[10px] ${trendColor}`}>
                {course.trend === "up" ? "Mejorando" : course.trend === "down" ? "Bajando" : "Estable"}
              </span>
            </div>
          </div>
        </div>

        {/* Overall bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-600 mb-1.5">
            <span>Progreso general</span>
            <span>{pct.toFixed(0)}%</span>
          </div>
          <GradeBar grade={course.currentGrade} maxGrade={course.maxGrade} />
        </div>

        {/* Categories */}
        <div className="space-y-2.5">
          {course.categories.map((cat) => {
            const catColors = getGradeColor(cat.grade);
            return (
              <div key={cat.name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{cat.name}</span>
                    <span className="text-[10px] text-slate-700">({cat.weight}%)</span>
                  </div>
                  <span className={`text-xs font-semibold ${catColors.text}`}>
                    {cat.grade.toFixed(1)}<span className="text-slate-700">/{cat.maxGrade}</span>
                  </span>
                </div>
                <GradeBar grade={cat.grade} maxGrade={cat.maxGrade} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Summary Bar Chart ─────────────────────────────────────────
function SummaryChart({ courses }: { courses: CourseGrade[] }) {
  const maxBar = 160; // px height

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-slate-200">Resumen por materia</h3>
      </div>

      <div className="flex items-end justify-around gap-2 h-44">
        {courses.map((course) => {
          const pct = course.currentGrade / course.maxGrade;
          const barH = Math.max(Math.round(pct * maxBar), 4);
          const barColor = getGradeBarColor(course.currentGrade);
          const colors = getGradeColor(course.currentGrade);

          return (
            <div key={course.id} className="flex flex-col items-center gap-2 flex-1">
              {/* Grade label above bar */}
              <span className={`text-xs font-bold ${colors.text}`}>
                {course.currentGrade.toFixed(1)}
              </span>
              {/* Bar */}
              <div className="w-full flex justify-center">
                <div
                  className={`w-full max-w-[40px] rounded-t-lg ${barColor} transition-all duration-700`}
                  style={{ height: `${barH}px` }}
                />
              </div>
              {/* Label */}
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${course.color} mb-1`} />
                <span className="text-[10px] text-slate-500 text-center leading-tight">{course.shortName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Passing grade line indicator */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-[10px] text-slate-600">Mínimo aprobatorio: 6.0</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function CalificacionesPage() {
  const average = calcOverallAverage(COURSES);
  const averageColors = getGradeColor(average);
  const alertCourses = COURSES.filter((c) => c.currentGrade < 7);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Calificaciones</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Semestre enero–junio 2026 · {COURSES.length} materias
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-orange-400" />
        </div>
      </section>

      {/* Overall average + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Promedio general */}
        <div className={`bg-slate-900 border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 ${averageColors.bg} ${averageColors.border}`}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Promedio General</p>
          <p className={`text-6xl font-black ${averageColors.text}`}>{average.toFixed(1)}</p>
          <p className="text-xs text-slate-600">de 10.0 máximo</p>
          <div className="w-full mt-2">
            <GradeBar grade={average} maxGrade={10} />
          </div>
          {average < 8 && (
            <p className={`text-xs font-medium mt-1 ${averageColors.text}`}>
              {average < 6 ? "⚠ Promedio bajo — acción inmediata requerida" : "📈 Por debajo de 8.0 — hay margen de mejora"}
            </p>
          )}
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          <SummaryChart courses={COURSES} />
        </div>
      </div>

      {/* Alerts for low grades */}
      {alertCourses.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400">Materias en riesgo de reprobación</h3>
          </div>
          <div className="space-y-2">
            {alertCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-red-500/10 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${c.color}`} />
                  <span className="text-sm text-slate-300">{c.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    Necesitas {(6 - c.currentGrade).toFixed(1)} puntos para aprobar
                  </span>
                  <span className="text-sm font-bold text-red-400">{c.currentGrade.toFixed(1)}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
