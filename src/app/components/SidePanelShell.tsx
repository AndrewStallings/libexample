"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";

type SidePanelShellProps = {
  isOpen?: boolean;
  title: string;
  description: string;
  statusMessage?: string | null;
  onClose?: () => void;
  children: ReactNode;
};

export const SidePanelShell = ({ isOpen = true, title, description, statusMessage, onClose, children }: SidePanelShellProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, onClose]);

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
            <div
              className="mt-4 rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(15, 118, 110, 0.18)",
                backgroundColor: "rgba(15, 118, 110, 0.08)",
                color: "var(--accent-strong)",
              }}
            >
              {statusMessage}
            </div>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7 md:py-7">{children}</div>
      </aside>
    </div>
  );
};
