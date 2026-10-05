import { esc } from "../lib/dom.js";
import { APPS, APP_STATUS } from "../config/apps.js";
import { PLANS, getPlan, allowedAppIds } from "../config/plans.js";
import { icon } from "./Icon.js";

/** Opciones de plan (radios). */
export function PlanSelector(planId) {
  return `<div class="plan-options" role="radiogroup" aria-label="Plan">${PLANS.map((p) => `
    <label class="choice">
      <input type="radio" name="plan" value="${p.id}"${p.id === planId ? " checked" : ""}>
      <span class="choice__title">${esc(p.name)}${p.public ? "" : ' <span class="pill pill--muted">No público</span>'}</span>
      <span class="choice__desc">${esc(p.price)} · ${esc(p.description)}</span>
    </label>`).join("")}</div>`;
}

/**
 * Microapps marcables según la regla del plan.
 * STAR-T ("elige 1") usa radios; los demás planes, casillas.
 */
export function AppSelector(planId, selected = []) {
  const plan = getPlan(planId);
  if (!plan) return '<div class="notice">Elige un plan para ver qué microapps puede tener este cliente.</div>';
  if (plan.rule.type === "none") {
    return `<div class="notice notice--warn">${esc(plan.name)} no incluye la plataforma. El cliente no tendrá microapps.</div>`;
  }
  const allowed = allowedAppIds(planId);
  const isChoose = plan.rule.type === "choose";
  const type = isChoose ? "radio" : "checkbox";
  const help = isChoose
    ? `Con ${plan.short} el cliente elige ${plan.rule.count} microapp entre las opciones habilitadas.`
    : plan.rule.type === "all"
      ? `${plan.short} incluye todas las microapps disponibles. Puedes desmarcar alguna si hace falta.`
      : "Elige libremente las microapps de este cliente.";
  return `<p class="hint">${esc(help)}</p>
  <div class="app-options">${APPS.map((a) => {
    const enabled = allowed.includes(a.id);
    const st = APP_STATUS[a.status];
    return `<label class="choice">
      <input type="${type}" name="apps" value="${a.id}"${selected.includes(a.id) && enabled ? " checked" : ""}${enabled ? "" : " disabled"}>
      <span class="choice__title">${icon(a.icon)} ${esc(a.name)}</span>
      <span class="choice__desc">${enabled ? esc(a.category) : a.status === "soon" ? "Próximamente" : `No incluida en ${esc(plan.short)}`}
        ${a.status !== "available" && a.status !== "soon" ? ` · ${st.label}` : ""}</span>
    </label>`;
  }).join("")}</div>`;
}
