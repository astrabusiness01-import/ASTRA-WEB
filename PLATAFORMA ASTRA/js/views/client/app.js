import { esc } from "../../lib/dom.js";
import { href } from "../../router.js";
import { getApp, externalUrlFor } from "../../config/apps.js";
import { canUseApp } from "../../auth/session.js";
import { ClientLayout } from "../../components/Layout.js";
import { EmptyState } from "../../components/EmptyState.js";
import { icon } from "../../components/Icon.js";

/**
 * Punto de entrada de cada microapp: /client/apps/:appId
 * Cuando una microapp se integre, aquí se cargará su módulo
 * (p. ej. import(`../../apps/${app.id}/index.js`)) pasándole el tenantId.
 */
export async function ClientAppView({ path, session, params }) {
  const app = getApp(params.appId);
  const back = `<a class="btn" href="${href("/client/apps")}">${icon("back")}Mis aplicaciones</a>`;

  if (!app) {
    ClientLayout({ path, session, title: "Aplicación", body: EmptyState({ icon: "search", title: "Esta aplicación no existe", action: back }) });
    return;
  }
  if (!canUseApp(session, app.id)) {
    ClientLayout({
      path, session, title: app.name,
      body: EmptyState({
        icon: "lock",
        title: "No tienes acceso a esta aplicación",
        text: session.tenant.status === "active" ? `${app.name} no está habilitada para tu negocio. Escríbenos si quieres agregarla.` : "Tu cuenta está pausada.",
        action: back,
      }),
    });
    return;
  }

  const external = externalUrlFor(app, session.tenant.id);
  ClientLayout({
    path, session, title: app.name,
    body: `
    <div><a class="btn btn--sm btn--ghost" href="${href("/client/apps")}">${icon("back")}Mis aplicaciones</a></div>
    <section class="card app-screen">
      <span class="app-card__ico">${icon(app.icon)}</span>
      <span class="eyebrow">${esc(app.category)}</span>
      <h1>${esc(app.name)}</h1>
      <p>${esc(app.description)}</p>
      ${app.modules ? `<div class="row" style="justify-content:center">${app.modules.map((m) => `<span class="pill">${esc(m.name)}</span>`).join("")}</div>` : ""}
      <div class="notice" style="text-align:left">Esta aplicación estará disponible próximamente.${external ? " Mientras tanto, puedes usar la versión que ya está publicada." : ""}</div>
      ${external ? `<a class="btn btn--primary" href="${esc(external)}" target="_blank" rel="noopener">${icon("external")}Abrir versión publicada</a>` : ""}
    </section>`,
  });
}
