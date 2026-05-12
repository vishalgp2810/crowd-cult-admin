import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/** OWASP-style baseline; tune CSP if you add new third-party scripts or if dev tools report violations. */
function securityHeaders() {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    /* Backend URL comes from NEXT_PUBLIC_API_URL; scheme-wide allows any host (narrow to that host in production if you can fix the deploy URL at build time). */
    "connect-src 'self' https: http: wss: ws:",
    isProd ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const list: { key: string; value: string }[] = [
    { key: "X-DNS-Prefetch-Control", value: "off" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()" },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin-allow-popups",
    },
  ];

  if (isProd) {
    list.push({ key: "Content-Security-Policy", value: csp });
    list.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains; preload",
    });
  }

  return list;
}

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders(),
      },
    ];
  },
  async redirects() {
    return [
      { source: "/artist-dashboard", destination: "/dashboard/artist", permanent: true },
      { source: "/venue-dashboard", destination: "/dashboard/venue", permanent: true },
      { source: "/artist-profile", destination: "/artist/nyx-solaris", permanent: true },
      { source: "/sign-up-login-screen", destination: "/auth", permanent: true },
      { source: "/admin-home", destination: "/admin/requests", permanent: false },
    ];
  },
};

export default nextConfig;
