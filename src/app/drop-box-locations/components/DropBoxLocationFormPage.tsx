"use client";

import { FormShell, ResourceForm } from "our-lib";
import {
  dropBoxLocationClient,
  useDropBoxLocationFormState,
} from "@/drop-box-locations/client/dropBoxLocationClient";
import type { DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

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
  const { currentRecord, statusMessage, handleSubmit } = useDropBoxLocationFormState({
    mode,
    record,
    isOpen,
    onClose,
  });

  return (
    <FormShell
      variant="side-panel"
      description="Generated location forms now stay beside the card list and refresh through TanStack Query when you save."
      isOpen={isOpen}
      onClose={onClose}
      statusMessage={statusMessage}
      title={dropBoxLocationClient.profile.getFormTitle(mode, currentRecord)}
    >
      <ResourceForm
        initialValue={dropBoxLocationClient.toInput(currentRecord)}
        key={currentRecord?.locationId ?? "new-location"}
        mode={mode}
        onSubmit={handleSubmit}
        profile={dropBoxLocationClient.profile}
        record={currentRecord}
      />
    </FormShell>
  );
};
