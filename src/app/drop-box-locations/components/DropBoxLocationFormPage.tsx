"use client";

import { FormShell, ResourceForm, useSidePanelFormState } from "our-lib";
import { createDropBoxLocationDemoService, toDropBoxLocationInput } from "@/drop-box-locations/services/dropBoxLocationDemoService";
import { DROP_BOX_LOCATIONS_QUERY_KEY } from "@/drop-box-locations/components/DropBoxLocationsLibraryPage";
import { dropBoxLocationProfile } from "@/drop-box-locations/models/profile";
import type { DropBoxLocationInput, DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

type DropBoxLocationFormPageProps = {
  mode: "create" | "edit";
  record?: DropBoxLocationRecord;
  isOpen?: boolean;
  onClose?: () => void;
};

export const DropBoxLocationFormPage = ({ mode, record, isOpen = true, onClose }: DropBoxLocationFormPageProps) => {
  const { currentRecord, statusMessage, handleSubmit } = useSidePanelFormState<
    ReturnType<typeof createDropBoxLocationDemoService>,
    DropBoxLocationRecord,
    DropBoxLocationInput
  >({
    mode,
    record,
    isOpen,
    onClose,
    createService: createDropBoxLocationDemoService,
    queryKey: [DROP_BOX_LOCATIONS_QUERY_KEY],
    createRecord: (service, input) => service.create(input, "demo-user"),
    updateRecord: (service, currentRecordValue, input) => service.update(currentRecordValue.locationId, input, "demo-user"),
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
