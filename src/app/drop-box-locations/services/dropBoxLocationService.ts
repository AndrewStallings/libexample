import { createRecordResource, type AuditLogger, type RecordRepository } from "our-lib";
import { dropBoxLocationInputSchema, type DropBoxLocationInput, type DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";

export const createDropBoxLocationService = (
  repository: RecordRepository<DropBoxLocationRecord, DropBoxLocationInput, DropBoxLocationInput>,
  logger: AuditLogger,
) => {
  const resource = createRecordResource({
    entityName: "dropBoxLocation",
    repository,
    logger,
    route: "/drop-box-locations",
    source: "dropBoxLocationService",
    getEntityId: (record) => record.locationId,
  });

  return {
    list: resource.list,
    getById: resource.getById,
    create: async (input: DropBoxLocationInput, userId: string) => {
      return resource.create(dropBoxLocationInputSchema.parse(input), userId);
    },
    update: async (id: string, input: DropBoxLocationInput, userId: string) => {
      return resource.update(id, dropBoxLocationInputSchema.parse(input), userId);
    },
    validate: (input: DropBoxLocationInput) => {
      return dropBoxLocationInputSchema.safeParse(input);
    },
  };
};
