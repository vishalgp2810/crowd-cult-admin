/** True if the user is allowed to use the platform admin console. */
export function isPlatformAdminRole(code: string | null | undefined): boolean {
  const n = String(code || "").toUpperCase();
  return n === "PLATFORM_ADMIN" || n === "ADMIN";
}
