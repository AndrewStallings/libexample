"use client";

import { FormShell, useSidePanelFormState } from "our-lib";
import { createReviewAction, updateReviewAction } from "@/reviews/actions";
import { ReviewForm } from "@/reviews/components/ReviewForm";
import { REVIEWS_QUERY_KEY } from "@/reviews/components/ReviewsLibraryPage";
import { toReviewInput } from "@/reviews/models/toReviewInput";
import type { ReviewRecord } from "@/reviews/models/schemas";
import { useMemo } from "react";

type ReviewFormPageProps = {
  mode: "create" | "edit";
  record?: ReviewRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const ReviewFormPage = ({ mode, record, isOpen = true, onClose }: ReviewFormPageProps) => {
  const service = useMemo(
    () => ({
      create: createReviewAction,
      update: updateReviewAction,
    }),
    [],
  );
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<
    typeof service,
    ReviewRecord,
    ReturnType<typeof toReviewInput>
  >({
    mode,
    record,
    isOpen,
    onClose,
    createService: () => service,
    queryKey: [REVIEWS_QUERY_KEY],
    createRecord: (serviceValue, input) => serviceValue.create(input),
    updateRecord: (serviceValue, currentRecordValue, input) => serviceValue.update(currentRecordValue.reviewId, input),
    getRecordId: (currentRecordValue) => currentRecordValue.reviewId,
    entityLabel: "review",
  });

  return (
    <FormShell
      variant="side-panel"
      description="The review editor now lives in a side panel so we can keep the joined review cards visible while mutations refresh the list."
      isOpen={isOpen}
      onClose={onClose}
      statusMessage={statusMessage}
      title={mode === "create" ? "Create a new review" : `Edit ${currentRecord?.subject ?? "review"}`}
    >
      <ReviewForm
        key={currentRecord?.reviewId ?? "new-review"}
        mode={mode}
        initialValue={toReviewInput(currentRecord)}
        record={currentRecord}
        onSubmit={handleSubmit}
      />
    </FormShell>
  );
};
