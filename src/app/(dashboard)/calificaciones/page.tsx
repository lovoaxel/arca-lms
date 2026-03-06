import { BarChart3 } from "lucide-react";

export default function CalificacionesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
        <BarChart3 className="w-7 h-7 text-orange-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-200">Calificaciones</h2>
        <p className="text-sm text-slate-500 mt-1">Esta sección está en desarrollo.</p>
      </div>
    </div>
  );
}
