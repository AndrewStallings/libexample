"use client";

import { FormShell, ResourceForm, useSidePanelFormState } from "our-lib";
import { SNACKS_QUERY_KEY } from "@/snacks/components/SnacksLibraryPage";
import { snackResource } from "@/snacks/models/resource";
import type { SnackInput, SnackRecord } from "@/snacks/models/schemas";
import { createSnackDemoService } from "@/snacks/services/snackDemoService";

type SnackFormPageProps = {
  mode: "create" | "edit";
  record?: SnackRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const SnackFormPage = ({ mode, record, isOpen = true, onClose }: SnackFormPageProps) => {
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<
    ReturnType<typeof createSnackDemoService>,
    SnackRecord,
    SnackInput
  >({
    mode,
    record,
    isOpen,
    onClose,
    createService: createSnackDemoService,
    queryKey: [SNACKS_QUERY_KEY],
    createRecord: (service, input) => service.create(input, "demo-user"),
    updateRecord: (service, currentRecordValue, input) => service.update(currentRecordValue.snackId, input, "demo-user"),
    getRecordId: (currentRecordValue) => currentRecordValue.snackId,
    entityLabel: "snack",
  });

  return (
    <FormShell
      variant="side-panel"
      description="This resource-driven form now slides in beside the snack cards and refreshes the collection through query invalidation."
      isOpen={isOpen}
      onClose={onClose}
      statusMessage={statusMessage}
      title={snackResource.profile.getFormTitle(mode, currentRecord)}
    >
      <ResourceForm
        initialValue={snackResource.toInput(currentRecord)}
        key={currentRecord?.snackId ?? "new-snack"}
        mode={mode}
        onSubmit={handleSubmit}
        profile={snackResource.profile}
        record={currentRecord}
      />
    </FormShell>
  );
};
