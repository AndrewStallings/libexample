"use client";

import type { ReactNode } from "react";
import type { EntityId, UpdatedAtValue } from "../types/index";

type FormFrameProps = {
  title: string;
  recordId?: EntityId;
  updatedBy?: string;
  updatedAt?: UpdatedAtValue;
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
      className="rounded-3xl border p-6"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
      }}
    >
      <header className="mb-6 flex flex-col gap-3 border-b pb-4 md:flex-row md:items-end md:justify-between" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {recordId !== undefined && recordId !== null ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              ID: {String(recordId)}
            </p>
          ) : null}
        </div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          {updatedBy ? <div>Last modified by {updatedBy}</div> : null}
          {updatedAtLabel ? <div>{updatedAtLabel}</div> : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">{children}</div>
      <div className="mt-6 flex justify-end">{footer}</div>
    </section>
  );
};
