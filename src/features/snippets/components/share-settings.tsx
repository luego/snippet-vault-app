"use client";

import { Check, Copy, ExternalLink, Globe2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { setSnippetVisibility } from "@/features/snippets/actions/snippets";
import type { SnippetVisibility } from "@/features/snippets/types";

export function ShareSettings({
  snippetId,
  publicId,
  visibility,
}: {
  snippetId: string;
  publicId: string;
  visibility: SnippetVisibility;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const sharePath = `/s/${publicId}`;
  const isPublic = visibility === "public";

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${sharePath}`,
      );
      setCopyStatus("Public link copied");
    } catch {
      setCopyStatus("Could not copy the public link");
    }
  }

  return (
    <section className="share-settings" aria-labelledby="share-settings-title">
      <div className="share-settings-heading">
        <span className="share-settings-icon">
          {isPublic ? (
            <Globe2 aria-hidden="true" className="size-4" />
          ) : (
            <LockKeyhole aria-hidden="true" className="size-4" />
          )}
        </span>
        <div>
          <h3 id="share-settings-title">Share settings</h3>
          <p>
            {isPublic
              ? "Anyone with the link can view this snippet."
              : "Only you can view this snippet."}
          </p>
        </div>
      </div>

      {isPublic && (
        <div className="share-link-row">
          <code>{sharePath}</code>
          <button
            className="icon-button"
            type="button"
            aria-label="Copy public link"
            onClick={copyShareLink}
          >
            {copyStatus === "Public link copied" ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      )}

      <div className="share-settings-actions">
        {isPublic && (
          <Link
            href={sharePath}
            className="button button-secondary"
            target="_blank"
            rel="noreferrer"
          >
            Open public page <ExternalLink className="size-4" />
          </Link>
        )}
        <form action={setSnippetVisibility}>
          <input type="hidden" name="snippetId" value={snippetId} />
          <input
            type="hidden"
            name="visibility"
            value={isPublic ? "private" : "public"}
          />
          <button className="button button-secondary" type="submit">
            Make {isPublic ? "private" : "public"}
          </button>
        </form>
      </div>
      <span className="sr-only" aria-live="polite">
        {copyStatus}
      </span>
    </section>
  );
}
