"use client";

import { useQuery, type QueryKey } from "@tanstack/react-query";
import type { ResourceBuilderResult } from "./createResourceBuilder";
import type { ResourceProfile } from "./defineResourceProfile";
import type { EntityId } from "../types/index";
import { useSidePanelFormState } from "./useSidePanelFormState";

type ResourceInput = Record<string, unknown>;

type ClientResourceMetadata<TRecord, TInput extends ResourceInput> =
  | Pick<ResourceBuilderResult<TRecord, TInput>, "profile" | "toInput" | "entityLabel">
  | {
      profile: ResourceProfile<TRecord, TInput>;
      toInput: (record?: TRecord | undefined) => TInput;
      entityLabel?: string | undefined;
    };

export type ClientResource<TRecord, TInput extends ResourceInput> = {
  queryKey: QueryKey;
  profile: ResourceProfile<TRecord, TInput>;
  toInput: (record?: TRecord | undefined) => TInput;
  getRecordId: (record: TRecord) => EntityId;
  entityLabel?: string | undefined;
  list: () => Promise<TRecord[]>;
  create: (input: TInput) => Promise<TRecord>;
  update: (record: TRecord, input: TInput) => Promise<TRecord>;
};

type CreateClientResourceOptions<TRecord, TInput extends ResourceInput> = {
  resource: ClientResourceMetadata<TRecord, TInput>;
  queryKey: QueryKey;
  list: () => Promise<TRecord[]>;
  create: (input: TInput) => Promise<TRecord>;
  update: (record: TRecord, input: TInput) => Promise<TRecord>;
  getRecordId?: ((record: TRecord) => EntityId) | undefined;
  entityLabel?: string | undefined;
};

const getRequiredRecordId = <TRecord, TInput extends ResourceInput>(
  resource: ClientResourceMetadata<TRecord, TInput>,
  getRecordId?: ((record: TRecord) => EntityId) | undefined,
) => {
  const resolvedGetRecordId = getRecordId ?? resource.profile.getRecordId;

  if (!resolvedGetRecordId) {
    throw new Error(`createClientResource requires getRecordId or profile.getRecordId for ${resource.profile.entityName}.`);
  }

  return (record: TRecord) => {
    const recordId = resolvedGetRecordId(record);

    if (recordId === undefined || recordId === null) {
      throw new Error(`createClientResource expected a record id for ${resource.profile.entityName}.`);
    }

    return recordId;
  };
};

export const createClientResource = <TRecord, TInput extends ResourceInput>({
  resource,
  queryKey,
  list,
  create,
  update,
  getRecordId,
  entityLabel,
}: CreateClientResourceOptions<TRecord, TInput>): ClientResource<TRecord, TInput> => {
  return {
    queryKey,
    profile: resource.profile,
    toInput: resource.toInput,
    getRecordId: getRequiredRecordId(resource, getRecordId),
    entityLabel: entityLabel ?? resource.entityLabel,
    list,
    create,
    update,
  };
};

type UseClientResourceListOptions<TRecord> = {
  initialData: TRecord[];
};

export const useClientResourceList = <TRecord, TInput extends ResourceInput>(
  resource: ClientResource<TRecord, TInput>,
  { initialData }: UseClientResourceListOptions<TRecord>,
) => {
  return useQuery({
    queryKey: resource.queryKey,
    queryFn: resource.list,
    initialData,
  });
};

type UseClientResourceSidePanelFormStateOptions<TRecord> = {
  mode: "create" | "edit";
  record?: TRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
  entityLabel?: string | undefined;
  getCreatedMessage?: ((record: TRecord) => string) | undefined;
  getUpdatedMessage?: ((record: TRecord) => string) | undefined;
  getMissingRecordMessage?: (() => string) | undefined;
};

export const useClientResourceSidePanelFormState = <TRecord, TInput extends ResourceInput>(
  resource: ClientResource<TRecord, TInput>,
  {
    mode,
    record,
    isOpen,
    onClose,
    entityLabel,
    getCreatedMessage,
    getUpdatedMessage,
    getMissingRecordMessage,
  }: UseClientResourceSidePanelFormStateOptions<TRecord>,
) => {
  return useSidePanelFormState<ClientResource<TRecord, TInput>, TRecord, TInput>({
    mode,
    record,
    isOpen,
    onClose,
    createService: () => resource,
    queryKey: resource.queryKey,
    createRecord: (service, input) => service.create(input),
    updateRecord: (service, currentRecord, input) => service.update(currentRecord, input),
    getRecordId: resource.getRecordId,
    entityLabel: entityLabel ?? resource.entityLabel,
    getCreatedMessage,
    getUpdatedMessage,
    getMissingRecordMessage,
  });
};
