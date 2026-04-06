"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FormFrame, FormSelectField, FormTextAreaField, FormTextField } from "our-lib";
import { reviewTypes, reviewerOptions } from "@/reviews/models/lookupData";
import { reviewInputSchema, reviewRatingOptions, reviewStatusOptions, type ReviewInput, type ReviewRecord } from "@/reviews/models/schemas";

type ReviewFormProps = {
  mode: "create" | "edit";
  initialValue: ReviewInput;
  record?: ReviewRecord;
  onSubmit: (value: ReviewInput) => Promise<void>;
};

export const ReviewForm = ({ mode, initialValue, record, onSubmit }: ReviewFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitButtonStyle = {
    backgroundColor: "var(--accent)",
  } as const;

  const form = useForm({
    defaultValues: initialValue,
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      const parsed = reviewInputSchema.safeParse(value);
      if (!parsed.success) {
        setSubmitError(parsed.error.issues[0]?.message ?? "Validation failed");
        return;
      }

      await onSubmit(parsed.data);
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FormFrame
        title={mode === "create" ? "Create Review" : "Edit Review"}
        recordId={record?.reviewId}
        updatedAt={record?.updatedAt}
        footer={
          <button className="rounded-full px-5 py-2 font-semibold text-white transition hover:opacity-90" style={submitButtonStyle} type="submit">
            {mode === "create" ? "Create review" : "Save review"}
          </button>
        }
      >
        <form.Field
          name="subject"
          validators={{
            onChange: ({ value }) => (value.length < 3 ? "Subject is required" : undefined),
          }}
        >
          {(field) => <FormTextField field={field} label="Subject" />}
        </form.Field>

        <form.Field name="reviewTypeId">
          {(field) => (
            <FormSelectField
              field={field}
              label="Review Type"
              options={reviewTypes.map((item) => ({ value: item.reviewTypeId, label: item.type }))}
            />
          )}
        </form.Field>

        <form.Field name="reviewerId">
          {(field) => <FormSelectField field={field} label="Reviewer" options={reviewerOptions} />}
        </form.Field>

        <form.Field
          name="rating"
          validators={{
            onChange: ({ value }) => {
              const status = form.getFieldValue("status");
              if (status === "approved" && Number(value) < 3) {
                return "Approved reviews should have a rating of at least 3.";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <FormSelectField field={field} label="Rating" options={[...reviewRatingOptions]} parseValue={(value) => Number(value)} />
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => <FormSelectField field={field} label="Status" options={[...reviewStatusOptions]} />}
        </form.Field>

        <div className="md:col-span-2">
          <form.Field
            name="summary"
            validators={{
              onChange: ({ value }) => (value.length < 8 ? "Summary should explain the review" : undefined),
            }}
          >
            {(field) => <FormTextAreaField field={field} label="Summary" error={submitError ?? undefined} />}
          </form.Field>
        </div>
      </FormFrame>
    </form>
  );
};
