"use client";

import { useEffect, useState } from "react";

type MutationType = "create" | "update" | "delete";

type BaseMutationEvent = {
  entity: string;
  mutation: MutationType;
};

export type RecordMutationEvent<TRecord = unknown> =
  | (BaseMutationEvent & { mutation: "create" | "update"; record: TRecord })
  | (BaseMutationEvent & { mutation: "delete"; recordId: string | number });

const eventName = "app:record-mutation";
const storageKey = "app:record-mutation";

const getChannel = () => {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  return new BroadcastChannel(eventName);
};

const dispatchLocalEvent = (event: RecordMutationEvent) => {
  window.dispatchEvent(new CustomEvent<RecordMutationEvent>(eventName, { detail: event }));
};

export const publishRecordMutation = <TRecord>(event: RecordMutationEvent<TRecord>) => {
  if (typeof window === "undefined") {
    return;
  }

  dispatchLocalEvent(event);

  const channel = getChannel();
  channel?.postMessage(event);
  channel?.close();

  const serialized = JSON.stringify({
    ...event,
    publishedAt: new Date().toISOString(),
  });
  window.localStorage.setItem(storageKey, serialized);
  window.localStorage.removeItem(storageKey);

  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: eventName, payload: event }, window.location.origin);
  }
};

export const subscribeToRecordMutations = (listener: (event: RecordMutationEvent) => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<RecordMutationEvent>).detail;
    if (detail) {
      listener(detail);
    }
  };

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin || event.data?.type !== eventName || !event.data?.payload) {
      return;
    }

    listener(event.data.payload as RecordMutationEvent);
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) {
      return;
    }

    const payload = JSON.parse(event.newValue) as RecordMutationEvent;
    listener(payload);
  };

  const channel = getChannel();
  const handleChannelMessage = (event: MessageEvent<RecordMutationEvent>) => {
    listener(event.data);
  };

  window.addEventListener(eventName, handleCustomEvent as EventListener);
  window.addEventListener("message", handleMessage);
  window.addEventListener("storage", handleStorage);
  channel?.addEventListener("message", handleChannelMessage);

  return () => {
    window.removeEventListener(eventName, handleCustomEvent as EventListener);
    window.removeEventListener("message", handleMessage);
    window.removeEventListener("storage", handleStorage);
    channel?.removeEventListener("message", handleChannelMessage);
    channel?.close();
  };
};

type UseRecordCollectionOptions<TRecord> = {
  entity: string;
  initialItems: TRecord[];
  getRecordId: (record: TRecord) => string | number;
  matchesRecord?: (record: TRecord) => boolean;
};

export const useRecordCollection = <TRecord>({
  entity,
  initialItems,
  getRecordId,
  matchesRecord = () => true,
}: UseRecordCollectionOptions<TRecord>) => {
  const [items, setItems] = useState<TRecord[]>(initialItems);

  useEffect(() => {
    return subscribeToRecordMutations((event) => {
      if (event.entity !== entity) {
        return;
      }

      setItems((currentItems) => {
        if (event.mutation === "delete") {
          return currentItems.filter((item) => getRecordId(item) !== event.recordId);
        }

        const record = event.record as TRecord;
        const recordId = getRecordId(record);
        const index = currentItems.findIndex((item) => getRecordId(item) === recordId);
        const shouldInclude = matchesRecord(record);

        if (!shouldInclude) {
          return index >= 0 ? currentItems.filter((item) => getRecordId(item) !== recordId) : currentItems;
        }

        if (index >= 0) {
          return currentItems.map((item) => (getRecordId(item) === recordId ? record : item));
        }

        return [record, ...currentItems];
      });
    });
  }, [entity, getRecordId, matchesRecord]);

  return items;
};

export const finalizePopupMutation = <TRecord>(event: RecordMutationEvent<TRecord>) => {
  publishRecordMutation(event);

  if (typeof window === "undefined" || !window.opener || window.opener.closed) {
    return;
  }

  window.setTimeout(() => {
    window.close();
  }, 120);
};
