import type { AuditStamp, EntityId } from "../types/index";
import { createInMemoryRecordRepository } from "./createInMemoryRecordRepository";

type TableRecordBase<TIdKey extends string> = AuditStamp & Record<TIdKey, EntityId>;

type CreateInMemoryTableRepositoryConfig<
  TRecord extends TInput & TableRecordBase<TIdKey>,
  TInput extends Record<string, unknown>,
  TIdKey extends keyof TRecord & string,
> = {
  initialItems: TRecord[];
  idKey: TIdKey;
  createId: (currentItems: TRecord[]) => EntityId;
  getUpdatedBy: (input: TInput) => string;
  insertPosition?: "prepend" | "append";
  createRecord?: (
    input: TInput,
    meta: { currentItems: TRecord[]; id: EntityId; updatedAt: string; updatedBy: string },
  ) => TRecord;
  updateRecord?: (existing: TRecord, input: TInput, meta: { updatedAt: string; updatedBy: string }) => TRecord;
};

export const createInMemoryTableRepository = <
  TRecord extends TInput & TableRecordBase<TIdKey>,
  TInput extends Record<string, unknown>,
  TIdKey extends keyof TRecord & string,
>(
  config: CreateInMemoryTableRepositoryConfig<TRecord, TInput, TIdKey>,
) => {
  return createInMemoryRecordRepository<TRecord, TInput, TInput>({
    initialItems: config.initialItems,
    getId: (record) => record[config.idKey],
    insertPosition: config.insertPosition ?? "prepend",
    createRecord: (input, currentItems) => {
      const updatedAt = new Date().toISOString();
      const updatedBy = config.getUpdatedBy(input);
      const id = config.createId(currentItems);

      if (config.createRecord) {
        return config.createRecord(input, {
          currentItems,
          id,
          updatedAt,
          updatedBy,
        });
      }

      return {
        [config.idKey]: id,
        ...input,
        updatedAt,
        updatedBy,
      } as TRecord;
    },
    updateRecord: (existing, input) => {
      const updatedAt = new Date().toISOString();
      const updatedBy = config.getUpdatedBy(input);

      if (config.updateRecord) {
        return config.updateRecord(existing, input, {
          updatedAt,
          updatedBy,
        });
      }

      return {
        ...existing,
        ...input,
        updatedAt,
        updatedBy,
      } as TRecord;
    },
  });
};
