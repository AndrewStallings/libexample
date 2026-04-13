import { AsyncCombobox, type AsyncComboboxOption, SelectInput, TextArea, TextInput } from "./Input";

type BoundField<TValue> = {
  state: {
    value: TValue;
    meta: {
      errors: unknown[];
    };
  };
  handleBlur: () => void;
  handleChange: (...args: any[]) => void;
};

const getErrorMessage = (value: unknown, fallback?: string) => {
  return typeof value === "string" ? value : fallback;
};

type FormTextFieldProps<TValue extends string | number | undefined> = {
  field: BoundField<TValue>;
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  disabled?: boolean | undefined;
  parseValue?: ((value: string) => TValue) | undefined;
};

export const FormTextField = <TValue extends string | number | undefined>({
  field,
  label,
  description,
  error,
  disabled,
  parseValue,
}: FormTextFieldProps<TValue>) => {
  return (
    <TextInput
      label={label}
      description={description}
      value={String(field.state.value ?? "")}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(parseValue ? parseValue(event.target.value) : (event.target.value as TValue))}
      error={getErrorMessage(field.state.meta.errors[0], error)}
      disabled={disabled}
    />
  );
};

type SelectOption = {
  label: string;
  value: string;
};

type FormSelectFieldProps<TValue extends string | number> = {
  field: BoundField<TValue>;
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  options: SelectOption[];
  parseValue?: ((value: string) => TValue) | undefined;
  onValueChange?: ((value: TValue) => void) | undefined;
  disabled?: boolean | undefined;
};

export const FormSelectField = <TValue extends string | number>({
  field,
  label,
  description,
  error,
  options,
  parseValue,
  onValueChange,
  disabled,
}: FormSelectFieldProps<TValue>) => {
  return (
    <SelectInput
      label={label}
      description={description}
      value={String(field.state.value)}
      onChange={(event) => {
        const nextValue = parseValue ? parseValue(event.target.value) : (event.target.value as TValue);
        field.handleChange(nextValue);
        onValueChange?.(nextValue);
      }}
      options={options}
      error={getErrorMessage(field.state.meta.errors[0], error)}
      disabled={disabled}
    />
  );
};

type FormTextAreaFieldProps = {
  field: BoundField<string | undefined>;
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  disabled?: boolean | undefined;
};

export const FormTextAreaField = ({ field, label, description, error, disabled }: FormTextAreaFieldProps) => {
  return (
    <TextArea
      label={label}
      description={description}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.value)}
      error={getErrorMessage(field.state.meta.errors[0], error)}
      disabled={disabled}
    />
  );
};

type FormAsyncComboboxFieldProps = {
  field: BoundField<string>;
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  disabled?: boolean | undefined;
  displayValue?: string | undefined;
  loadOptions: (query: string) => Promise<AsyncComboboxOption[]>;
  onOptionSelected?: ((option: AsyncComboboxOption) => void) | undefined;
  emptyMessage?: string | undefined;
  placeholder?: string | undefined;
};

export const FormAsyncComboboxField = ({
  field,
  label,
  description,
  error,
  disabled,
  displayValue,
  loadOptions,
  onOptionSelected,
  emptyMessage,
  placeholder,
}: FormAsyncComboboxFieldProps) => {
  return (
    <AsyncCombobox
      description={description}
      disabled={disabled}
      displayValue={displayValue}
      emptyMessage={emptyMessage}
      error={getErrorMessage(field.state.meta.errors[0], error)}
      label={label}
      loadOptions={loadOptions}
      onOptionSelect={(option) => {
        field.handleChange(option.value);
        onOptionSelected?.(option);
      }}
      placeholder={placeholder}
      value={String(field.state.value ?? "")}
    />
  );
};
