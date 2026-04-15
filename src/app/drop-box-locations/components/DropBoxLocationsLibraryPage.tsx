"use client";

import { useState } from "react";
import { ResourceCard, cardActionClassName } from "our-lib";
import {
  dropBoxLocationClient,
  useDropBoxLocationCollection,
} from "@/drop-box-locations/client/dropBoxLocationClient";
import { DropBoxLocationFormPage } from "@/drop-box-locations/components/DropBoxLocationFormPage";
import type { DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

type DropBoxLocationsLibraryPageProps = {
  initialLocations: DropBoxLocationRecord[];
};

export const DropBoxLocationsLibraryPage = ({ initialLocations }: DropBoxLocationsLibraryPageProps) => {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DropBoxLocationRecord | undefined>();
  const { data: locations = [] } = useDropBoxLocationCollection(initialLocations);

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
            profile={dropBoxLocationClient.profile}
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
