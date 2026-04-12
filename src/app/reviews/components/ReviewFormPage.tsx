"use client";

import { FormShell, useSidePanelFormState } from "our-lib";
import { ReviewForm } from "@/reviews/components/ReviewForm";
import { REVIEWS_QUERY_KEY } from "@/reviews/components/ReviewsLibraryPage";
import { createReviewDemoService, toReviewInput } from "@/reviews/services/reviewDemoService";
import type { ReviewRecord } from "@/reviews/models/schemas";

type ReviewFormPageProps = {
  mode: "create" | "edit";
  record?: ReviewRecord;
  isOpen?: boolean;
  onClose?: () => void;
};

export const ReviewFormPage = ({ mode, record, isOpen = true, onClose }: ReviewFormPageProps) => {
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<
    ReturnType<typeof createReviewDemoService>,
    ReviewRecord,
    ReturnType<typeof toReviewInput>
  >({
    mode,
    record,
    isOpen,
    onClose,
    createService: createReviewDemoService,
    queryKey: [REVIEWS_QUERY_KEY],
    createRecord: (service, input) => service.create(input, "demo-user"),
    updateRecord: (service, currentRecordValue, input) => service.update(currentRecordValue.reviewId, input, "demo-user"),
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
