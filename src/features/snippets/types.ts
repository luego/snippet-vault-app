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
  copy_count: number;
  created_at: string;
  updated_at: string;
  tags: SnippetTag[];
};

export type SnippetDetail = Omit<SnippetListItem, "tags"> & {
  code: string;
};

export type SnippetTag = {
  id: string;
  name: string;
  normalized_name: string;
};

export type TagSummary = SnippetTag & {
  snippet_count: number;
  last_used_at: string;
};

export type DashboardSummary = {
  total: number;
  favorites: number;
  public: number;
  updatedThisWeek: number;
  recent: SnippetListItem[];
  topTags: TagSummary[];
};
