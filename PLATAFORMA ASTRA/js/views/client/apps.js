import { getApp } from "../../config/apps.js";
import { ClientLayout } from "../../components/Layout.js";
import { AppGrid } from "../../components/AppGrid.js";

export async function ClientAppsView({ path, session }) {
  const t = session.tenant;
  const apps = t.status === "active" ? t.apps.map(getApp).filter(Boolean) : [];
  ClientLayout({
    path, session, title: "Mis aplicaciones",
    body: `
    <div class="page-head"><div><h1>Mis aplicaciones</h1><p>Las herramientas habilitadas para tu negocio.</p></div></div>
    ${AppGrid(apps, t.status === "active" ? {} : { emptyTitle: "Tu cuenta está pausada", emptyText: "Escríbenos para reactivarla." })}`,
  });
}
