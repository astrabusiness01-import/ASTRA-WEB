// =============================================================
// SESIÓN (simulada)
// NO es seguridad real: cualquiera puede elegir un usuario en la pantalla
// de inicio. Solo deja lista la forma del flujo futuro:
//
//   login → identificar usuario → identificar su tenant
//         → admin: /admin   |   cliente: /client
//
// Cuando exista un proveedor de login (p. ej. Supabase Auth), solo cambia
// este archivo: signIn() llamará al proveedor y getSession() leerá su sesión.
// Las vistas siguen usando getSession() y los guards igual que hoy.
// =============================================================

import { getUser, getTenant } from "../data/store.js";

const KEY = "plataforma-astra:session";
const PREVIEW_KEY = "plataforma-astra:preview";

function readId() {
  try { return sessionStorage.getItem(KEY); } catch { return null; }
}

function readPreview() {
  try { return sessionStorage.getItem(PREVIEW_KEY); } catch { return null; }
}

/**
 * Devuelve { user, tenant, isAdmin, isPreview } o null si no hay sesión.
 * Un admin puede "ver como" un tenant (vista previa); en ese caso tenant es el previsualizado.
 */
export async function getSession() {
  const id = readId();
  if (!id) return null;
  const user = await getUser(id);
  if (!user) return null;
  const isAdmin = user.role === "admin";
  const previewId = isAdmin ? readPreview() : null;
  const tenantId = previewId || user.tenantId;
  const tenant = tenantId ? await getTenant(tenantId) : null;
  return { user, tenant, isAdmin, isPreview: Boolean(previewId && tenant) };
}

/** Admin: ver el dashboard de un cliente tal como lo verá él. */
export function startPreview(tenantId) {
  try { sessionStorage.setItem(PREVIEW_KEY, tenantId); } catch { /* sin almacenamiento */ }
}

export function stopPreview() {
  try { sessionStorage.removeItem(PREVIEW_KEY); } catch { /* nada que limpiar */ }
}

/** Simula el login eligiendo un usuario. Devuelve la ruta de destino. */
export async function signInAs(userId) {
  const user = await getUser(userId);
  if (!user) throw new Error("Usuario no encontrado.");
  try {
    sessionStorage.setItem(KEY, user.id);
    sessionStorage.removeItem(PREVIEW_KEY);
  } catch { /* sin almacenamiento: no habrá sesión */ }
  return user.role === "admin" ? "/admin" : "/client";
}

export function signOut() {
  try {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(PREVIEW_KEY);
  } catch { /* nada que limpiar */ }
}

/** El panel admin solo es para el administrador de la plataforma. */
export async function requireAdmin() {
  const s = await getSession();
  return s?.isAdmin ? s : null;
}

/** El dashboard del cliente necesita un usuario con tenant activo. */
export async function requireTenant() {
  const s = await getSession();
  return s?.tenant ? s : null;
}

/** Comprueba si el tenant de la sesión tiene habilitada una microapp. */
export function canUseApp(session, appId) {
  return Boolean(session?.tenant && session.tenant.status === "active" && session.tenant.apps.includes(appId));
}
