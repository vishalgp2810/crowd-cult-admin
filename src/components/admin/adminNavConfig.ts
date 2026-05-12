/** Central definition for admin-only navigation (add entries as new admin routes ship). */
export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  match: (pathname: string) => boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: "/admin/requests",
    label: "Review queue",
    description: "Pending artist and venue profiles",
    match: (p) => p === "/admin/requests" || p === "/admin",
  },
  {
    href: "/admin/users",
    label: "Admin users",
    description: "Create and manage platform admin accounts",
    match: (p) => p === "/admin/users",
  },
];

export function getActiveNavKey(pathname: string): string | null {
  const item = ADMIN_NAV.find((n) => n.match(pathname));
  return item?.href ?? null;
}

export function getPageMeta(pathname: string): { title: string; description: string; breadcrumb: string[] } {
  const item = ADMIN_NAV.find((n) => n.match(pathname));
  if (item) {
    return {
      title: item.label,
      description: item.description,
      breadcrumb: ["Admin", item.label],
    };
  }
  return {
    title: "Admin",
    description: "Platform administration",
    breadcrumb: ["Admin"],
  };
}
