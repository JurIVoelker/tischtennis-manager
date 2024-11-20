import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tischtennis Manager",
    short_name: "TT-Manager",
    description:
      "Verwalte deine Tischtennis-Mannschaft und bleibe immer auf dem Laufenden.",
    start_url: "/Test-Club/Herren-I/login?inviteToken=test-token",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/ttm-sm.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/ttm-lg.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
