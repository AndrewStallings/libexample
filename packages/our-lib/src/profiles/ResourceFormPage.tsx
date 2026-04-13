"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { FormShell } from "../forms/index";
import type { ResourceBuilderResult } from "./createResourceBuilder";
import type { ResourceProfile } from "./defineResourceProfile";
import { ResourceForm } from "./ResourceForm";
import { useResourceFormState } from "./useResourceFormState";

const humanizeBackLabel = (href?: string) => {
  if (!href) {
    return undefined;
  }

  const segment = href.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).at(-1);
  if (!segment) {
    return undefined;
  }

  const label = segment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim()
    .toLowerCase();

  return label ? `Back to ${label}` : undefined;
};

type ResourceFormPageProps<TService, TRecord, TInput extends Record<string, unknown>> = {
  mode: "create" | "edit";
  record?: TRecord;
  createService: () => TService;
  description: string;
  entityLabel?: string;
  getRecordId?: (record: TRecord) => import("../types/index").EntityId;
  createRecord: (service: TService, input: TInput) => Promise<TRecord>;
  updateRecord: (service: TService, record: TRecord, input: TInput) => Promise<TRecord>;
  onSubmitted?: (record: TRecord, mode: "create" | "edit") => Promise<void> | void;
  resource?: Pick<ResourceBuilderResult<TRecord, TInput>, "profile" | "toInput" | "route" | "entityLabel" | "navigation">;
  profile?: ResourceProfile<TRecord, TInput>;
  toInput?: (record?: TRecord) => TInput;
  backHref?: string;
  backLabel?: string;
  renderBackLink?: (props: { href: string; className: string; children: ReactNode }) => ReactNode;
};

export const ResourceFormPage = <TService, TRecord, TInput extends Record<string, unknown>>({
  mode,
  record,
  createService,
  description,
  entityLabel,
  getRecordId,
  createRecord,
  updateRecord,
  onSubmitted,
  resource,
  profile,
  toInput,
  backHref,
  backLabel,
  renderBackLink,
}: ResourceFormPageProps<TService, TRecord, TInput>) => {
  const service = useMemo(() => createService(), [createService]);
  const resolvedProfile = resource?.profile ?? profile;
  const resolvedToInput = resource?.toInput ?? toInput;

  if (!resolvedProfile) {
    throw new Error("ResourceFormPage requires a resource.profile or profile prop.");
  }

  if (!resolvedToInput) {
    throw new Error("ResourceFormPage requires a resource.toInput or toInput prop.");
  }

  const resolvedBackHref = backHref ?? resource?.navigation?.backHref ?? resource?.route;
  const resolvedBackLabel = backLabel ?? resource?.navigation?.backLabel ?? humanizeBackLabel(resolvedBackHref);
  const resolvedEntityLabel = entityLabel ?? resource?.entityLabel;
  const resolveRecordId = getRecordId ?? resolvedProfile.getRecordId;

  if (!resolveRecordId) {
    throw new Error(`ResourceFormPage requires getRecordId or profile.getRecordId for ${resolvedProfile.entityName}.`);
  }

  const requiredRecordId = (record: TRecord) => {
    const recordId = resolveRecordId(record);
    if (recordId === undefined || recordId === null) {
      throw new Error(`ResourceFormPage expected a record id for ${resolvedProfile.entityName}.`);
    }
    return recordId;
  };

  const { currentRecord, statusMessage, handleSubmit } = useResourceFormState<TRecord, TInput>({
    mode,
    createRecord: (input) => createRecord(service, input),
    updateRecord: (currentRecordValue, input) => updateRecord(service, currentRecordValue, input),
    getRecordId: requiredRecordId,
    ...(record !== undefined ? { initialRecord: record } : {}),
    ...(onSubmitted !== undefined ? { onSubmitted } : {}),
    ...(resolvedEntityLabel !== undefined ? { entityLabel: resolvedEntityLabel } : {}),
  });

  return (
    <FormShell
      variant="page"
      title={resolvedProfile.getFormTitle(mode, currentRecord)}
      description={description}
      statusMessage={statusMessage}
      {...(resolvedBackHref !== undefined ? { backHref: resolvedBackHref } : {})}
      {...(resolvedBackLabel !== undefined ? { backLabel: resolvedBackLabel } : {})}
      {...(renderBackLink !== undefined ? { renderBackLink } : {})}
    >
      <ResourceForm
        initialValue={resolvedToInput(currentRecord)}
        mode={mode}
        onSubmit={handleSubmit}
        profile={resolvedProfile}
        {...(currentRecord !== undefined ? { record: currentRecord } : {})}
      />
    </FormShell>
  );
};
