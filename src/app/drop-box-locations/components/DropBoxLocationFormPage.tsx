"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ResourceForm, useResourceFormState } from "our-lib";
import { useEffect } from "react";
import { SidePanelShell } from "@/app/components/SidePanelShell";
import { queryKeys } from "@/config/queryKeys";
import { createDropBoxLocationDemoService, toDropBoxLocationInput } from "@/drop-box-locations/services/dropBoxLocationDemoService";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

type DropBoxLocationFormPageProps = {
  mode: "create" | "edit";
  record?: DropBoxLocationRecord;
  isOpen?: boolean;
  onClose?: () => void;
};

export const DropBoxLocationFormPage = ({ mode, record, isOpen = true, onClose }: DropBoxLocationFormPageProps) => {
  const queryClient = useQueryClient();
  const service = createDropBoxLocationDemoService();
  const { currentRecord, statusMessage, setCurrentRecord, setStatusMessage, handleSubmit } = useResourceFormState<
    DropBoxLocationRecord,
    DropBoxLocationInput
  >({
    mode,
    initialRecord: record,
    createRecord: (input) => service.create(input, "demo-user"),
    updateRecord: (currentRecordValue, input) => service.update(currentRecordValue.locationId, input, "demo-user"),
    getRecordId: (currentRecordValue) => currentRecordValue.locationId,
    entityLabel: "location",
    onSubmitted: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.dropBoxLocations });
      onClose?.();
    },
  });

  useEffect(() => {
    setCurrentRecord(record);
    setStatusMessage(null);
  }, [isOpen, mode, record, setCurrentRecord, setStatusMessage]);

  return (
    <SidePanelShell
      description="Generated location forms now stay beside the card list and refresh through TanStack Query when you save."
      isOpen={isOpen}
      onClose={onClose}
      statusMessage={statusMessage}
      title={dropBoxLocationProfile.getFormTitle(mode, currentRecord)}
    >
      <ResourceForm
        initialValue={toDropBoxLocationInput(currentRecord)}
        key={currentRecord?.locationId ?? "new-location"}
        mode={mode}
        onSubmit={handleSubmit}
        profile={dropBoxLocationProfile}
        record={currentRecord}
      />
    </SidePanelShell>
  );
};
