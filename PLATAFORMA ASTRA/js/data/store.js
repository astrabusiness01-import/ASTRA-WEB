// =============================================================
// CAPA DE DATOS
// Toda la interfaz lee y escribe SOLO a través de estas funciones.
// Hoy guardan en localStorage (mock). Para conectar una base real
// (Supabase o Vercel Blob + API), reemplaza el cuerpo de cada función por
// una llamada al backend; las firmas ya son async y no cambian.
//
// Entidades: Tenant (incluye BrandSettings y TenantApp), User, Activity.
// Subscription = tenant.plan por ahora.
// =============================================================

import { buildSeed } from "./seed.js";
import { assignableApps } from "../config/apps.js";

const KEY = "plataforma-astra:v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const db = JSON.parse(raw);
      if (db?.version === 1) return db;
    }
  } catch { /* almacenamiento no disponible o dañado: se usan los datos iniciales */ }
  const db = buildSeed();
  persist(db);
  return db;
}

function persist(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    throw new Error("No se pudo guardar. Revisa que el navegador permita almacenamiento local o usa un logo más liviano.");
  }
}

const clone = (v) => structuredClone(v);
const slugify = (s) =>
  String(s || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 40) || "cliente";

// ---------- Tenants ----------

export async function listTenants() {
  return clone(load().tenants).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTenant(tenantId) {
  const t = load().tenants.find((x) => x.id === tenantId);
  return t ? clone(t) : null;
}

/** Crea (sin id) o actualiza (con id) un tenant. Devuelve el tenant guardado. */
export async function saveTenant(input) {
  const db = load();
  const validApps = new Set(assignableApps().map((a) => a.id));
  const data = {
    name: String(input.name || "").trim(),
    tradeName: String(input.tradeName || "").trim(),
    dashboardName: String(input.dashboardName || "").trim(),
    logo: input.logo || "",
    primaryColor: input.primaryColor || "#D4A03C",
    secondaryColor: input.secondaryColor || input.primaryColor || "#E8952F",
    description: String(input.description || "").trim(),
    contact: {
      email: String(input.contact?.email || "").trim(),
      phone: String(input.contact?.phone || "").trim(),
      city: String(input.contact?.city || "").trim(),
    },
    status: input.status === "paused" ? "paused" : "active",
    plan: input.plan,
    apps: [...new Set(input.apps || [])].filter((id) => validApps.has(id)),
    isDemo: Boolean(input.isDemo),
  };
  if (!data.name) throw new Error("El nombre del negocio es obligatorio.");

  let tenant;
  const idx = input.id ? db.tenants.findIndex((t) => t.id === input.id) : -1;
  if (idx >= 0) {
    tenant = { ...db.tenants[idx], ...data };
    db.tenants[idx] = tenant;
    pushActivity(db, tenant.id, `Se actualizó la configuración de ${tenant.name}.`);
  } else {
    let id = slugify(input.tenantId || data.tradeName || data.name);
    const base = id;
    for (let n = 2; db.tenants.some((t) => t.id === id); n++) id = `${base}-${n}`;
    tenant = { id, ...data, createdAt: new Date().toISOString() };
    db.tenants.push(tenant);
    pushActivity(db, id, `Se creó el cliente ${tenant.name}.`);
  }
  persist(db);
  return clone(tenant);
}

export async function setTenantStatus(tenantId, status) {
  const db = load();
  const t = db.tenants.find((x) => x.id === tenantId);
  if (!t) throw new Error("Cliente no encontrado.");
  t.status = status === "paused" ? "paused" : "active";
  pushActivity(db, t.id, `${t.name} quedó ${t.status === "active" ? "activo" : "pausado"}.`);
  persist(db);
  return clone(t);
}

// ---------- Users ----------

export async function listUsers({ tenantId } = {}) {
  const users = load().users;
  return clone(tenantId === undefined ? users : users.filter((u) => u.tenantId === tenantId));
}

export async function getUser(userId) {
  const u = load().users.find((x) => x.id === userId);
  return u ? clone(u) : null;
}

// ---------- Activity ----------

function pushActivity(db, tenantId, text) {
  db.activity.push({ id: `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, tenantId, text, at: new Date().toISOString() });
  if (db.activity.length > 300) db.activity.splice(0, db.activity.length - 300);
}

/** Sin tenantId: toda la actividad (solo admin). Con tenantId: solo la de ese tenant. */
export async function listActivity({ tenantId, limit = 8 } = {}) {
  const all = load().activity;
  const rows = tenantId === undefined ? all : all.filter((a) => a.tenantId === tenantId);
  return clone(rows).sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

// ---------- Métricas ----------

/**
 * Métricas de un tenant. Los tenants DEMO reciben números ficticios estables.
 * Los tenants reales devuelven null hasta que las microapps reporten datos.
 */
export async function getTenantMetrics(tenantId) {
  const t = load().tenants.find((x) => x.id === tenantId);
  if (!t) return null;
  const keys = ["ventas", "pedidos", "clientes", "despachos"];
  if (!t.isDemo) return { isDemo: false, values: Object.fromEntries(keys.map((k) => [k, null])) };
  let seed = [...tenantId].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const rnd = (min, max) => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return min + (seed % (max - min + 1));
  };
  return {
    isDemo: true,
    values: { ventas: rnd(2500, 18000), pedidos: rnd(20, 160), clientes: rnd(15, 120), despachos: rnd(5, 60) },
  };
}

// ---------- Mantenimiento ----------

export async function resetDemoData() {
  const db = buildSeed();
  persist(db);
  return true;
}

export async function exportData() {
  return clone(load());
}
