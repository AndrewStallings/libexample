"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FormPageShell, ResourceForm, useResourceFormState } from "our-lib";
import { createDropBoxLocationDemoService, toDropBoxLocationInput } from "@/drop-box-locations/services/dropBoxLocationDemoService";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

type DropBoxLocationFormPageProps = {
  mode: "create" | "edit";
  record?: DropBoxLocationRecord;
};

export const DropBoxLocationFormPage = ({ mode, record }: DropBoxLocationFormPageProps) => {
  const service = useMemo(() => createDropBoxLocationDemoService(), []);
  const { currentRecord, statusMessage, handleSubmit } = useResourceFormState<DropBoxLocationRecord, DropBoxLocationInput>({
    mode,
    initialRecord: record,
    createRecord: (value) => service.create(value, "demo-user"),
    updateRecord: (currentValue, value) => service.update(currentValue.locationId, value, "demo-user"),
    getRecordId: (currentValue: DropBoxLocationRecord) => currentValue.locationId,
    entityLabel: "location",
  });

  return (
    <FormPageShell
      backHref="/drop-box-locations"
      backLabel="Back to locations"
      title={mode === "create" ? "Create a drop box location" : `Edit ${currentRecord?.locationName ?? "drop box location"}`}
      description="This page uses the generated resource form to keep the feature-specific code small."
      statusMessage={statusMessage}
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
    >
      <ResourceForm
        initialValue={toDropBoxLocationInput(currentRecord)}
        mode={mode}
        onSubmit={handleSubmit}
        profile={dropBoxLocationProfile}
        record={currentRecord}
      />
    </FormPageShell>
  );
};
