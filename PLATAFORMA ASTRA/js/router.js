// Router por hash: /#/admin/clients, /#/client/apps/catalogo, etc.
// Se eligió hash porque funciona igual en Vercel, en un servidor local y
// sin configurar reescrituras: el servidor siempre entrega index.html.

const routes = [];
let notFound = null;

/** Registra una ruta. Los segmentos ":param" se pasan a la vista. */
export function route(pattern, view) {
  const keys = [];
  const regex = new RegExp(
    "^" + pattern.replace(/\/:([a-zA-Z]+)/g, (_, k) => (keys.push(k), "/([^/]+)")) + "/?$"
  );
  routes.push({ regex, keys, view });
}

export function fallback(view) { notFound = view; }

export function currentPath() {
  const path = location.hash.replace(/^#/, "").split("?")[0];
  return path || "/";
}

export function navigate(path) {
  if (currentPath() === path) render();
  else location.hash = path;
}

export const href = (path) => `#${path}`;

let token = 0;
export async function render() {
  const path = currentPath();
  const mine = ++token;
  for (const r of routes) {
    const m = r.regex.exec(path);
    if (m) {
      const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      await r.view({ params, path, isCurrent: () => mine === token });
      return;
    }
  }
  if (notFound) await notFound({ params: {}, path, isCurrent: () => mine === token });
}

export function start() {
  window.addEventListener("hashchange", () => {
    render();
    window.scrollTo({ top: 0 });
  });
  render();
}
