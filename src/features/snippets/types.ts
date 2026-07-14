import type { SupportedLanguage } from "@/lib/constants/languages";

export type SnippetVisibility = "private" | "public";

export type SnippetActionState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialSnippetActionState: SnippetActionState = {
  status: "idle",
  message: "",
};

export type SnippetListItem = {
  id: string;
  title: string;
  description: string | null;
  language: SupportedLanguage | string;
  visibility: SnippetVisibility;
  is_favorite: boolean;
  updated_at: string;
};

export type SnippetDetail = SnippetListItem & {
  code: string;
  copy_count: number;
  created_at: string;
};

export type SnippetTag = {
  id: string;
  name: string;
  normalized_name: string;
};
