import { CalendarDays, Code2, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";

import { BrandMark } from "@/components/shared/brand-mark";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CodeBlock } from "@/features/snippets/components/code-block";
import { CopyButton } from "@/features/snippets/components/copy-button";
import { publicIdSchema } from "@/features/snippets/schemas/snippet";
import { getPublicSnippet } from "@/features/snippets/server/repository";
import {
  SUPPORTED_LANGUAGES,
  toSupportedLanguage,
} from "@/lib/constants/languages";
import { createPublicClient } from "@/lib/supabase/public";

const loadPublicSnippet = cache(async (publicId: string) => {
  const parsed = publicIdSchema.safeParse(publicId);
  if (!parsed.success) return { data: null, error: null };
  return getPublicSnippet(createPublicClient(), parsed.data);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const { data } = await loadPublicSnippet(publicId);
  if (!data) {
    return {
      title: "Snippet unavailable",
      robots: { index: false, follow: false },
    };
  }

  const description =
    data.description?.slice(0, 155) ??
    "A code snippet shared securely from Snippet Vault.";
  return {
    title: data.title,
    description,
    alternates: { canonical: `/s/${data.publicId}` },
    robots: { index: false, follow: false },
    openGraph: {
      title: data.title,
      description,
      type: "article",
      url: `/s/${data.publicId}`,
    },
    twitter: { card: "summary_large_image", title: data.title, description },
  };
}

export default async function PublicSnippetPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const { data: snippet, error } = await loadPublicSnippet(publicId);
  if (error) throw new Error("Unable to load shared snippet");
  if (!snippet) notFound();

  const language = SUPPORTED_LANGUAGES[toSupportedLanguage(snippet.language)];
  const updated = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(snippet.updatedAt));

  return (
    <div className="public-share-page">
      <header className="public-share-header">
        <nav
          className="public-share-nav"
          aria-label="Public snippet navigation"
        >
          <BrandMark />
          <div>
            <ThemeToggle />
            <Link href="/sign-up" className="button button-primary">
              Create your vault
            </Link>
          </div>
        </nav>
      </header>

      <main className="public-share-main" id="main-content" tabIndex={-1}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Snippet Vault</Link>
          <span aria-hidden="true">/</span>
          <span>Shared snippet</span>
        </nav>

        <div className="public-share-heading">
          <div>
            <span className="eyebrow">
              <ShieldCheck className="size-4" /> Read-only public share
            </span>
            <h1>{snippet.title}</h1>
            {snippet.description && <p>{snippet.description}</p>}
          </div>
          <CopyButton code={snippet.code} />
        </div>

        <div className="public-share-meta" aria-label="Snippet details">
          <span className="badge">
            <Code2 className="size-3.5" /> {language}
          </span>
          <span>
            <CalendarDays className="size-3.5" /> Updated {updated}
          </span>
          {snippet.tags.map((tag) => (
            <span className="tag-pill" key={tag.id}>
              #{tag.name}
            </span>
          ))}
        </div>

        <section
          className="public-code-panel"
          aria-labelledby="shared-code-title"
        >
          <div className="code-panel-header">
            <h2 id="shared-code-title">Code</h2>
            <span>Shared from Snippet Vault</span>
          </div>
          <CodeBlock code={snippet.code} language={snippet.language} />
        </section>

        <aside className="public-share-cta">
          <div>
            <h2>Keep your reusable code within reach.</h2>
            <p>
              Save, organize, search, and selectively share your own snippets.
            </p>
          </div>
          <Link href="/sign-up" className="button button-primary">
            Create a free vault
          </Link>
        </aside>
      </main>
    </div>
  );
}
