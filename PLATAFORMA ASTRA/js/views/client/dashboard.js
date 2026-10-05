import { esc } from "../../lib/dom.js";
import { href } from "../../router.js";
import { listActivity, getTenantMetrics } from "../../data/store.js";
import { getApp } from "../../config/apps.js";
import { getPlan } from "../../config/plans.js";
import { ClientLayout } from "../../components/Layout.js";
import { AppGrid } from "../../components/AppGrid.js";
import { MetricsCard } from "../../components/MetricsCard.js";
import { ActivityList } from "../../components/ActivityList.js";
import { TenantLogo } from "../../components/TenantLogo.js";
import { EmptyState } from "../../components/EmptyState.js";
import { icon } from "../../components/Icon.js";

const METRICS = [
  { key: "ventas", label: "Ventas del mes", icon: "sales", fmt: (v) => `S/ ${v.toLocaleString("es-PE")}` },
  { key: "pedidos", label: "Pedidos", icon: "orders" },
  { key: "clientes", label: "Clientes", icon: "users" },
  { key: "despachos", label: "Despachos", icon: "truck" },
];

export async function ClientDashboardView({ path, session }) {
  const t = session.tenant;
  // Todo se consulta con el tenantId de la sesión: nunca se leen datos de otro negocio.
  const [activity, metrics] = await Promise.all([listActivity({ tenantId: t.id, limit: 5 }), getTenantMetrics(t.id)]);
  const apps = t.status === "active" ? t.apps.map(getApp).filter(Boolean) : [];
  const plan = getPlan(t.plan);
  const name = t.tradeName || t.name;

  ClientLayout({
    path, session, title: "Inicio",
    body: `
    <section class="welcome">
      ${TenantLogo(t, "lg")}
      <div class="welcome__text">
        <span class="eyebrow">${esc(t.dashboardName || "Mi panel")}</span>
        <h1>Bienvenido, ${esc(name)}</h1>
        <p>Gestiona tu negocio desde un solo lugar.</p>
      </div>
      <div class="row">${t.isDemo ? '<span class="pill pill--demo">DEMO</span>' : ""}${plan ? `<span class="pill pill--brand">Plan ${esc(plan.short)}</span>` : ""}</div>
    </section>

    ${t.status !== "active" ? '<div class="notice notice--warn">Tu cuenta está pausada. Escríbenos para reactivarla y volver a usar tus aplicaciones.</div>' : ""}

    <section class="grid" style="gap:14px">
      <div class="toolbar"><h2 class="section-title">Métricas</h2>
        <span class="hint">${metrics?.isDemo ? "Datos de demostración, no son reales." : "Se llenarán cuando tus microapps empiecen a registrar datos."}</span></div>
      <div class="grid grid--metrics">${METRICS.map((m) => {
        const v = metrics?.values[m.key];
        return MetricsCard({ label: m.label, icon: m.icon, value: v == null ? null : (m.fmt ? m.fmt(v) : v), demo: metrics?.isDemo, hint: v == null ? "Sin datos aún" : "" });
      }).join("")}</div>
    </section>

    <section class="grid" style="gap:14px">
      <div class="toolbar"><h2 class="section-title">Mis aplicaciones</h2>${apps.length ? `<a class="btn btn--sm btn--ghost" href="${href("/client/apps")}">Ver todas ${icon("arrow")}</a>` : ""}</div>
      ${AppGrid(apps)}
    </section>

    <div class="grid grid--2">
      <section class="card">
        <div class="card__head"><h2 class="section-title">Accesos rápidos</h2></div>
        ${apps.length ? `<div class="row">${apps.slice(0, 4).map((a) => `<a class="btn btn--sm" href="${href(a.route)}">${icon(a.icon)}${esc(a.name)}</a>`).join("")}</div>`
          : EmptyState({ icon: "apps", title: "Sin accesos todavía" })}
      </section>
      <section class="card">
        <div class="card__head"><h2 class="section-title">Actividad reciente</h2></div>
        ${ActivityList(activity)}
      </section>
    </div>`,
  });
}
