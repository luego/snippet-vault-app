import { EmptyState } from "@/components/feedback/empty-state";

export function FoundationPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="app-content route-page">
      <div className="page-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="foundation-note">
        <strong>Milestone 1 foundation:</strong> This route and responsive
        application shell are ready. Secure Supabase data and mutations are
        implemented in later milestones from the specification.
      </div>
      <div className="mt-5">
        <EmptyState
          title={`${title} is ready for data`}
          description="The interface foundation is complete; connected data arrives with the relevant product milestone."
        />
      </div>
    </main>
  );
}
