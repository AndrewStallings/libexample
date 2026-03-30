import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldShellProps = {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
};

const FieldShell = ({ label, description, error, children }: FieldShellProps) => {
  return (
    <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      {description ? <span className="text-xs text-[var(--muted)]">{description}</span> : null}
      {children}
      {error ? <span className="text-sm text-[var(--danger)]">{error}</span> : null}
    </label>
  );
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
  error?: string;
};

export const TextInput = ({ label, description, error, ...props }: TextInputProps) => {
  return (
    <FieldShell label={label} description={description} error={error}>
      <input
        {...props}
        className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
      />
    </FieldShell>
  );
};

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  description?: string;
  error?: string;
};

export const TextArea = ({ label, description, error, ...props }: TextAreaProps) => {
  return (
    <FieldShell label={label} description={description} error={error}>
      <textarea
        {...props}
        className="min-h-28 rounded-xl border border-[var(--border)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
      />
    </FieldShell>
  );
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  description?: string;
  error?: string;
  options: Array<{ label: string; value: string }>;
};

export const SelectInput = ({ label, description, error, options, ...props }: SelectInputProps) => {
  return (
    <FieldShell label={label} description={description} error={error}>
      <select
        {...props}
        className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
};
