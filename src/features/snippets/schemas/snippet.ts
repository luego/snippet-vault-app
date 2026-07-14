import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";
import { normalizeTags } from "@/features/tags/utils/normalize-tag";

const languageKeys = Object.keys(SUPPORTED_LANGUAGES) as [
  keyof typeof SUPPORTED_LANGUAGES,
  ...(keyof typeof SUPPORTED_LANGUAGES)[],
];

const tagList = z
  .string()
  .max(320, "Tags are too long")
  .transform((value) => value.split(","))
  .transform(normalizeTags)
  .refine((tags) => tags.length <= 10, {
    message: "Use no more than 10 unique tags",
  })
  .refine((tags) => tags.every((tag) => tag.length <= 30), {
    message: "Each tag must be 30 characters or fewer",
  });

export const snippetInputSchema = z.object({
  title: z.string().trim().min(1, "Enter a title").max(120),
  description: z
    .string()
    .trim()
    .max(500)
    .transform((value) => value || null),
  code: z.string().min(1, "Enter some code").max(50_000),
  language: z.enum(languageKeys),
  visibility: z.enum(["private", "public"]),
  tags: tagList,
});

export const snippetIdSchema = z.uuid();
export const publicIdSchema = z.uuid();

export function snippetInputFromFormData(formData: FormData) {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return snippetInputSchema.safeParse({
    title: text("title"),
    description: text("description"),
    code: text("code"),
    language: text("language"),
    visibility: text("visibility"),
    tags: text("tags"),
  });
}
