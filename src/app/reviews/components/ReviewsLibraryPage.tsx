"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { ReviewFormPage } from "@/reviews/components/ReviewFormPage";
import type { ReviewRecord } from "@/reviews/models/schemas";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";
import { createReviewService } from "@/reviews/services/reviewService";

export const REVIEWS_QUERY_KEY = "reviews";

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
  const service = useMemo(() => createReviewService(), []);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ReviewRecord | undefined>();
  const { data: reviews = [] } = useQuery({
    queryKey: [REVIEWS_QUERY_KEY],
    queryFn: async () => (await service.repository.list()).items,
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="app-shell">
      <section className="app-hero">
        <p className="app-kicker">
          Second Feature
        </p>
        <h1 className="app-title">Reviews pressure-test the pattern against joined lookup data.</h1>
        <p className="app-copy">
          The base review table has eight columns, and <code>ReviewTypeID</code> joins to a type lookup table. The UI still consumes a clean,
          enriched record shape.
        </p>
        <div className="app-actions">
          <button
            className="app-primary-button"
            onClick={() => {
              setSelectedRecord(undefined);
              setPanelMode("create");
            }}
            type="button"
          >
            Create Review
          </button>
        </div>
      </section>

      <section className="app-card-stack">
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
