// Datos iniciales de la plataforma (mock).
// "astra" es el negocio real: solo su configuración, sin datos privados de clientes.
// Los demás tenants son DEMO, con datos ficticios.

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

export function buildSeed() {
  const tenants = [
    {
      id: "astra",
      name: "ASTRA Importaciones",
      tradeName: "ASTRA",
      dashboardName: "Centro ASTRA",
      logo: "assets/img/astra-star-mark.webp",
      primaryColor: "#D4A03C",
      secondaryColor: "#E8952F",
      description: "Comunidad de importaciones desde USA: courier, consolidados, perfumes e iPhones.",
      contact: { email: "", phone: "", city: "Lima, Perú" },
      status: "active",
      plan: "interno",
      apps: ["catalogo", "gestion-clientes", "cotizador-courier"],
      isDemo: false,
      createdAt: daysAgo(36),
    },
    {
      id: "demo-perfumeria",
      name: "Perfumería Aurora (DEMO)",
      tradeName: "Aurora Perfumes",
      dashboardName: "Panel Aurora",
      logo: "",
      primaryColor: "#C04D7A",
      secondaryColor: "#7A2F8F",
      description: "Negocio ficticio de demostración: perfumería con plan STAR-T.",
      contact: { email: "demo@aurora.example", phone: "+51 900 000 001", city: "Arequipa (DEMO)" },
      status: "active",
      plan: "start",
      apps: ["catalogo"],
      isDemo: true,
      createdAt: daysAgo(12),
    },
    {
      id: "demo-importaciones",
      name: "Importaciones Nova (DEMO)",
      tradeName: "Nova Import",
      dashboardName: "Nova · Gestión",
      logo: "",
      primaryColor: "#2E8BC0",
      secondaryColor: "#1D5C8A",
      description: "Negocio ficticio de demostración: importadora con plan 1v1.",
      contact: { email: "demo@nova.example", phone: "+51 900 000 002", city: "Trujillo (DEMO)" },
      status: "active",
      plan: "1v1",
      apps: ["catalogo", "gestion-clientes", "cotizador-courier"],
      isDemo: true,
      createdAt: daysAgo(5),
    },
  ];

  // User → pertenece a un Tenant (tenantId null = administrador de la plataforma)
  const users = [
    { id: "u-admin", name: "Admin ASTRA", email: "admin@astra.example", role: "admin", tenantId: null, isDemo: false },
    { id: "u-astra", name: "Equipo ASTRA", email: "equipo@astra.example", role: "owner", tenantId: "astra", isDemo: false },
    { id: "u-aurora", name: "Lucía Demo", email: "lucia@aurora.example", role: "owner", tenantId: "demo-perfumeria", isDemo: true },
    { id: "u-nova", name: "Mario Demo", email: "mario@nova.example", role: "owner", tenantId: "demo-importaciones", isDemo: true },
    { id: "u-nova-2", name: "Ana Demo", email: "ana@nova.example", role: "member", tenantId: "demo-importaciones", isDemo: true },
  ];

  // Activity → siempre con tenantId (null = evento de la plataforma)
  const activity = [
    { id: "a1", tenantId: null, text: "Se creó la plataforma ASTRA.", at: daysAgo(36) },
    { id: "a2", tenantId: "astra", text: "Se habilitaron Catálogo, Gestión de clientes y Cotizador de courier.", at: daysAgo(36) },
    { id: "a3", tenantId: "demo-perfumeria", text: "Se creó el cliente Perfumería Aurora (DEMO) con plan STAR-T.", at: daysAgo(12) },
    { id: "a4", tenantId: "demo-perfumeria", text: "Eligió la microapp Catálogo de productos.", at: daysAgo(12) },
    { id: "a5", tenantId: "demo-importaciones", text: "Se creó el cliente Importaciones Nova (DEMO) con plan 1v1.", at: daysAgo(5) },
    { id: "a6", tenantId: "demo-importaciones", text: "Se agregó la usuaria Ana Demo.", at: daysAgo(2) },
  ];

  return { version: 1, tenants, users, activity };
}
