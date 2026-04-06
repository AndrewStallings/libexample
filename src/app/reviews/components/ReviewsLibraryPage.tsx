import Link from "next/link";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { initialReviewRows } from "@/reviews/data/reviewRepository";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";

const getReviewTypeName = (reviewTypeId: string) => {
  return reviewTypes.find((item) => item.reviewTypeId === reviewTypeId)?.type ?? reviewTypeId;
};

const getReviewerName = (reviewerId: string) => {
  return reviewerOptions.find((item) => item.value === reviewerId)?.label ?? reviewerId;
};

const formatStatus = (status: string) => {
  return status[0]?.toUpperCase() + status.slice(1);
};

export const ReviewsLibraryPage = () => {
  const createButtonStyle = {
    backgroundColor: "var(--accent)",
  } as const;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Second Feature
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Reviews pressure-test the pattern against joined lookup data.</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          The base review table has eight columns, and <code>ReviewTypeID</code> joins to a type lookup table. The UI still consumes a clean,
          enriched record shape.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90" href="/reviews/new" style={createButtonStyle}>
            Create Review
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        {initialReviewRows.map((record) => (
          <EntityCard
            key={record.reviewId}
            sections={[
              {
                title: "Primary",
                items: [
                  { value: record.subject, label: `Subject - ${record.reviewId}`, prominent: true },
                  { value: getReviewerName(record.reviewerId), label: "Reviewer" },
                  { value: getReviewTypeName(record.reviewTypeId), label: "Type" },
                  { value: formatStatus(record.status), label: "Status" },
                ],
              },
              {
                title: "Supporting",
                items: [
                  { value: `${record.rating}/5`, label: "Rating" },
                  { value: record.summary, label: "Summary" },
                  { value: record.updatedAt, label: "Updated At" },
                ],
              },
            ]}
            actions={
              <>
                <Link className={cardActionClassName} href={`/reviews/${record.reviewId}`}>
                  Open Form
                </Link>
                <CardActionButton>View Audit</CardActionButton>
                {record.status === "open" ? <CardActionButton>Escalate</CardActionButton> : null}
              </>
            }
          />
        ))}
      </section>
    </main>
  );
};
