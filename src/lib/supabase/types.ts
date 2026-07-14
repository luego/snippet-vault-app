export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          preferred_theme: "light" | "dark" | "system";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferred_theme?: "light" | "dark" | "system";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          preferred_theme?: "light" | "dark" | "system";
          updated_at?: string;
        };
        Relationships: [];
      };
      snippets: {
        Row: {
          id: string;
          owner_id: string;
          public_id: string;
          title: string;
          description: string | null;
          code: string;
          language: string;
          visibility: "private" | "public";
          is_favorite: boolean;
          copy_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          public_id?: string;
          title: string;
          description?: string | null;
          code: string;
          language?: string;
          visibility?: "private" | "public";
          is_favorite?: boolean;
          copy_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["snippets"]["Insert"]>;
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          normalized_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          normalized_name: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          normalized_name?: string;
        };
        Relationships: [];
      };
      snippet_tags: {
        Row: { snippet_id: string; tag_id: string; created_at: string };
        Insert: { snippet_id: string; tag_id: string; created_at?: string };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_snippet_with_tags: {
        Args: {
          p_title: string;
          p_description: string | null;
          p_code: string;
          p_language: string;
          p_visibility: "private" | "public";
          p_tags?: string[];
        };
        Returns: string;
      };
      update_snippet_with_tags: {
        Args: {
          p_snippet_id: string;
          p_title: string;
          p_description: string | null;
          p_code: string;
          p_language: string;
          p_visibility: "private" | "public";
          p_tags?: string[];
        };
        Returns: string;
      };
      duplicate_snippet: {
        Args: { p_snippet_id: string };
        Returns: string;
      };
      increment_snippet_copy_count: {
        Args: { p_snippet_id: string };
        Returns: undefined;
      };
      search_snippets: {
        Args: {
          p_query?: string | null;
          p_language?: string | null;
          p_tag?: string | null;
          p_favorite?: boolean | null;
          p_visibility?: "private" | "public" | null;
          p_sort?: string;
          p_offset?: number;
          p_limit?: number;
        };
        Returns: {
          id: string;
          title: string;
          description: string | null;
          language: string;
          visibility: "private" | "public";
          is_favorite: boolean;
          copy_count: number;
          created_at: string;
          updated_at: string;
          tags: Json;
          total_count: number;
        }[];
      };
      list_tag_summaries: {
        Args: { p_limit?: number };
        Returns: {
          id: string;
          name: string;
          normalized_name: string;
          snippet_count: number;
          last_used_at: string;
        }[];
      };
    };
    Enums: { snippet_visibility: "private" | "public" };
    CompositeTypes: Record<string, never>;
  };
};
