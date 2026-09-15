export const USER_ROLES = ["USER", "CONTRIBUTOR", "MODERATOR", "ADMIN"] as const;

export type UserRole = (typeof USER_ROLES)[number];

type RoleSubject = {
  role?: string | null;
};

function getRole(subject: RoleSubject | null | undefined): UserRole | null {
  const role = subject?.role?.toUpperCase();

  return USER_ROLES.includes(role as UserRole) ? (role as UserRole) : null;
}

export function canEditWiki(subject: RoleSubject | null | undefined): boolean {
  const role = getRole(subject);

  return role === "CONTRIBUTOR" || role === "MODERATOR" || role === "ADMIN";
}

export function canModerate(subject: RoleSubject | null | undefined): boolean {
  const role = getRole(subject);

  return role === "MODERATOR" || role === "ADMIN";
}

export function isAdmin(subject: RoleSubject | null | undefined): boolean {
  return getRole(subject) === "ADMIN";
}
