// Pantalla de inicio. Hoy simula el login: eliges con qué usuario entrar.
// Mañana aquí irá el formulario de acceso único (ver auth/session.js).
import { esc, $$ } from "../lib/dom.js";
import { navigate } from "../router.js";
import { listUsers, listTenants } from "../data/store.js";
import { signInAs } from "../auth/session.js";
import { TenantLogo } from "../components/TenantLogo.js";
import { roleLabel } from "../components/UserMenu.js";
import { icon } from "../components/Icon.js";

export async function HomeView() {
  const [users, tenants] = await Promise.all([listUsers(), listTenants()]);
  const byId = Object.fromEntries(tenants.map((t) => [t.id, t]));
  const admin = users.find((u) => u.role === "admin");
  const clientUsers = users.filter((u) => u.tenantId && byId[u.tenantId]);
  document.title = "Plataforma ASTRA";

  document.getElementById("app").innerHTML = `<div class="home"><div class="home__box">
    <div class="home__head">
      <span class="astra-logo"><img src="assets/img/astra-star-mark.webp" alt="">ASTRA</span>
      <h1>Plataforma <span>ASTRA</span></h1>
      <p>Un solo lugar para administrar las microapps de cada negocio. Elige cómo quieres entrar.</p>
    </div>
    <div class="grid grid--2">
      <section class="card card--accent role-card">
        <span class="metric__ico">${icon("shield")}</span>
        <h2>Administrador</h2>
        <p>Crea clientes, configura su marca y decide qué microapps tiene cada uno.</p>
        <button class="btn btn--primary" type="button" data-user="${esc(admin?.id)}">Entrar al panel admin ${icon("arrow")}</button>
      </section>
      <section class="card role-card">
        <span class="metric__ico">${icon("clients")}</span>
        <h2>Cliente</h2>
        <p>Entra al dashboard de un negocio y mira solo sus microapps.</p>
        <div class="tenant-pick">${clientUsers.map((u) => {
          const t = byId[u.tenantId];
          return `<button type="button" data-user="${esc(u.id)}">
            ${TenantLogo(t, "sm")}
            <span style="min-width:0"><span class="tenant-pick__name">${esc(t.name)}</span><br>
            <span class="tenant-pick__sub">${esc(u.name)} · ${esc(roleLabel(u.role))}</span></span>
          </button>`;
        }).join("")}</div>
      </section>
    </div>
    <p class="home__note">${icon("lock")} Vista de prueba: todavía no hay login real. Más adelante habrá un acceso único que te llevará a tu panel según tu usuario.</p>
  </div></div>`;

  $$("[data-user]").forEach((b) =>
    b.addEventListener("click", async () => navigate(await signInAs(b.dataset.user)))
  );
}
