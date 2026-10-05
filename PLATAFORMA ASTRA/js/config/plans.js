// =============================================================
// PLANES COMERCIALES DE ASTRA
// Equivalen a FREE / PRO / PREMIUM: Kit ≈ sin plataforma, STAR-T ≈ PRO
// con elección, 1v1 ≈ PREMIUM. Aún no hay pagos: el admin asigna el plan.
// =============================================================
//
// Reglas de microapps por plan:
//   { type: "none" }                          no incluye plataforma
//   { type: "choose", count, from: [ids] }    el cliente elige `count` apps de `from`
//   { type: "all" }                           todas las apps asignables
//   { type: "custom" }                        el admin elige libremente (tenant interno)

import { assignableApps } from "./apps.js";

export const PLANS = [
  {
    id: "kit",
    name: "Kit Mi Primera Importación",
    short: "Kit",
    price: "S/ 25",
    public: true,
    description: "Guía para tu primera importación. No incluye la plataforma.",
    rule: { type: "none" },
  },
  {
    id: "start",
    name: "STAR-T",
    short: "STAR-T",
    price: "S/ 99",
    public: true,
    description: "Tu usuario en la plataforma y 1 microapp a elegir: Catálogo o Gestión de clientes.",
    rule: { type: "choose", count: 1, from: ["catalogo", "gestion-clientes"] },
  },
  {
    id: "1v1",
    name: "1v1 · Mentoría 6 meses",
    short: "1v1",
    price: "S/ 3,000",
    public: false, // no se muestra en público
    description: "Las 5 microapps habilitadas y enseñanza para automatizar tu negocio con IA.",
    rule: { type: "all" },
  },
  {
    id: "interno",
    name: "Interno ASTRA",
    short: "Interno",
    price: "—",
    public: false,
    description: "Para el propio negocio ASTRA. El admin elige las microapps sin restricciones.",
    rule: { type: "custom" },
  },
];

export const getPlan = (id) => PLANS.find((p) => p.id === id) || null;

/** Apps que se pueden marcar con este plan. */
export function allowedAppIds(planId) {
  const plan = getPlan(planId);
  const all = assignableApps().map((a) => a.id);
  if (!plan) return [];
  switch (plan.rule.type) {
    case "none": return [];
    case "choose": return plan.rule.from.filter((id) => all.includes(id));
    default: return all;
  }
}

/** Selección inicial sugerida al cambiar de plan. */
export function defaultAppIds(planId, current = []) {
  const plan = getPlan(planId);
  if (!plan) return [];
  const allowed = allowedAppIds(planId);
  if (plan.rule.type === "all") return allowed;
  if (plan.rule.type === "choose") {
    const kept = current.filter((id) => allowed.includes(id)).slice(0, plan.rule.count);
    return kept.length ? kept : allowed.slice(0, plan.rule.count);
  }
  if (plan.rule.type === "custom") return current.filter((id) => allowed.includes(id));
  return [];
}

/** Valida una selección de apps contra el plan. Devuelve un mensaje de error o null. */
export function validateApps(planId, appIds) {
  const plan = getPlan(planId);
  if (!plan) return "Elige un plan.";
  const allowed = allowedAppIds(planId);
  const outside = appIds.filter((id) => !allowed.includes(id));
  if (outside.length) return `El plan ${plan.short} no incluye algunas de las microapps marcadas.`;
  if (plan.rule.type === "choose" && appIds.length !== plan.rule.count) {
    return `Con ${plan.short} el cliente elige exactamente ${plan.rule.count} microapp.`;
  }
  return null;
}
