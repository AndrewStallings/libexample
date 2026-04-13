import type { ReactNode } from "react";
import type { ZodType } from "zod";
import type { AsyncComboboxOption } from "../forms/Input";
import type { EntityId, SelectOption, UpdatedAtValue } from "../types/index";

export type ResourceCardField<TRecord> = {
  label: string;
  section: string;
  prominent?: boolean | undefined;
  value: (record: TRecord) => ReactNode;
};

type ResourceFormFieldBase<TInput, TKey extends keyof TInput & string> = {
  key: TKey;
  label: string;
  description?: string | undefined;
  colSpan?: 1 | 2 | undefined;
};

export type ResourceTextField<TInput, TKey extends keyof TInput & string> = ResourceFormFieldBase<TInput, TKey> & {
  kind: "text" | "textarea";
};

export type ResourceNumberField<TInput, TKey extends keyof TInput & string> = ResourceFormFieldBase<TInput, TKey> & {
  kind: "number";
};

export type ResourceSelectField<TInput, TKey extends keyof TInput & string> = ResourceFormFieldBase<TInput, TKey> & {
  kind: "select";
  options: SelectOption[];
};

export type ResourceAsyncComboboxField<TInput, TKey extends keyof TInput & string> = ResourceFormFieldBase<TInput, TKey> & {
  kind: "async-combobox";
  loadOptions: (query: string) => Promise<AsyncComboboxOption[]>;
  placeholder?: string | undefined;
};

export type ResourceFormField<TInput> =
  | ResourceTextField<TInput, keyof TInput & string>
  | ResourceNumberField<TInput, keyof TInput & string>
  | ResourceSelectField<TInput, keyof TInput & string>
  | ResourceAsyncComboboxField<TInput, keyof TInput & string>;

export type ResourceProfile<TRecord, TInput extends Record<string, unknown>> = {
  entityName: string;
  inputSchema: ZodType<TInput>;
  getRecordId?: ((record: TRecord) => EntityId | undefined) | undefined;
  getUpdatedAt?: ((record: TRecord) => UpdatedAtValue | undefined) | undefined;
  getUpdatedBy?: ((record: TRecord) => string | undefined) | undefined;
  getFormTitle: (mode: "create" | "edit", record?: TRecord | undefined) => string;
  getSubmitLabel: (mode: "create" | "edit") => string;
  cardFields: ResourceCardField<TRecord>[];
  formFields: ResourceFormField<TInput>[];
};

export const defineResourceProfile = <TRecord, TInput extends Record<string, unknown>>(
  profile: ResourceProfile<TRecord, TInput>,
) => {
  return profile;
};
