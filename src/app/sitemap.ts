import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env/public";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.NEXT_PUBLIC_APP_URL;
  return ["", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path ? "yearly" : "weekly",
    priority: path ? 0.3 : 1,
  }));
}
