"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FormFrame, SelectInput, TextArea, TextInput } from "our-lib";
import { bookInputSchema, bookStatusOptions, type BookInput, type BookRecord } from "@/features/books/bookSchemas";
import { ownerOptions } from "@/features/books/bookOptions";

type BookFormProps = {
  mode: "create" | "edit";
  initialValue: BookInput;
  record?: BookRecord;
  onSubmit: (value: BookInput) => Promise<void>;
};

const getErrorMessage = (value: unknown) => {
  return typeof value === "string" ? value : undefined;
};

export const BookForm = ({ mode, initialValue, record, onSubmit }: BookFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: initialValue,
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      const parsed = bookInputSchema.safeParse(value);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        setSubmitError(firstIssue?.message ?? "Validation failed");
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
        title={mode === "create" ? "Create Book" : "Edit Book"}
        recordId={record?.bookId}
        updatedAt={record?.updatedAt}
        updatedBy={record?.updatedBy}
        footer={
          <button
            className="rounded-full bg-[var(--accent)] px-5 py-2 font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            type="submit"
          >
            {mode === "create" ? "Create record" : "Save changes"}
          </button>
        }
      >
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => (value.length < 2 ? "Title is required" : undefined),
          }}
        >
          {(field) => (
            <TextInput
              label="Title"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              error={getErrorMessage(field.state.meta.errors[0])}
            />
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => (
            <SelectInput
              label="Status"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value as BookInput["status"])}
              options={[...bookStatusOptions]}
            />
          )}
        </form.Field>

        <form.Field
          name="ownerId"
          validators={{
            onChange: ({ value }) => {
              return !value ? "Owner is required" : undefined;
            },
          }}
        >
          {(field) => (
            <SelectInput
              label="Owner"
              value={field.state.value}
              onChange={(event) => {
                const nextOwnerId = event.target.value;
                const owner = ownerOptions.find((item) => item.value === nextOwnerId);
                field.handleChange(nextOwnerId);
                if (owner) {
                  form.setFieldValue("ownerName", owner.label);
                }
              }}
              options={ownerOptions}
            />
          )}
        </form.Field>

        <form.Field name="ownerName">
          {(field) => (
            <TextInput
              label="Owner Name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              description="Usually filled automatically from the selected owner, but editable for escape-hatch scenarios."
            />
          )}
        </form.Field>

        <div className="md:col-span-2">
          <form.Field
            name="notes"
            validators={{
              onChange: ({ value }) => {
                const status = form.getFieldValue("status");
                if (status === "archived" && !value.toLowerCase().includes("archive")) {
                  return "Archived items should explain why they were archived.";
                }

                return value.length < 5 ? "Notes should explain the record" : undefined;
              },
            }}
          >
            {(field) => (
              <TextArea
                label="Notes"
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
