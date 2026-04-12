"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ResourceCard, cardActionClassName } from "our-lib";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import { DropBoxLocationFormPage } from "@/drop-box-locations/components/DropBoxLocationFormPage";
import type { DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";
import { listDropBoxLocations } from "@/drop-box-locations/services/dropBoxLocationDemoService";

export const DROP_BOX_LOCATIONS_QUERY_KEY = "drop-box-locations";

export const DropBoxLocationsLibraryPage = () => {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DropBoxLocationRecord | undefined>();
  const { data: locations = [] } = useQuery({
    queryKey: [DROP_BOX_LOCATIONS_QUERY_KEY],
    queryFn: listDropBoxLocations,
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          Generated Layout Stress Test
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">Drop box locations use a generated card and form layout.</h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          This feature is meant to prove a lower-effort path: after Drizzle and Zod schemas exist, a developer mostly defines a typed resource profile.
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
            Create Location
          </button>
        </div>
      </section>

      <section className="space-y-6">
        {locations.map((record) => (
          <ResourceCard
            key={record.locationId}
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
            profile={dropBoxLocationProfile}
            record={record}
          />
        ))}
      </section>

      <DropBoxLocationFormPage
        isOpen={panelMode !== null}
        mode={panelMode ?? "create"}
        onClose={closePanel}
        record={selectedRecord}
      />
    </main>
  );
};
