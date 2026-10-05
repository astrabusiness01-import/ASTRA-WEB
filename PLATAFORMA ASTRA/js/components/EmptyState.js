import { esc } from "../lib/dom.js";
import { icon } from "./Icon.js";

export function EmptyState({ icon: ico = "sparkle", title, text = "", action = "" }) {
  return `<div class="empty">
    <div class="empty__ico">${icon(ico)}</div>
    <h3>${esc(title)}</h3>
    ${text ? `<p>${esc(text)}</p>` : ""}
    ${action}
  </div>`;
}
