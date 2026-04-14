import {
  createWorkflowService,
  InMemoryAuditLogger,
  type AuditLogEntry,
  type AuditLogger,
  type RecordRepository,
} from "our-lib";
import {
  InMemoryDropBoxLocationRepository,
  ProductionDropBoxLocationRepository,
} from "@/drop-box-locations/data/dropBoxLocationRepository";
import { dropBoxLocationInputSchema, type DropBoxLocationInput, type DropBoxLocationRecord } from "@/drop-box-locations/models/schemas";
import { createAppAuditLogger } from "@/config/auditLogger";

const createRepositoryForEnvironment = (): RecordRepository<
  DropBoxLocationRecord,
  DropBoxLocationInput,
  DropBoxLocationInput
> => {
  if (process.env.NODE_ENV === "production") {
    return new ProductionDropBoxLocationRepository();
  }

  return new InMemoryDropBoxLocationRepository();
};

const createLoggerForEnvironment = (): AuditLogger => {
  return createAppAuditLogger();
};

type DropBoxLocationRepository = RecordRepository<
  DropBoxLocationRecord,
  DropBoxLocationInput,
  DropBoxLocationInput
>;

type DropBoxLocationDependencies = {
  repository: DropBoxLocationRepository;
  logger: AuditLogger;
};

const createDropBoxLocationDependencies = (): DropBoxLocationDependencies => {
  return {
    repository: createRepositoryForEnvironment(),
    logger: createLoggerForEnvironment(),
  };
};

const dependencies = createDropBoxLocationDependencies();

const hasMarketingBigNumber = (locationId: string) => {
  const digitsOnly = locationId.replace(/[^\d]/g, "");
  return /^10{2,}$/.test(digitsOnly);
};

const createDropBoxLocationLoggingHelpers = (logger: AuditLogger) => {
  return {
    writeAuditEntry: async (entry: AuditLogEntry) => {
      await logger.write(entry);
    },
    getEntries: () => {
      if (logger instanceof InMemoryAuditLogger) {
        return [...logger.entries];
      }

      return [] as AuditLogEntry[];
    },
  };
};

const createDropBoxLocationResourceHelpers = ({ repository, logger }: DropBoxLocationDependencies) => {
  const workflow = createWorkflowService({
    entityName: "dropBoxLocation",
    repository,
    logger,
    route: "/drop-box-locations",
    source: "dropBoxLocationService",
    getEntityId: (record) => record.locationId,
    inputSchema: dropBoxLocationInputSchema,
  });

  return {
    list: workflow.list,
    getById: workflow.getById,
    create: workflow.create,
    update: workflow.update,
    validate: workflow.validate,
  };
};

export type DropBoxLocationService = {
  repository: DropBoxLocationRepository;
  logger: AuditLogger;
  validation: Pick<ReturnType<typeof createDropBoxLocationResourceHelpers>, "validate">;
  logging: ReturnType<typeof createDropBoxLocationLoggingHelpers>;
  resource: ReturnType<typeof createDropBoxLocationResourceHelpers>;
  getMarketingBigNumberLocationIds: () => Promise<string[]>;
};

export const createDropBoxLocationService = () => {
  const { repository, logger } = dependencies;
  const logging = createDropBoxLocationLoggingHelpers(logger);
  const resource = createDropBoxLocationResourceHelpers({ repository, logger });

  return {
    repository,
    logger,
    validation: {
      validate: resource.validate,
    },
    logging,
    resource,
    getMarketingBigNumberLocationIds: async () => {
      const result = await repository.list();
      return result.items
        .map((record) => record.locationId)
        .filter((locationId) => hasMarketingBigNumber(locationId));
    },
  } satisfies DropBoxLocationService;
};

export const createDropBoxLocationResourceService = () => {
  return createDropBoxLocationService().resource;
};
