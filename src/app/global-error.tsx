"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          <div>
            <h1>Snippet Vault needs a moment.</h1>
            <p>
              Something unexpected happened. No private details were exposed.
            </p>
            <button type="button" onClick={reset}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
