import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright y módulos de Node.js (fs, child_process) solo deben correr en el servidor
  serverExternalPackages: ['playwright', '@playwright/browser-chromium', 'fs', 'path'],

  // Deshabilitar Edge Runtime para las API routes que usan Playwright
  // (Playwright requiere Node.js, no funciona en Edge)
  experimental: {},
};

export default nextConfig;
