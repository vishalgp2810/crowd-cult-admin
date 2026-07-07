/** Paths reachable without a logged-in session (auth page, public profile previews). */
export function isAdminPublicPath(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname === "/" || pathname === "/auth") return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/artist/")) return true;
  if (pathname.startsWith("/venue/")) return true;
  return false;
}
