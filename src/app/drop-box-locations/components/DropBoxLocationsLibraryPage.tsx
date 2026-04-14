"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ResourceCard, cardActionClassName } from "our-lib";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import { DropBoxLocationFormPage } from "@/drop-box-locations/components/DropBoxLocationFormPage";
import type { DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";
import { createDropBoxLocationService } from "@/drop-box-locations/services/dropBoxLocationService";

export const DROP_BOX_LOCATIONS_QUERY_KEY = "drop-box-locations";

export const DropBoxLocationsLibraryPage = () => {
  const service = useMemo(() => createDropBoxLocationService(), []);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DropBoxLocationRecord | undefined>();
  const { data: locations = [] } = useQuery({
    queryKey: [DROP_BOX_LOCATIONS_QUERY_KEY],
    queryFn: async () => (await service.repository.list()).items,
  });

  const closePanel = () => {
    setPanelMode(null);
    setSelectedRecord(undefined);
  };

  return (
    <main className="app-shell">
      <section className="app-hero">
        <p className="app-kicker">
          Generated Layout Stress Test
        </p>
        <h1 className="app-title">
          Generated library primitives driving a real resource workflow.
        </h1>
        <p className="app-copy">
          This feature is meant to prove a lower-effort path: after Drizzle and Zod schemas exist, a developer mostly defines a typed resource profile.
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
            Create Location
          </button>
        </div>
      </section>

      <section className="app-card-stack">
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
