import { EmptyState } from "../components/EmptyState.js";

export async function NotFoundView() {
  document.getElementById("app").innerHTML = `<div class="home"><div class="home__box">
    ${EmptyState({ icon: "search", title: "Página no encontrada", text: "La dirección que abriste no existe en la plataforma.", action: '<a class="btn btn--primary" href="#/">Ir al inicio</a>' })}
  </div></div>`;
}
