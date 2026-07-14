import { z } from "zod";

import { normalizeTag } from "@/features/tags/utils/normalize-tag";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";

const languageKeys = Object.keys(SUPPORTED_LANGUAGES) as [
  keyof typeof SUPPORTED_LANGUAGES,
  ...(keyof typeof SUPPORTED_LANGUAGES)[],
];

const firstValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

const optionalText = (maximum: number) =>
  z.preprocess(
    firstValue,
    z
      .string()
      .trim()
      .max(maximum)
      .transform((value) => value || undefined)
      .optional()
      .catch(undefined),
  );

export const snippetSearchParamsSchema = z.object({
  q: z.preprocess(firstValue, z.string().trim().max(100).catch("")),
  language: z.preprocess(
    firstValue,
    z.enum(languageKeys).optional().catch(undefined),
  ),
  tag: optionalText(30).transform((value) =>
    value ? normalizeTag(value) : undefined,
  ),
  favorite: z.preprocess(
    firstValue,
    z.enum(["true", "false"]).optional().catch(undefined),
  ),
  visibility: z.preprocess(
    firstValue,
    z.enum(["private", "public"]).optional().catch(undefined),
  ),
  sort: z.preprocess(
    firstValue,
    z
      .enum(["updated-desc", "created-desc", "title-asc", "copies-desc"])
      .catch("updated-desc"),
  ),
  page: z.preprocess(firstValue, z.coerce.number().int().min(1).catch(1)),
  pageSize: z.preprocess(
    firstValue,
    z.coerce.number().int().min(1).max(50).catch(20),
  ),
});

export type SnippetSearchParams = z.infer<typeof snippetSearchParamsSchema>;
