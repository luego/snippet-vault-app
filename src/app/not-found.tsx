import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell grid min-h-svh place-items-center py-16 text-center">
      <div>
        <span className="eyebrow">404 · Not found</span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          This snippet slipped away.
        </h1>
        <p className="mt-3 text-slate-500">
          The page may have moved, or you may not have access to it.
        </p>
        <Link href="/" className="button button-primary mt-7">
          Back home
        </Link>
      </div>
    </main>
  );
}
