"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FormAsyncComboboxField, FormFrame, FormSelectField, FormTextAreaField, FormTextField } from "our-lib";
import { loadOwnerOptions, ownerOptions } from "@/books/models/options";
import { bookInputSchema, bookStatusOptions, type BookInput, type BookRecord } from "@/books/models/schemas";

type BookFormProps = {
  mode: "create" | "edit";
  initialValue: BookInput;
  record?: BookRecord;
  onSubmit: (value: BookInput) => Promise<void>;
};

export const BookForm = ({ mode, initialValue, record, onSubmit }: BookFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitButtonStyle = {
    backgroundColor: "var(--accent)",
  } as const;

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
          <button className="rounded-full px-5 py-2 font-semibold text-white transition hover:opacity-90" style={submitButtonStyle} type="submit">
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
          {(field) => <FormTextField field={field} label="Title" />}
        </form.Field>

        <form.Field name="status">
          {(field) => <FormSelectField field={field} label="Status" options={[...bookStatusOptions]} />}
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
            <FormAsyncComboboxField
              description="Async owner lookup to stress test a searchable form field."
              field={field}
              label="Owner"
              loadOptions={loadOwnerOptions}
              displayValue={form.getFieldValue("ownerName")}
              onOptionSelected={(option) => {
                const owner = ownerOptions.find((item) => item.value === option.value);
                if (owner) {
                  form.setFieldValue("ownerName", owner.label);
                }
              }}
              placeholder="Search owners"
            />
          )}
        </form.Field>

        <form.Field name="ownerName">
          {(field) => (
            <FormTextField
              field={field}
              label="Owner Name"
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
            {(field) => <FormTextAreaField field={field} label="Notes" error={submitError ?? undefined} />}
          </form.Field>
        </div>
      </FormFrame>
    </form>
  );
};
