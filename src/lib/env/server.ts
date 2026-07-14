import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_DB_URL: z.url().optional(),
});

export const serverEnv = serverEnvSchema.parse({
  APP_ENV:
    process.env.APP_ENV ??
    (process.env.NODE_ENV === "production" ? "production" : "development"),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  SUPABASE_DB_URL: process.env.SUPABASE_DB_URL || undefined,
});
