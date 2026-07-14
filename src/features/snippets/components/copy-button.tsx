"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { recordSnippetCopy } from "@/features/snippets/actions/snippets";

export function CopyButton({
  code,
  snippetId,
}: {
  code: string;
  snippetId?: string;
}) {
  const [message, setMessage] = useState("");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Copied");
      if (snippetId) void recordSnippetCopy(snippetId);
    } catch {
      setMessage("Copy failed");
    }
  }

  const copied = message === "Copied";

  return (
    <div className="copy-control">
      <button
        className="button button-secondary"
        type="button"
        onClick={copyCode}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy code"}
      </button>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
