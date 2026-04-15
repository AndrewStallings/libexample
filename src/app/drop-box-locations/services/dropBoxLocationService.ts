import "server-only";

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
  if (process.env.APP_DROP_BOX_LOCATION_REPOSITORY_MODE === "production") {
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

type DropBoxLocationResourceService = ReturnType<typeof createDropBoxLocationResourceHelpers>;

export type DropBoxLocationService = {
  repository: DropBoxLocationRepository;
  logger: AuditLogger;
  list: () => Promise<DropBoxLocationRecord[]>;
  getById: (locationId: string) => Promise<DropBoxLocationRecord | null>;
  create: (input: DropBoxLocationInput) => Promise<DropBoxLocationRecord>;
  update: (locationId: string, input: DropBoxLocationInput) => Promise<DropBoxLocationRecord>;
  validation: Pick<DropBoxLocationResourceService, "validate">;
  logging: ReturnType<typeof createDropBoxLocationLoggingHelpers>;
  resource: DropBoxLocationResourceService;
  getMarketingBigNumberLocationIds: () => Promise<string[]>;
};

export const createDropBoxLocationService = (dependencies: DropBoxLocationDependencies = createDropBoxLocationDependencies()) => {
  const { repository, logger } = dependencies;
  const logging = createDropBoxLocationLoggingHelpers(logger);
  const resource = createDropBoxLocationResourceHelpers({ repository, logger });
  const list = async () => {
    return (await repository.list()).items;
  };
  const getById = async (locationId: string) => {
    return repository.getById(locationId);
  };
  const create = async (input: DropBoxLocationInput) => {
    return resource.create(input, input.districtManager);
  };
  const update = async (locationId: string, input: DropBoxLocationInput) => {
    return resource.update(locationId, input, input.districtManager);
  };

  return {
    repository,
    logger,
    list,
    getById,
    create,
    update,
    validation: {
      validate: resource.validate,
    },
    logging,
    resource,
    getMarketingBigNumberLocationIds: async () => {
      return (await list()).map((record) => record.locationId).filter((locationId) => hasMarketingBigNumber(locationId));
    },
  } satisfies DropBoxLocationService;
};

const dropBoxLocationService = createDropBoxLocationService();

export const createDropBoxLocationResourceService = (dependencies?: DropBoxLocationDependencies) => {
  return createDropBoxLocationService(dependencies).resource;
};

export const listDropBoxLocations = async () => {
  return dropBoxLocationService.list();
};

export const getDropBoxLocationById = async (locationId: string) => {
  return dropBoxLocationService.getById(locationId);
};

export const createDropBoxLocation = async (input: DropBoxLocationInput) => {
  return dropBoxLocationService.create(input);
};

export const updateDropBoxLocation = async (locationId: string, input: DropBoxLocationInput) => {
  return dropBoxLocationService.update(locationId, input);
};
