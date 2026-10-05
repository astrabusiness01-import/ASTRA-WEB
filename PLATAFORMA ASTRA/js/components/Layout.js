import { $, $$, brandVars, esc } from "../lib/dom.js";
import { navigate } from "../router.js";
import { signOut, stopPreview } from "../auth/session.js";
import { AdminSidebar } from "./AdminSidebar.js";
import { ClientSidebar } from "./ClientSidebar.js";
import { Header } from "./Header.js";
import { UserMenu } from "./UserMenu.js";

const root = () => document.getElementById("app");

function wireShell(shell) {
  const close = () => shell.classList.remove("is-open");
  $("[data-menu-toggle]", shell)?.addEventListener("click", () => shell.classList.toggle("is-open"));
  $(".backdrop", shell)?.addEventListener("click", close);
  $$(".sidebar a", shell).forEach((a) => a.addEventListener("click", close));
  $$("[data-signout]", shell).forEach((b) => b.addEventListener("click", () => { signOut(); navigate("/"); }));
  $$("[data-stop-preview]", shell).forEach((b) => b.addEventListener("click", () => { stopPreview(); navigate("/admin/clients"); }));
}

/** Pinta el layout del panel admin (marca ASTRA) y devuelve el contenedor del contenido. */
export function AdminLayout({ path, session, title, body }) {
  document.title = `${title} · Admin · Plataforma ASTRA`;
  root().innerHTML = `<div class="shell">
    ${AdminSidebar(path, session.user)}
    <div class="backdrop"></div>
    <div class="main">
      ${Header({ title, right: UserMenu(session.user) })}
      <main class="content" id="content">${body}</main>
    </div>
  </div>`;
  const shell = $(".shell", root());
  wireShell(shell);
  return $("#content", shell);
}

/** Pinta el layout del cliente con SU marca (white label). */
export function ClientLayout({ path, session, title, body }) {
  const t = session.tenant;
  document.title = `${title} · ${t.dashboardName || t.tradeName || t.name}`;
  const banner = session.isPreview
    ? `<div class="notice" style="margin:0;border-radius:0;border-width:0 0 1px">Estás viendo el dashboard de <b>${esc(t.name)}</b> como administrador. Así lo verá el cliente.</div>`
    : "";
  root().innerHTML = `<div class="shell" style="${brandVars(t.primaryColor, t.secondaryColor)}">
    ${ClientSidebar(path, session)}
    <div class="backdrop"></div>
    <div class="main">
      ${banner}
      ${Header({ title, right: UserMenu(session.user, session.isPreview ? "Admin · vista previa" : undefined) })}
      <main class="content" id="content">${body}</main>
    </div>
  </div>`;
  const shell = $(".shell", root());
  wireShell(shell);
  return $("#content", shell);
}
