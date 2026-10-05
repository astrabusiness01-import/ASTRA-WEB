import { esc, timeAgo } from "../lib/dom.js";
import { EmptyState } from "./EmptyState.js";

export function ActivityList(items) {
  if (!items.length) return EmptyState({ icon: "activity", title: "Sin actividad todavía" });
  return `<ul class="activity">${items.map((a) => `
    <li><span class="activity__dot"></span>
      <div><div class="activity__text">${esc(a.text)}</div><div class="activity__time">${timeAgo(a.at)}</div></div>
    </li>`).join("")}</ul>`;
}
