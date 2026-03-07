"use client";

import { useState } from "react";
import { BarChart3, AlertTriangle, TrendingUp, TrendingDown, Minus, Calculator, ChevronRight } from "lucide-react";

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

// ─── Grade Target Calculator ───────────────────────────────────
const TARGET_OPTIONS = [
  { label: "Pasar",  value: 6.0, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  { label: "Bien",   value: 7.0, color: "text-blue-400   bg-blue-500/10   border-blue-500/30"   },
  { label: "Alto",   value: 8.0, color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  { label: "9.0",    value: 9.0, color: "text-green-400  bg-green-500/10  border-green-500/30"  },
];

function GradeTargetCalculator({ courses }: { courses: CourseGrade[] }) {
  const [targets, setTargets] = useState<Record<string, number>>(
    Object.fromEntries(courses.map((c) => [c.id, 7.0]))
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
        <Calculator className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-slate-200">Calculadora de nota mínima</h3>
        <span className="text-xs text-slate-600 ml-1">— ¿Cuánto necesito para llegar a mi meta?</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-800/50">
        {courses.map((course) => {
          const target = targets[course.id];
          const diff = target - course.currentGrade;
          const alreadyReached = diff <= 0;
          // Remaining weight: categories that are still 0 (not graded)
          const remainingWeight = course.categories
            .filter((cat) => cat.grade === 0)
            .reduce((sum, cat) => sum + cat.weight, 0);
          const gradedPoints = course.categories
            .filter((cat) => cat.grade > 0)
            .reduce((sum, cat) => sum + (cat.grade * cat.weight) / 100, 0);
          // Minimum grade needed on remaining categories
          const neededOnRemaining =
            remainingWeight > 0
              ? ((target - gradedPoints) / remainingWeight) * 100
              : null;

          return (
            <div key={course.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Course name */}
                <div className="flex items-center gap-2 flex-1 min-w-[160px]">
                  <div className={`w-1.5 h-8 rounded-full ${course.color} flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-medium text-slate-200 leading-tight">{course.name}</p>
                    <p className="text-xs text-slate-600 leading-tight">
                      Actual:{" "}
                      <span className={`font-semibold ${course.currentGrade < 6 ? "text-red-400" : course.currentGrade < 8 ? "text-yellow-400" : "text-green-400"}`}>
                        {course.currentGrade.toFixed(1)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Target buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-600 mr-0.5">Meta:</span>
                  {TARGET_OPTIONS.map((opt) => {
                    const reached = course.currentGrade >= opt.value;
                    const selected = targets[course.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setTargets((prev) => ({ ...prev, [course.id]: opt.value }))}
                        className={`text-[11px] font-semibold px-2 py-1 rounded border transition-all ${
                          reached
                            ? "text-green-400 bg-green-500/10 border-green-500/20 cursor-default"
                            : selected
                            ? opt.color
                            : "text-slate-500 border-slate-700 hover:border-slate-600 hover:text-slate-400"
                        }`}
                      >
                        {reached && selected ? "✓" : ""}{opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Result */}
                <div className="min-w-[180px] text-right">
                  {alreadyReached ? (
                    <span className="text-xs font-semibold text-green-400">✓ Ya alcanzaste esta meta</span>
                  ) : neededOnRemaining === null ? (
                    <span className="text-xs text-red-400 font-semibold">Sin actividades pendientes detectadas</span>
                  ) : neededOnRemaining > 10 ? (
                    <span className="text-xs text-red-400 font-semibold">⚠ Meta muy difícil de alcanzar</span>
                  ) : neededOnRemaining < 0 ? (
                    <span className="text-xs text-green-400 font-semibold">✓ Ya tienes garantizado ese promedio</span>
                  ) : (
                    <span className="text-xs text-slate-300">
                      Necesitas{" "}
                      <span className={`font-bold text-sm ${neededOnRemaining >= 9 ? "text-orange-400" : "text-blue-400"}`}>
                        {neededOnRemaining.toFixed(1)}/10
                      </span>
                      {" "}en actividades restantes
                    </span>
                  )}
                </div>
              </div>

              {/* Remaining categories breakdown */}
              {!alreadyReached && neededOnRemaining !== null && neededOnRemaining <= 10 && (
                <div className="mt-2.5 pl-3.5 flex flex-wrap gap-2">
                  {course.categories
                    .filter((cat) => cat.grade === 0)
                    .map((cat) => (
                      <span key={cat.name} className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {cat.name} ({cat.weight}% del curso)
                      </span>
                    ))}
                  {course.categories.filter((c) => c.grade === 0).length === 0 && (
                    <span className="text-[10px] text-slate-700 italic">Todas las categorías ya tienen calificación</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-slate-800/30 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-700">
          <ChevronRight className="inline w-3 h-3 mb-0.5" /> El cálculo usa el peso de categorías sin calificar. Activa el scraper para datos reales.
        </p>
      </div>
    </div>
  );
}

// ─── Calculadora de Promedio Ponderado ────────────────────────
interface MateriaPromedio {
  id: string;
  name: string;
  color: string;
  creditos: number;
  calificacion: number;
}

const MATERIAS_INICIALES: MateriaPromedio[] = [
  { id: "m1", name: "Precálculo",                        color: "bg-purple-500", creditos: 6, calificacion: 0   },
  { id: "m2", name: "Sistemas Operativos",               color: "bg-cyan-500",   creditos: 6, calificacion: 8.4 },
  { id: "m3", name: "Bases de Datos",                    color: "bg-blue-500",   creditos: 6, calificacion: 8.7 },
  { id: "m4", name: "Habilidades para el Emprendimiento",color: "bg-green-500",  creditos: 4, calificacion: 4.2 },
  { id: "m5", name: "Equipo Representativo Deportivo",   color: "bg-yellow-500", creditos: 2, calificacion: 9.1 },
];

function calcPromedioPonderado(materias: MateriaPromedio[]): number {
  const totalCreditos = materias.reduce((s, m) => s + m.creditos, 0);
  if (totalCreditos === 0) return 0;
  const suma = materias.reduce((s, m) => s + m.calificacion * m.creditos, 0);
  return suma / totalCreditos;
}

function trafficLightClasses(promedio: number): { ring: string; bg: string; text: string; label: string } {
  if (promedio >= 8) return { ring: "ring-green-500/40", bg: "bg-green-500",  text: "text-green-400", label: "Excelente" };
  if (promedio >= 6) return { ring: "ring-yellow-500/40", bg: "bg-yellow-500", text: "text-yellow-400", label: "Regular" };
  return               { ring: "ring-red-500/40",    bg: "bg-red-500",    text: "text-red-400",    label: "En riesgo" };
}

function CalculadoraPromedio() {
  const [materias, setMaterias] = useState<MateriaPromedio[]>(MATERIAS_INICIALES);

  const handleGradeChange = (id: string, value: string) => {
    const num = value === "" ? 0 : parseFloat(value);
    if (isNaN(num)) return;
    const clamped = Math.min(Math.max(num, 0), 10);
    setMaterias((prev) => prev.map((m) => (m.id === id ? { ...m, calificacion: clamped } : m)));
  };

  const handleCreditosChange = (id: string, value: string) => {
    const num = value === "" ? 0 : parseInt(value, 10);
    if (isNaN(num)) return;
    const clamped = Math.min(Math.max(num, 0), 20);
    setMaterias((prev) => prev.map((m) => (m.id === id ? { ...m, creditos: clamped } : m)));
  };

  const promedio = calcPromedioPonderado(materias);
  const tl = trafficLightClasses(promedio);
  const totalCreditos = materias.reduce((s, m) => s + m.creditos, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
        <Calculator className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-slate-200">Calculadora de Promedio Ponderado</h3>
        <span className="text-xs text-slate-600 ml-1">— Ajusta calificaciones esperadas y créditos</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_80px_100px_40px] gap-3 text-[10px] uppercase tracking-wider text-slate-600 font-semibold px-1">
          <span>Materia</span>
          <span className="text-center">Créditos</span>
          <span className="text-center">Calificación</span>
          <span />
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {materias.map((m) => {
            const rowTl = trafficLightClasses(m.calificacion);
            return (
              <div
                key={m.id}
                className="grid grid-cols-[1fr_80px_100px_40px] gap-3 items-center bg-slate-800/30 rounded-lg px-3 py-2.5 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-1.5 h-6 rounded-full ${m.color} flex-shrink-0`} />
                  <span className="text-sm text-slate-300 truncate">{m.name}</span>
                </div>

                {/* Creditos */}
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={m.creditos}
                  onChange={(e) => handleCreditosChange(m.id, e.target.value)}
                  className="w-full text-center text-sm font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                {/* Calificacion */}
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={m.calificacion}
                  onChange={(e) => handleGradeChange(m.id, e.target.value)}
                  className={`w-full text-center text-sm font-bold bg-slate-800 border rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    m.calificacion >= 8
                      ? "text-green-400 border-green-500/30"
                      : m.calificacion >= 6
                      ? "text-yellow-400 border-yellow-500/30"
                      : "text-red-400 border-red-500/30"
                  }`}
                />

                {/* Traffic light dot */}
                <div className="flex justify-center">
                  <div className={`w-3 h-3 rounded-full ${rowTl.bg} ring-2 ${rowTl.ring}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Result */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 rounded-xl border ${
          promedio >= 8
            ? "bg-green-500/5 border-green-500/20"
            : promedio >= 6
            ? "bg-yellow-500/5 border-yellow-500/20"
            : "bg-red-500/5 border-red-500/20"
        }`}>
          <div className="flex items-center gap-4">
            {/* Traffic light */}
            <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-900 rounded-lg border border-slate-800">
              <div className={`w-4 h-4 rounded-full ${promedio < 6 ? "bg-red-500 ring-2 ring-red-500/40" : "bg-red-500/20"}`} />
              <div className={`w-4 h-4 rounded-full ${promedio >= 6 && promedio < 8 ? "bg-yellow-500 ring-2 ring-yellow-500/40" : "bg-yellow-500/20"}`} />
              <div className={`w-4 h-4 rounded-full ${promedio >= 8 ? "bg-green-500 ring-2 ring-green-500/40" : "bg-green-500/20"}`} />
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Promedio Ponderado</p>
              <p className={`text-4xl font-black ${tl.text}`}>{promedio.toFixed(2)}</p>
              <p className="text-xs text-slate-600">{totalCreditos} créditos totales</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${
              promedio >= 8
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : promedio >= 6
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {tl.label}
            </span>
            <p className="text-[10px] text-slate-600 mt-1">
              {promedio >= 8 ? "Sigue así, vas excelente" : promedio >= 6 ? "Puedes mejorar en algunas materias" : "Necesitas subir tus calificaciones"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-800/30 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-700">
          <ChevronRight className="inline w-3 h-3 mb-0.5" /> Ajusta las calificaciones esperadas para simular tu promedio final. Los créditos son editables.
        </p>
      </div>
    </div>
  );
}

// ─── Calculadora de Promedio (Pesos %) ────────────────────────
interface MateriaPeso {
  id: string;
  name: string;
  color: string;
  peso: number; // porcentaje del total (deben sumar 100)
  calificacionEsperada: number; // 0-100
}

const MATERIAS_PESO_INICIAL: MateriaPeso[] = [
  { id: "wp1", name: "Precálculo",                         color: "bg-purple-500", peso: 25, calificacionEsperada: 0   },
  { id: "wp2", name: "Sistemas Operativos",                color: "bg-cyan-500",   peso: 25, calificacionEsperada: 84  },
  { id: "wp3", name: "Bases de Datos",                     color: "bg-blue-500",   peso: 25, calificacionEsperada: 87  },
  { id: "wp4", name: "Habilidades para el Emprendimiento", color: "bg-green-500",  peso: 15, calificacionEsperada: 42  },
  { id: "wp5", name: "Equipo Representativo Deportivo",    color: "bg-yellow-500", peso: 10, calificacionEsperada: 91  },
];

function calcPromedioPesos(materias: MateriaPeso[]): number {
  const totalPeso = materias.reduce((s, m) => s + m.peso, 0);
  if (totalPeso === 0) return 0;
  return materias.reduce((s, m) => s + (m.calificacionEsperada * m.peso) / totalPeso, 0);
}

function semaforoClasses(promedio: number): { ring: string; bg: string; text: string; label: string } {
  if (promedio >= 90) return { ring: "ring-green-500/40",  bg: "bg-green-500",  text: "text-green-400",  label: "Excelente" };
  if (promedio >= 70) return { ring: "ring-yellow-500/40", bg: "bg-yellow-500", text: "text-yellow-400", label: "Regular" };
  return                      { ring: "ring-red-500/40",    bg: "bg-red-500",    text: "text-red-400",    label: "En riesgo" };
}

function CalculadoraPromedioPesos() {
  const [materias, setMaterias] = useState<MateriaPeso[]>(MATERIAS_PESO_INICIAL);

  const handleGradeChange = (id: string, value: string): void => {
    const num = value === "" ? 0 : parseFloat(value);
    if (isNaN(num)) return;
    const clamped = Math.min(Math.max(num, 0), 100);
    setMaterias((prev) => prev.map((m) => (m.id === id ? { ...m, calificacionEsperada: clamped } : m)));
  };

  const handlePesoChange = (id: string, value: string): void => {
    const num = value === "" ? 0 : parseInt(value, 10);
    if (isNaN(num)) return;
    const clamped = Math.min(Math.max(num, 0), 100);
    setMaterias((prev) => prev.map((m) => (m.id === id ? { ...m, peso: clamped } : m)));
  };

  const promedio = calcPromedioPesos(materias);
  const sem = semaforoClasses(promedio);
  const totalPeso = materias.reduce((s, m) => s + m.peso, 0);
  const pesosValidos = totalPeso === 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
        <Calculator className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200">Calculadora de Promedio</h3>
        <span className="text-xs text-slate-600 ml-1">— Pesos porcentuales (deben sumar 100%)</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_90px_110px_44px] gap-3 text-[10px] uppercase tracking-wider text-slate-600 font-semibold px-1">
          <span>Materia</span>
          <span className="text-center">Peso (%)</span>
          <span className="text-center">Calificación</span>
          <span className="text-center">Estado</span>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {materias.map((m) => {
            const rowSem = semaforoClasses(m.calificacionEsperada);
            return (
              <div
                key={m.id}
                className="grid grid-cols-[1fr_90px_110px_44px] gap-3 items-center bg-slate-800/30 rounded-lg px-3 py-2.5 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-1.5 h-6 rounded-full ${m.color} flex-shrink-0`} />
                  <span className="text-sm text-slate-300 truncate">{m.name}</span>
                </div>

                {/* Peso */}
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={m.peso}
                  onChange={(e) => handlePesoChange(m.id, e.target.value)}
                  className="w-full text-center text-sm font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                {/* Calificacion esperada (0-100) */}
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={m.calificacionEsperada}
                  onChange={(e) => handleGradeChange(m.id, e.target.value)}
                  className={`w-full text-center text-sm font-bold bg-slate-800 border rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    m.calificacionEsperada >= 90
                      ? "text-green-400 border-green-500/30"
                      : m.calificacionEsperada >= 70
                      ? "text-yellow-400 border-yellow-500/30"
                      : "text-red-400 border-red-500/30"
                  }`}
                />

                {/* Traffic light dot */}
                <div className="flex justify-center">
                  <div className={`w-3 h-3 rounded-full ${rowSem.bg} ring-2 ${rowSem.ring}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Peso total indicator */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold ${
          pesosValidos
            ? "bg-green-500/5 border-green-500/20 text-green-400"
            : "bg-red-500/5 border-red-500/20 text-red-400"
        }`}>
          <span>Total de pesos: {totalPeso}%</span>
          <span>{pesosValidos ? "OK - Los pesos suman 100%" : `Faltan ${100 - totalPeso}% para completar`}</span>
        </div>

        {/* Result */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 rounded-xl border ${
          promedio >= 90
            ? "bg-green-500/5 border-green-500/20"
            : promedio >= 70
            ? "bg-yellow-500/5 border-yellow-500/20"
            : "bg-red-500/5 border-red-500/20"
        }`}>
          <div className="flex items-center gap-4">
            {/* Semaforo visual */}
            <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-900 rounded-lg border border-slate-800">
              <div className={`w-4 h-4 rounded-full ${promedio < 70 ? "bg-red-500 ring-2 ring-red-500/40" : "bg-red-500/20"}`} />
              <div className={`w-4 h-4 rounded-full ${promedio >= 70 && promedio < 90 ? "bg-yellow-500 ring-2 ring-yellow-500/40" : "bg-yellow-500/20"}`} />
              <div className={`w-4 h-4 rounded-full ${promedio >= 90 ? "bg-green-500 ring-2 ring-green-500/40" : "bg-green-500/20"}`} />
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Promedio Ponderado</p>
              <p className={`text-4xl font-black ${sem.text}`}>{promedio.toFixed(2)}</p>
              <p className="text-xs text-slate-600">Escala 0–100 · {totalPeso}% asignado</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${
              promedio >= 90
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : promedio >= 70
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {sem.label}
            </span>
            <p className="text-[10px] text-slate-600 mt-1">
              {promedio >= 90 ? "Excelente desempeno, sigue asi" : promedio >= 70 ? "Puedes mejorar en algunas materias" : "Necesitas subir tus calificaciones urgentemente"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-800/30 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-700">
          <ChevronRight className="inline w-3 h-3 mb-0.5" /> Ajusta los pesos (%) y calificaciones esperadas (0-100) para simular tu promedio. Los pesos deben sumar 100%.
        </p>
      </div>
    </div>
  );
}

// ─── Academic Risk Panel ────────────────────────────────────────
interface RiskLevel {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
  advice: string;
}

function getRisk(grade: number, trend: CourseGrade["trend"]): RiskLevel {
  if (grade === 0 || grade < 6) {
    return {
      label: "Riesgo crítico",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/25",
      dot: "bg-red-500",
      advice: grade === 0
        ? "Sin calificaciones — contacta al profesor urgente"
        : "Por debajo del mínimo aprobatorio. Actúa de inmediato.",
    };
  }
  if (grade < 7.5 && trend === "down") {
    return {
      label: "Riesgo moderado",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/25",
      dot: "bg-orange-500",
      advice: "Calificación bajando. Revisa tu rendimiento antes del siguiente parcial.",
    };
  }
  if (grade < 7.5) {
    return {
      label: "Atención",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/25",
      dot: "bg-yellow-500",
      advice: "Por encima del mínimo, pero con margen ajustado. Mantén el ritmo.",
    };
  }
  return {
    label: "Sin riesgo",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/25",
    dot: "bg-green-500",
    advice: "Buen desempeño. Sigue así para cerrar el semestre arriba.",
  };
}

function AcademicRiskPanel({ courses }: { courses: CourseGrade[] }) {
  const critical = courses.filter((c) => c.currentGrade < 6 || c.currentGrade === 0);
  const moderate = courses.filter((c) => c.currentGrade >= 6 && c.currentGrade < 7.5 && c.trend === "down");
  const attention = courses.filter((c) => c.currentGrade >= 6 && c.currentGrade < 7.5 && c.trend !== "down");
  const safe = courses.filter((c) => c.currentGrade >= 7.5);

  const overallRisk = critical.length > 0 ? "Crítico" : moderate.length > 0 ? "Moderado" : attention.length > 0 ? "Atención" : "Saludable";
  const overallColor = critical.length > 0 ? "text-red-400" : moderate.length > 0 ? "text-orange-400" : attention.length > 0 ? "text-yellow-400" : "text-green-400";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
              <div className={`absolute inset-0 rounded-full ${critical.length > 0 ? "bg-red-500" : moderate.length > 0 ? "bg-orange-500" : attention.length > 0 ? "bg-yellow-500" : "bg-green-500"}`} />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Panel de Riesgo Académico</h3>
          <span className="text-xs text-slate-600 ml-1">— semáforo por materia</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
          critical.length > 0 ? "bg-red-500/10 text-red-400 border-red-500/25" :
          moderate.length > 0 ? "bg-orange-500/10 text-orange-400 border-orange-500/25" :
          attention.length > 0 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/25" :
          "bg-green-500/10 text-green-400 border-green-500/25"
        }`}>
          {overallRisk}
        </span>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 divide-x divide-slate-800 border-b border-slate-800">
        {[
          { count: critical.length,  label: "Crítico",   color: "text-red-400",    bg: "bg-red-500" },
          { count: moderate.length,  label: "Moderado",  color: "text-orange-400", bg: "bg-orange-500" },
          { count: attention.length, label: "Atención",  color: "text-yellow-400", bg: "bg-yellow-500" },
          { count: safe.length,      label: "Sin riesgo",color: "text-green-400",  bg: "bg-green-500" },
        ].map(({ count, label, color, bg }) => (
          <div key={label} className="flex flex-col items-center justify-center py-3 gap-1">
            <div className={`w-2 h-2 rounded-full ${bg}`} />
            <span className={`text-xl font-black ${color}`}>{count}</span>
            <span className="text-[10px] text-slate-600 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Per-course rows */}
      <div className="divide-y divide-slate-800/50">
        {courses.map((course) => {
          const risk = getRisk(course.currentGrade, course.trend);
          return (
            <div key={course.id} className={`flex items-center gap-4 px-5 py-3.5 ${risk.bg} border-l-2 ${risk.border}`}>
              {/* Dot */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${risk.dot}`} />

              {/* Course info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-1 h-8 rounded-full ${course.color} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{course.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{risk.advice}</p>
                </div>
              </div>

              {/* Grade + risk label */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-sm font-bold ${course.currentGrade < 6 ? "text-red-400" : course.currentGrade < 8 ? "text-yellow-400" : "text-green-400"}`}>
                  {course.currentGrade.toFixed(1)}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${risk.bg} ${risk.color} ${risk.border} hidden sm:inline`}>
                  {risk.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-slate-800/20 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-700">
          Basado en calificaciones actuales y tendencia de cada materia. Datos en tiempo real cuando el scraper esté activo.
        </p>
      </div>
    </div>
  );
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

      {/* Academic Risk Panel */}
      <AcademicRiskPanel courses={COURSES} />

      {/* Grade Target Calculator */}
      <GradeTargetCalculator courses={COURSES} />

      {/* Course cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Calculadora de Promedio Ponderado */}
      <CalculadoraPromedio />
    </div>
  );
}
