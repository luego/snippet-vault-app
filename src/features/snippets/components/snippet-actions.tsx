"use client";

import { CopyPlus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import {
  deleteSnippet,
  duplicateSnippet,
  setSnippetVisibility,
  toggleFavorite,
} from "@/features/snippets/actions/snippets";
import type { SnippetDetail } from "@/features/snippets/types";

export function SnippetActions({ snippet }: { snippet: SnippetDetail }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="snippet-actions">
      <Link
        href={`/snippets/${snippet.id}/edit`}
        className="button button-primary"
      >
        Edit
      </Link>
      <form action={duplicateSnippet}>
        <input type="hidden" name="snippetId" value={snippet.id} />
        <button className="button button-secondary" type="submit">
          <CopyPlus className="size-4" /> Duplicate
        </button>
      </form>
      <form action={toggleFavorite}>
        <input type="hidden" name="snippetId" value={snippet.id} />
        <input
          type="hidden"
          name="favorite"
          value={String(!snippet.is_favorite)}
        />
        <button className="button button-secondary" type="submit">
          <Star className="size-4" />
          {snippet.is_favorite ? "Unfavorite" : "Favorite"}
        </button>
      </form>
      <form action={setSnippetVisibility}>
        <input type="hidden" name="snippetId" value={snippet.id} />
        <input
          type="hidden"
          name="visibility"
          value={snippet.visibility === "private" ? "public" : "private"}
        />
        <button className="button button-secondary" type="submit">
          Make {snippet.visibility === "private" ? "public" : "private"}
        </button>
      </form>
      <button
        className="button button-danger"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Trash2 className="size-4" /> Delete
      </button>

      <dialog className="delete-dialog" ref={dialogRef}>
        <h2>Delete this snippet?</h2>
        <p>
          “{snippet.title}” and its tag connections will be permanently removed.
        </p>
        <div className="delete-dialog-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          <form action={deleteSnippet}>
            <input type="hidden" name="snippetId" value={snippet.id} />
            <button className="button button-danger" type="submit">
              Delete permanently
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
