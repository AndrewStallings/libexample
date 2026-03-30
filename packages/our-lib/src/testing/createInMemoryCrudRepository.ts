import type { CrudRepository, ListResult } from "../dal/contracts";
import type { EntityId } from "../types";

type CreateInMemoryCrudRepositoryConfig<TRecord, TCreateInput, TUpdateInput> = {
  initialItems?: TRecord[];
  getId: (record: TRecord) => EntityId;
  createRecord: (input: TCreateInput, currentItems: TRecord[]) => TRecord;
  updateRecord: (existing: TRecord, input: TUpdateInput) => TRecord;
};

type InMemoryCrudRepository<TRecord, TCreateInput, TUpdateInput> = CrudRepository<TRecord, TCreateInput, TUpdateInput> & {
  snapshot: () => TRecord[];
};

export const createInMemoryCrudRepository = <TRecord, TCreateInput, TUpdateInput>(
  config: CreateInMemoryCrudRepositoryConfig<TRecord, TCreateInput, TUpdateInput>,
): InMemoryCrudRepository<TRecord, TCreateInput, TUpdateInput> => {
  const { initialItems = [], getId, createRecord, updateRecord } = config;
  let items = [...initialItems];

  return {
    list: async (): Promise<ListResult<TRecord>> => {
      return {
        items: [...items],
        total: items.length,
      };
    },

    getById: async (id: EntityId): Promise<TRecord | null> => {
      return items.find((item) => getId(item) === id) ?? null;
    },

    create: async (input: TCreateInput): Promise<TRecord> => {
      const created = createRecord(input, items);
      items = [created, ...items];
      return created;
    },

    update: async (id: EntityId, input: TUpdateInput): Promise<TRecord> => {
      const index = items.findIndex((item) => getId(item) === id);

      if (index < 0) {
        throw new Error(`Record ${id} was not found`);
      }

      const updated = updateRecord(items[index], input);
      items = items.map((item, itemIndex) => (itemIndex === index ? updated : item));
      return updated;
    },

    snapshot: () => {
      return [...items];
    },
  };
};
