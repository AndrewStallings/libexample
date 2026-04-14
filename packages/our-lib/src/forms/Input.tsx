"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { libPanelStyle } from "../styles";

type FieldShellProps = {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
};

const FieldShell = ({ label, description, error, children }: FieldShellProps) => {
  return (
    <label
      className="flex flex-col gap-2 rounded-[1.5rem] border p-4"
      style={{
        ...libPanelStyle,
        backgroundColor: "var(--lib-surface-strong)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.56)",
      }}
    >
      <span className="text-sm font-semibold text-slate-800 dark:text-white">
        {label}
      </span>
      {description ? (
        <span className="text-xs leading-5 text-slate-500 dark:text-slate-300">
          {description}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="text-sm text-red-700 dark:text-red-300">
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
        className="rounded-xl border bg-[color:var(--lib-surface)] px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--lib-primary)] focus:ring-4 focus:ring-[color:var(--lib-primary-soft)] dark:text-white dark:placeholder:text-slate-400"
        style={{ borderColor: "var(--lib-border)" }}
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
        className="min-h-28 rounded-xl border bg-[color:var(--lib-surface)] px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--lib-primary)] focus:ring-4 focus:ring-[color:var(--lib-primary-soft)] dark:text-white dark:placeholder:text-slate-400"
        style={{ borderColor: "var(--lib-border)" }}
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
        className="rounded-xl border bg-[color:var(--lib-surface)] px-3 py-2.5 text-slate-900 outline-none transition focus:border-[color:var(--lib-primary)] focus:ring-4 focus:ring-[color:var(--lib-primary-soft)] dark:text-white"
        style={{ borderColor: "var(--lib-border)" }}
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
          className="w-full rounded-xl border bg-[color:var(--lib-surface)] px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--lib-primary)] focus:ring-4 focus:ring-[color:var(--lib-primary-soft)] dark:text-white dark:placeholder:text-slate-400"
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
          style={{ borderColor: "var(--lib-border)" }}
          value={query}
        />
        {open ? (
          <div
            className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-[1.25rem] border p-2 shadow-lg"
            role="listbox"
            style={{
              ...libPanelStyle,
              backgroundColor: "var(--lib-surface)",
              borderColor: "var(--lib-border-strong)",
              boxShadow: "0 20px 44px rgba(15, 23, 42, 0.10)",
            }}
          >
            {loading ? <div className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">Loading...</div> : null}
            {!loading && options.length === 0 ? <div className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{emptyMessage}</div> : null}
            {!loading
              ? options.map((option) => (
                  <button
                    key={option.value}
                    className="block w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-[rgba(22,55,159,0.05)] dark:text-white dark:hover:bg-white/10"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      onOptionSelect(option);
                      setQuery(option.label);
                      setOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">{option.label}</div>
                    {option.description ? <div className="text-xs text-slate-500 dark:text-slate-300">{option.description}</div> : null}
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
};
