import { AppCard } from "./AppCard.js";
import { EmptyState } from "./EmptyState.js";

export function AppGrid(apps, options = {}) {
  if (!apps.length) {
    return EmptyState({
      icon: "apps",
      title: options.emptyTitle || "Aún no tienes aplicaciones",
      text: options.emptyText || "Cuando se habilite una microapp para tu negocio, aparecerá aquí.",
    });
  }
  return `<div class="grid grid--apps">${apps.map((a) => AppCard(a, options)).join("")}</div>`;
}
