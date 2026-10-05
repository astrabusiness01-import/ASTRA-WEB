// =============================================================
// REGISTRO CENTRAL DE MICROAPPS
// Toda la interfaz (tarjetas, rutas, selectores, matriz) se genera desde aquí.
// Para agregar una microapp nueva, añade un objeto a esta lista. Nada más.
// =============================================================
//
// Campos:
//   id            identificador único; también es el segmento de la ruta
//   name          nombre visible
//   description   texto corto para la tarjeta
//   category      agrupa las apps en el panel admin
//   icon          nombre del icono en components/Icon.js
//   status        "available"   existe y se puede asignar a clientes
//                 "development" en construcción, se puede asignar pero aún no abre
//                 "soon"        próximamente: visible en el catálogo, no se puede asignar
//   route         ruta dentro del dashboard del cliente
//   slot          posición entre las 5 microapps prometidas en los programas (opcional)
//   modules       secciones internas de la microapp (opcional)
//   externalUrl   versión publicada que ya existe fuera de la plataforma (opcional)
//   externalTenant  tenant dueño de esa versión publicada: solo él la abre,
//                 porque hoy esas apps muestran datos de ese negocio.

export const APPS = [
  {
    id: "catalogo",
    name: "Catálogo de productos",
    description: "Tus productos con fotos y precios, filtros y carrito que envía el pedido por WhatsApp.",
    category: "Ventas",
    icon: "catalog",
    status: "available",
    route: "/client/apps/catalogo",
    slot: 1,
    externalUrl: "https://pagina-consolidado-perfumes.vercel.app",
    externalTenant: "astra",
  },
  {
    id: "gestion-clientes",
    name: "Gestión de clientes",
    description: "Ordena a tus clientes, sus recojos y despachos, consolidados y la liquidación de cada uno.",
    category: "Operaciones",
    icon: "crm",
    status: "available",
    route: "/client/apps/gestion-clientes",
    slot: 2,
    // Despachos y Liquidaciones viven dentro de esta microapp (igual que en FUSIONES ASTRA).
    modules: [
      { id: "clientes", name: "Clientes" },
      { id: "despachos", name: "Recojos y despachos" },
      { id: "consolidados", name: "Consolidados" },
      { id: "liquidaciones", name: "Liquidaciones" },
    ],
    externalUrl: "https://fusiones-astra.vercel.app",
    externalTenant: "astra",
  },
  {
    id: "cotizador-courier",
    name: "Cotizador de courier",
    description: "Calcula cuánto cuesta traer compras de USA a Perú: flete por kilo, desaduanaje e impuestos.",
    category: "Ventas",
    icon: "calculator",
    status: "development",
    route: "/client/apps/cotizador-courier",
    slot: 3,
  },
  {
    id: "cotizador-perfumes",
    name: "Cotizador de perfumes",
    description: "Cotiza perfumes importados con su precio final puesto en Perú. Candidata a microapp 4.",
    category: "Ventas",
    icon: "perfume",
    status: "soon",
    route: "/client/apps/cotizador-perfumes",
    externalUrl: "https://astra-cotizador-perfumes.vercel.app",
    externalTenant: "astra",
  },
  {
    id: "metricas",
    name: "Métricas",
    description: "Ventas, pedidos y clientes de tu negocio en un solo tablero.",
    category: "Análisis",
    icon: "chart",
    status: "soon",
    route: "/client/apps/metricas",
  },
  {
    id: "control-pedidos",
    name: "Control de pedidos",
    description: "Sigue cada pedido desde la compra en USA hasta la entrega a tu cliente.",
    category: "Operaciones",
    icon: "orders",
    status: "soon",
    route: "/client/apps/control-pedidos",
  },
];

export const APP_STATUS = {
  available: { label: "Disponible", tone: "ok" },
  development: { label: "En desarrollo", tone: "warn" },
  soon: { label: "Próximamente", tone: "muted" },
};

export const getApp = (id) => APPS.find((a) => a.id === id) || null;

/** Apps que el admin puede asignar a un cliente. */
export const assignableApps = () => APPS.filter((a) => a.status !== "soon");

/** URL externa que puede abrir un tenant para esta app, o null. */
export function externalUrlFor(app, tenantId) {
  if (!app?.externalUrl) return null;
  return !app.externalTenant || app.externalTenant === tenantId ? app.externalUrl : null;
}
