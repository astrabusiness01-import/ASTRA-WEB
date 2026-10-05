import { esc, readableOn } from "../lib/dom.js";
import { icon } from "./Icon.js";
import { TenantLogo } from "./TenantLogo.js";

/** Campos de marca (white label) con vista previa en vivo. */
export function BrandSettings(t) {
  return `<div class="fields">
    <div class="field field--full">
      <span class="label">Logo</span>
      <div class="logo-upload">
        <span data-logo-preview>${TenantLogo(t, "lg")}</span>
        <label class="btn btn--sm">${icon("upload")}Subir logo<input type="file" accept="image/*" data-logo-input class="sr-only"></label>
        <button type="button" class="btn btn--sm btn--ghost" data-logo-clear${t.logo ? "" : " hidden"}>${icon("trash")}Quitar</button>
      </div>
      <small>PNG, JPG o WebP. Se reduce a 256 px. Sin logo se muestran las iniciales.</small>
    </div>
    <div class="field">
      <label for="primaryColor">Color principal</label>
      <div class="color-field"><input type="color" id="primaryColor" name="primaryColor" value="${esc(t.primaryColor)}"><input class="input" data-hex-for="primaryColor" value="${esc(t.primaryColor)}" maxlength="7" aria-label="Código del color principal"></div>
    </div>
    <div class="field">
      <label for="secondaryColor">Color secundario</label>
      <div class="color-field"><input type="color" id="secondaryColor" name="secondaryColor" value="${esc(t.secondaryColor)}"><input class="input" data-hex-for="secondaryColor" value="${esc(t.secondaryColor)}" maxlength="7" aria-label="Código del color secundario"></div>
    </div>
    <div class="field field--full">
      <label for="dashboardName">Nombre del dashboard</label>
      <input class="input" id="dashboardName" name="dashboardName" value="${esc(t.dashboardName)}" placeholder="Ej.: Panel Aurora">
    </div>
    <div class="field field--full">
      <span class="label">Vista previa</span>
      ${BrandPreview(t)}
    </div>
  </div>`;
}

export function BrandPreview(t) {
  const p = t.primaryColor || "#D4A03C";
  const s = t.secondaryColor || p;
  const style = `--p-grad:linear-gradient(135deg, ${esc(p)}, ${esc(s)});--p-on:${readableOn(p)};--p-brand:${esc(p)}`;
  return `<div class="brand-preview" data-brand-preview style="${style}">
    <div class="brand-preview__bar">${TenantLogo(t, "sm")}<div><strong>${esc(t.dashboardName || t.tradeName || t.name || "Nombre del negocio")}</strong><span>Bienvenido, ${esc(t.tradeName || t.name || "tu negocio")}</span></div></div>
    <div class="brand-preview__body"><span class="brand-preview__chip">Catálogo</span><span class="brand-preview__chip">Gestión de clientes</span><span class="brand-preview__chip">Métricas</span></div>
  </div>`;
}
