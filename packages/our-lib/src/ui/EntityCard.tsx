import type { ReactNode } from "react";

export type EntityCardItem = {
  value: ReactNode;
  label?: string;
  prominent?: boolean;
};

export type EntityCardSection = {
  items: EntityCardItem[];
  title?: string;
};

type EntityCardProps = {
  sections: EntityCardSection[];
  actions?: ReactNode;
};

export const EntityCard = ({ sections, actions }: EntityCardProps) => {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[color:rgba(31,41,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,252,246,0.92))] shadow-[0_20px_60px_rgba(98,74,39,0.12)]">
      <div className="flex flex-col md:flex-row">
        <div
          className="grid flex-1"
          style={{
            gridTemplateColumns: `repeat(${Math.max(sections.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {sections.map((section, index) => (
            <section
              key={index}
              className="border-b border-[color:rgba(31,41,55,0.08)] px-6 py-6 last:border-b-0 md:border-b-0 md:border-r md:border-[color:rgba(31,41,55,0.08)] last:md:border-r-0"
            >
              {section.title ? (
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  {section.title}
                </div>
              ) : null}
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={item.label ?? itemIndex}
                    className="rounded-2xl border border-[color:rgba(31,41,55,0.06)] bg-white/70 px-4 py-3"
                  >
                    <div className="min-w-0">
                      {item.label ? (
                        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                          {item.label}
                        </div>
                      ) : null}
                      <div className={item.prominent ? "text-xl font-semibold leading-snug" : "text-[15px] leading-6 text-[var(--foreground)]"}>
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
          <aside className="border-t border-[color:rgba(31,41,55,0.08)] bg-[rgba(240,231,216,0.32)] px-5 py-6 md:min-w-56 md:max-w-64 md:border-t-0 md:border-l md:border-[color:rgba(31,41,55,0.08)]">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Actions</div>
            <div className="flex flex-col gap-3">{actions}</div>
          </aside>
        ) : null}
      </div>
    </article>
  );
};
