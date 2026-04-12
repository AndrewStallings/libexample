"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormShell } from "our-lib";
import { ReviewForm } from "@/reviews/components/ReviewForm";
import { createReviewDemoService, toReviewInput } from "@/reviews/services/reviewDemoService";
import type { ReviewRecord } from "@/reviews/models/schemas";
import { queryKeys } from "@/config/queryKeys";

type ReviewFormPageProps = {
  mode: "create" | "edit";
  record?: ReviewRecord;
  isOpen?: boolean;
  onClose?: () => void;
};

export const ReviewFormPage = ({ mode, record, isOpen = true, onClose }: ReviewFormPageProps) => {
  const queryClient = useQueryClient();
  const service = createReviewDemoService();
  const [currentRecord, setCurrentRecord] = useState<ReviewRecord | undefined>(record);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentRecord(record);
    setStatusMessage(null);
  }, [isOpen, mode, record]);

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
        onSubmit={async (value) => {
          if (mode === "create") {
            const created = await service.create(value, "demo-user");
            setCurrentRecord(created);
            setStatusMessage(`Created ${created.reviewId}.`);
            await queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
            onClose?.();
            return;
          }

          if (!currentRecord) {
            setStatusMessage("No review was available to update.");
            return;
          }

          const updated = await service.update(currentRecord.reviewId, value, "demo-user");
          setCurrentRecord(updated);
          setStatusMessage(`Saved changes for ${updated.reviewId}.`);
          await queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
          onClose?.();
        }}
      />
    </FormShell>
  );
};
