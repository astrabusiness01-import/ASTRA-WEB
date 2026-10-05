import { esc } from "../../lib/dom.js";
import { href } from "../../router.js";
import { listTenants } from "../../data/store.js";
import { APPS } from "../../config/apps.js";
import { AdminLayout } from "../../components/Layout.js";
import { AppCard } from "../../components/AppCard.js";
import { TenantLogo } from "../../components/TenantLogo.js";
import { icon } from "../../components/Icon.js";

export async function AdminAppsView({ path, session }) {
  const tenants = await listTenants();
  const usage = (id) => tenants.filter((t) => t.apps.includes(id)).length;
  const categories = [...new Set(APPS.map((a) => a.category))];

  AdminLayout({
    path, session, title: "Microapps",
    body: `
    <div class="page-head"><div><h1>Microapps</h1>
      <p>Se desarrollan una sola vez y se habilitan por cliente. Esta lista sale de <code>js/config/apps.js</code>.</p></div></div>
    ${categories.map((cat) => `
      <section class="grid" style="gap:14px">
        <h2 class="section-title">${esc(cat)}</h2>
        <div class="grid grid--apps">${APPS.filter((a) => a.category === cat).map((a) => AppCard(a, {
          link: false,
          extra: `<span class="pill">${usage(a.id)} cliente${usage(a.id) === 1 ? "" : "s"}</span>${a.externalUrl ? `<a class="pill" href="${esc(a.externalUrl)}" target="_blank" rel="noopener">${icon("external").replace("<svg", '<svg width="12" height="12"')}Versión publicada</a>` : ""}`,
        })).join("")}</div>
      </section>`).join("")}
    <section class="grid" style="gap:14px">
      <h2 class="section-title">Qué microapp tiene cada cliente</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Cliente</th>${APPS.map((a) => `<th class="c" title="${esc(a.name)}">${esc(a.name)}</th>`).join("")}</tr></thead>
        <tbody>${tenants.map((t) => `<tr>
          <td><a class="client-row" href="${href(`/admin/clients/${t.id}`)}">${TenantLogo(t, "sm")}<span class="client-row__name">${esc(t.name)}</span></a></td>
          ${APPS.map((a) => `<td class="c">${t.apps.includes(a.id) ? `<span class="check" aria-label="Habilitada">${icon("check").replace("<svg", '<svg width="18" height="18"')}</span>` : '<span class="cross" aria-label="No habilitada">—</span>'}</td>`).join("")}
        </tr>`).join("")}</tbody>
      </table></div>
    </section>`,
  });
}
