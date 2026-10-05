import { esc } from "../../lib/dom.js";
import { href } from "../../router.js";
import { listUsers, listTenants } from "../../data/store.js";
import { AdminLayout } from "../../components/Layout.js";
import { roleLabel } from "../../components/UserMenu.js";
import { icon } from "../../components/Icon.js";

export async function AdminUsersView({ path, session }) {
  const [users, tenants] = await Promise.all([listUsers(), listTenants()]);
  const byId = Object.fromEntries(tenants.map((t) => [t.id, t]));

  AdminLayout({
    path, session, title: "Usuarios",
    body: `
    <div class="page-head"><div><h1>Usuarios</h1>
      <p>Cada usuario pertenece a un solo negocio (tenant), salvo el administrador de la plataforma.</p></div></div>
    <div class="notice">${icon("lock").replace("<svg", '<svg width="14" height="14" style="vertical-align:-2px"')} Todavía no hay login real: estos usuarios son de prueba. Cuando conectemos el acceso único, aquí podrás invitar, pausar y quitar usuarios.</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Negocio</th></tr></thead>
      <tbody>${users.map((u) => {
        const t = byId[u.tenantId];
        return `<tr>
          <td><div class="client-row"><span class="avatar">${esc(u.name[0])}</span><span class="client-row__name">${esc(u.name)}</span>${u.isDemo ? '<span class="pill pill--demo">DEMO</span>' : ""}</div></td>
          <td>${esc(u.email)}</td>
          <td>${esc(roleLabel(u.role))}</td>
          <td>${t ? `<a href="${href(`/admin/clients/${t.id}`)}">${esc(t.name)}</a>` : u.tenantId ? "—" : "Plataforma"}</td>
        </tr>`;
      }).join("")}</tbody>
    </table></div>`,
  });
}
