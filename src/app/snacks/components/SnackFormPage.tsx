"use client";

import Link from "next/link";
import { ResourceFormPage } from "our-lib";
import { snackResource } from "@/snacks/models/resource";
import type { SnackRecord } from "@/snacks/models/schemas";
import { createSnackDemoService } from "@/snacks/services/snackDemoService";

type SnackFormPageProps = {
  mode: "create" | "edit";
  record?: SnackRecord;
};

export const SnackFormPage = ({ mode, record }: SnackFormPageProps) => {
  return (
    <ResourceFormPage
      backHref="/snacks"
      backLabel="Back to snacks"
      createRecord={(service, input) => service.create(input, "demo-user")}
      createService={createSnackDemoService}
      description="This form is generated from the shared resource builder so new CRUD screens can stay close to their schema."
      entityLabel="snack"
      mode={mode}
      profile={snackResource.profile}
      record={record}
      renderBackLink={({ href, className, children }) => (
        <Link className={className} href={href}>
          {children}
        </Link>
      )}
      toInput={snackResource.toInput}
      updateRecord={(service, currentRecord, input) => service.update(currentRecord.snackId, input, "demo-user")}
    />
  );
};
