import type { AuditLogger, CrudRepository } from "./contracts";
import { buildAuditEntry } from "./logging";
import type { EntityId } from "../types";

type CrudResourceConfig<TRecord, TCreateInput, TUpdateInput> = {
  entityName: string;
  repository: CrudRepository<TRecord, TCreateInput, TUpdateInput>;
  logger: AuditLogger;
  route: string;
  source: string;
  getEntityId(record: TRecord): EntityId;
};

export const createCrudResource = <TRecord, TCreateInput, TUpdateInput>(
  config: CrudResourceConfig<TRecord, TCreateInput, TUpdateInput>,
) => {
  const { entityName, repository, logger, route, source, getEntityId } = config;

  return {
    list: async () => {
      return repository.list();
    },

    getById: async (id: EntityId) => {
      return repository.getById(id);
    },

    create: async (input: TCreateInput, userId: string) => {
      const created = await repository.create(input);

      await logger.write(
        buildAuditEntry({
          server: "local",
          shortNote: `${entityName} created`,
          longNote: `${entityName} ${getEntityId(created)} was created`,
          source,
          category: entityName,
          route,
          userId,
        }),
      );

      return created;
    },

    update: async (id: EntityId, input: TUpdateInput, userId: string) => {
      const updated = await repository.update(id, input);

      await logger.write(
        buildAuditEntry({
          server: "local",
          shortNote: `${entityName} updated`,
          longNote: `${entityName} ${id} was updated`,
          source,
          category: entityName,
          route,
          userId,
        }),
      );

      return updated;
    },
  };
};
