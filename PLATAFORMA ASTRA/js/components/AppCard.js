import { esc } from "../lib/dom.js";
import { href } from "../router.js";
import { APP_STATUS } from "../config/apps.js";
import { icon } from "./Icon.js";

/** Tarjeta de microapp. Con `link` es navegable; sin él es informativa (panel admin). */
export function AppCard(app, { link = true, extra = "" } = {}) {
  const st = APP_STATUS[app.status] || APP_STATUS.soon;
  const tag = link ? "a" : "article";
  const attrs = link ? ` href="${href(app.route)}"` : "";
  return `<${tag} class="app-card"${attrs}>
    <div class="app-card__top">
      <span class="app-card__ico">${icon(app.icon)}</span>
      <div><div class="app-card__name">${esc(app.name)}</div><div class="app-card__cat">${esc(app.category)}</div></div>
    </div>
    <p class="app-card__desc">${esc(app.description)}</p>
    ${app.modules ? `<div class="row">${app.modules.map((m) => `<span class="pill">${esc(m.name)}</span>`).join("")}</div>` : ""}
    <div class="app-card__foot">
      <span class="pill pill--${st.tone}"><span class="dot"></span>${st.label}</span>
      ${link ? `<span class="app-card__go">Abrir ${icon("arrow")}</span>` : ""}
      ${extra}
    </div>
  </${tag}>`;
}
