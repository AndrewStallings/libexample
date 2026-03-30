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
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <header className="mb-6 flex flex-col gap-3 border-b border-[var(--border)] pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {recordId ? <p className="text-sm text-[var(--muted)]">ID: {recordId}</p> : null}
        </div>
        <div className="text-sm text-[var(--muted)]">
          {updatedBy ? <div>Last modified by {updatedBy}</div> : null}
          {updatedAt ? <div>{updatedAt}</div> : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">{children}</div>
      <div className="mt-6 flex justify-end">{footer}</div>
    </section>
  );
};
