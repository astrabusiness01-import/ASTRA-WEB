import { esc, initials } from "../lib/dom.js";

const ROLE = { admin: "Administrador", owner: "Dueño del negocio", member: "Miembro" };

export function UserMenu(user, subtitle) {
  if (!user) return "";
  return `<div class="user-menu">
    <span class="avatar" aria-hidden="true">${esc(initials(user.name))}</span>
    <span class="user-menu__info">
      <span class="user-menu__name">${esc(user.name)}</span>
      <span class="user-menu__role">${esc(subtitle || ROLE[user.role] || user.role)}</span>
    </span>
  </div>`;
}

export const roleLabel = (role) => ROLE[role] || role;
