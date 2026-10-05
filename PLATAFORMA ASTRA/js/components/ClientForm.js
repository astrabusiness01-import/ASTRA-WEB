import { esc, $, $$, imageFileToDataUrl, toast } from "../lib/dom.js";
import { defaultAppIds, validateApps } from "../config/plans.js";
import { PlanSelector, AppSelector } from "./AppSelector.js";
import { BrandSettings, BrandPreview } from "./BrandSettings.js";
import { TenantLogo } from "./TenantLogo.js";
import { icon } from "./Icon.js";

export const EMPTY_TENANT = {
  name: "", tradeName: "", dashboardName: "", logo: "",
  primaryColor: "#D4A03C", secondaryColor: "#E8952F",
  description: "", contact: { email: "", phone: "", city: "" },
  status: "active", plan: "start", apps: ["catalogo"], isDemo: false,
};

/** Formulario para crear o editar un cliente (tenant). */
export function ClientForm(t, { isNew }) {
  return `<form class="form" novalidate data-client-form>
    <section class="card form-section">
      <div class="form-section__head"><h2>Datos del negocio</h2><p>Cómo se identifica este cliente en la plataforma.</p></div>
      <div class="fields">
        <div class="field">
          <label for="name">Nombre del negocio *</label>
          <input class="input" id="name" name="name" required value="${esc(t.name)}" placeholder="Ej.: Perfumería XYZ">
          <span class="error-text" data-error-for="name" hidden></span>
        </div>
        <div class="field">
          <label for="tradeName">Nombre comercial</label>
          <input class="input" id="tradeName" name="tradeName" value="${esc(t.tradeName)}" placeholder="Ej.: XYZ Perfumes">
        </div>
        ${isNew ? `<div class="field">
          <label for="tenantId">Identificador (tenantId)</label>
          <input class="input" id="tenantId" name="tenantId" placeholder="Se genera del nombre" pattern="[a-z0-9-]*">
          <small>Solo minúsculas, números y guiones. Si lo dejas vacío, se genera solo.</small>
        </div>` : `<div class="field">
          <span class="label">Identificador (tenantId)</span>
          <input class="input" value="${esc(t.id)}" disabled>
          <small>No cambia: todos los datos del cliente se asocian a este id.</small>
        </div>`}
        <div class="field">
          <label for="status">Estado</label>
          <select class="select" id="status" name="status">
            <option value="active"${t.status === "active" ? " selected" : ""}>Activo</option>
            <option value="paused"${t.status === "paused" ? " selected" : ""}>Pausado</option>
          </select>
        </div>
        <div class="field field--full">
          <label for="description">Descripción</label>
          <textarea class="textarea" id="description" name="description" placeholder="A qué se dedica este negocio">${esc(t.description)}</textarea>
        </div>
        <label class="check-line field--full"><input type="checkbox" name="isDemo"${t.isDemo ? " checked" : ""}> Es un cliente de demostración (sus métricas se muestran como DEMO)</label>
      </div>
    </section>

    <section class="card form-section">
      <div class="form-section__head"><h2>Contacto</h2><p>Datos para comunicarte con el negocio.</p></div>
      <div class="fields">
        <div class="field"><label for="email">Correo</label><input class="input" type="email" id="email" name="email" value="${esc(t.contact.email)}" placeholder="contacto@negocio.com"></div>
        <div class="field"><label for="phone">WhatsApp / teléfono</label><input class="input" type="tel" id="phone" name="phone" value="${esc(t.contact.phone)}" placeholder="+51 ..."></div>
        <div class="field"><label for="city">Ciudad</label><input class="input" id="city" name="city" value="${esc(t.contact.city)}" placeholder="Lima"></div>
      </div>
    </section>

    <section class="card form-section">
      <div class="form-section__head"><h2>Marca</h2><p>Logo, colores y nombre que verá el cliente en su dashboard.</p></div>
      ${BrandSettings(t)}
    </section>

    <section class="card form-section">
      <div class="form-section__head"><h2>Plan y microapps</h2><p>El plan define qué microapps se pueden habilitar.</p></div>
      ${PlanSelector(t.plan)}
      <div data-app-selector>${AppSelector(t.plan, t.apps)}</div>
      <span class="error-text" data-error-for="apps" hidden></span>
    </section>

    <div class="form-actions">
      <a class="btn" href="#/admin/clients">Cancelar</a>
      <button class="btn btn--primary" type="submit">${icon("plus")}${isNew ? "Crear cliente" : "Guardar cambios"}</button>
    </div>
  </form>`;
}

/** Conecta los eventos del formulario. onSubmit recibe los datos listos para store.saveTenant(). */
export function mountClientForm(root, initial, onSubmit) {
  const form = $("[data-client-form]", root);
  const state = { logo: initial.logo || "" };

  const values = () => {
    const fd = new FormData(form);
    return {
      ...initial,
      name: fd.get("name"),
      tradeName: fd.get("tradeName"),
      tenantId: fd.get("tenantId") || undefined,
      status: fd.get("status"),
      description: fd.get("description"),
      isDemo: fd.get("isDemo") === "on",
      contact: { email: fd.get("email"), phone: fd.get("phone"), city: fd.get("city") },
      logo: state.logo,
      primaryColor: fd.get("primaryColor"),
      secondaryColor: fd.get("secondaryColor"),
      dashboardName: fd.get("dashboardName"),
      plan: fd.get("plan"),
      apps: fd.getAll("apps"),
    };
  };

  const refreshBrand = () => {
    const v = values();
    $("[data-brand-preview]", form).outerHTML = BrandPreview(v);
    $("[data-logo-preview]", form).innerHTML = TenantLogo(v, "lg");
    $("[data-logo-clear]", form).hidden = !state.logo;
  };

  // Plan → recalcula las microapps permitidas
  $$('input[name="plan"]', form).forEach((r) =>
    r.addEventListener("change", () => {
      const v = values();
      $("[data-app-selector]", form).innerHTML = AppSelector(v.plan, defaultAppIds(v.plan, v.apps));
      showError("apps", "");
    })
  );

  // Colores: selector ↔ código hex
  $$('input[type="color"]', form).forEach((c) => {
    const hex = $(`[data-hex-for="${c.name}"]`, form);
    c.addEventListener("input", () => { hex.value = c.value; refreshBrand(); });
    hex.addEventListener("input", () => {
      if (/^#[0-9a-f]{6}$/i.test(hex.value)) { c.value = hex.value; refreshBrand(); }
    });
  });
  ["name", "tradeName", "dashboardName"].forEach((n) => form.elements[n].addEventListener("input", refreshBrand));

  // Logo
  $("[data-logo-input]", form).addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state.logo = await imageFileToDataUrl(file);
      refreshBrand();
    } catch (err) { toast(err.message); }
    e.target.value = "";
  });
  $("[data-logo-clear]", form).addEventListener("click", () => { state.logo = ""; refreshBrand(); });

  function showError(field, msg) {
    const el = $(`[data-error-for="${field}"]`, form);
    el.textContent = msg;
    el.hidden = !msg;
    if (form.elements[field]?.setAttribute) form.elements[field].setAttribute("aria-invalid", msg ? "true" : "false");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = values();
    let ok = true;
    if (!String(v.name).trim()) { showError("name", "Escribe el nombre del negocio."); ok = false; } else showError("name", "");
    const appsError = validateApps(v.plan, v.apps);
    if (appsError) { showError("apps", appsError); ok = false; } else showError("apps", "");
    if (!ok) { $('[aria-invalid="true"], .error-text:not([hidden])', form)?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    try { await onSubmit(v); } catch (err) { toast(err.message); btn.disabled = false; }
  });
}
