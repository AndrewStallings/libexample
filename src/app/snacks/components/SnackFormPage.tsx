"use client";

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
      createRecord={(service, input) => service.create(input, "demo-user")}
      createService={createSnackDemoService}
      description="This form is generated from the shared resource builder so new CRUD screens can stay close to their schema."
      mode={mode}
      record={record}
      resource={snackResource}
      updateRecord={(service, currentRecord, input) => service.update(currentRecord.snackId, input, "demo-user")}
    />
  );
};
