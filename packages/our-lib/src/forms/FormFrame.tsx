"use client";

import type { ReactNode } from "react";

type FormFrameProps = {
  title: string;
  recordId?: string;
  updatedBy?: string;
  updatedAt?: string;
  children: ReactNode;
  footer: ReactNode;
};

export const FormFrame = ({ title, recordId, updatedBy, updatedAt, children, footer }: FormFrameProps) => {
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
          {recordId ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              ID: {recordId}
            </p>
          ) : null}
        </div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          {updatedBy ? <div>Last modified by {updatedBy}</div> : null}
          {updatedAt ? <div>{updatedAt}</div> : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">{children}</div>
      <div className="mt-6 flex justify-end">{footer}</div>
    </section>
  );
};
