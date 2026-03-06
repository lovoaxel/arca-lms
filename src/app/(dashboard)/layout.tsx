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
import { useState } from "react";

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
            <p className="text-sm font-semibold text-white leading-tight">Brightspace</p>
            <p className="text-[10px] font-medium text-orange-400 uppercase tracking-wider leading-tight">Plus</p>
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
