import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env/public";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/snippets",
        "/favorites",
        "/tags",
        "/settings",
        "/reset-password",
      ],
    },
    sitemap: `${publicEnv.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
