import Link from "next/link";
import { FileCode2 } from "lucide-react";

export function EmptyState({
  title = "No snippets yet",
  description = "Save your first reusable idea and it will show up here.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="empty-state">
      <span className="empty-state-icon">
        <FileCode2 aria-hidden="true" className="size-6" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href="/snippets/new" className="button button-primary">
        Create snippet
      </Link>
    </section>
  );
}
