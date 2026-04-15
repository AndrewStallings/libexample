import type { ReactNode } from "react";

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
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white text-black shadow-[0_20px_48px_rgba(15,23,42,0.10)] dark:border-zinc-700 dark:bg-black dark:text-white">
      <div className="h-1.5 bg-[linear-gradient(90deg,#00249c,#4f7dff)]" />
      <div className="flex flex-col lg:flex-row">
        <div className="grid flex-1 grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
          {sections.map((section, index) => (
            <section
              key={index}
              className="border-b border-slate-200 px-6 py-6 last:border-b-0 dark:border-zinc-700 md:border-b-0 md:border-r last:md:border-r-0"
            >
              {section.title ? (
                <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00249c] dark:text-[#89a8ff]">
                  {section.title}
                </div>
              ) : null}
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={item.label ?? itemIndex}
                    className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 shadow-[inset_3px_0_0_#00249c] dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <div className="min-w-0">
                      {item.label ? (
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
                          {item.label}
                        </div>
                      ) : null}
                      <div className={item.prominent ? "text-[1.35rem] font-semibold leading-snug text-black dark:text-white" : "text-base leading-7 text-slate-800 dark:text-zinc-100"}>
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
          <aside className="border-t border-slate-200 bg-slate-50 px-5 py-6 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white lg:w-60 lg:shrink-0 lg:border-l lg:border-t-0 xl:w-64">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00249c] dark:text-[#89a8ff]">
              Actions
            </div>
            <div className="flex flex-col gap-3">{actions}</div>
          </aside>
        ) : null}
      </div>
    </article>
  );
};
