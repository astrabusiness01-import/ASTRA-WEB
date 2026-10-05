# Plataforma ASTRA — plan

## Qué se prometió en la página de venta
- **STAR-T:** usuario en la plataforma ASTRA y **1 micro app a elegir**: Catálogo de productos **o** Gestión de clientes.
- **1v1:** usuario con **las 5 micro apps** habilitadas, más la enseñanza de IA.
- **Kit:** no incluye la plataforma.

## El punto clave: hoy las micro apps son SOLO de ASTRA
Las 3 micro apps actuales trabajan con **tus** datos:
- **Catálogo:** muestra tus perfumes y tus precios.
- **FUSIONES:** guarda tus clientes, tus recojos y tus liquidaciones.
- **Cotizador:** usa tus tarifas.

Si un alumno entra "a su micro app", tiene que ver **su propio** catálogo y **sus propios** clientes, nunca los tuyos ni los de otro alumno. Eso se llama **multiusuario** y es el trabajo principal de la plataforma: cada app tiene que separar los datos por dueño.

## Fases propuestas
| Fase | Qué se construye | Resultado |
|---|---|---|
| **0** | Tablero de micro apps (`tablero.html`) | ✅ Listo. Inventario, links y qué programa incluye cada una |
| **1** | **Portal + panel de administración** | 🟡 Hub listo con datos de prueba (`index.html`): panel admin, crear clientes, marca, planes y microapps por cliente. Falta login real y base de datos |
| **2** | **Catálogo multiusuario** | Cada alumno con su catálogo propio: sube productos, fotos y precios, y lo comparte con su link |
| **3** | **Gestión de clientes multiusuario** | Versión de FUSIONES por alumno: sus clientes y pedidos, separados de los tuyos |
| **4** | **Cotizador multiusuario** | Cada alumno pone sus tarifas (por kg, desaduanaje, impuestos) |
| **5** | Micro apps 4 y 5 | Cuando las definas |

**Orden sugerido:** Fase 1, luego la app que más alumnos de STAR-T vayan a elegir (catálogo o gestión de clientes), y después el resto. Las clases de STAR-T empiezan el **5 de noviembre**, así que la Fase 1 y al menos una micro app tienen que estar listas para esa fecha.

## Decisiones pendientes del dueño
1. **Dónde guardar los datos de los alumnos:**
   - **Vercel Blob**, lo mismo que ya usa FUSIONES (gratis hasta cierto uso), o
   - **Supabase**, una base de datos con login incluido y plan gratuito; es más ordenado cuando hay muchos usuarios.
2. **Cómo entran los alumnos:**
   - Usuario y contraseña,
   - un **código** que les das tú (como el código del panel de FUSIONES), o
   - un **link mágico** que les llega por correo.
3. **Dominio:** usar algo como `plataforma-astra.vercel.app` o un dominio propio.
4. **Micro apps 4 y 5:** cuáles son. Una candidata es el **Cotizador de perfumes**, que ya está publicado.
5. **Cotizador de courier:** hoy no está publicado. Hay que publicarlo antes de entregarlo.
