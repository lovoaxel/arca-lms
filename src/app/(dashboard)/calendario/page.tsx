"use client";

import { Calendar, Clock, BookOpen, AlertTriangle, CheckCircle2, Download } from "lucide-react";

// ─── iCal Export ───────────────────────────────────────────────
function formatICSDate(dateStr: string, timeStr?: string): string {
  const d = dateStr.replace(/-/g, "");
  if (!timeStr) return `${d}`;
  const t = timeStr.replace(/:/g, "") + "00";
  return `${d}T${t}`;
}

function generateICS(items: DeliveryItem[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ARCA LMS//Calendario Semestral//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:ARCA — Semestre 2026",
    "X-WR-CALDESC:Entregas y eventos del semestre enero-junio 2026",
    "X-WR-TIMEZONE:America/Mexico_City",
  ];

  for (const item of items) {
    const dtstart = item.time
      ? `DTSTART;TZID=America/Mexico_City:${formatICSDate(item.date, item.time)}`
      : `DTSTART;VALUE=DATE:${item.date.replace(/-/g, "")}`;
    const dtend = item.time
      ? `DTEND;TZID=America/Mexico_City:${formatICSDate(item.date, item.time)}`
      : `DTEND;VALUE=DATE:${item.date.replace(/-/g, "")}`;
    const summary = `${item.title} — ${item.courseName}`;
    const description = `Tipo: ${TYPE_LABELS[item.type]}\\nMateria: ${item.courseName}${item.location ? "\\nLugar: " + item.location : ""}`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:arca-${item.id}-2026@arca.lms`,
      dtstart,
      dtend,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      ...(item.location ? [`LOCATION:${item.location}`] : []),
      "STATUS:CONFIRMED",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(items: DeliveryItem[]): void {
  const content = generateICS(items);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ARCA_Calendario_2026.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Mock data: fechas reales del semestre enero–junio 2026 ─────
interface DeliveryItem {
  id: string;
  title: string;
  courseName: string;
  courseColor: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type: "assignment" | "exam" | "class" | "event";
  location?: string;
  submitted?: boolean;
}

const DELIVERIES: DeliveryItem[] = [
  // Marzo 2026
  { id: "d1",  title: "Práctica 3 — Normalización BD",     courseName: "Bases de Datos",          courseColor: "bg-blue-500",   date: "2026-03-06", time: "23:59", type: "assignment" },
  { id: "d2",  title: "Examen Parcial 1",                  courseName: "Precálculo",               courseColor: "bg-purple-500", date: "2026-03-07", time: "10:00", type: "exam",       location: "Salón B-204" },
  { id: "d3",  title: "Práctica de Fútbol",                courseName: "Equipo Representativo",    courseColor: "bg-yellow-500", date: "2026-03-08", time: "08:00", type: "class",      location: "Cancha Principal" },
  { id: "d4",  title: "Proyecto Fase 2 — Canvas",          courseName: "Habilidades para el Emprendimiento", courseColor: "bg-green-500",  date: "2026-03-10", time: "23:59", type: "assignment" },
  { id: "d5",  title: "Tarea 4 — Scheduling de Procesos",  courseName: "Sistemas Operativos",      courseColor: "bg-cyan-500",   date: "2026-03-11", time: "23:59", type: "assignment" },
  { id: "d6",  title: "Tarea 2 — Funciones Trigonométricas", courseName: "Precálculo",             courseColor: "bg-purple-500", date: "2026-03-14", time: "23:59", type: "assignment" },
  { id: "d7",  title: "Práctica de Fútbol",                courseName: "Equipo Representativo",    courseColor: "bg-yellow-500", date: "2026-03-15", time: "08:00", type: "class",      location: "Cancha Principal" },
  { id: "d8",  title: "Tarea 3 — Memoria Virtual",         courseName: "Sistemas Operativos",      courseColor: "bg-cyan-500",   date: "2026-03-20", time: "23:59", type: "assignment" },
  { id: "d9",  title: "Quiz 2 — Funciones Exponenciales",  courseName: "Precálculo",               courseColor: "bg-purple-500", date: "2026-03-21", time: "09:00", type: "exam" },
  { id: "d10", title: "Práctica de Fútbol",                courseName: "Equipo Representativo",    courseColor: "bg-yellow-500", date: "2026-03-22", time: "08:00", type: "class",      location: "Cancha Principal" },
  { id: "d11", title: "Reporte Mensual — Condición Física", courseName: "Equipo Representativo",   courseColor: "bg-yellow-500", date: "2026-03-31", time: "23:59", type: "assignment" },
  // Abril 2026
  { id: "d12", title: "Proyecto BD — Entrega Parcial",     courseName: "Bases de Datos",           courseColor: "bg-blue-500",   date: "2026-04-03", time: "23:59", type: "assignment" },
  { id: "d13", title: "Examen Parcial 2",                  courseName: "Sistemas Operativos",      courseColor: "bg-cyan-500",   date: "2026-04-07", time: "11:00", type: "exam",       location: "Aula C-101" },
  { id: "d14", title: "Tarea 3 — Derivadas e Integrales",  courseName: "Precálculo",               courseColor: "bg-purple-500", date: "2026-04-10", time: "23:59", type: "assignment" },
  { id: "d15", title: "Proyecto Fase 3 — Pitch",           courseName: "Habilidades para el Emprendimiento", courseColor: "bg-green-500",  date: "2026-04-14", time: "14:00", type: "event",      location: "Auditorio B" },
  { id: "d16", title: "Torneo Interno Fútbol",             courseName: "Equipo Representativo",    courseColor: "bg-yellow-500", date: "2026-04-18", time: "09:00", type: "event",      location: "Cancha Principal" },
  { id: "d17", title: "Tarea 5 — Sistemas de Archivos",    courseName: "Sistemas Operativos",      courseColor: "bg-cyan-500",   date: "2026-04-22", time: "23:59", type: "assignment" },
  { id: "d18", title: "Práctica 4 — SQL Avanzado",         courseName: "Bases de Datos",           courseColor: "bg-blue-500",   date: "2026-04-24", time: "23:59", type: "assignment" },
  // Mayo 2026
  { id: "d19", title: "Examen Parcial 2",                  courseName: "Precálculo",               courseColor: "bg-purple-500", date: "2026-05-05", time: "10:00", type: "exam",       location: "Salón B-204" },
  { id: "d20", title: "Proyecto Final — Presentación",     courseName: "Habilidades para el Emprendimiento", courseColor: "bg-green-500",  date: "2026-05-12", time: "13:00", type: "event",      location: "Auditorio A" },
  { id: "d21", title: "Tarea 6 — Redes y Comunicación",    courseName: "Sistemas Operativos",      courseColor: "bg-cyan-500",   date: "2026-05-15", time: "23:59", type: "assignment" },
  { id: "d22", title: "Examen Parcial 2",                  courseName: "Bases de Datos",           courseColor: "bg-blue-500",   date: "2026-05-19", time: "11:00", type: "exam",       location: "Aula C-101" },
  // Junio 2026
  { id: "d23", title: "Proyecto Final BD — Sistema Inventario", courseName: "Bases de Datos",      courseColor: "bg-blue-500",   date: "2026-05-30", time: "23:59", type: "assignment" },
  { id: "d24", title: "Examen Final",                      courseName: "Precálculo",               courseColor: "bg-purple-500", date: "2026-06-09", time: "10:00", type: "exam",       location: "Salón B-204" },
  { id: "d25", title: "Examen Final",                      courseName: "Sistemas Operativos",      courseColor: "bg-cyan-500",   date: "2026-06-10", time: "09:00", type: "exam",       location: "Aula C-101" },
  { id: "d26", title: "Examen Final",                      courseName: "Bases de Datos",           courseColor: "bg-blue-500",   date: "2026-06-11", time: "11:00", type: "exam",       location: "Aula C-101" },
  { id: "d27", title: "Examen Final",                      courseName: "Habilidades para el Emprendimiento", courseColor: "bg-green-500",  date: "2026-06-12", time: "14:00", type: "exam" },
];

// ─── Helpers ───────────────────────────────────────────────────
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function getUrgency(dateStr: string): "overdue" | "this-week" | "next-week" | "future" {
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((date.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)  return "overdue";
  if (diffDays <= 7) return "this-week";
  if (diffDays <= 14) return "next-week";
  return "future";
}

const URGENCY_STYLES = {
  overdue:   { bar: "bg-red-500",    badge: "text-red-400 bg-red-500/10 border-red-500/20",      label: "Vencida"          },
  "this-week": { bar: "bg-yellow-500", badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", label: "Esta semana" },
  "next-week": { bar: "bg-blue-500",   badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",     label: "Próx. semana" },
  future:    { bar: "bg-green-500",   badge: "text-green-400 bg-green-500/10 border-green-500/20",  label: "Próximamente"    },
};

const TYPE_LABELS: Record<DeliveryItem["type"], string> = {
  assignment: "Entrega",
  exam:       "Examen",
  class:      "Clase",
  event:      "Evento",
};

const TYPE_ICONS: Record<DeliveryItem["type"], React.ComponentType<{ className?: string }>> = {
  assignment: CheckCircle2,
  exam:       AlertTriangle,
  class:      BookOpen,
  event:      Calendar,
};

function getDaysLabel(dateStr: string): { text: string; color: string } {
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((date.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)  return { text: `Hace ${Math.abs(diffDays)} día${Math.abs(diffDays) !== 1 ? "s" : ""}`, color: "text-red-400" };
  if (diffDays === 0) return { text: "Hoy", color: "text-red-400 font-bold" };
  if (diffDays === 1) return { text: "Mañana", color: "text-orange-400" };
  if (diffDays < 7)  return { text: `En ${diffDays} días`, color: "text-yellow-400" };
  if (diffDays < 14) return { text: `En ${diffDays} días`, color: "text-blue-400" };
  return { text: `En ${diffDays} días`, color: "text-slate-500" };
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((date.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays === -1) return "Ayer";
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ─── Group by week ─────────────────────────────────────────────
interface WeekGroup {
  label: string;
  urgency: "overdue" | "this-week" | "next-week" | "future";
  items: DeliveryItem[];
}

function groupByWeek(items: DeliveryItem[]): WeekGroup[] {
  const groups: WeekGroup[] = [
    { label: "Vencidas",         urgency: "overdue",    items: [] },
    { label: "Esta semana",      urgency: "this-week",  items: [] },
    { label: "Próxima semana",   urgency: "next-week",  items: [] },
    { label: "Más adelante",     urgency: "future",     items: [] },
  ];

  for (const item of items) {
    const urgency = getUrgency(item.date);
    groups.find((g) => g.urgency === urgency)!.items.push(item);
  }

  return groups.filter((g) => g.items.length > 0);
}

// ─── Delivery Card ─────────────────────────────────────────────
function DeliveryCard({ item }: { item: DeliveryItem }) {
  const urgency = getUrgency(item.date);
  const styles = URGENCY_STYLES[urgency];
  const { text: countdownText, color: countdownColor } = getDaysLabel(item.date);
  const TypeIcon = TYPE_ICONS[item.type];

  return (
    <div className="flex items-stretch gap-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      {/* Color bar */}
      <div className={`w-1 flex-shrink-0 ${styles.bar}`} />

      <div className="flex items-center gap-4 px-4 py-3.5 flex-1 min-w-0">
        {/* Type icon */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === "exam" ? "bg-red-500/10" : "bg-slate-800"}`}>
          <TypeIcon className={`w-4 h-4 ${item.type === "exam" ? "text-red-400" : "text-slate-400"}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${item.courseColor} flex-shrink-0`} />
              <span className="text-xs text-slate-500 truncate">{item.courseName}</span>
            </div>
            {item.time && (
              <>
                <span className="text-slate-700">·</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span className="text-xs text-slate-600">{item.time}</span>
                </div>
              </>
            )}
            {item.location && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-600">{item.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-xs font-semibold ${countdownColor}`}>{countdownText}</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${styles.badge}`}>
              {styles.label}
            </span>
            <span className="text-[10px] text-slate-600 uppercase tracking-wide">
              {TYPE_LABELS[item.type]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function CalendarioPage() {
  // Sort all by date
  const sorted = [...DELIVERIES].sort((a, b) => a.date.localeCompare(b.date));
  const groups = groupByWeek(sorted);

  const totalPending = DELIVERIES.filter((d) => getUrgency(d.date) !== "overdue").length;
  const totalOverdue = DELIVERIES.filter((d) => getUrgency(d.date) === "overdue").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Calendario de Entregas</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Semestre enero–junio 2026 · {totalPending} próximas · {totalOverdue > 0 ? `${totalOverdue} vencidas` : "0 vencidas"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadICS(DELIVERIES)}
            title="Exportar a Google Calendar / Apple Calendar / Outlook"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 hover:border-orange-500/40 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            Exportar .ics
          </button>
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      </section>

      {/* Legend */}
      <div className="flex items-center gap-4 p-3 bg-slate-900 border border-slate-800 rounded-xl flex-wrap">
        <span className="text-xs text-slate-500 font-medium">Urgencia:</span>
        {Object.entries(URGENCY_STYLES).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${val.bar}`} />
            <span className="text-xs text-slate-500">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Week groups */}
      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.urgency}>
            {/* Group header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-2 h-2 rounded-full ${URGENCY_STYLES[group.urgency].bar}`} />
              <h3 className="text-sm font-semibold text-slate-300">{group.label}</h3>
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-600">{group.items.length} evento{group.items.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Daily sub-groups */}
            <div className="space-y-3">
              {/* Group items by date within the week */}
              {Array.from(new Set(group.items.map((i) => i.date))).sort().map((date) => {
                const dayItems = group.items.filter((i) => i.date === date);
                return (
                  <div key={date}>
                    {/* Date label */}
                    <p className="text-xs font-medium text-slate-500 mb-2 ml-1 capitalize">
                      {formatDateHeader(date)}
                    </p>
                    <div className="space-y-2 ml-0">
                      {dayItems.map((item) => (
                        <DeliveryCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
