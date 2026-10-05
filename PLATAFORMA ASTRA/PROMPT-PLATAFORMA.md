# PROMPT — PLATAFORMA ASTRA (HUB MULTI-TENANT DE MICROAPPS)

> Cómo usarlo: abre un chat nuevo de Claude Code con la carpeta `/Users/macbookpro/Documents/PLATAFORMA ASTRA` y escribe: **"Lee PROMPT-PLATAFORMA.md completo y ejecútalo."**

==================================================
0. CONTEXTO ASTRA (LEER PRIMERO)
==================================================

Soy el dueño de **ASTRA**, una comunidad de importaciones en Perú (courier, consolidados, perfumes, iPhones y productos en tendencia desde USA). Esta plataforma es el "hub" de mis microapps. Primero la usaré yo (ASTRA) y luego mis alumnos y clientes.

**Carpeta de este proyecto:** `/Users/macbookpro/Documents/PLATAFORMA ASTRA/`
- Hoy solo contiene `tablero.html` (inventario visual de las microapps), `PLAN-PLATAFORMA.md` (plan por fases) y `README.md`. Léelos antes de empezar.
- **Regla:** cada proyecto vive en su propia carpeta. Todo lo nuevo de la plataforma va AQUÍ. NO modifiques las carpetas de las otras microapps (abajo). Solo enlázalas o léelas como referencia.

**Stack preferido:** HTML + CSS + JavaScript vanilla, sin paso de build, con módulos ES (`<script type="module">`) para separar componentes. Se publica en Vercel. Es el mismo stack de mis otros proyectos. Si consideras que hace falta un framework, explícame por qué ANTES de usarlo y espera mi aprobación.

**Microapps reales de ASTRA (ya existen como proyectos separados, hoy solo con datos de ASTRA):**

| # | Microapp | Qué hace | Link publicado | Carpeta local |
|---|---|---|---|---|
| 1 | **Catálogo de productos** | Productos con fotos y precios, filtros y carrito que envía el pedido por WhatsApp | https://pagina-consolidado-perfumes.vercel.app | `/Users/macbookpro/Documents/PAGINA CONSOLIDADO PERFUMES` |
| 2 | **Gestión de clientes** ("FUSIONES ASTRA") | Clientes, recojos/despachos, consolidados y liquidación por cliente, con panel del creador | https://fusiones-astra.vercel.app | `/Users/macbookpro/Documents/FUSION ` (el nombre termina en espacio) |
| 3 | **Cotizador de courier** | Calcula el costo de traer compras de USA a Perú (US$10/kg, desaduanaje US$5 por producto, 24% de impuestos si pasa de US$200) | Aún sin publicar | `/Users/macbookpro/Documents/PAGINA COTIZADORA` |
| 4 | Por definir | (candidata: Cotizador de perfumes, https://astra-cotizador-perfumes.vercel.app) | | |
| 5 | Por definir | | | |

En el registro central de microapps (sección 8 de abajo), usa ESTAS microapps como base. Puedes dejar además "Métricas" y "Control de pedidos" como "próximamente". Para Despachos y Liquidaciones: en ASTRA hoy viven dentro de "Gestión de clientes" (FUSIONES). Modélalas como módulos de esa microapp o como microapps separadas, pero explícame tu decisión.

**Mis planes comerciales (úsalos en lugar de FREE/PRO/PREMIUM de la sección 18, o mapéalos):**

| Plan | Precio | Microapps |
|---|---|---|
| **Kit Mi Primera Importación** | S/ 25 | Ninguna (no incluye plataforma) |
| **STAR-T** | S/ 99 | Usuario en la plataforma + **elige 1**: Catálogo de productos **o** Gestión de clientes |
| **1v1** (mentoría 6 meses) | S/ 3,000 (no mostrar en público) | **Las 5 microapps** + enseñanza para automatizar con IA |

El sistema de planes debe permitir esa regla de "elige 1 de estas 2" para STAR-T.

**Tenants iniciales (mock):**
- `astra`: ASTRA, el negocio real. Sus microapps publicadas deben abrir sus links reales (las de la tabla).
- 2 negocios de demostración claramente marcados como DEMO, por ejemplo `demo-perfumeria` con plan STAR-T y Catálogo elegido, y `demo-importaciones` con plan 1v1 y todas las microapps.

**Branding de la plataforma (marca ASTRA, no de los tenants):**
- Fondo casi negro que pasa a marrón oscuro (#0a0705 → #20140a). Dorado #D4A03C, ámbar #E8952F, degradado `linear-gradient(135deg, #F2C46A, #D4A03C 45%, #E8952F)`. Texto crema #F4EBDD / #D9CCB6 / #9C8D75.
- Tipografía Poppins (Google Fonts).
- Logo: estrella dorada de contorno hueco + wordmark "A S T R A" con tracking ancho. Isotipo disponible en `/Users/macbookpro/Documents/PAGINA ASTRA/astra/assets/img/astra-star-mark.webp` (cópialo a esta carpeta, no lo enlaces desde fuera).
- Referencia de estilo ya aprobada: `/Users/macbookpro/Documents/PAGINA LANDING ASTRA/programas/programas.css`.
- Cada tenant (white label) usa SUS colores y logo en su dashboard. El panel admin usa la marca ASTRA.

**Fecha límite:** las clases de STAR-T empiezan el **5 de noviembre de 2026**. Para esa fecha deben estar listos al menos el hub, el panel admin y el dashboard del cliente.

---

QUIERO CONSTRUIR UNA PLATAFORMA SAAS MULTI-CLIENTE (MULTI-TENANT) QUE FUNCIONE COMO UN HUB CENTRAL PARA ADMINISTRAR Y OFRECER MÚLTIPLES MICROAPPS A DIFERENTES NEGOCIOS.

IMPORTANTE: ANTES DE MODIFICAR CUALQUIER ARCHIVO, ANALIZA COMPLETAMENTE EL PROYECTO ACTUAL, SU FRAMEWORK, ESTRUCTURA, COMPONENTES Y DEPENDENCIAS. REUTILIZA LO QUE YA EXISTE Y NO ELIMINES FUNCIONALIDADES QUE NO SEAN NECESARIAS PARA ESTE CAMBIO.

==================================================
1. CONCEPTO GENERAL
==================================================

Quiero construir un sistema donde YO sea el administrador principal de la plataforma.

Desde mi propio panel de administración quiero poder crear clientes/negocios.

Cada cliente tendrá su propio espacio dentro de la misma plataforma.

La estructura debe ser:

MI PLATAFORMA
    ↓
PANEL DE ADMINISTRADOR
    ↓
CREAR CLIENTE
    ↓
CONFIGURAR CLIENTE
    ↓
ASIGNAR MICROAPPS
    ↓
CONFIGURAR MARCA
    ↓
DASHBOARD DEL CLIENTE
    ↓
MICROAPPS DEL CLIENTE

NO quiero crear un proyecto diferente desde cero para cada cliente.

Quiero construir el sistema una sola vez y reutilizar las mismas microapps para diferentes clientes.

Cada cliente tendrá:

- Su propio nombre
- Su propio logo
- Sus propios colores
- Sus propios datos
- Sus propias microapps habilitadas
- Sus propios usuarios
- Sus propias métricas
- Su propia configuración

Los datos de un cliente NUNCA deben mezclarse con los datos de otro cliente.

==================================================
2. DOS TIPOS PRINCIPALES DE USUARIO
==================================================

Debe existir conceptualmente:

A. ADMINISTRADOR

Soy yo, el propietario de la plataforma.

Tengo acceso al panel maestro donde puedo administrar todos los clientes y microapps.

B. CLIENTE

Es un negocio que utiliza la plataforma.

El cliente solamente debe poder acceder a su propio espacio y a las microapps que yo le haya habilitado.

IMPORTANTE:

NO implementar todavía autenticación real.

Por ahora quiero construir la arquitectura y la interfaz preparadas para implementarla posteriormente.

==================================================
3. PANEL DEL ADMINISTRADOR
==================================================

Crear un panel administrativo separado.

Ruta conceptual:

/admin

Debe incluir un sidebar con:

- Dashboard
- Clientes
- Microapps
- Usuarios
- Configuración

El dashboard del administrador debe mostrar tarjetas como:

- Total de clientes
- Clientes activos
- Microapps disponibles
- Actividad reciente

Si todavía no existe una base de datos, utiliza datos de demostración claramente identificados.

==================================================
4. GESTIÓN DE CLIENTES
==================================================

Dentro de:

/admin/clients

Quiero poder visualizar una lista de clientes.

Cada cliente debe mostrar:

- Nombre
- Logo
- Estado
- Cantidad de microapps
- Fecha de creación
- Acción "Ver"
- Acción "Editar"

Debe existir un botón:

"+ Crear cliente"

Al crear un cliente quiero poder introducir:

- Nombre del negocio
- Nombre comercial
- Logo
- Color principal
- Color secundario
- Descripción
- Datos de contacto
- Estado
- Microapps disponibles

Ejemplo:

CLIENTE:

Perfumería XYZ

LOGO:

Logo de Perfumería XYZ

COLORES:

Color principal: #...
Color secundario: #...

MICROAPPS:

☑ Catálogo
☑ Despachos
☑ Liquidaciones
☑ Métricas
☐ Cotizador

Al guardar, el sistema debe crear la configuración de ese cliente.

NO quiero duplicar el código completo de la plataforma.

==================================================
5. SISTEMA MULTI-TENANT
==================================================

La arquitectura debe estar preparada desde el principio para funcionar como MULTI-TENANT.

Cada cliente debe tener un identificador único:

tenantId

Ejemplo:

Cliente A:

tenantId = cliente-a

Cliente B:

tenantId = cliente-b

Todas las entidades futuras relacionadas con un cliente deben poder asociarse a ese tenantId.

Ejemplo conceptual:

{
  id: "cliente-a",
  name: "Perfumería XYZ",
  logo: "...",
  primaryColor: "...",
  secondaryColor: "...",
  apps: [...]
}

IMPORTANTE:

Los datos de Cliente A jamás deben aparecer en Cliente B.

Aunque todavía no implementemos una base de datos real, estructura todo pensando en que posteriormente se conectará una base de datos.

==================================================
6. DASHBOARD DEL CLIENTE
==================================================

Cada cliente debe tener su propio dashboard.

Ruta conceptual:

/client

El dashboard debe mostrar:

- Logo del cliente
- Nombre del negocio
- Colores personalizados
- Mensaje de bienvenida
- Microapps disponibles
- Actividad reciente
- Métricas
- Accesos rápidos

Ejemplo:

"Bienvenido, Perfumería XYZ"

"Gestiona tu negocio desde un solo lugar."

Debajo:

MIS APLICACIONES

[ Catálogo ]

[ Despachos ]

[ Liquidaciones ]

[ Métricas ]

El cliente solamente debe ver las microapps que tenga habilitadas.

==================================================
7. MICROAPPS COMO MÓDULOS REUTILIZABLES
==================================================

Las microapps deben funcionar como módulos independientes y reutilizables.

Ejemplos iniciales:

1. Catálogo
2. Despachos
3. Liquidaciones
4. Cotizador
5. Métricas
6. Gestión de clientes
7. Control de pedidos

(ASTRA: ver la tabla de microapps reales en la sección 0.)

IMPORTANTE:

NO desarrolles todavía la funcionalidad completa de estas microapps.

Por ahora solamente crea sus tarjetas, estructura, rutas y placeholders.

Quiero que posteriormente pueda desarrollar una microapp una sola vez y habilitarla para diferentes clientes.

Ejemplo:

MICROAPP: CATÁLOGO

Cliente A → habilitada
Cliente B → habilitada
Cliente C → deshabilitada
Cliente D → habilitada

==================================================
8. CONFIGURACIÓN CENTRAL DE MICROAPPS
==================================================

Quiero que las microapps estén definidas desde una estructura centralizada.

Utiliza una estructura equivalente a:

const apps = [
  {
    id: "catalogo",
    name: "Catálogo",
    description: "Gestiona el catálogo del negocio.",
    category: "Ventas",
    icon: "...",
    status: "active",
    route: "/apps/catalogo"
  },
  {
    id: "despachos",
    name: "Despachos",
    description: "Gestiona los despachos.",
    category: "Operaciones",
    icon: "...",
    status: "active",
    route: "/apps/despachos"
  }
];

(ASTRA: agrega un campo opcional `externalUrl` para las microapps que ya existen publicadas, así el tenant `astra` las abre en su link real mientras no estén integradas.)

La interfaz debe generarse dinámicamente a partir de esta configuración.

Así, cuando posteriormente agregue una nueva microapp, no tenga que modificar manualmente múltiples componentes.

==================================================
9. ASIGNACIÓN DE MICROAPPS A CLIENTES
==================================================

Desde el panel de administrador quiero poder seleccionar qué microapps tiene cada cliente.

Ejemplo:

CLIENTE:

Perfumería XYZ

MICROAPPS:

☑ Catálogo
☑ Despachos
☑ Liquidaciones
☑ Métricas
☐ Cotizador

Al guardar:

El dashboard de Perfumería XYZ debe mostrar solamente las microapps seleccionadas.

==================================================
10. SISTEMA WHITE LABEL
==================================================

Quiero que cada cliente pueda tener una identidad visual diferente.

Debe ser posible configurar:

- Logo
- Nombre
- Colores
- Nombre del dashboard
- Iconos cuando corresponda

Ejemplo:

CLIENTE A:

Perfumería XYZ

Logo de Perfumería XYZ

Sus colores.

CLIENTE B:

Importaciones ABC

Logo de Importaciones ABC

Otros colores.

Ambos utilizan la misma plataforma y las mismas microapps, pero cada uno ve su propio branding y sus propios datos.

==================================================
11. NAVEGACIÓN
==================================================

Preparar una estructura similar a:

/admin
/admin/clients
/admin/apps
/admin/settings

/client
/client/apps
/client/apps/[app]

Adapta las rutas al framework actual del proyecto.

Cada microapp debe tener preparada una ruta propia.

Por ahora, si una microapp todavía no está desarrollada, debe mostrar:

"Esta aplicación estará disponible próximamente."

No inventes funcionalidades.

==================================================
12. EXPERIENCIA DE LOGIN FUTURA
==================================================

NO implementar login real todavía.

Pero la arquitectura debe quedar preparada para que posteriormente exista un único login.

El flujo futuro debe ser:

USUARIO
↓
LOGIN
↓
SISTEMA IDENTIFICA AL USUARIO
↓
IDENTIFICA SU TENANT
↓
SI ES ADMIN → PANEL ADMINISTRADOR
SI ES CLIENTE → DASHBOARD DEL CLIENTE

IMPORTANTE:

El cliente NO debería tener que iniciar sesión primero en mi plataforma y después volver a iniciar sesión en otra plataforma.

Quiero una sola autenticación.

==================================================
13. COMPONENTIZACIÓN
==================================================

Mantén el código limpio, modular y reutilizable.

Utiliza componentes separados cuando corresponda, por ejemplo:

- AdminSidebar
- ClientSidebar
- Header
- Dashboard
- AppCard
- AppGrid
- ClientCard
- ClientForm
- AppSelector
- BrandSettings
- SearchBar
- UserMenu
- MetricsCard
- EmptyState

NO crees un único archivo gigante con toda la aplicación.

==================================================
14. DISEÑO
==================================================

Quiero una interfaz moderna, premium y profesional.

Debe sentirse como un producto SaaS real.

Características:

- Minimalista
- Limpio
- Profesional
- Buena jerarquía visual
- Excelente espaciado
- Tarjetas modernas
- Bordes ligeramente redondeados
- Sombras sutiles
- Hover states
- Transiciones suaves
- Animaciones discretas
- Excelente responsive

Debe funcionar correctamente en:

- Desktop
- Laptop
- Tablet
- Mobile

Evita:

- Diseño genérico de plantilla
- Elementos innecesarios
- Saturación visual
- Desbordamientos
- Componentes que se rompan en móvil

(ASTRA: usa el branding de la sección 0 para la plataforma.)

==================================================
15. MÉTRICAS
==================================================

El dashboard del cliente debe tener un espacio preparado para métricas.

Por ahora pueden ser datos de demostración.

Ejemplo:

- Ventas
- Pedidos
- Clientes
- Despachos
- Actividad

NO inventes datos reales.

Utiliza datos mock claramente identificados mientras no exista una base de datos.

==================================================
16. FUTURA BASE DE DATOS
==================================================

NO implementar todavía una base de datos real.

Pero estructura el código pensando en entidades futuras como:

User
Tenant
App
TenantApp
BrandSettings
Activity
Subscription

Relaciones conceptuales:

User → pertenece a Tenant

Tenant → tiene muchas Apps

App → puede pertenecer a muchos Tenants

TenantApp → determina qué App tiene habilitada cada Tenant

BrandSettings → pertenece a Tenant

(ASTRA: las opciones que estoy evaluando para la base de datos son Vercel Blob, que ya uso en FUSIONES, o Supabase. Deja la capa de datos aislada, por ejemplo en un archivo `data/store.js` con funciones getTenant, listTenants, saveTenant, etc., para cambiar de mock a base real sin tocar la interfaz. Mientras sea mock, persiste en localStorage con una clave propia de la plataforma.)

==================================================
17. SEGURIDAD FUTURA
==================================================

Aunque todavía no implementaremos autenticación ni backend real, la arquitectura debe considerar desde el inicio:

- Cada usuario pertenece a un tenant.
- Cada tenant tiene sus propios datos.
- Cada microapp puede estar habilitada o deshabilitada por tenant.
- Un usuario no debería poder acceder a otro tenant.
- Los permisos deben poder implementarse posteriormente.

NO simules una seguridad que todavía no existe.

Simplemente deja la arquitectura preparada correctamente.

==================================================
18. FUTURO SISTEMA DE PLANES
==================================================

NO implementar pagos todavía.

Pero deja preparada la arquitectura para posteriormente crear planes:

FREE
PRO
PREMIUM

Y definir qué microapps puede utilizar cada plan.

Ejemplo:

FREE:
Catálogo

PRO:
Catálogo
Despachos
Liquidaciones

PREMIUM:
Todas las microapps

(ASTRA: mis planes reales son Kit / STAR-T / 1v1. Ver la sección 0. STAR-T necesita la regla "elige 1 entre Catálogo y Gestión de clientes".)

==================================================
19. FUTURA PERSONALIZACIÓN WHITE LABEL
==================================================

El objetivo final de esta plataforma es que yo pueda vender a diferentes negocios algo similar a:

"Tu propio sistema de gestión para tu negocio."

Cada negocio podría tener:

- Su propia marca
- Su propio logo
- Sus propios colores
- Sus propias microapps
- Sus propios usuarios
- Sus propios datos
- Sus propias métricas

Pero todo sería administrado desde mi plataforma central.

==================================================
20. NO HACER TODAVÍA
==================================================

NO desarrolles todavía:

- Login real
- Registro real
- Base de datos real
- Pagos
- Suscripciones
- Integraciones externas
- Backend complejo
- Microapps funcionales completas
- Sistema real de usuarios
- Sistema real de permisos

PRIMERO quiero construir correctamente el HUB, el panel administrativo, la estructura multi-tenant y la experiencia visual del cliente.

==================================================
21. COMPATIBILIDAD CON EL PROYECTO ACTUAL
==================================================

Antes de modificar cualquier archivo:

1. Analiza la estructura actual.
2. Identifica el framework.
3. Identifica las dependencias.
4. Identifica los componentes existentes.
5. Reutiliza componentes cuando sea posible.
6. No elimines funcionalidades existentes innecesariamente.
7. No reemplaces la arquitectura actual sin una razón clara.
8. No agregues dependencias innecesarias.
9. Mantén el proyecto funcionando.

==================================================
22. RESULTADO FINAL
==================================================

Al terminar quiero poder visualizar claramente este flujo:

YO
↓
PANEL ADMIN
↓
CREAR CLIENTE
↓
CONFIGURAR NOMBRE + LOGO + COLORES
↓
SELECCIONAR MICROAPPS
↓
GUARDAR CLIENTE
↓
CLIENTE CREADO
↓
DASHBOARD PERSONALIZADO DEL CLIENTE
↓
CLIENTE VE SOLAMENTE SUS MICROAPPS

Quiero que todo esto funcione inicialmente con datos mock/locales, sin necesidad de implementar todavía backend, autenticación o base de datos.

==================================================
23. EXPLICACIÓN FINAL
==================================================

Cuando termines, explícame claramente:

1. Qué archivos creaste.
2. Qué archivos modificaste.
3. Cómo funciona la arquitectura.
4. Cómo se representa un cliente.
5. Cómo funciona el tenantId.
6. Cómo se asignan las microapps.
7. Cómo se cambia la marca de un cliente.
8. Cómo agregar una nueva microapp.
9. Cómo funcionará posteriormente el login.
10. Qué necesitamos implementar después para conectar una base de datos real.
11. Qué necesitamos implementar después para tener clientes reales.
12. Qué necesitamos implementar después para convertir esto en un SaaS comercial.

IMPORTANTE:

NO empieces a desarrollar las microapps funcionales todavía.

Primero termina correctamente el HUB, el panel de administración, la creación/configuración de clientes, la asignación de microapps, el sistema de branding y la arquitectura multi-tenant.

NO quiero solamente una landing page.

Quiero una primera versión real del sistema, preparada para convertirse posteriormente en una plataforma SaaS multi-cliente.

==================================================
24. REGLAS DE TRABAJO ASTRA
==================================================

1. **Idioma:** todos los textos de la interfaz y las respuestas en español neutro con "tú". NUNCA voseo (nada de "vos", "tenés", "hacé"). Si te dicto ideas sueltas, reescríbelas de forma profesional y clara.
2. **Primero el plan:** antes de escribir código, muéstrame el plan con la estructura de archivos y las rutas, y espera mi aprobación.
3. **Rutas sin build:** con HTML vanilla, las rutas pueden ser carpetas (`/admin/`, `/admin/clients/`, `/client/`, `/client/apps/catalogo/`) o un router por hash. Elige la opción que funcione bien en Vercel y explícala. Si usas rutas absolutas, recuerda que la página se sirve desde la raíz del proyecto.
4. **Vista previa:** sirve el proyecto en local con un servidor que no use caché (header `Cache-Control: no-store`), por ejemplo un `tools/serve.py` con `SimpleHTTPRequestHandler`. Así el navegador siempre muestra la última versión.
5. **Revisión:** al terminar cada parte, revísala en celular (375 px) y en desktop, sin errores en consola ni scroll horizontal.
6. **Siempre el link:** al final de cada cambio dame el link para verlo (local y, si se publicó, el de Vercel). Reviso desde mi iPhone.
7. **Publicar:** se publicará en Vercel como proyecto nuevo (por ejemplo `plataforma-astra`), del equipo `astra-importaciones`. Pregúntame antes de publicar por primera vez.
8. **No tocar otros proyectos:** no modifiques las carpetas de las otras microapps ni de la página de venta (`PAGINA LANDING ASTRA`) ni de la web principal (`PAGINA ASTRA`).
9. **Datos sensibles:** no pongas en la plataforma datos privados de clientes reales (nombres completos, teléfonos, tarifas). En los tenants demo, usa datos ficticios claramente marcados como DEMO.
