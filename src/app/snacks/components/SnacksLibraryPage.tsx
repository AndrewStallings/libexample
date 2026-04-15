"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ResourceCard, cardActionClassName } from "our-lib";
import { listSnacksAction } from "@/snacks/actions";
import { SnackFormPage } from "@/snacks/components/SnackFormPage";
import { snackResource } from "@/snacks/models/resource";
import type { SnackRecord } from "@/snacks/models/schemas";

export const SNACKS_QUERY_KEY = "snacks";

type SnacksLibraryPageProps = {
  initialSnacks: SnackRecord[];
};

export const SnacksLibraryPage = ({ initialSnacks }: SnacksLibraryPageProps) => {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<SnackRecord | undefined>();
  const { data: snacks = [] } = useQuery({
    queryKey: [SNACKS_QUERY_KEY],
    queryFn: listSnacksAction,
    initialData: initialSnacks,
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 text-black dark:text-white md:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eef3ff_0%,#ffffff_52%,#dbe6ff_100%)] px-6 py-8 shadow-[0_26px_72px_rgba(45,51,72,0.12)] dark:border-zinc-700 dark:bg-[linear-gradient(135deg,#000000_0%,#111827_45%,#18181b_100%)] md:px-8 md:py-10">
        <div className="pointer-events-none absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#4f7dff]/20 blur-3xl dark:bg-[#2a4bb5]/35" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/70 blur-3xl dark:bg-zinc-800/60" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2441a4] dark:text-[#cddcff]">
            Resource Builder Demo
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-black dark:text-white md:text-[2.8rem]">
            Snacks are driven by a single reusable resource definition.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-zinc-300">
          The snack feature keeps its wiring small by letting one builder object own the generated card profile, form profile,
          service template, and default input mapping.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-[#00249c] bg-[#00249c] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,36,156,0.18)] transition hover:bg-[#001c77] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00249c]/20 dark:border-[#3f63d6] dark:bg-[#00249c] dark:text-white dark:hover:bg-[#16379f]"
              onClick={() => {
                setSelectedRecord(undefined);
                setPanelMode("create");
              }}
              type="button"
            >
              Create Snack
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        {snacks.map((record) => (
          <ResourceCard
            key={record.snackId}
            actions={
              <button
                className={cardActionClassName}
                onClick={() => {
                  setSelectedRecord(record);
                  setPanelMode("edit");
                }}
                type="button"
              >
                Open Form
              </button>
            }
            profile={snackResource.profile}
            record={record}
          />
        ))}
      </section>

      <SnackFormPage isOpen={panelMode !== null} mode={panelMode ?? "create"} onClose={closePanel} record={selectedRecord} />
    </main>
  );
};
