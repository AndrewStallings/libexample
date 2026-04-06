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
    <article
      className="overflow-hidden rounded-3xl border"
      style={{
        borderColor: "rgba(31, 41, 55, 0.12)",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 252, 246, 0.92))",
        boxShadow: "0 20px 60px rgba(98, 74, 39, 0.12)",
      }}
    >
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
              className="border-b px-6 py-6 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0"
              style={{ borderColor: "rgba(31, 41, 55, 0.08)" }}
            >
              {section.title ? (
                <div className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                  {section.title}
                </div>
              ) : null}
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <li key={item.label ?? itemIndex} className="rounded-2xl border bg-white/70 px-4 py-3" style={{ borderColor: "rgba(31, 41, 55, 0.06)" }}>
                    <div className="min-w-0">
                      {item.label ? (
                        <div className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                          {item.label}
                        </div>
                      ) : null}
                      <div className={item.prominent ? "text-xl font-semibold leading-snug" : "text-base leading-6"} style={{ color: "var(--foreground)" }}>
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
            className="border-t px-5 py-6 md:border-t-0 md:border-l"
            style={{
              borderColor: "rgba(31, 41, 55, 0.08)",
              backgroundColor: "rgba(240, 231, 216, 0.32)",
              minWidth: "14rem",
              maxWidth: "16rem",
            }}
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              Actions
            </div>
            <div className="flex flex-col gap-3">{actions}</div>
          </aside>
        ) : null}
      </div>
    </article>
  );
};
