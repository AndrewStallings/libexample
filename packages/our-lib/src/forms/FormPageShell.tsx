"use client";

import type { ReactNode } from "react";

type FormPageShellProps = {
  backHref?: string;
  backLabel?: string;
  title: string;
  description: string;
  statusMessage?: string | null;
  renderBackLink?: (props: { href: string; className: string; children: ReactNode }) => ReactNode;
  children: ReactNode;
};

export const FormPageShell = ({
  backHref,
  backLabel,
  title,
  description,
  statusMessage,
  renderBackLink,
  children,
}: FormPageShellProps) => {
  const statusMessageStyle = {
    borderColor: "rgba(15, 118, 110, 0.18)",
    backgroundColor: "rgba(15, 118, 110, 0.08)",
    color: "var(--accent-strong)",
  } as const;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-3xl">
        {backHref && backLabel
          ? renderBackLink?.({
              href: backHref,
              className: "text-sm font-semibold transition hover:opacity-80",
              children: backLabel,
            }) ?? (
              <a className="text-sm font-semibold transition hover:opacity-80" href={backHref}>
                {backLabel}
              </a>
            )
          : null}
        <h1 className="mt-3 text-4xl font-semibold leading-tight">{title}</h1>
        <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
          {description}
        </p>
        {statusMessage ? (
          <div className="mt-4 rounded-2xl border px-4 py-3 text-sm" style={statusMessageStyle}>
            {statusMessage}
          </div>
        ) : null}
      </section>

      {children}
    </main>
  );
};
