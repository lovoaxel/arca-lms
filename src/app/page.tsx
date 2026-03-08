import { GraduationCap, BookOpen, Calendar, Bell, Moon, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Brightspace <span className="text-indigo-400">Plus</span>
          </span>
        </div>
        <span className="text-sm text-[#8B949E]">Universidad Anáhuac</span>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-400 mb-8">
          <Zap className="w-4 h-4" />
          Tu portal universitario, reinventado
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Brightspace{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            Plus
          </span>
        </h1>

        <p className="text-[#8B949E] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Todas las funcionalidades de Brightspace Anáhuac con una interfaz moderna,
          inteligente y diseñada para ti. Con IA integrada y notificaciones en tiempo real.
        </p>

        <a
          href="/api/auth/login"
          className="group flex items-center gap-3 bg-white text-[#0D1117] font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 hover:scale-105"
        >
          <svg className="w-6 h-6" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
            <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
          </svg>
          Iniciar sesión con cuenta Anáhuac
        </a>

        <p className="text-[#6E7681] text-sm mt-4">
          Usa tus credenciales institucionales de Microsoft
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
            title: "Cursos modernos",
            desc: "Vista clara de tus materias, tareas y calificaciones en un solo lugar.",
          },
          {
            icon: <Calendar className="w-6 h-6 text-blue-400" />,
            title: "Calendario inteligente",
            desc: "Fechas de entrega organizadas con prioridades y recordatorios automáticos.",
          },
          {
            icon: <Bell className="w-6 h-6 text-[#3FB950]" />,
            title: "Notificaciones reales",
            desc: "Alertas por Telegram cuando suban tareas nuevas o se acerquen entregas.",
          },
          {
            icon: <Moon className="w-6 h-6 text-violet-400" />,
            title: "Modo oscuro",
            desc: "Diseñado para largas sesiones de estudio. Tus ojos te lo agradecerán.",
          },
          {
            icon: <Zap className="w-6 h-6 text-[#D29922]" />,
            title: "IA integrada",
            desc: "Asistente Jarvis disponible en todo momento para ayudarte con tus tareas.",
          },
          {
            icon: <GraduationCap className="w-6 h-6 text-[#F85149]" />,
            title: "Hecho para Anáhuac",
            desc: "Conectado directamente a tu cuenta institucional. Sin complicaciones.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 hover:bg-[#1C2128] transition-all duration-200"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2 text-[#E6EDF3]">{f.title}</h3>
            <p className="text-[#8B949E] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center text-[#6E7681] text-sm pb-8">
        Brightspace Plus — Desarrollado por Axel Lovo · Universidad Anáhuac 2026
      </footer>
    </main>
  );
}
