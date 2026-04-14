"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";
import { libAccentBadgeStyle, libPanelStyle, libStatusMessageStyle } from "../styles";

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

const renderBackAction = (backHref?: string, backLabel?: string, renderBackLink?: (props: LinkRenderProps) => ReactNode) => {
  if (!backHref || !backLabel) {
    return null;
  }

  return (
    renderBackLink?.({
      href: backHref,
      className: "text-sm font-medium text-slate-500 transition hover:text-[color:var(--lib-primary-strong)] dark:text-slate-400 dark:hover:text-white",
      children: backLabel,
    }) ?? (
      <a className="text-sm font-medium text-slate-500 transition hover:text-[color:var(--lib-primary-strong)] dark:text-slate-400 dark:hover:text-white" href={backHref}>
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
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/18 backdrop-blur-[3px] dark:bg-black/55">
        <button aria-label="Close panel" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
        <aside
          aria-labelledby={titleId}
          aria-modal="true"
          className="relative z-10 flex h-full w-full max-w-3xl flex-col overflow-hidden border-l shadow-[0_32px_80px_rgba(15,23,42,0.14)] dark:text-white"
          role="dialog"
          style={{ ...libPanelStyle, backgroundColor: "var(--lib-surface)" }}
        >
          <div
            className="border-b px-5 py-6 md:px-7"
            style={{
              background: "var(--lib-panel-hero)",
              borderColor: "var(--lib-border)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="relative pl-5">
                <div className="absolute left-0 top-1 h-16 w-1 rounded-full" style={{ backgroundColor: "var(--lib-panel-accent)" }} />
                <p className="text-[11px] font-semibold uppercase" style={libAccentBadgeStyle}>
                  Editing Workspace
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight" id={titleId} style={{ color: "var(--lib-panel-hero-ink)" }}>
                  {title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: "var(--lib-panel-hero-copy)" }}>
                  {description}
                </p>
              </div>
              <button
                className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:opacity-90"
                onClick={onClose}
                style={{
                  backgroundColor: "var(--lib-panel-button-bg)",
                  borderColor: "var(--lib-panel-button-border)",
                  color: "var(--lib-panel-button-ink)",
                }}
                type="button"
              >
                Close
              </button>
            </div>
            {statusMessage ? <div className="mt-5 rounded-2xl border px-4 py-3 text-sm" style={libStatusMessageStyle}>{statusMessage}</div> : null}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7 md:py-7" style={{ background: "var(--lib-panel-body)" }}>
            {children}
          </div>
        </aside>
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 dark:text-white md:px-8">
      <section className="max-w-3xl">
        {renderBackAction(backHref, backLabel, renderBackLink)}
        <div className="mt-5 h-px w-20 bg-[color:var(--lib-primary)]/80" />
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>
        {statusMessage ? (
          <div
            className="mt-5 rounded-2xl border px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            style={libStatusMessageStyle}
          >
            {statusMessage}
          </div>
        ) : null}
      </section>

      {children}
    </main>
  );
};
