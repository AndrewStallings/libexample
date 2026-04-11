"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { ReviewFormPage } from "@/reviews/components/ReviewFormPage";
import type { ReviewRecord } from "@/reviews/models/schemas";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";
import { listReviews } from "@/reviews/services/reviewDemoService";
import { queryKeys } from "@/config/queryKeys";

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
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ReviewRecord | undefined>();
  const { data: reviews = [] } = useQuery({
    queryKey: queryKeys.reviews,
    queryFn: listReviews,
  });

  const createButtonStyle = {
    backgroundColor: "var(--accent)",
  } as const;

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

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
          <button
            className="rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            onClick={() => {
              setSelectedRecord(undefined);
              setPanelMode("create");
            }}
            style={createButtonStyle}
            type="button"
          >
            Create Review
          </button>
        </div>
      </section>

      <section className="space-y-6">
        {reviews.map((record) => (
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
                <button
                  className={cardActionClassName}
                  onClick={() => {
                    setSelectedRecord(record);
                    setPanelMode("edit");
                  }}
                  type="button"
                >
                  Open Form
                </button>
                <CardActionButton>View Audit</CardActionButton>
                {record.status === "open" ? <CardActionButton>Escalate</CardActionButton> : null}
              </>
            }
          />
        ))}
      </section>

      <ReviewFormPage isOpen={panelMode !== null} mode={panelMode ?? "create"} onClose={closePanel} record={selectedRecord} />
    </main>
  );
};
