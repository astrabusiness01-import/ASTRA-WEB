import { requireAdmin, requireTenant } from "../auth/session.js";
import { navigate } from "../router.js";

/** Envuelve una vista de admin: sin sesión de admin, vuelve al inicio. */
export const adminView = (view) => async (ctx) => {
  const session = await requireAdmin();
  if (!session) return navigate("/");
  if (ctx.isCurrent()) return view({ ...ctx, session });
};

/** Envuelve una vista de cliente: sin tenant en la sesión, vuelve al inicio. */
export const clientView = (view) => async (ctx) => {
  const session = await requireTenant();
  if (!session) return navigate("/");
  if (ctx.isCurrent()) return view({ ...ctx, session });
};
