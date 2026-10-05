import { esc, formatDate } from "../../lib/dom.js";
import { href } from "../../router.js";
import { listTenants, listUsers, listActivity } from "../../data/store.js";
import { APPS, assignableApps } from "../../config/apps.js";
import { getPlan } from "../../config/plans.js";
import { AdminLayout } from "../../components/Layout.js";
import { MetricsCard } from "../../components/MetricsCard.js";
import { ActivityList } from "../../components/ActivityList.js";
import { TenantLogo } from "../../components/TenantLogo.js";
import { statusPill, demoPill } from "../../components/ClientCard.js";
import { icon } from "../../components/Icon.js";

export async function AdminDashboardView({ path, session }) {
  const [tenants, users, activity] = await Promise.all([listTenants(), listUsers(), listActivity({ limit: 6 })]);
  const active = tenants.filter((t) => t.status === "active").length;
  const demos = tenants.filter((t) => t.isDemo).length;

  AdminLayout({
    path, session, title: "Dashboard",
    body: `
    <div class="page-head">
      <div><span class="eyebrow">Panel maestro</span><h1>Hola, ${esc(session.user.name.split(" ")[0])}</h1>
      <p>Así va tu plataforma hoy. ${demos ? `Incluye ${demos} cliente${demos === 1 ? "" : "s"} DEMO con datos ficticios.` : ""}</p></div>
      <a class="btn btn--primary" href="${href("/admin/clients/new")}">${icon("plus")}Crear cliente</a>
    </div>
    <div class="grid grid--metrics">
      ${MetricsCard({ label: "Total de clientes", value: tenants.length, icon: "clients", hint: demos ? `${demos} DEMO` : "" })}
      ${MetricsCard({ label: "Clientes activos", value: active, icon: "activity", hint: `${tenants.length - active} pausados` })}
      ${MetricsCard({ label: "Microapps disponibles", value: assignableApps().length, icon: "apps", hint: `${APPS.length - assignableApps().length} próximamente` })}
      ${MetricsCard({ label: "Usuarios", value: users.length, icon: "users", hint: "Sin login real aún" })}
    </div>
    <div class="grid grid--2">
      <section class="card">
        <div class="card__head"><h2 class="section-title">Clientes recientes</h2><a class="btn btn--sm btn--ghost" href="${href("/admin/clients")}">Ver todos ${icon("arrow")}</a></div>
        <ul class="activity">${tenants.slice(0, 5).map((t) => `
          <li style="align-items:center">${TenantLogo(t, "sm")}
            <div style="flex:1;min-width:0"><a href="${href(`/admin/clients/${t.id}`)}" class="client-row__name">${esc(t.name)}</a>
            <div class="activity__time">${esc(getPlan(t.plan)?.short || "—")} · ${t.apps.length} microapps · ${formatDate(t.createdAt)}</div></div>
            <div class="row">${statusPill(t)}${demoPill(t)}</div>
          </li>`).join("")}</ul>
      </section>
      <section class="card">
        <div class="card__head"><h2 class="section-title">Actividad reciente</h2></div>
        ${ActivityList(activity)}
      </section>
    </div>`,
  });
}
