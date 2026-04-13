"use client";

import { useState } from "react";
import type { EntityId } from "../types/index";

type ResourceFormMode = "create" | "edit";

export type UseResourceFormStateOptions<TRecord, TInput> = {
  mode: ResourceFormMode;
  initialRecord?: TRecord;
  createRecord: (input: TInput) => Promise<TRecord>;
  updateRecord: (record: TRecord, input: TInput) => Promise<TRecord>;
  onSubmitted?: (record: TRecord, mode: ResourceFormMode) => Promise<void> | void;
  getRecordId: (record: TRecord) => EntityId;
  entityLabel?: string;
  getCreatedMessage?: (record: TRecord) => string;
  getUpdatedMessage?: (record: TRecord) => string;
  getMissingRecordMessage?: () => string;
};

type UseResourceFormStateResult<TRecord, TInput> = {
  currentRecord?: TRecord;
  statusMessage: string | null;
  setCurrentRecord: (record: TRecord | undefined) => void;
  setStatusMessage: (message: string | null) => void;
  handleSubmit: (input: TInput) => Promise<void>;
};

export const useResourceFormState = <TRecord, TInput>({
  mode,
  initialRecord,
  createRecord,
  updateRecord,
  onSubmitted,
  getRecordId,
  entityLabel = "record",
  getCreatedMessage,
  getUpdatedMessage,
  getMissingRecordMessage,
}: UseResourceFormStateOptions<TRecord, TInput>): UseResourceFormStateResult<TRecord, TInput> => {
  const [currentRecord, setCurrentRecord] = useState<TRecord | undefined>(initialRecord);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (input: TInput) => {
    if (mode === "create") {
      const created = await createRecord(input);
      setCurrentRecord(created);
      setStatusMessage(getCreatedMessage?.(created) ?? `Created ${String(getRecordId(created))}.`);
      await onSubmitted?.(created, mode);
      return;
    }

    if (!currentRecord) {
      setStatusMessage(getMissingRecordMessage?.() ?? `No ${entityLabel} was available to update.`);
      return;
    }

    const updated = await updateRecord(currentRecord, input);
    setCurrentRecord(updated);
    setStatusMessage(getUpdatedMessage?.(updated) ?? `Saved changes for ${String(getRecordId(updated))}.`);
    await onSubmitted?.(updated, mode);
  };

  return {
    currentRecord,
    statusMessage,
    setCurrentRecord,
    setStatusMessage,
    handleSubmit,
  };
};
