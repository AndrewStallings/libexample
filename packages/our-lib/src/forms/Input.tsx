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
    <label className="flex flex-col gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.56)] dark:border-zinc-700 dark:bg-zinc-900">
      <span className="text-sm font-semibold text-black dark:text-white">
        {label}
      </span>
      {description ? (
        <span className="text-xs leading-5 text-slate-500 dark:text-zinc-300">
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

const inputClassName =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-black outline-none transition placeholder:text-slate-400 focus:border-[#00249c] focus:ring-4 focus:ring-[#00249c]/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500";

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
        className={inputClassName}
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
        className={`min-h-28 ${inputClassName}`}
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
        className={inputClassName}
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
          className={`w-full ${inputClassName}`}
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
          value={query}
        />
        {open ? (
          <div
            className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-[1.25rem] border border-slate-300 bg-white p-2 shadow-[0_20px_44px_rgba(15,23,42,0.10)] dark:border-zinc-700 dark:bg-zinc-950"
            role="listbox"
          >
            {loading ? <div className="px-3 py-2 text-sm text-slate-600 dark:text-zinc-300">Loading...</div> : null}
            {!loading && options.length === 0 ? <div className="px-3 py-2 text-sm text-slate-600 dark:text-zinc-300">{emptyMessage}</div> : null}
            {!loading
              ? options.map((option) => (
                  <button
                    key={option.value}
                    className="block w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-[#eef3ff] dark:text-white dark:hover:bg-zinc-900"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      onOptionSelect(option);
                      setQuery(option.label);
                      setOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    <div className="font-medium text-black dark:text-white">{option.label}</div>
                    {option.description ? <div className="text-xs text-slate-500 dark:text-zinc-300">{option.description}</div> : null}
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
};
