import { esc } from "../lib/dom.js";
import { icon } from "./Icon.js";

export function SearchBar({ id = "search", placeholder = "Buscar…", value = "" }) {
  return `<label class="search">
    <span class="sr-only">${esc(placeholder)}</span>
    ${icon("search")}
    <input class="input" type="search" id="${esc(id)}" placeholder="${esc(placeholder)}" value="${esc(value)}" autocomplete="off">
  </label>`;
}
