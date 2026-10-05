import { $ } from "../../lib/dom.js";
import { href } from "../../router.js";
import { listTenants } from "../../data/store.js";
import { AdminLayout } from "../../components/Layout.js";
import { SearchBar } from "../../components/SearchBar.js";
import { ClientRow, ClientCard } from "../../components/ClientCard.js";
import { EmptyState } from "../../components/EmptyState.js";
import { icon } from "../../components/Icon.js";

export async function AdminClientsView({ path, session }) {
  const tenants = await listTenants();
  const content = AdminLayout({
    path, session, title: "Clientes",
    body: `
    <div class="page-head">
      <div><h1>Clientes</h1><p>Cada cliente es un negocio con su propio espacio, marca y microapps.</p></div>
      <a class="btn btn--primary" href="${href("/admin/clients/new")}">${icon("plus")}Crear cliente</a>
    </div>
    <div class="toolbar">
      ${SearchBar({ id: "q", placeholder: "Buscar cliente…" })}
      <select class="select" id="status-filter" style="width:auto" aria-label="Filtrar por estado">
        <option value="">Todos los estados</option><option value="active">Activos</option><option value="paused">Pausados</option>
      </select>
    </div>
    <div id="list"></div>`,
  });

  const draw = () => {
    const q = $("#q", content).value.trim().toLowerCase();
    const st = $("#status-filter", content).value;
    const rows = tenants.filter((t) =>
      (!st || t.status === st) &&
      (!q || [t.name, t.tradeName, t.id].some((s) => String(s).toLowerCase().includes(q)))
    );
    $("#list", content).innerHTML = rows.length
      ? `<div class="table-wrap clients-table"><table>
          <thead><tr><th>Cliente</th><th>Estado</th><th>Plan</th><th class="c">Microapps</th><th>Creado</th><th><span class="sr-only">Acciones</span></th></tr></thead>
          <tbody>${rows.map(ClientRow).join("")}</tbody></table></div>
         <div class="client-cards">${rows.map(ClientCard).join("")}</div>`
      : EmptyState({
          icon: "clients",
          title: tenants.length ? "Ningún cliente coincide" : "Aún no tienes clientes",
          text: tenants.length ? "Prueba con otro nombre o quita el filtro." : "Crea tu primer cliente para darle su propio espacio.",
          action: tenants.length ? "" : `<a class="btn btn--primary" href="${href("/admin/clients/new")}">${icon("plus")}Crear cliente</a>`,
        });
  };
  $("#q", content).addEventListener("input", draw);
  $("#status-filter", content).addEventListener("change", draw);
  draw();
}
