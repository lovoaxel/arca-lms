export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tareas/:path*",
    "/calendario/:path*",
    "/calificaciones/:path*",
    "/cursos/:path*",
  ],
};
