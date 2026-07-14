"use client";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container-shell grid min-h-[70svh] place-items-center py-16 text-center">
      <div>
        <span className="eyebrow">Something went wrong</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          We could not load this page.
        </h1>
        <p className="mt-3 text-slate-500">
          Try again. If the problem continues, come back in a moment.
        </p>
        <button
          type="button"
          className="button button-primary mt-7"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
