import { esc } from "../lib/dom.js";
import { icon } from "./Icon.js";

/** Barra superior: botón de menú (móvil), título y acciones a la derecha. */
export function Header({ title, right = "" }) {
  return `<header class="topbar">
    <button class="btn btn--icon btn--ghost menu-btn" type="button" data-menu-toggle aria-label="Abrir menú">${icon("menu")}</button>
    <div class="topbar__title">${esc(title)}</div>
    <div class="topbar__spacer"></div>
    ${right}
  </header>`;
}
