import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Crowd&Cult Admin",
    short_name: "C&C Admin",
    description: "Platform admin console for Crowd&Cult.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/SHORT-LOGO.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/LOGO.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/SHORT-LOGO.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
