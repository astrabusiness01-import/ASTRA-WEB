import { esc, formatDate } from "../lib/dom.js";
import { href } from "../router.js";
import { getPlan } from "../config/plans.js";
import { icon } from "./Icon.js";
import { TenantLogo } from "./TenantLogo.js";

export const statusPill = (t) =>
  t.status === "active"
    ? '<span class="pill pill--ok"><span class="dot"></span>Activo</span>'
    : '<span class="pill pill--warn"><span class="dot"></span>Pausado</span>';

export const demoPill = (t) => (t.isDemo ? '<span class="pill pill--demo">DEMO</span>' : "");

/** Fila de la tabla de clientes (desktop). */
export function ClientRow(t) {
  const plan = getPlan(t.plan);
  return `<tr>
    <td><div class="client-row">${TenantLogo(t)}<div style="min-width:0">
      <div class="client-row__name">${esc(t.name)}</div>
      <div class="client-row__sub"><code>${esc(t.id)}</code></div></div></div></td>
    <td><div class="row">${statusPill(t)}${demoPill(t)}</div></td>
    <td>${esc(plan?.short || "—")}</td>
    <td class="c">${t.apps.length}</td>
    <td>${formatDate(t.createdAt)}</td>
    <td><div class="row" style="justify-content:flex-end;flex-wrap:nowrap">
      <a class="btn btn--sm" href="${href(`/admin/clients/${t.id}`)}">${icon("eye")}Ver</a>
      <a class="btn btn--sm" href="${href(`/admin/clients/${t.id}/edit`)}">${icon("edit")}Editar</a>
    </div></td>
  </tr>`;
}

/** Tarjeta de cliente (móvil). */
export function ClientCard(t) {
  const plan = getPlan(t.plan);
  return `<article class="card client-card">
    <div class="client-row">${TenantLogo(t)}<div style="min-width:0">
      <div class="client-row__name">${esc(t.name)}</div>
      <div class="client-row__sub">Creado el ${formatDate(t.createdAt)}</div></div></div>
    <div class="client-card__meta">${statusPill(t)}${demoPill(t)}
      <span class="pill">${esc(plan?.short || "Sin plan")}</span>
      <span class="pill">${t.apps.length} microapp${t.apps.length === 1 ? "" : "s"}</span></div>
    <div class="client-card__actions">
      <a class="btn btn--sm" href="${href(`/admin/clients/${t.id}`)}">${icon("eye")}Ver</a>
      <a class="btn btn--sm" href="${href(`/admin/clients/${t.id}/edit`)}">${icon("edit")}Editar</a>
    </div>
  </article>`;
}
