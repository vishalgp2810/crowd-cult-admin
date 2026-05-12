import { NextResponse, type NextRequest } from "next/server";

/**
 * Block common automated probes (env leaks, CMS, RCE probes) before they hit the app.
 * This does not replace WAF / host hardening or rate limits on your API.
 */
const BLOCKED_PREFIXES = [
  "/.env",
  "/.git",
  "/.aws",
  "/.docker",
  "/wp-admin",
  "/wp-login",
  "/wp-content",
  "/wp-includes",
  "/phpmyadmin",
  "/pma",
  "/adminer",
  "/.svn",
  "/server-status",
  "/actuator",
  "/debug",
  "/console",
  "/_profiler",
  "/vendor/phpunit",
  "/cgi-bin",
] as const;

const BLOCKED_PATTERNS = [/\.(php|phtml|asp|aspx|jsp|jspx)(\?|$)/i, /\/\.\./, /%2e%2e/i];

function matchesPrefix(pathname: string, prefix: string): boolean {
  const lower = pathname.toLowerCase();
  const p = prefix.toLowerCase();
  if (p === "/.git") {
    return lower === "/.git" || lower.startsWith("/.git/");
  }
  if (p === "/.env") {
    return /^\/\.env($|[./])/i.test(pathname);
  }
  return lower === p || lower.startsWith(`${p}/`);
}

function isBlockedPath(pathname: string): boolean {
  for (const p of BLOCKED_PREFIXES) {
    if (matchesPrefix(pathname, p)) return true;
  }
  for (const re of BLOCKED_PATTERNS) {
    if (re.test(pathname)) return true;
  }
  return false;
}

export function proxy(request: NextRequest) {
  if (isBlockedPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
