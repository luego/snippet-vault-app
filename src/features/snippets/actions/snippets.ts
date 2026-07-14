"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  snippetIdSchema,
  snippetInputFromFormData,
} from "@/features/snippets/schemas/snippet";
import type { SnippetActionState } from "@/features/snippets/types";
import { requireVerifiedClaims } from "@/features/auth/server/session";
import { createClient } from "@/lib/supabase/server";

function validationError(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}): SnippetActionState {
  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function logSnippetError(operation: string, error: { code?: string }) {
  console.error(`Snippet ${operation} failed`, { code: error.code });
}

function revalidateSnippetPaths(snippetId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/snippets");
  revalidatePath("/favorites");
  revalidatePath("/tags");
  if (snippetId) revalidatePath(`/snippets/${snippetId}`);
}

export async function createSnippet(
  _previousState: SnippetActionState,
  formData: FormData,
): Promise<SnippetActionState> {
  const parsed = snippetInputFromFormData(formData);
  if (!parsed.success) return validationError(parsed.error);

  await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await client.rpc("create_snippet_with_tags", {
    p_title: parsed.data.title,
    p_description: parsed.data.description,
    p_code: parsed.data.code,
    p_language: parsed.data.language,
    p_visibility: parsed.data.visibility,
    p_tags: parsed.data.tags,
  });

  if (error || !data) {
    if (error) logSnippetError("creation", error);
    return {
      status: "error",
      message: "We could not save this snippet. Try again in a moment.",
    };
  }

  revalidateSnippetPaths(data);
  redirect(`/snippets/${data}`);
}

export async function updateSnippet(
  snippetId: string,
  _previousState: SnippetActionState,
  formData: FormData,
): Promise<SnippetActionState> {
  const parsedId = snippetIdSchema.safeParse(snippetId);
  const parsed = snippetInputFromFormData(formData);
  if (!parsedId.success) {
    return { status: "error", message: "This snippet is unavailable." };
  }
  if (!parsed.success) return validationError(parsed.error);

  await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await client.rpc("update_snippet_with_tags", {
    p_snippet_id: parsedId.data,
    p_title: parsed.data.title,
    p_description: parsed.data.description,
    p_code: parsed.data.code,
    p_language: parsed.data.language,
    p_visibility: parsed.data.visibility,
    p_tags: parsed.data.tags,
  });

  if (error || !data) {
    if (error) logSnippetError("update", error);
    return {
      status: "error",
      message:
        "We could not update this snippet. It may no longer be available.",
    };
  }

  revalidateSnippetPaths(data);
  redirect(`/snippets/${data}`);
}

export async function deleteSnippet(formData: FormData) {
  const parsedId = snippetIdSchema.safeParse(formData.get("snippetId"));
  if (!parsedId.success) redirect("/snippets");

  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { error } = await client
    .from("snippets")
    .delete()
    .eq("id", parsedId.data)
    .eq("owner_id", claims.sub);

  if (error) logSnippetError("deletion", error);
  revalidateSnippetPaths(parsedId.data);
  redirect("/snippets");
}

export async function duplicateSnippet(formData: FormData) {
  const parsedId = snippetIdSchema.safeParse(formData.get("snippetId"));
  if (!parsedId.success) redirect("/snippets");

  await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await client.rpc("duplicate_snippet", {
    p_snippet_id: parsedId.data,
  });

  if (error || !data) {
    if (error) logSnippetError("duplication", error);
    redirect(`/snippets/${parsedId.data}`);
  }

  revalidateSnippetPaths(data);
  redirect(`/snippets/${data}/edit`);
}

export async function toggleFavorite(formData: FormData) {
  const parsedId = snippetIdSchema.safeParse(formData.get("snippetId"));
  const favorite = formData.get("favorite") === "true";
  if (!parsedId.success) redirect("/snippets");

  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { error } = await client
    .from("snippets")
    .update({ is_favorite: favorite })
    .eq("id", parsedId.data)
    .eq("owner_id", claims.sub);

  if (error) logSnippetError("favorite update", error);
  revalidateSnippetPaths(parsedId.data);
}

export async function setSnippetVisibility(formData: FormData) {
  const parsedId = snippetIdSchema.safeParse(formData.get("snippetId"));
  const visibility = formData.get("visibility");
  if (
    !parsedId.success ||
    (visibility !== "private" && visibility !== "public")
  ) {
    redirect("/snippets");
  }

  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await client
    .from("snippets")
    .update({ visibility })
    .eq("id", parsedId.data)
    .eq("owner_id", claims.sub)
    .select("public_id")
    .maybeSingle();

  if (error) logSnippetError("visibility update", error);
  revalidateSnippetPaths(parsedId.data);
  if (data?.public_id) revalidatePath(`/s/${data.public_id}`);
}

export async function recordSnippetCopy(snippetId: string) {
  const parsedId = snippetIdSchema.safeParse(snippetId);
  if (!parsedId.success) return;

  await requireVerifiedClaims();
  const client = await createClient();
  const { error } = await client.rpc("increment_snippet_copy_count", {
    p_snippet_id: parsedId.data,
  });
  if (error) logSnippetError("copy count update", error);
}
