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

const badgeClassName = "text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00249c] dark:text-[#89a8ff]";
const statusMessageClassName =
  "mt-5 rounded-2xl border border-[#bfd0ff] bg-[#edf3ff] px-4 py-3 text-sm text-[#001c77] dark:border-[#2e468f] dark:bg-[#10172d] dark:text-white";

const renderBackAction = (backHref?: string, backLabel?: string, renderBackLink?: (props: LinkRenderProps) => ReactNode) => {
  if (!backHref || !backLabel) {
    return null;
  }

  return (
    renderBackLink?.({
      href: backHref,
      className: "text-sm font-medium text-slate-600 transition hover:text-[#001c77] dark:text-zinc-300 dark:hover:text-white",
      children: backLabel,
    }) ?? (
      <a className="text-sm font-medium text-slate-600 transition hover:text-[#001c77] dark:text-zinc-300 dark:hover:text-white" href={backHref}>
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
          className="relative z-10 flex h-full w-full max-w-3xl flex-col overflow-hidden border-l border-slate-200 bg-white text-black shadow-[0_32px_80px_rgba(15,23,42,0.14)] dark:border-zinc-700 dark:bg-black dark:text-white"
          role="dialog"
        >
          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#eef3ff_0%,#ffffff_52%,#dbe6ff_100%)] px-5 py-6 dark:border-zinc-700 dark:bg-[linear-gradient(135deg,#000000_0%,#111827_45%,#18181b_100%)] md:px-7">
            <div className="flex items-start justify-between gap-4">
              <div className="relative pl-5">
                <div className="absolute left-0 top-1 h-16 w-1 rounded-full bg-[#00249c] dark:bg-[#7ea2ff]" />
                <p className={badgeClassName}>
                  Editing Workspace
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-black dark:text-white" id={titleId}>
                  {title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-300">
                  {description}
                </p>
              </div>
              <button
                className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-black transition hover:bg-white dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>
            {statusMessage ? <div className={statusMessageClassName}>{statusMessage}</div> : null}
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-6 dark:bg-zinc-950 md:px-7 md:py-7">
            {children}
          </div>
        </aside>
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 text-black dark:text-white md:px-8">
      <section className="max-w-3xl">
        {renderBackAction(backHref, backLabel, renderBackLink)}
        <div className="mt-5 h-px w-20 bg-[#00249c]/80" />
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-black dark:text-white">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-zinc-300">
          {description}
        </p>
        {statusMessage ? <div className={statusMessageClassName}>{statusMessage}</div> : null}
      </section>

      {children}
    </main>
  );
};
