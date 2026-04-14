import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/artist-dashboard", destination: "/dashboard/artist", permanent: true },
      { source: "/venue-dashboard", destination: "/dashboard/venue", permanent: true },
      { source: "/artist-profile", destination: "/artist/nyx-solaris", permanent: true },
      { source: "/sign-up-login-screen", destination: "/auth", permanent: true },
    ];
  },
};

export default nextConfig;
