"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ReviewForm } from "@/features/reviews/ReviewForm";
import { createReviewDemoService, toReviewInput } from "@/features/reviews/reviewDemoService";
import type { ReviewRecord } from "@/features/reviews/reviewSchemas";

type ReviewFormPageProps = {
  mode: "create" | "edit";
  record?: ReviewRecord;
};

export const ReviewFormPage = ({ mode, record }: ReviewFormPageProps) => {
  const service = useMemo(() => createReviewDemoService(), []);
  const [currentRecord, setCurrentRecord] = useState<ReviewRecord | undefined>(record);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-3xl">
        <Link className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]" href="/reviews">
          Back to review cards
        </Link>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">
          {mode === "create" ? "Create a new review" : `Edit ${currentRecord?.subject ?? "review"}`}
        </h1>
        <p className="mt-3 text-base text-[var(--muted)]">This route shows the same library form shell against a different feature and joined lookup data.</p>
        {statusMessage ? (
          <div className="mt-4 rounded-2xl border border-[color:rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] px-4 py-3 text-sm text-[var(--accent-strong)]">
            {statusMessage}
          </div>
        ) : null}
      </section>

      <ReviewForm
        key={currentRecord?.reviewId ?? "new-review"}
        mode={mode}
        initialValue={toReviewInput(currentRecord)}
        record={currentRecord}
        onSubmit={async (value) => {
          if (mode === "create") {
            const created = await service.create(value, "demo-user");
            setCurrentRecord(created);
            setStatusMessage(`Created ${created.reviewId}.`);
            return;
          }

          if (!currentRecord) {
            setStatusMessage("No review was available to update.");
            return;
          }

          const updated = await service.update(currentRecord.reviewId, value, "demo-user");
          setCurrentRecord(updated);
          setStatusMessage(`Saved changes for ${updated.reviewId}.`);
        }}
      />
    </main>
  );
};
