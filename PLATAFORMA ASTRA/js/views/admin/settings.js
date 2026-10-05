import { esc, $, toast } from "../../lib/dom.js";
import { render } from "../../router.js";
import { resetDemoData, exportData } from "../../data/store.js";
import { PLANS, allowedAppIds } from "../../config/plans.js";
import { getApp } from "../../config/apps.js";
import { AdminLayout } from "../../components/Layout.js";
import { icon } from "../../components/Icon.js";

const ruleText = (p) => {
  switch (p.rule.type) {
    case "none": return "Sin plataforma";
    case "choose": return `Elige ${p.rule.count}: ${p.rule.from.map((id) => getApp(id)?.name).join(" o ")}`;
    case "all": return `Todas (${allowedAppIds(p.id).length} disponibles hoy)`;
    default: return "A elección del admin";
  }
};

export async function AdminSettingsView({ path, session }) {
  const content = AdminLayout({
    path, session, title: "Configuración",
    body: `
    <div class="page-head"><div><h1>Configuración</h1><p>Planes, datos y estado de la plataforma.</p></div></div>
    <section class="grid" style="gap:14px">
      <h2 class="section-title">Planes</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Plan</th><th>Precio</th><th>Microapps</th><th>Público</th></tr></thead>
        <tbody>${PLANS.map((p) => `<tr><td><b style="color:var(--cream)">${esc(p.name)}</b><br><span class="hint">${esc(p.description)}</span></td>
          <td>${esc(p.price)}</td><td>${esc(ruleText(p))}</td><td>${p.public ? "Sí" : "No"}</td></tr>`).join("")}</tbody>
      </table></div>
      <p class="hint">Los planes se editan en <code>js/config/plans.js</code>. Aún no hay pagos: el plan se asigna a mano al crear o editar un cliente.</p>
    </section>
    <div class="grid grid--2">
      <section class="card">
        <div class="card__head"><h2 class="section-title">Datos</h2></div>
        <p class="hint" style="margin-bottom:14px">Hoy los datos se guardan solo en este navegador (localStorage, clave <code>plataforma-astra:v1</code>). La capa <code>js/data/store.js</code> está lista para cambiarse por Supabase o Vercel Blob.</p>
        <div class="row">
          <button class="btn" type="button" data-export>${icon("upload")}Descargar respaldo JSON</button>
          <button class="btn btn--danger" type="button" data-reset>${icon("trash")}Restablecer datos de demostración</button>
        </div>
      </section>
      <section class="card">
        <div class="card__head"><h2 class="section-title">Acceso</h2></div>
        <p class="hint">Login real: <b>pendiente</b>. La sesión de prueba vive en <code>js/auth/session.js</code>; ahí se conectará el acceso único (un solo login que lleva a cada usuario a su panel).</p>
      </section>
    </div>`,
  });

  $("[data-export]", content).addEventListener("click", async () => {
    const blob = new Blob([JSON.stringify(await exportData(), null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `plataforma-astra-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $("[data-reset]", content).addEventListener("click", async () => {
    if (!confirm("Se borrarán los clientes que creaste en este navegador y volverán los datos de demostración. ¿Continuar?")) return;
    await resetDemoData();
    toast("Datos restablecidos");
    render();
  });
}
