"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";

type LinkRenderProps = {
  href: string;
  className: string;
  children: ReactNode;
};

export type FormShellProps = {
  variant?: "page" | "side-panel" | undefined;
  isOpen?: boolean | undefined;
  backHref?: string | undefined;
  backLabel?: string | undefined;
  title: string;
  description: string;
  statusMessage?: string | null | undefined;
  onClose?: (() => void) | undefined;
  renderBackLink?: ((props: LinkRenderProps) => ReactNode) | undefined;
  children: ReactNode;
};

const statusMessageStyle = {
  borderColor: "rgba(15, 118, 110, 0.18)",
  backgroundColor: "rgba(15, 118, 110, 0.08)",
  color: "var(--accent-strong)",
} as const;

const renderBackAction = (backHref?: string, backLabel?: string, renderBackLink?: (props: LinkRenderProps) => ReactNode) => {
  if (!backHref || !backLabel) {
    return null;
  }

  return (
    renderBackLink?.({
      href: backHref,
      className: "text-sm font-semibold transition hover:opacity-80",
      children: backLabel,
    }) ?? (
      <a className="text-sm font-semibold transition hover:opacity-80" href={backHref}>
        {backLabel}
      </a>
    )
  );
};

export const FormShell = ({
  variant = "page",
  isOpen = true,
  backHref,
  backLabel,
  title,
  description,
  statusMessage,
  onClose,
  renderBackLink,
  children,
}: FormShellProps) => {
  const titleId = useId();

  useEffect(() => {
    if (variant !== "side-panel" || !isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, variant]);

  if (variant === "side-panel") {
    if (!isOpen) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/30 backdrop-blur-[1px]">
        <button aria-label="Close panel" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
        <aside
          aria-labelledby={titleId}
          aria-modal="true"
          className="relative z-10 flex h-full w-full max-w-3xl flex-col overflow-hidden bg-stone-50 shadow-2xl"
          role="dialog"
        >
          <div className="border-b border-stone-200 bg-white/92 px-5 py-5 backdrop-blur md:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                  Editing Workspace
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-stone-900" id={titleId}>
                  {title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
              </div>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>
            {statusMessage ? (
              <div className="mt-4 rounded-2xl border px-4 py-3 text-sm" style={statusMessageStyle}>
                {statusMessage}
              </div>
            ) : null}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7 md:py-7">{children}</div>
        </aside>
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-3xl">
        {renderBackAction(backHref, backLabel, renderBackLink)}
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
