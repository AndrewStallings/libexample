"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ResourceForm, useResourceFormState } from "our-lib";
import { useEffect } from "react";
import { SidePanelShell } from "@/app/components/SidePanelShell";
import { queryKeys } from "@/config/queryKeys";
import { snackResource } from "@/snacks/models/resource";
import type { SnackInput, SnackRecord } from "@/snacks/models/schemas";
import { createSnackDemoService } from "@/snacks/services/snackDemoService";

type SnackFormPageProps = {
  mode: "create" | "edit";
  record?: SnackRecord;
  isOpen?: boolean;
  onClose?: () => void;
};

export const SnackFormPage = ({ mode, record, isOpen = true, onClose }: SnackFormPageProps) => {
  const queryClient = useQueryClient();
  const service = createSnackDemoService();
  const { currentRecord, statusMessage, setCurrentRecord, setStatusMessage, handleSubmit } = useResourceFormState<SnackRecord, SnackInput>({
    mode,
    initialRecord: record,
    createRecord: (input) => service.create(input, "demo-user"),
    updateRecord: (currentRecordValue, input) => service.update(currentRecordValue.snackId, input, "demo-user"),
    getRecordId: (currentRecordValue) => currentRecordValue.snackId,
    entityLabel: "snack",
    onSubmitted: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.snacks });
      onClose?.();
    },
  });

  useEffect(() => {
    setCurrentRecord(record);
    setStatusMessage(null);
  }, [isOpen, mode, record, setCurrentRecord, setStatusMessage]);

  return (
    <SidePanelShell
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
    </SidePanelShell>
  );
};
