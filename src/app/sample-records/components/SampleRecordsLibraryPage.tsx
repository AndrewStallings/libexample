"use client";

import Link from "next/link";
import { CardActionButton, EntityCard, cardActionClassName } from "our-lib";
import { useSampleRecordCollection } from "@/app/sample-records/client/sampleRecordClient";
import type { SampleRecord } from "@/app/sample-records/models/schemas";

type SampleRecordsLibraryPageProps = {
  initialRecords: SampleRecord[];
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const SampleRecordsLibraryPage = ({ initialRecords }: SampleRecordsLibraryPageProps) => {
  const { data: records = [] } = useSampleRecordCollection(initialRecords);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 text-black dark:text-white md:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eef3ff_0%,#ffffff_52%,#dbe6ff_100%)] px-6 py-8 shadow-[0_26px_72px_rgba(45,51,72,0.12)] dark:border-zinc-700 dark:bg-[linear-gradient(135deg,#000000_0%,#111827_45%,#18181b_100%)] md:px-8 md:py-10">
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#4f7dff]/20 blur-3xl dark:bg-[#2441a4]/35" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/70 blur-3xl dark:bg-zinc-800/60" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2441a4] dark:text-[#cddcff]">Entity Card Example</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-black dark:text-white md:text-[2.8rem]">
            One table, one service, and a direct card layout.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-zinc-300">
            This example keeps the repository focused on a single table and lets the service add one higher-level helper while the page renders
            EntityCard directly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border border-[#00249c] bg-[#00249c] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,36,156,0.18)] transition hover:bg-[#001c77] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00249c]/20 dark:border-[#3f63d6] dark:bg-[#00249c] dark:text-white dark:hover:bg-[#16379f]"
              href="/sample-records/new"
            >
              Create Record
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5">
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
