# PLATAFORMA ASTRA

Hub multi-cliente (multi-tenant) de las **microapps** de ASTRA. Desde el panel admin creas negocios, les pones su marca y decides qué microapps tiene cada uno. Cada negocio entra a su propio dashboard y ve **solo** sus microapps y sus datos.

> Primera versión: funciona con datos de prueba guardados en el navegador. Todavía **no** hay login real, base de datos ni pagos (ver "Qué sigue").

## Cómo verla

```bash
python3 tools/serve.py
# abre http://localhost:8770
```

En Vercel se publica tal cual (sitio estático, sin build). En la pantalla de inicio eliges entrar como **Administrador** o como uno de los **clientes**.

## Rutas

Se usa un router por hash (`/#/admin`), que funciona igual en local y en Vercel sin configurar reescrituras.

| Ruta | Pantalla |
|---|---|
| `/#/` | Inicio (hoy simula el login) |
| `/#/admin` | Dashboard del administrador |
| `/#/admin/clients` | Lista de clientes |
| `/#/admin/clients/new` | Crear cliente |
| `/#/admin/clients/:id` | Ver cliente |
| `/#/admin/clients/:id/edit` | Editar cliente (marca, plan, microapps) |
| `/#/admin/apps` | Catálogo de microapps y matriz cliente × microapp |
| `/#/admin/users` | Usuarios |
| `/#/admin/settings` | Planes, respaldo y datos de demostración |
| `/#/client` | Dashboard del cliente (con su marca) |
| `/#/client/apps` | Mis aplicaciones |
| `/#/client/apps/:app` | Entrada de cada microapp |

## Archivos

```
index.html               carga estilos y js/main.js
css/tokens.css           colores y tipografía de la marca ASTRA
css/app.css              estilos de toda la interfaz
js/main.js               registra las rutas
js/router.js             router por hash
js/config/apps.js        REGISTRO CENTRAL de microapps
js/config/plans.js       planes Kit / STAR-T / 1v1 y sus reglas
js/data/store.js         CAPA DE DATOS (hoy localStorage)
js/data/seed.js          datos iniciales: ASTRA + 2 clientes DEMO
js/auth/session.js       sesión simulada y guards (aquí irá el login)
js/lib/dom.js            utilidades (escape de HTML, colores, fechas)
js/components/           AdminSidebar, ClientSidebar, Header, AppCard, AppGrid,
                         ClientCard, ClientForm, AppSelector, BrandSettings,
                         SearchBar, UserMenu, MetricsCard, EmptyState, ...
js/views/admin/          pantallas del panel admin
js/views/client/         pantallas del dashboard del cliente
tools/serve.py           servidor local sin caché
tablero.html             inventario de microapps (versión 0)
PLAN-PLATAFORMA.md       plan por fases
PROMPT-PLATAFORMA.md     prompt original del proyecto
```

## Cómo funciona

**Un cliente (tenant)** es un objeto con un `id` único (el `tenantId`):

```js
{
  id: "demo-perfumeria",              // tenantId
  name: "Perfumería Aurora (DEMO)", tradeName: "Aurora Perfumes",
  logo: "data:image/webp;…",           // o una ruta; sin logo se usan iniciales
  primaryColor: "#C04D7A", secondaryColor: "#7A2F8F", dashboardName: "Panel Aurora",   // BrandSettings
  plan: "start",                       // Subscription
  apps: ["catalogo"],                  // TenantApp: microapps habilitadas
  status: "active", isDemo: true, contact: {…}, createdAt: "…"
}
```

- **tenantId:** se genera del nombre comercial al crear el cliente (o lo escribes tú) y no cambia. Usuarios (`user.tenantId`) y actividad (`activity.tenantId`) se guardan con él. Las vistas del cliente consultan siempre con el `tenantId` de la sesión, nunca con uno que venga de la URL, así que un cliente no puede pedir datos de otro.
- **Asignar microapps:** en *Crear/Editar cliente* eliges el plan y marcas las microapps. `plans.js` aplica la regla: Kit = ninguna, STAR-T = **elige 1** entre Catálogo y Gestión de clientes, 1v1 = todas, Interno = libre. El dashboard del cliente muestra solo `tenant.apps`, y la ruta `/client/apps/:app` bloquea las que no tiene.
- **Cambiar la marca:** en *Editar cliente → Marca* (logo, 2 colores y nombre del dashboard), con vista previa en vivo. El dashboard del cliente aplica esos colores como variables CSS (`--brand`, `--brand-2`). El panel admin siempre usa la marca ASTRA.
- **Agregar una microapp:** añade un objeto a `APPS` en `js/config/apps.js`. Las tarjetas, el selector, la matriz y la ruta salen solas. Si ya está publicada en otro lado, ponle `externalUrl` y `externalTenant` (solo ese tenant ve el botón, porque esa versión tiene sus datos).
- **Despachos y Liquidaciones:** son **módulos de "Gestión de clientes"**, igual que hoy en FUSIONES ASTRA, porque comparten clientes y pedidos. Separarlas duplicaría datos. Si un día se venden por separado, basta con crear su entrada en `APPS`.
- **Vista previa:** desde *Ver cliente → Ver su dashboard*, el admin ve el dashboard tal como lo verá ese cliente.

## Qué sigue

1. **Login real (acceso único):** cambiar `js/auth/session.js` para que `signIn` use un proveedor (Supabase Auth, enlace mágico o código). Tras el login, el usuario trae su `role` y `tenantId`: admin → `/admin`, cliente → `/client`. Las microapps integradas leen la misma sesión, así que no hay que volver a iniciar sesión.
2. **Base de datos real:** reemplazar el cuerpo de las funciones de `js/data/store.js` (`listTenants`, `getTenant`, `saveTenant`, `listUsers`, `listActivity`, `getTenantMetrics`…) por llamadas a Supabase o a una API en Vercel (con Vercel Blob). Tablas: `tenants`, `users`, `apps`, `tenant_apps`, `brand_settings`, `activity`, `subscriptions`. La seguridad va en el servidor: en Supabase, *Row Level Security* filtrando por `tenant_id`.
3. **Clientes reales:** invitaciones por correo, alta de usuarios por tenant, logos en almacenamiento de archivos (no en dataURL) y convertir cada microapp a multiusuario (que guarde sus datos con `tenantId`).
4. **SaaS comercial:** pagos (Mercado Pago, Culqi o Stripe) conectados a `plan`, activación y pausa automáticas por pago, dominio propio, términos y privacidad, métricas reales que reporten las microapps y respaldos.
