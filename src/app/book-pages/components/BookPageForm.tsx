"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FormAsyncComboboxField, FormFrame, FormSelectField, FormTextAreaField, FormTextField } from "our-lib";
import { loadEditorOptions, editorOptions } from "@/book-pages/models/options";
import { bookPageInputSchema, bookPageStatusOptions, type BookPageInput, type BookPageRecord } from "@/book-pages/models/schemas";

type BookPageFormProps = {
  mode: "create" | "edit";
  initialValue: BookPageInput;
  record?: BookPageRecord | undefined;
  onSubmit: (value: BookPageInput) => Promise<void>;
};

export const BookPageForm = ({ mode, initialValue, record, onSubmit }: BookPageFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: initialValue,
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      const parsed = bookPageInputSchema.safeParse(value);
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
        title={mode === "create" ? "Create Book Page" : "Edit Book Page"}
        recordId={record?.pageId}
        updatedAt={record?.updatedAt}
        updatedBy={record?.updatedBy}
        footer={
          <button className="rounded-full bg-teal-700 px-5 py-2 font-semibold text-white transition hover:opacity-90" type="submit">
            {mode === "create" ? "Create page" : "Save page"}
          </button>
        }
      >
        <form.Field name="pageTitle">{(field) => <FormTextField field={field} label="Page Title" />}</form.Field>
        <form.Field name="pageNumber">{(field) => <FormTextField field={field} label="Page Number" parseValue={(value) => Number(value)} />}</form.Field>
        <form.Field name="chapterTitle">{(field) => <FormTextField field={field} label="Chapter" />}</form.Field>
        <form.Field name="sectionName">{(field) => <FormTextField field={field} label="Section" />}</form.Field>
        <form.Field name="status">{(field) => <FormSelectField field={field} label="Status" options={[...bookPageStatusOptions]} />}</form.Field>
        <form.Field name="audience">{(field) => <FormTextField field={field} label="Audience" />}</form.Field>
        <form.Field name="editorId">
          {(field) => (
            <FormAsyncComboboxField
              field={field}
              label="Editor"
              loadOptions={loadEditorOptions}
              displayValue={form.getFieldValue("editorName")}
              onOptionSelected={(option) => {
                const selectedEditor = editorOptions.find((item) => item.value === option.value);
                if (selectedEditor) {
                  form.setFieldValue("editorName", selectedEditor.label);
                }
              }}
              placeholder="Search editors"
            />
          )}
        </form.Field>
        <form.Field name="reviewerName">{(field) => <FormTextField field={field} label="Reviewer" />}</form.Field>
        <form.Field name="wordCount">{(field) => <FormTextField field={field} label="Word Count" parseValue={(value) => Number(value)} />}</form.Field>
        <form.Field name="readingTimeMinutes">{(field) => <FormTextField field={field} label="Reading Time" parseValue={(value) => Number(value)} />}</form.Field>
        <form.Field name="illustrationCount">{(field) => <FormTextField field={field} label="Illustrations" parseValue={(value) => Number(value)} />}</form.Field>
        <form.Field name="componentCount">{(field) => <FormTextField field={field} label="Components" parseValue={(value) => Number(value)} />}</form.Field>
        <form.Field name="locale">{(field) => <FormTextField field={field} label="Locale" />}</form.Field>
        <form.Field name="seoTitle">{(field) => <FormTextField field={field} label="SEO Title" />}</form.Field>
        <form.Field name="slug">{(field) => <FormTextField field={field} label="Slug" />}</form.Field>
        <form.Field name="lastReviewedAt">{(field) => <FormTextField field={field} label="Last Reviewed" />}</form.Field>
        <div className="md:col-span-2">
          <form.Field name="notes">{(field) => <FormTextAreaField field={field} label="Notes" error={submitError ?? undefined} />}</form.Field>
        </div>
      </FormFrame>
    </form>
  );
};
