"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ResourceCard, cardActionClassName } from "our-lib";
import { SnackFormPage } from "@/snacks/components/SnackFormPage";
import { snackResource } from "@/snacks/models/resource";
import type { SnackRecord } from "@/snacks/models/schemas";
import { listSnacks } from "@/snacks/services/snackDemoService";
import { queryKeys } from "@/config/queryKeys";

export const SnacksLibraryPage = () => {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<SnackRecord | undefined>();
  const { data: snacks = [] } = useQuery({
    queryKey: queryKeys.snacks,
    queryFn: listSnacks,
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Resource Builder Demo
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Snacks are driven by a single reusable resource definition.</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          The snack feature keeps its wiring small by letting one builder object own the generated card profile, form profile,
          service template, and default input mapping.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            onClick={() => {
              setSelectedRecord(undefined);
              setPanelMode("create");
            }}
            type="button"
          >
            Create Snack
          </button>
        </div>
      </section>

      <section className="space-y-6">
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
