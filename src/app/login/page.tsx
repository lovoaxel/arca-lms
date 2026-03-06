"use client";

import { signIn } from "next-auth/react";
import { GraduationCap, Sparkles } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    await signIn("azure-ad", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/25">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Brightspace Plus</h1>
            <p className="text-sm text-slate-500 mt-1">Portal Anáhuac reimaginado</p>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 mb-6" />

          {/* Welcome text */}
          <div className="mb-6 text-center">
            <h2 className="text-base font-semibold text-slate-200">Bienvenido de regreso</h2>
            <p className="text-sm text-slate-500 mt-1">
              Inicia sesión con tu cuenta institucional de la Anáhuac
            </p>
          </div>

          {/* Microsoft SSO Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-3
              bg-[#2f2f2f] hover:bg-[#3a3a3a]
              border border-slate-700 hover:border-slate-600
              text-white font-medium text-sm
              px-4 py-3 rounded-xl
              transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed
              group
            "
          >
            {/* Microsoft Logo SVG */}
            <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <rect x="0" y="0" width="10" height="10" fill="#F25022" />
              <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
              <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
              <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
            </svg>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-500 border-t-orange-400 rounded-full animate-spin" />
                Conectando...
              </span>
            ) : (
              "Continuar con Microsoft"
            )}
          </button>

          {/* Info note */}
          <div className="mt-4 flex items-start gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Usamos el mismo Microsoft SSO que Brightspace. Tus credenciales no son almacenadas.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-700 mt-6">
          Brightspace Plus · Universidad Anáhuac · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
