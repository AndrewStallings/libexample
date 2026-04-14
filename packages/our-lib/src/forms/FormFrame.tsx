"use client";

import type { ReactNode } from "react";
import type { EntityId, UpdatedAtValue } from "../types/index";
import { libPanelStyle } from "../styles";

type FormFrameProps = {
  title: string;
  recordId?: EntityId | undefined;
  updatedBy?: string | undefined;
  updatedAt?: UpdatedAtValue | undefined;
  children: ReactNode;
  footer: ReactNode;
};

const formatUpdatedAtLabel = (value?: UpdatedAtValue) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && "toISO" in value && typeof value.toISO === "function") {
    return value.toISO() ?? String(value);
  }

  return String(value);
};

export const FormFrame = ({ title, recordId, updatedBy, updatedAt, children, footer }: FormFrameProps) => {
  const updatedAtLabel = formatUpdatedAtLabel(updatedAt);

  return (
    <section
      className="rounded-[1.75rem] border p-6 dark:text-white"
      style={{
        ...libPanelStyle,
        backgroundColor: "var(--lib-surface)",
        boxShadow: "0 20px 48px rgba(15, 23, 42, 0.08)",
      }}
    >
      <header className="mb-8 flex flex-col gap-4 border-b border-[color:var(--lib-border)] pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 h-1 w-14 rounded-full bg-[color:var(--lib-primary)]" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
          {recordId !== undefined && recordId !== null ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              ID: {String(recordId)}
            </p>
          ) : null}
        </div>
        <div className="grid gap-1 text-sm text-slate-500 dark:text-slate-300 md:text-right">
          {updatedBy ? <div>Last modified by {updatedBy}</div> : null}
          {updatedAtLabel ? <div>{updatedAtLabel}</div> : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">{children}</div>
      <div className="mt-8 flex justify-end border-t border-[color:var(--lib-border)] pt-5 dark:border-white/10">{footer}</div>
    </section>
  );
};
