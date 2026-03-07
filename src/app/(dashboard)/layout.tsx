"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  BookOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  Bell,
  LogOut,
  GraduationCap,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Tipos de navegación ───────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio",          href: "/dashboard",       icon: Home         },
  { label: "Cursos",          href: "/cursos",           icon: BookOpen     },
  { label: "Tareas",          href: "/tareas",           icon: ClipboardList},
  { label: "Calendario",      href: "/calendario",       icon: Calendar     },
  { label: "Calificaciones",  href: "/calificaciones",   icon: BarChart3    },
];

// ─── Fallback usuario ──────────────────────────────────────────
const FALLBACK_USER = {
  name: "Axel Lovo",
  initials: "AL",
  program: "Ingeniería en Sistemas Computacionales",
  semester: 3,
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "AL";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

// ─── Sidebar Link Component ────────────────────────────────────
function SidebarLink({ item, isActive, onClick }: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-150 group
        ${isActive
          ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        }
      `}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110 ${isActive ? "text-orange-400" : ""}`} />
      <span>{item.label}</span>
      {isActive && <ChevronRight className="w-3 h-3 ml-auto text-orange-400/60" />}
    </Link>
  );
}

// ─── Sidebar Component ─────────────────────────────────────────
function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name ?? FALLBACK_USER.name;
  const userInitials = getInitials(session?.user?.name) ?? FALLBACK_USER.initials;

  return (
    <aside className="flex flex-col h-full bg-slate-900 border-r border-slate-800/80">
      {/* Logo / Brand */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">ARCA</p>
            <p className="text-[10px] font-medium text-orange-400 uppercase tracking-wider leading-tight">LMS</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Menú
        </p>
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Footer del sidebar — info del usuario */}
      <div className="px-3 py-4 border-t border-slate-800/80">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-orange-400">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 truncate">Semestre {FALLBACK_USER.semester}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-slate-600 hover:text-slate-400 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Datos mock para búsqueda global ─────────────────────────
interface SearchResult {
  id: string;
  type: "tarea" | "curso";
  title: string;
  subtitle: string;
}

const SEARCH_DATA: SearchResult[] = [
  { id: "t1", type: "tarea", title: "Ensayo de Ética Profesional",         subtitle: "Ética — Entrega: 12 mar" },
  { id: "t2", type: "tarea", title: "Proyecto Final de Bases de Datos",    subtitle: "Bases de Datos — Entrega: 18 mar" },
  { id: "t3", type: "tarea", title: "Reporte de Laboratorio #5",           subtitle: "Física II — Entrega: 14 mar" },
  { id: "t4", type: "tarea", title: "Investigación sobre IA Generativa",   subtitle: "Inteligencia Artificial — Entrega: 20 mar" },
  { id: "t5", type: "tarea", title: "Ejercicios de Cálculo Integral",      subtitle: "Cálculo III — Entrega: 10 mar" },
  { id: "c1", type: "curso", title: "Bases de Datos Avanzadas",            subtitle: "Prof. García — Lun/Mié 10:00" },
  { id: "c2", type: "curso", title: "Inteligencia Artificial",             subtitle: "Prof. Martínez — Mar/Jue 12:00" },
  { id: "c3", type: "curso", title: "Ética Profesional",                   subtitle: "Prof. López — Vie 08:00" },
  { id: "c4", type: "curso", title: "Cálculo III",                         subtitle: "Prof. Hernández — Lun/Mié 08:00" },
  { id: "c5", type: "curso", title: "Física II",                           subtitle: "Prof. Ramírez — Mar/Jue 14:00" },
];

// ─── Iconos SVG inline para búsqueda ─────────────────────────
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}

function TaskIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x={3} y={3} width={18} height={18} rx={2} />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CourseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// ─── Global Search Component ──────────────────────────────────
function GlobalSearch() {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: SearchResult[] = query.trim().length > 0
    ? SEARCH_DATA.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showDropdown = isOpen && query.trim().length > 0;

  // Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        return;
      }
      if (e.key === "Enter" && activeIndex >= 0 && activeIndex < results.length) {
        e.preventDefault();
        // In a real app, navigate to the result
        setIsOpen(false);
        setQuery("");
        setActiveIndex(-1);
      }
    },
    [results.length, activeIndex]
  );

  return (
    <div ref={containerRef} className="hidden md:block relative w-full max-w-sm mx-4">
      {/* Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Buscar tareas, cursos..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          className="w-full h-9 pl-9 pr-20 rounded-lg bg-slate-800/80 border border-slate-700/60 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/40 transition-colors"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-700/60 border border-slate-600/50 text-[10px] font-medium text-slate-400 pointer-events-none select-none">
          Ctrl+K
        </kbd>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-lg bg-slate-900 border border-slate-700/70 shadow-xl shadow-black/30 overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              Sin resultados para &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="py-1 max-h-72 overflow-y-auto">
              {results.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                      setActiveIndex(-1);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      index === activeIndex
                        ? "bg-slate-800 text-slate-100"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    {item.type === "tarea" ? (
                      <TaskIcon className="w-4 h-4 flex-shrink-0 text-orange-400" />
                    ) : (
                      <CourseIcon className="w-4 h-4 flex-shrink-0 text-sky-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        item.type === "tarea"
                          ? "bg-orange-500/15 text-orange-400"
                          : "bg-sky-500/15 text-sky-400"
                      }`}
                    >
                      {item.type === "tarea" ? "Tarea" : "Curso"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Header Component ──────────────────────────────────────────
function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name ?? FALLBACK_USER.name;
  const userInitials = getInitials(session?.user?.name) ?? FALLBACK_USER.initials;

  const pageTitle = NAV_ITEMS.find(
    (item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  )?.label ?? "Dashboard";

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Izquierda */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-100">{pageTitle}</h1>
      </div>

      {/* Centro — búsqueda global */}
      <GlobalSearch />

      {/* Derecha */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-400" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-slate-800">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-medium text-slate-300 leading-tight">{userName}</p>
            <p className="text-[10px] text-slate-600 leading-tight">Anáhuac</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-orange-400">{userInitials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Root Dashboard Layout ─────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:w-56 xl:w-60 flex-shrink-0">
        <div className="w-full">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar móvil — overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-60 z-50">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
