"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FormAsyncComboboxField, FormFrame, FormSelectField, FormTextAreaField, FormTextField } from "../forms/index";
import type { ResourceProfile, ResourceFormField } from "./defineResourceProfile";

type ResourceFormProps<TRecord, TInput extends Record<string, unknown>> = {
  profile: ResourceProfile<TRecord, TInput>;
  mode: "create" | "edit";
  initialValue: TInput;
  record?: TRecord;
  onSubmit: (value: TInput) => Promise<void>;
};

const renderField = <TInput extends Record<string, unknown>>(
  fieldDefinition: ResourceFormField<TInput>,
  field: {
    state: { value: unknown; meta: { errors: unknown[] } };
    handleBlur: () => void;
    handleChange: (...args: any[]) => void;
  },
) => {
  switch (fieldDefinition.kind) {
    case "textarea":
      return <FormTextAreaField field={field as any} label={fieldDefinition.label} description={fieldDefinition.description} />;
    case "number":
      return (
        <FormTextField
          field={field as any}
          label={fieldDefinition.label}
          description={fieldDefinition.description}
          parseValue={(value) => Number(value) as never}
        />
      );
    case "select":
      return <FormSelectField field={field as any} label={fieldDefinition.label} description={fieldDefinition.description} options={fieldDefinition.options} />;
    case "async-combobox":
      return (
        <FormAsyncComboboxField
          field={field as any}
          label={fieldDefinition.label}
          description={fieldDefinition.description}
          loadOptions={fieldDefinition.loadOptions}
          placeholder={fieldDefinition.placeholder}
        />
      );
    default:
      return <FormTextField field={field as any} label={fieldDefinition.label} description={fieldDefinition.description} />;
  }
};

export const ResourceForm = <TRecord, TInput extends Record<string, unknown>>({
  profile,
  mode,
  initialValue,
  record,
  onSubmit,
}: ResourceFormProps<TRecord, TInput>) => {
  const [localSubmitError, setLocalSubmitError] = useState<string | null>(null);
  const formFrameProps = {
    title: profile.getFormTitle(mode, record),
    footer: (
      <button className="rounded-full bg-teal-700 px-5 py-2 font-semibold text-white transition hover:opacity-90" type="submit">
        {profile.getSubmitLabel(mode)}
      </button>
    ),
    ...(record && profile.getRecordId ? { recordId: profile.getRecordId(record) } : {}),
    ...(record && profile.getUpdatedAt ? { updatedAt: profile.getUpdatedAt(record) } : {}),
    ...(record && profile.getUpdatedBy ? { updatedBy: profile.getUpdatedBy(record) } : {}),
  };
  const form = useForm({
    defaultValues: initialValue,
    onSubmit: async ({ value }) => {
      setLocalSubmitError(null);
      const parsed = profile.inputSchema.safeParse(value);
      if (!parsed.success) {
        setLocalSubmitError(parsed.error.issues[0]?.message ?? "Validation failed");
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
      <FormFrame {...formFrameProps}>
        {profile.formFields.map((fieldDefinition) => (
          <div key={fieldDefinition.key} className={fieldDefinition.colSpan === 2 ? "md:col-span-2" : undefined}>
            <form.Field name={fieldDefinition.key as never}>
              {(field) => renderField(fieldDefinition as ResourceFormField<TInput>, field)}
            </form.Field>
          </div>
        ))}
        {localSubmitError ? (
          <div className="md:col-span-2 text-sm" style={{ color: "var(--danger)" }}>
            {localSubmitError}
          </div>
        ) : null}
      </FormFrame>
    </form>
  );
};
