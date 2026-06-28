import { NextResponse } from "next/server";

export function GET() {
  const manifest = {
    name: "Pressure-It Admin",
    short_name: "PIT Admin",
    description: "Pressure-It admin portal — manage quotes, services & content.",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "/icons/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
