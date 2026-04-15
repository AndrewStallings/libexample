"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ResourceFormPage } from "our-lib";
import { createSampleRecordAction, updateSampleRecordAction } from "@/app/sample-records/actions";
import { sampleRecordProfile } from "@/app/sample-records/models/profile";
import type { SampleRecord } from "@/app/sample-records/models/schemas";

type SampleRecordFormPageProps = {
  mode: "create" | "edit";
  record?: SampleRecord | undefined;
};

export const SampleRecordFormPage = ({ mode, record }: SampleRecordFormPageProps) => {
  const service = useMemo(
    () => ({
      create: createSampleRecordAction,
      update: updateSampleRecordAction,
    }),
    [],
  );

  return (
    <ResourceFormPage
      mode={mode}
      record={record}
      description="This sample uses a dedicated page layout so the service, workflow, and form profile can be seen in a simpler end-to-end route."
      profile={sampleRecordProfile}
      toInput={(currentRecord) => {
        return {
          title: currentRecord?.title ?? "",
          groupName: currentRecord?.groupName ?? "",
          ownerName: currentRecord?.ownerName ?? "",
          status: currentRecord?.status ?? "active",
          notes: currentRecord?.notes ?? "",
        };
      }}
      backHref="/sample-records"
      backLabel="Back to sample records"
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
      createService={() => service}
      createRecord={(serviceValue, input) => serviceValue.create(input)}
      updateRecord={(serviceValue, currentRecordValue, input) => serviceValue.update(currentRecordValue.sampleRecordId, input)}
      getRecordId={(currentRecordValue) => currentRecordValue.sampleRecordId}
      entityLabel="record"
    />
  );
};
