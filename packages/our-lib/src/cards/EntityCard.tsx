import type { ReactNode } from "react";

import { libAccentBadgeStyle, libPanelStyle } from "../styles";

export type EntityCardItem = {
  value: ReactNode;
  label?: string | undefined;
  prominent?: boolean | undefined;
};

export type EntityCardSection = {
  items: EntityCardItem[];
  title?: string | undefined;
};

type EntityCardProps = {
  sections: EntityCardSection[];
  actions?: ReactNode | undefined;
};

export const EntityCard = ({ sections, actions }: EntityCardProps) => {
  return (
    <article
      className="overflow-hidden rounded-[1.75rem] border"
      style={{
        ...libPanelStyle,
        backgroundColor: "var(--lib-surface)",
        boxShadow: "0 20px 48px rgba(15, 23, 42, 0.10)",
      }}
    >
      <div className="h-1.5 bg-[linear-gradient(90deg,var(--lib-primary),rgba(92,157,174,0.55))]" />
      <div className="flex flex-col lg:flex-row">
        <div
          className="grid flex-1"
          style={{
            gridTemplateColumns: `repeat(${Math.max(sections.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {sections.map((section, index) => (
            <section
              key={index}
              className="border-b border-[color:var(--lib-border)] px-6 py-6 last:border-b-0 dark:border-white/10 md:border-b-0 md:border-r last:md:border-r-0"
            >
              {section.title ? (
                <div className="mb-5 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400" style={libAccentBadgeStyle}>
                  {section.title}
                </div>
              ) : null}
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={item.label ?? itemIndex}
                    className="rounded-[1.25rem] border px-4 py-4"
                    style={{
                      backgroundColor: "var(--lib-surface-strong)",
                      borderColor: "var(--lib-border)",
                      boxShadow: "inset 3px 0 0 var(--lib-primary)",
                    }}
                  >
                    <div className="min-w-0">
                      {item.label ? (
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          {item.label}
                        </div>
                      ) : null}
                      <div className={item.prominent ? "text-[1.35rem] font-semibold leading-snug text-slate-900 dark:text-white" : "text-base leading-7 text-slate-800 dark:text-slate-100"}>
                        {item.value}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {actions ? (
          <aside
            className="border-t px-5 py-6 lg:border-t-0 lg:border-l"
            style={{
              minWidth: "14rem",
              maxWidth: "16rem",
              background: "var(--lib-actions-bg)",
              borderColor: "var(--lib-border)",
              color: "var(--lib-action-button-ink)",
            }}
          >
            <div className="mb-4 text-[11px] font-semibold uppercase" style={libAccentBadgeStyle}>
              Actions
            </div>
            <div className="flex flex-col gap-3">{actions}</div>
          </aside>
        ) : null}
      </div>
    </article>
  );
};
