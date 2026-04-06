import type { ListResult, RecordRepository } from "../dal/contracts";
import type { EntityId } from "../types/index";

type CreateInMemoryRecordRepositoryConfig<TRecord, TCreateInput, TUpdateInput> = {
  initialItems: TRecord[];
  getId(record: TRecord): EntityId;
  createRecord(input: TCreateInput, currentItems: TRecord[]): TRecord;
  updateRecord(existing: TRecord, input: TUpdateInput): TRecord;
};

type InMemoryRecordRepository<TRecord, TCreateInput, TUpdateInput> = RecordRepository<TRecord, TCreateInput, TUpdateInput> & {
  snapshot(): TRecord[];
};

export const createInMemoryRecordRepository = <TRecord, TCreateInput, TUpdateInput>(
  config: CreateInMemoryRecordRepositoryConfig<TRecord, TCreateInput, TUpdateInput>,
): InMemoryRecordRepository<TRecord, TCreateInput, TUpdateInput> => {
  let items = [...config.initialItems];

  return {
    list: async (): Promise<ListResult<TRecord>> => {
      return {
        items,
        total: items.length,
      };
    },

    getById: async (id: EntityId) => {
      return items.find((item) => config.getId(item) === id) ?? null;
    },

    create: async (input: TCreateInput) => {
      const created = config.createRecord(input, items);
      items = [...items, created];
      return created;
    },

    update: async (id: EntityId, input: TUpdateInput) => {
      const existing = items.find((item) => config.getId(item) === id);
      if (!existing) {
        throw new Error(`Record ${id} was not found`);
      }

      const updated = config.updateRecord(existing, input);
      items = items.map((item) => (config.getId(item) === id ? updated : item));
      return updated;
    },

    snapshot: () => {
      return items;
    },
  };
};
