"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

type FieldShellProps = {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
};

const FieldShell = ({ label, description, error, children }: FieldShellProps) => {
  return (
    <label
      className="flex flex-col gap-2 rounded-2xl border p-4 shadow-sm"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {label}
      </span>
      {description ? (
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {description}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </span>
      ) : null}
    </label>
  );
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
};

export const TextInput = ({ label, description, error, ...props }: TextInputProps) => {
  return (
    <FieldShell label={label} description={description} error={error}>
      <input
        {...props}
        className="rounded-xl border bg-white px-3 py-2 outline-none transition"
        style={{ borderColor: "var(--border)" }}
      />
    </FieldShell>
  );
};

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
};

export const TextArea = ({ label, description, error, ...props }: TextAreaProps) => {
  return (
    <FieldShell label={label} description={description} error={error}>
      <textarea
        {...props}
        className="min-h-28 rounded-xl border bg-white px-3 py-2 outline-none transition"
        style={{ borderColor: "var(--border)" }}
      />
    </FieldShell>
  );
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  options: Array<{ label: string; value: string }>;
};

export const SelectInput = ({ label, description, error, options, ...props }: SelectInputProps) => {
  return (
    <FieldShell label={label} description={description} error={error}>
      <select
        {...props}
        className="rounded-xl border bg-white px-3 py-2 outline-none transition"
        style={{ borderColor: "var(--border)" }}
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

export type AsyncComboboxOption = {
  label: string;
  value: string;
  description?: string | undefined;
};

type AsyncComboboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  value: string;
  displayValue?: string | undefined;
  loadOptions: (query: string) => Promise<AsyncComboboxOption[]>;
  onOptionSelect: (option: AsyncComboboxOption) => void;
  emptyMessage?: string | undefined;
};

export const AsyncCombobox = ({
  label,
  description,
  error,
  value,
  displayValue,
  loadOptions,
  onOptionSelect,
  emptyMessage = "No matches found.",
  disabled,
  placeholder,
  ...props
}: AsyncComboboxProps) => {
  const [query, setQuery] = useState(displayValue ?? value);
  const [options, setOptions] = useState<AsyncComboboxOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const latestRequest = useRef(0);

  useEffect(() => {
    setQuery(displayValue ?? value);
  }, [displayValue, value]);

  useEffect(() => {
    if (!open || disabled) {
      return;
    }

    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;
    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      void loadOptions(query).then((nextOptions) => {
        if (latestRequest.current === requestId) {
          setOptions(nextOptions);
          setLoading(false);
        }
      });
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [disabled, loadOptions, open, query]);

  return (
    <FieldShell label={label} description={description} error={error}>
      <div className="relative">
        <input
          {...props}
          aria-autocomplete="list"
          aria-expanded={open}
          className="w-full rounded-xl border bg-white px-3 py-2 outline-none transition"
          disabled={disabled}
          onBlur={() => {
            window.setTimeout(() => {
              setOpen(false);
              setQuery(displayValue ?? value);
            }, 100);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
          }}
          placeholder={placeholder}
          role="combobox"
          style={{ borderColor: "var(--border)" }}
          value={query}
        />
        {open ? (
          <div
            className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-2xl border bg-white p-2 shadow-lg"
            role="listbox"
            style={{ borderColor: "var(--border)" }}
          >
            {loading ? <div className="px-3 py-2 text-sm">Loading...</div> : null}
            {!loading && options.length === 0 ? <div className="px-3 py-2 text-sm">{emptyMessage}</div> : null}
            {!loading
              ? options.map((option) => (
                  <button
                    key={option.value}
                    className="block w-full rounded-xl px-3 py-2 text-left transition hover:bg-stone-100"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      onOptionSelect(option);
                      setQuery(option.label);
                      setOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.description ? <div className="text-xs text-stone-500">{option.description}</div> : null}
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
};
