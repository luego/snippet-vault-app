import { z } from "zod";

export const snippetSearchParamsSchema = z.object({
  q: z.string().trim().max(100).catch(""),
  language: z.string().trim().max(50).optional().catch(undefined),
  tag: z.string().trim().max(30).optional().catch(undefined),
  favorite: z.enum(["true", "false"]).optional().catch(undefined),
  visibility: z.enum(["private", "public"]).optional().catch(undefined),
  sort: z
    .enum(["updated-desc", "created-desc", "title-asc", "copies-desc"])
    .catch("updated-desc"),
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(50).catch(20),
});

export type SnippetSearchParams = z.infer<typeof snippetSearchParamsSchema>;
