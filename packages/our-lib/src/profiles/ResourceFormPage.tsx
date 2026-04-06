"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { FormPageShell } from "../forms/index";
import type { ResourceProfile } from "./defineResourceProfile";
import { ResourceForm } from "./ResourceForm";
import { useResourceFormState } from "./useResourceFormState";

type ResourceFormPageProps<TService, TRecord, TInput extends Record<string, unknown>> = {
  mode: "create" | "edit";
  record?: TRecord;
  profile: ResourceProfile<TRecord, TInput>;
  createService: () => TService;
  toInput: (record?: TRecord) => TInput;
  backHref: string;
  backLabel: string;
  description: string;
  entityLabel?: string;
  getRecordId?: (record: TRecord) => string;
  createRecord: (service: TService, input: TInput) => Promise<TRecord>;
  updateRecord: (service: TService, record: TRecord, input: TInput) => Promise<TRecord>;
  renderBackLink: (props: { href: string; className: string; children: ReactNode }) => ReactNode;
};

export const ResourceFormPage = <TService, TRecord, TInput extends Record<string, unknown>>({
  mode,
  record,
  profile,
  createService,
  toInput,
  backHref,
  backLabel,
  description,
  entityLabel,
  getRecordId,
  createRecord,
  updateRecord,
  renderBackLink,
}: ResourceFormPageProps<TService, TRecord, TInput>) => {
  const service = useMemo(() => createService(), [createService]);
  const resolveRecordId = getRecordId ?? profile.getRecordId;

  if (!resolveRecordId) {
    throw new Error(`ResourceFormPage requires getRecordId or profile.getRecordId for ${profile.entityName}.`);
  }

  const requiredRecordId = (record: TRecord) => {
    const recordId = resolveRecordId(record);
    if (!recordId) {
      throw new Error(`ResourceFormPage expected a record id for ${profile.entityName}.`);
    }
    return recordId;
  };

  const { currentRecord, statusMessage, handleSubmit } = useResourceFormState<TRecord, TInput>({
    mode,
    initialRecord: record,
    createRecord: (input) => createRecord(service, input),
    updateRecord: (currentRecordValue, input) => updateRecord(service, currentRecordValue, input),
    getRecordId: requiredRecordId,
    entityLabel,
  });

  return (
    <FormPageShell
      backHref={backHref}
      backLabel={backLabel}
      title={profile.getFormTitle(mode, currentRecord)}
      description={description}
      statusMessage={statusMessage}
      renderBackLink={renderBackLink}
    >
      <ResourceForm
        initialValue={toInput(currentRecord)}
        mode={mode}
        onSubmit={handleSubmit}
        profile={profile}
        record={currentRecord}
      />
    </FormPageShell>
  );
};
