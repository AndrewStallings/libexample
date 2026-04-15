"use client";

import { useMemo } from "react";
import { FormShell, ResourceForm, useSidePanelFormState } from "our-lib";
import { createSnackAction, updateSnackAction } from "@/snacks/actions";
import { SNACKS_QUERY_KEY } from "@/snacks/components/SnacksLibraryPage";
import { snackResource } from "@/snacks/models/resource";
import type { SnackInput, SnackRecord } from "@/snacks/models/schemas";

type SnackFormPageProps = {
  mode: "create" | "edit";
  record?: SnackRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const SnackFormPage = ({ mode, record, isOpen = true, onClose }: SnackFormPageProps) => {
  const service = useMemo(
    () => ({
      create: createSnackAction,
      update: updateSnackAction,
    }),
    [],
  );
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<
    typeof service,
    SnackRecord,
    SnackInput
  >({
    mode,
    record,
    isOpen,
    onClose,
    createService: () => service,
    queryKey: [SNACKS_QUERY_KEY],
    createRecord: (serviceValue, input) => serviceValue.create(input),
    updateRecord: (serviceValue, currentRecordValue, input) => serviceValue.update(currentRecordValue.snackId, input),
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
