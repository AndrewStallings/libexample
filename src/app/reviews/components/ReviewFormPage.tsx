"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormPageShell } from "our-lib";
import { ReviewForm } from "@/reviews/components/ReviewForm";
import { createReviewDemoService, toReviewInput } from "@/reviews/services/reviewDemoService";
import type { ReviewRecord } from "@/reviews/models/schemas";

type ReviewFormPageProps = {
  mode: "create" | "edit";
  record?: ReviewRecord;
};

export const ReviewFormPage = ({ mode, record }: ReviewFormPageProps) => {
  const service = useMemo(() => createReviewDemoService(), []);
  const [currentRecord, setCurrentRecord] = useState<ReviewRecord | undefined>(record);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <FormPageShell
      backHref="/reviews"
      backLabel="Back to review cards"
      title={mode === "create" ? "Create a new review" : `Edit ${currentRecord?.subject ?? "review"}`}
      description="This route shows the same library form shell against a different feature and joined lookup data."
      statusMessage={statusMessage}
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
    >
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
    </FormPageShell>
  );
};
