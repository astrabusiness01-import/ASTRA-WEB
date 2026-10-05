import { esc, $, formatDate, toast } from "../../lib/dom.js";
import { href, navigate, render } from "../../router.js";
import { getTenant, listUsers, listActivity, setTenantStatus } from "../../data/store.js";
import { getApp } from "../../config/apps.js";
import { getPlan } from "../../config/plans.js";
import { startPreview } from "../../auth/session.js";
import { AdminLayout } from "../../components/Layout.js";
import { AppGrid } from "../../components/AppGrid.js";
import { ActivityList } from "../../components/ActivityList.js";
import { TenantLogo } from "../../components/TenantLogo.js";
import { BrandPreview } from "../../components/BrandSettings.js";
import { statusPill, demoPill } from "../../components/ClientCard.js";
import { EmptyState } from "../../components/EmptyState.js";
import { roleLabel } from "../../components/UserMenu.js";
import { icon } from "../../components/Icon.js";

export async function AdminClientDetailView({ path, session, params }) {
  const t = await getTenant(params.id);
  if (!t) {
    AdminLayout({ path, session, title: "Cliente", body: EmptyState({ icon: "clients", title: "Cliente no encontrado", action: `<a class="btn" href="${href("/admin/clients")}">Volver a clientes</a>` }) });
    return;
  }
  // Solo datos de ESTE tenant
  const [users, activity] = await Promise.all([listUsers({ tenantId: t.id }), listActivity({ tenantId: t.id, limit: 6 })]);
  const plan = getPlan(t.plan);
  const apps = t.apps.map(getApp).filter(Boolean);
  const c = t.contact;

  const content = AdminLayout({
    path, session, title: t.name,
    body: `
    <div><a class="btn btn--sm btn--ghost" href="${href("/admin/clients")}">${icon("back")}Clientes</a></div>
    <div class="page-head">
      <div class="client-row" style="align-items:center">${TenantLogo(t, "lg")}
        <div style="min-width:0"><h1>${esc(t.name)}</h1>
        <div class="row" style="margin-top:6px">${statusPill(t)}${demoPill(t)}<span class="pill">${esc(plan?.short || "Sin plan")}</span><span class="pill"><code>${esc(t.id)}</code></span></div></div>
      </div>
      <div class="row">
        <button class="btn" type="button" data-toggle-status>${t.status === "active" ? "Pausar" : "Activar"}</button>
        <a class="btn" href="${href(`/admin/clients/${t.id}/edit`)}">${icon("edit")}Editar</a>
        <button class="btn btn--primary" type="button" data-preview>${icon("eye")}Ver su dashboard</button>
      </div>
    </div>

    <div class="grid grid--2">
      <section class="card">
        <div class="card__head"><h2 class="section-title">Datos del negocio</h2></div>
        <dl class="kv">
          <dt>Nombre comercial</dt><dd>${esc(t.tradeName || "—")}</dd>
          <dt>Descripción</dt><dd>${esc(t.description || "—")}</dd>
          <dt>Correo</dt><dd>${esc(c.email || "—")}</dd>
          <dt>Teléfono</dt><dd>${esc(c.phone || "—")}</dd>
          <dt>Ciudad</dt><dd>${esc(c.city || "—")}</dd>
          <dt>Creado</dt><dd>${formatDate(t.createdAt)}</dd>
          <dt>Plan</dt><dd>${esc(plan ? `${plan.name} (${plan.price})` : "—")}</dd>
        </dl>
      </section>
      <section class="card">
        <div class="card__head"><h2 class="section-title">Marca</h2><a class="btn btn--sm btn--ghost" href="${href(`/admin/clients/${t.id}/edit`)}">Cambiar</a></div>
        <dl class="kv" style="margin-bottom:14px">
          <dt>Dashboard</dt><dd>${esc(t.dashboardName || "—")}</dd>
          <dt>Principal</dt><dd><span class="swatch" style="background:${esc(t.primaryColor)}"></span><code>${esc(t.primaryColor)}</code></dd>
          <dt>Secundario</dt><dd><span class="swatch" style="background:${esc(t.secondaryColor)}"></span><code>${esc(t.secondaryColor)}</code></dd>
        </dl>
        ${BrandPreview(t)}
      </section>
    </div>

    <section class="grid" style="gap:14px">
      <div class="toolbar"><h2 class="section-title">Microapps habilitadas (${apps.length})</h2><a class="btn btn--sm" href="${href(`/admin/clients/${t.id}/edit`)}">${icon("apps")}Asignar microapps</a></div>
      ${AppGrid(apps, { link: false, emptyTitle: "Sin microapps", emptyText: plan?.rule.type === "none" ? `${plan.name} no incluye la plataforma.` : "Edita el cliente para asignarle microapps." })}
    </section>

    <div class="grid grid--2">
      <section class="card">
        <div class="card__head"><h2 class="section-title">Usuarios</h2></div>
        ${users.length ? `<ul class="activity">${users.map((u) => `<li style="align-items:center"><span class="avatar">${esc(u.name[0])}</span><div style="min-width:0"><div class="activity__text">${esc(u.name)}${u.isDemo ? ' <span class="pill pill--demo">DEMO</span>' : ""}</div><div class="activity__time">${esc(roleLabel(u.role))} · ${esc(u.email)}</div></div></li>`).join("")}</ul>`
          : EmptyState({ icon: "users", title: "Sin usuarios", text: "Cuando exista el login, aquí invitarás a las personas de este negocio." })}
      </section>
      <section class="card">
        <div class="card__head"><h2 class="section-title">Actividad</h2></div>
        ${ActivityList(activity)}
      </section>
    </div>`,
  });

  $("[data-preview]", content).addEventListener("click", () => { startPreview(t.id); navigate("/client"); });
  $("[data-toggle-status]", content).addEventListener("click", async () => {
    await setTenantStatus(t.id, t.status === "active" ? "paused" : "active");
    toast(t.status === "active" ? "Cliente pausado" : "Cliente activado");
    render();
  });
}
