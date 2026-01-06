/**
 * Router Guards
 *
 * Maneja el acceso a rutas públicas y privadas
 */

import { getToken } from "@/api/apiClient";

/**
 * Guard de autenticación
 * Verifica si el usuario tiene token para acceder a rutas protegidas
 */
export function authGuard(to, from, next) {
  const requiresAuth = to.meta?.requiresAuth;
  const isPublicOnly = to.meta?.publicOnly; // Rutas solo para no autenticados (login, register)
  const token = getToken();

  // Si la ruta requiere auth y no hay token → redirigir al login
  if (requiresAuth && !token) {
    return next({
      path: "/",
      query: { redirect: to.fullPath }, // Guardar la ruta original para redirigir después del login
    });
  }

  // Si la ruta es solo pública (login) y ya está autenticado → redirigir al dashboard
  if (isPublicOnly && token) {
    return next("/dashboard");
  }

  // Continuar normalmente
  next();
}

/**
 * Guard de roles (para uso futuro)
 * Verifica si el usuario tiene el rol necesario
 */
export function roleGuard(allowedRoles) {
  return (to, from, next) => {
    const user = JSON.parse(sessionStorage.getItem("authUser") || "{}");
    const userRole = user?.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      next("/unauthorized"); // O redirigir a donde prefieras
    }
  };
}

/**
 * Registra todos los guards en el router
 */
export function setupGuards(router) {
  router.beforeEach(authGuard);
}
