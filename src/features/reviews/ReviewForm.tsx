"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FormFrame, SelectInput, TextArea, TextInput } from "our-lib";
import { reviewInputSchema, reviewRatingOptions, reviewStatusOptions, type ReviewInput, type ReviewRecord } from "@/features/reviews/reviewSchemas";
import { reviewTypes, reviewerOptions } from "@/features/reviews/reviewLookupData";

type ReviewFormProps = {
  mode: "create" | "edit";
  initialValue: ReviewInput;
  record?: ReviewRecord;
  onSubmit: (value: ReviewInput) => Promise<void>;
};

const getErrorMessage = (value: unknown) => {
  return typeof value === "string" ? value : undefined;
};

export const ReviewForm = ({ mode, initialValue, record, onSubmit }: ReviewFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

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
          <button
            className="rounded-full bg-[var(--accent)] px-5 py-2 font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            type="submit"
          >
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
          {(field) => (
            <TextInput
              label="Subject"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              error={getErrorMessage(field.state.meta.errors[0])}
            />
          )}
        </form.Field>

        <form.Field name="reviewTypeId">
          {(field) => (
            <SelectInput
              label="Review Type"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              options={reviewTypes.map((item) => ({ value: item.reviewTypeId, label: item.type }))}
            />
          )}
        </form.Field>

        <form.Field name="reviewerId">
          {(field) => (
            <SelectInput
              label="Reviewer"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              options={reviewerOptions}
            />
          )}
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
            <SelectInput
              label="Rating"
              value={String(field.state.value)}
              onChange={(event) => field.handleChange(Number(event.target.value))}
              options={[...reviewRatingOptions]}
              error={getErrorMessage(field.state.meta.errors[0])}
            />
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => (
            <SelectInput
              label="Status"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value as ReviewInput["status"])}
              options={[...reviewStatusOptions]}
            />
          )}
        </form.Field>

        <div className="md:col-span-2">
          <form.Field
            name="summary"
            validators={{
              onChange: ({ value }) => (value.length < 8 ? "Summary should explain the review" : undefined),
            }}
          >
            {(field) => (
              <TextArea
                label="Summary"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                error={getErrorMessage(field.state.meta.errors[0]) ?? submitError ?? undefined}
              />
            )}
          </form.Field>
        </div>
      </FormFrame>
    </form>
  );
};
