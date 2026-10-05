import { esc } from "../lib/dom.js";
import { href } from "../router.js";
import { getApp } from "../config/apps.js";
import { icon } from "./Icon.js";
import { TenantLogo } from "./TenantLogo.js";
import { UserMenu } from "./UserMenu.js";

export function ClientSidebar(current, session) {
  const { tenant, user, isPreview } = session;
  const apps = tenant.apps.map(getApp).filter(Boolean);
  const link = (path, label, ico, exact = false) => {
    const on = exact ? current === path : current === path || current.startsWith(path + "/");
    return `<a class="nav-link${on ? " is-active" : ""}" href="${href(path)}"${on ? ' aria-current="page"' : ""}>${icon(ico)}${esc(label)}</a>`;
  };
  return `<aside class="sidebar" aria-label="Navegación de ${esc(tenant.tradeName || tenant.name)}">
    <div class="sidebar__brand">
      ${TenantLogo(tenant, "sm")}
      <div style="min-width:0">
        <div class="sidebar__brand-name">${esc(tenant.dashboardName || tenant.tradeName || tenant.name)}</div>
        <div class="sidebar__brand-sub">${tenant.isDemo ? "Demo" : "Mi negocio"}</div>
      </div>
    </div>
    <nav>
      ${link("/client", "Inicio", "dashboard", true)}
      ${link("/client/apps", "Mis aplicaciones", "apps", true)}
    </nav>
    ${apps.length ? `<div class="sidebar__label">Aplicaciones</div><nav>${apps.map((a) => link(a.route, a.name, a.icon)).join("")}</nav>` : ""}
    <div class="sidebar__foot">
      ${UserMenu(user, isPreview ? "Admin · vista previa" : undefined)}
      ${isPreview
        ? `<button class="nav-link nav-link--button" type="button" data-stop-preview>${icon("back")}Volver al panel admin</button>`
        : `<button class="nav-link nav-link--button" type="button" data-signout>${icon("logout")}Cambiar de usuario</button>`}
    </div>
  </aside>`;
}
