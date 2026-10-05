import { href } from "../router.js";
import { icon } from "./Icon.js";
import { UserMenu } from "./UserMenu.js";

const ITEMS = [
  { path: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { path: "/admin/clients", label: "Clientes", icon: "clients" },
  { path: "/admin/apps", label: "Microapps", icon: "apps" },
  { path: "/admin/users", label: "Usuarios", icon: "users" },
  { path: "/admin/settings", label: "Configuración", icon: "settings" },
];

export function AdminSidebar(current, user) {
  const isActive = (i) => (i.exact ? current === i.path : current === i.path || current.startsWith(i.path + "/"));
  return `<aside class="sidebar" aria-label="Navegación del administrador">
    <div class="sidebar__brand">
      <span class="astra-logo"><img src="assets/img/astra-star-mark.webp" alt="">ASTRA</span>
    </div>
    <div class="sidebar__label">Panel maestro</div>
    <nav>${ITEMS.map((i) => `
      <a class="nav-link${isActive(i) ? " is-active" : ""}" href="${href(i.path)}"${isActive(i) ? ' aria-current="page"' : ""}>${icon(i.icon)}${i.label}</a>`).join("")}
    </nav>
    <div class="sidebar__foot">
      ${UserMenu(user)}
      <button class="nav-link nav-link--button" type="button" data-signout>${icon("logout")}Cambiar de usuario</button>
    </div>
  </aside>`;
}
