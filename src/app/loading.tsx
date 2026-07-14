export default function Loading() {
  return (
    <main
      className="container-shell section"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="mt-5 h-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </main>
  );
}
