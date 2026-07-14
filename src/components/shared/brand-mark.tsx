import Link from "next/link";
import { Braces } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-indigo-500 text-white shadow-sm shadow-indigo-500/25">
        <Braces aria-hidden="true" className="size-5" strokeWidth={2.25} />
      </span>
      {!compact && <span className="text-[1.05rem]">Snippet Vault</span>}
    </Link>
  );
}
