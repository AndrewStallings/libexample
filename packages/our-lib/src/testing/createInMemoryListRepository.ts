import type { EntityId } from "../types/index";
import { createInMemoryRecordRepository } from "./createInMemoryRecordRepository";

type CreateInMemoryListRepositoryConfig<TRecord extends Record<TIdKey, EntityId>, TIdKey extends keyof TRecord & string> = {
  initialItems: TRecord[];
  idKey: TIdKey;
  insertPosition?: "prepend" | "append";
};

export const createInMemoryListRepository = <
  TRecord extends Record<TIdKey, EntityId>,
  TIdKey extends keyof TRecord & string,
>(
  config: CreateInMemoryListRepositoryConfig<TRecord, TIdKey>,
) => {
  return createInMemoryRecordRepository<TRecord, TRecord, Partial<Omit<TRecord, TIdKey>>>({
    initialItems: config.initialItems,
    getId: (record) => record[config.idKey],
    insertPosition: config.insertPosition ?? "prepend",
    createRecord: (input) => {
      return input;
    },
    updateRecord: (existing, input) => {
      return {
        ...existing,
        ...input,
      };
    },
  });
};
