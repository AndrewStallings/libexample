"use client";

import Link from "next/link";
import { ResourceFormPage } from "our-lib";
import { createDropBoxLocationDemoService, toDropBoxLocationInput } from "@/drop-box-locations/services/dropBoxLocationDemoService";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import type { DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

type DropBoxLocationFormPageProps = {
  mode: "create" | "edit";
  record?: DropBoxLocationRecord;
};

export const DropBoxLocationFormPage = ({ mode, record }: DropBoxLocationFormPageProps) => {
  return (
    <ResourceFormPage
      backHref="/drop-box-locations"
      backLabel="Back to locations"
      createRecord={(service, input) => service.create(input, "demo-user")}
      createService={createDropBoxLocationDemoService}
      description="This page uses the generated resource form to keep the feature-specific code small."
      entityLabel="location"
      mode={mode}
      profile={dropBoxLocationProfile}
      record={record}
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
      toInput={toDropBoxLocationInput}
      updateRecord={(service, currentRecord, input) => service.update(currentRecord.locationId, input, "demo-user")}
    />
  );
};
