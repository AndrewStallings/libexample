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
    <main className="app-shell">
      <section className="app-hero">
        <p className="app-kicker">
          Resource Builder Demo
        </p>
        <h1 className="app-title">Snacks are driven by a single reusable resource definition.</h1>
        <p className="app-copy">
          The snack feature keeps its wiring small by letting one builder object own the generated card profile, form profile,
          service template, and default input mapping.
        </p>
        <div className="app-actions">
          <button
            className="app-primary-button"
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

      <section className="app-card-stack">
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
