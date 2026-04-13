"use client";

import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { EntityId } from "../types/index";
import { useResourceFormState, type UseResourceFormStateOptions } from "./useResourceFormState";

type UseSidePanelFormStateOptions<TService, TRecord, TInput> = {
  mode: "create" | "edit";
  record?: TRecord | undefined;
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
  createService: () => TService;
  queryKey: QueryKey;
  createRecord: (service: TService, input: TInput) => Promise<TRecord>;
  updateRecord: (service: TService, currentRecord: TRecord, input: TInput) => Promise<TRecord>;
  getRecordId: (record: TRecord) => EntityId;
  entityLabel?: string | undefined;
  getCreatedMessage?: ((record: TRecord) => string) | undefined;
  getUpdatedMessage?: ((record: TRecord) => string) | undefined;
  getMissingRecordMessage?: (() => string) | undefined;
};

export const useSidePanelFormState = <TService, TRecord, TInput>({
  mode,
  record,
  isOpen = true,
  onClose,
  createService,
  queryKey,
  createRecord,
  updateRecord,
  getRecordId,
  entityLabel,
  getCreatedMessage,
  getUpdatedMessage,
  getMissingRecordMessage,
}: UseSidePanelFormStateOptions<TService, TRecord, TInput>) => {
  const queryClient = useQueryClient();
  const service = useMemo(createService, [createService]);
  const resourceFormStateOptions: UseResourceFormStateOptions<TRecord, TInput> = {
    mode,
    createRecord: (input) => createRecord(service, input),
    updateRecord: (currentRecordValue, input) => updateRecord(service, currentRecordValue, input),
    getRecordId,
    onSubmitted: async () => {
      await queryClient.invalidateQueries({ queryKey });
      onClose?.();
    },
    ...(record !== undefined ? { initialRecord: record } : {}),
    ...(entityLabel !== undefined ? { entityLabel } : {}),
    ...(getCreatedMessage !== undefined ? { getCreatedMessage } : {}),
    ...(getUpdatedMessage !== undefined ? { getUpdatedMessage } : {}),
    ...(getMissingRecordMessage !== undefined ? { getMissingRecordMessage } : {}),
  };
  const { currentRecord, statusMessage, setCurrentRecord, setStatusMessage, handleSubmit } = useResourceFormState<TRecord, TInput>(
    resourceFormStateOptions,
  );

  useEffect(() => {
    setCurrentRecord(record);
    setStatusMessage(null);
  }, [isOpen, mode, record, setCurrentRecord, setStatusMessage]);

  return {
    currentRecord,
    statusMessage,
    handleSubmit,
  };
};
