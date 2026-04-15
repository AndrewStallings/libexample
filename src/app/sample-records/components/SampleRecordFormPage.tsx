"use client";

import Link from "next/link";
import { ResourceFormPage } from "our-lib";
import { sampleRecordClient } from "@/app/sample-records/client/sampleRecordClient";
import type { SampleRecord } from "@/app/sample-records/models/schemas";

type SampleRecordFormPageProps = {
  mode: "create" | "edit";
  record?: SampleRecord | undefined;
};

const getSampleRecordClient = () => sampleRecordClient;
const createSampleRecord = (client: typeof sampleRecordClient, input: Parameters<typeof sampleRecordClient.create>[0]) => {
  return client.create(input);
};
const updateSampleRecord = (
  client: typeof sampleRecordClient,
  currentRecord: SampleRecord,
  input: Parameters<typeof sampleRecordClient.create>[0],
) => {
  return client.update(currentRecord, input);
};
const getSampleRecordId = (record: SampleRecord) => record.sampleRecordId;

export const SampleRecordFormPage = ({ mode, record }: SampleRecordFormPageProps) => {
  return (
    <ResourceFormPage
      mode={mode}
      record={record}
      description="This sample uses a dedicated page layout so the service, workflow, and form profile can be seen in a simpler end-to-end route."
      profile={sampleRecordClient.profile}
      toInput={sampleRecordClient.toInput}
      backHref="/sample-records"
      backLabel="Back to sample records"
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
      createService={getSampleRecordClient}
      createRecord={createSampleRecord}
      updateRecord={updateSampleRecord}
      getRecordId={getSampleRecordId}
      entityLabel={sampleRecordClient.entityLabel}
    />
  );
};
