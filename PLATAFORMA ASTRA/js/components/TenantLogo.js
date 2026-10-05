import { esc, initials, readableOn } from "../lib/dom.js";

/** Logo del tenant: su imagen o, si no tiene, sus iniciales sobre sus colores. */
export function TenantLogo(tenant, size = "") {
  const cls = `tenant-logo${size ? ` tenant-logo--${size}` : ""}`;
  const p = tenant?.primaryColor || "#D4A03C";
  const s = tenant?.secondaryColor || p;
  const style = `--t-grad:linear-gradient(135deg, ${esc(p)}, ${esc(s)});--t-on:${readableOn(p)}`;
  const label = esc(tenant?.tradeName || tenant?.name || "");
  if (tenant?.logo) {
    return `<span class="${cls}" style="${style}"><img src="${esc(tenant.logo)}" alt="Logo de ${label}"></span>`;
  }
  return `<span class="${cls}" style="${style}" aria-label="${label}">${esc(initials(tenant?.tradeName || tenant?.name))}</span>`;
}
