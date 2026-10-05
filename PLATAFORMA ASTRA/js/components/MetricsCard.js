import { esc } from "../lib/dom.js";
import { icon } from "./Icon.js";

/** Tarjeta de métrica. value null = aún sin datos. */
export function MetricsCard({ label, value, icon: ico = "chart", hint = "", demo = false }) {
  const shown = value === null || value === undefined ? "—" : esc(value);
  return `<div class="card metric">
    <div class="metric__top"><span>${esc(label)}</span><span class="metric__ico">${icon(ico)}</span></div>
    <div class="metric__value">${shown}</div>
    <div class="row">
      ${demo ? '<span class="pill pill--demo">DEMO</span>' : ""}
      ${hint ? `<span class="metric__hint">${esc(hint)}</span>` : ""}
    </div>
  </div>`;
}
