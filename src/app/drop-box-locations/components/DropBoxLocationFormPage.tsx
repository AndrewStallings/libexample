"use client";

import { useMemo } from "react";
import { FormShell, ResourceForm, useSidePanelFormState } from "our-lib";
import { DROP_BOX_LOCATIONS_QUERY_KEY } from "@/drop-box-locations/components/DropBoxLocationsLibraryPage";
import { toDropBoxLocationInput } from "@/drop-box-locations/data/dropBoxLocationRepository";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import type {
  DropBoxLocationInput,
  DropBoxLocationRecord,
} from "@/drop-box-locations/models/schemas";
import { createDropBoxLocationService } from "@/drop-box-locations/services/dropBoxLocationService";

type DropBoxLocationFormPageProps = {
  mode: "create" | "edit";
  record?: DropBoxLocationRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
};

export const DropBoxLocationFormPage = ({
  mode,
  record,
  isOpen = true,
  onClose,
}: DropBoxLocationFormPageProps) => {
  const service = useMemo(() => createDropBoxLocationService(), []);
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<
    ReturnType<typeof createDropBoxLocationService>,
    DropBoxLocationRecord,
    DropBoxLocationInput
  >({
    mode,
    record,
    isOpen,
    onClose,
    createService: () => service,
    queryKey: [DROP_BOX_LOCATIONS_QUERY_KEY],
    createRecord: (serviceValue, input) =>
      serviceValue.repository.create(input),
    updateRecord: (serviceValue, currentRecordValue, input) =>
      serviceValue.repository.update(currentRecordValue.locationId, input),
    getRecordId: (currentRecordValue) => currentRecordValue.locationId,
    entityLabel: "location",
  });

  return (
    <FormShell
      variant="side-panel"
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
    </FormShell>
  );
};
