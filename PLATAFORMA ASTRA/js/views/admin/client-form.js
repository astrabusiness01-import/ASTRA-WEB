import { toast } from "../../lib/dom.js";
import { href, navigate } from "../../router.js";
import { getTenant, saveTenant } from "../../data/store.js";
import { AdminLayout } from "../../components/Layout.js";
import { ClientForm, mountClientForm, EMPTY_TENANT } from "../../components/ClientForm.js";
import { EmptyState } from "../../components/EmptyState.js";
import { icon } from "../../components/Icon.js";

export async function AdminClientFormView({ path, session, params }) {
  const isNew = !params.id;
  const tenant = isNew ? structuredClone(EMPTY_TENANT) : await getTenant(params.id);
  const title = isNew ? "Crear cliente" : "Editar cliente";

  if (!tenant) {
    AdminLayout({ path, session, title, body: EmptyState({ icon: "clients", title: "Cliente no encontrado", action: `<a class="btn" href="${href("/admin/clients")}">Volver a clientes</a>` }) });
    return;
  }

  const content = AdminLayout({
    path, session, title,
    body: `
    <div class="page-head">
      <div><a class="btn btn--sm btn--ghost" href="${href(isNew ? "/admin/clients" : `/admin/clients/${tenant.id}`)}">${icon("back")}Volver</a>
      <h1 style="margin-top:8px">${isNew ? "Nuevo cliente" : `Editar ${tenant.name}`}</h1>
      <p>${isNew ? "Al guardar, se crea su espacio con su marca y las microapps que marques." : "Los cambios se aplican al instante en su dashboard."}</p></div>
    </div>
    ${ClientForm(tenant, { isNew })}`,
  });

  mountClientForm(content, tenant, async (values) => {
    const saved = await saveTenant(values);
    toast(isNew ? `Cliente ${saved.name} creado` : "Cambios guardados");
    navigate(`/admin/clients/${saved.id}`);
  });
}
