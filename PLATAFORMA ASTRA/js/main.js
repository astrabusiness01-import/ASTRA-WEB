// Punto de entrada: registra las rutas y arranca el router.
import { route, fallback, start } from "./router.js";
import { adminView, clientView } from "./views/guard.js";
import { HomeView } from "./views/home.js";
import { NotFoundView } from "./views/not-found.js";
import { AdminDashboardView } from "./views/admin/dashboard.js";
import { AdminClientsView } from "./views/admin/clients.js";
import { AdminClientFormView } from "./views/admin/client-form.js";
import { AdminClientDetailView } from "./views/admin/client-detail.js";
import { AdminAppsView } from "./views/admin/apps.js";
import { AdminUsersView } from "./views/admin/users.js";
import { AdminSettingsView } from "./views/admin/settings.js";
import { ClientDashboardView } from "./views/client/dashboard.js";
import { ClientAppsView } from "./views/client/apps.js";
import { ClientAppView } from "./views/client/app.js";

route("/", HomeView);

route("/admin", adminView(AdminDashboardView));
route("/admin/clients", adminView(AdminClientsView));
route("/admin/clients/new", adminView(AdminClientFormView));
route("/admin/clients/:id", adminView(AdminClientDetailView));
route("/admin/clients/:id/edit", adminView(AdminClientFormView));
route("/admin/apps", adminView(AdminAppsView));
route("/admin/users", adminView(AdminUsersView));
route("/admin/settings", adminView(AdminSettingsView));

route("/client", clientView(ClientDashboardView));
route("/client/apps", clientView(ClientAppsView));
route("/client/apps/:appId", clientView(ClientAppView));

fallback(NotFoundView);

window.addEventListener("unhandledrejection", (e) => console.error(e.reason));
start();
