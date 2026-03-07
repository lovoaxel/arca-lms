"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Mock data ────────────────────────────────────────────────
interface SearchItem {
  id: string;
  type: "course" | "task";
  title: string;
  subtitle: string;
}

const MOCK_DATA: SearchItem[] = [
  { id: "c1", type: "course", title: "Cálculo Diferencial", subtitle: "MTH-201 · Semestre 3" },
  { id: "c2", type: "course", title: "Programación Orientada a Objetos", subtitle: "CS-301 · Semestre 3" },
  { id: "c3", type: "course", title: "Base de Datos", subtitle: "CS-302 · Semestre 3" },
  { id: "c4", type: "course", title: "Física Mecánica", subtitle: "PHY-101 · Semestre 3" },
  { id: "c5", type: "course", title: "Inglés Avanzado", subtitle: "LNG-401 · Semestre 3" },
  { id: "t1", type: "task", title: "Entrega: Proyecto Final POO", subtitle: "Programación Orientada a Objetos · Vence 15 Mar" },
  { id: "t2", type: "task", title: "Quiz: Derivadas parciales", subtitle: "Cálculo Diferencial · Vence 12 Mar" },
  { id: "t3", type: "task", title: "Práctica: Normalización 3FN", subtitle: "Base de Datos · Vence 18 Mar" },
  { id: "t4", type: "task", title: "Laboratorio: Cinemática", subtitle: "Física Mecánica · Vence 20 Mar" },
  { id: "t5", type: "task", title: "Essay: Climate Change", subtitle: "Inglés Avanzado · Vence 22 Mar" },
];

// ─── Icons (inline SVGs) ──────────────────────────────────────
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

// ─── GlobalSearch Component ───────────────────────────────────
export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim() === ""
    ? MOCK_DATA
    : MOCK_DATA.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      );

  const courses = filtered.filter((i) => i.type === "course");
  const tasks = filtered.filter((i) => i.type === "task");

  // Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay so the modal renders first
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    },
    []
  );

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors text-sm cursor-pointer"
      >
        <SearchIcon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="hidden sm:inline text-xs">Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-700/80 border border-slate-600/50 text-[10px] font-mono font-medium text-slate-400 ml-1">
          Ctrl+K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-slate-950/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg mx-4 rounded-xl bg-slate-900 border border-slate-700/70 shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
              <SearchIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar cursos, tareas..."
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
              <kbd
                onClick={() => setOpen(false)}
                className="flex-shrink-0 cursor-pointer px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-500">
                    No se encontraron resultados para &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                <>
                  {/* Courses section */}
                  {courses.length > 0 && (
                    <div>
                      <p className="px-4 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                        Cursos
                      </p>
                      {courses.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-800/70 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <BookIcon className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tasks section */}
                  {tasks.length > 0 && (
                    <div>
                      <p className="px-4 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                        Tareas
                      </p>
                      {tasks.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-800/70 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <ClipboardIcon className="w-3.5 h-3.5 text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 text-[10px] text-slate-600">
              <span>Navegar con flechas</span>
              <span>Enter para seleccionar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
