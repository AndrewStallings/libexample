"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { createSampleRecordService } from "@/app/sample-records/services/sampleRecordService";

export const SAMPLE_RECORDS_QUERY_KEY = "sample-records";

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const SampleRecordsLibraryPage = () => {
  const service = useMemo(() => createSampleRecordService(), []);
  const { data: records = [] } = useQuery({
    queryKey: [SAMPLE_RECORDS_QUERY_KEY],
    queryFn: async () => (await service.repository.list()).items,
  });

  return (
    <main className="app-shell">
      <section className="app-hero">
        <p className="app-kicker">Entity Card Example</p>
        <h1 className="app-title">One table, one service, and a direct card layout.</h1>
        <p className="app-copy">
          This example keeps the repository focused on a single table and lets the service add one higher-level helper while the page renders
          EntityCard directly.
        </p>
        <div className="app-actions">
          <Link className="app-primary-button" href="/sample-records/new">
            Create Record
          </Link>
        </div>
      </section>

      <section className="app-card-stack">
        {records.map((record) => (
          <EntityCard
            key={record.sampleRecordId}
            sections={[
              {
                title: "Primary",
                items: [
                  { label: `Title - ${record.sampleRecordId}`, value: record.title, prominent: true },
                  { label: "Group", value: record.groupName },
                  { label: "Owner", value: record.ownerName },
                ],
              },
              {
                title: "Status",
                items: [
                  { label: "Current Status", value: formatStatus(record.status) },
                  { label: "Notes", value: record.notes },
                ],
              },
            ]}
            actions={
              <>
                <Link className={cardActionClassName} href={`/sample-records/${record.sampleRecordId}`}>
                  Open Record
                </Link>
                <CardActionButton>Review Activity</CardActionButton>
              </>
            }
          />
        ))}
      </section>
    </main>
  );
};
