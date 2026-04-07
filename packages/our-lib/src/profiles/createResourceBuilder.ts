import type { SafeParseReturnType, ZodType } from "zod";
import type { AuditLogger, RecordRepository, ResourceService } from "../dal/contracts";
import { createRecordResource } from "../dal/createRecordResource";
import type { EntityId } from "../types/index";
import { defineResourceProfile, type ResourceCardField, type ResourceFormField, type ResourceProfile } from "./defineResourceProfile";

const humanizeEntityName = (value: string) => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export type ValidatedResourceService<TRecord, TInput> = ResourceService<TRecord, TInput, TInput> & {
  validate: (input: TInput) => SafeParseReturnType<TInput, TInput>;
};

export type ResourceBuilderConfig<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown> = {
  entityName: string;
  route: string;
  inputSchema: ZodType<TInput>;
  drizzleTable?: TDrizzleTable;
  source?: string;
  displayName?: string;
  entityLabel?: string;
  getRecordId: (record: TRecord) => EntityId;
  getRecordLabel?: (record: TRecord) => string | undefined;
  getUpdatedAt?: (record: TRecord) => string | undefined;
  getUpdatedBy?: (record: TRecord) => string | undefined;
  getFormTitle?: ResourceProfile<TRecord, TInput>["getFormTitle"];
  getSubmitLabel?: ResourceProfile<TRecord, TInput>["getSubmitLabel"];
  createEmptyInput: () => TInput;
  mapRecordToInput?: (record: TRecord) => TInput;
  cardFields: ResourceCardField<TRecord>[];
  formFields: ResourceFormField<TInput>[];
};

export type ResourceBuilderResult<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown> = {
  entityName: string;
  route: string;
  drizzleTable?: TDrizzleTable;
  profile: ResourceProfile<TRecord, TInput>;
  toInput: (record?: TRecord) => TInput;
  createService: (
    repository: RecordRepository<TRecord, TInput, TInput>,
    logger: AuditLogger,
  ) => ValidatedResourceService<TRecord, TInput>;
};

export const createResourceBuilder = <TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown>(
  config: ResourceBuilderConfig<TRecord, TInput, TDrizzleTable>,
): ResourceBuilderResult<TRecord, TInput, TDrizzleTable> => {
  const displayName = config.displayName ?? humanizeEntityName(config.entityName);
  const entityLabel = config.entityLabel ?? displayName.toLowerCase();

  const profile = defineResourceProfile<TRecord, TInput>({
    entityName: config.entityName,
    inputSchema: config.inputSchema,
    getRecordId: config.getRecordId,
    getUpdatedAt: config.getUpdatedAt,
    getUpdatedBy: config.getUpdatedBy,
    getFormTitle:
      config.getFormTitle ??
      ((mode, record) => {
        if (mode === "create") {
          return `Create ${displayName}`;
        }

        const recordLabel = record ? config.getRecordLabel?.(record) : undefined;
        return `Edit ${recordLabel ?? entityLabel}`;
      }),
    getSubmitLabel: config.getSubmitLabel ?? ((mode) => (mode === "create" ? `Create ${entityLabel}` : `Save ${entityLabel}`)),
    cardFields: config.cardFields,
    formFields: config.formFields,
  });

  const toInput = (record?: TRecord): TInput => {
    if (!record) {
      return config.createEmptyInput();
    }

    if (config.mapRecordToInput) {
      return config.mapRecordToInput(record);
    }

    const nextInput = config.createEmptyInput();
    const recordValues = record as Record<string, unknown>;

    for (const field of config.formFields) {
      if (field.key in recordValues) {
        nextInput[field.key] = recordValues[field.key] as TInput[typeof field.key];
      }
    }

    return nextInput;
  };

  const createService = (
    repository: RecordRepository<TRecord, TInput, TInput>,
    logger: AuditLogger,
  ): ValidatedResourceService<TRecord, TInput> => {
    const resource = createRecordResource({
      entityName: config.entityName,
      repository,
      logger,
      route: config.route,
      source: config.source ?? `${config.entityName}Service`,
      getEntityId: config.getRecordId,
    });

    return {
      list: resource.list,
      getById: resource.getById,
      create: async (input, userId) => {
        return resource.create(config.inputSchema.parse(input), userId);
      },
      update: async (id, input, userId) => {
        return resource.update(id, config.inputSchema.parse(input), userId);
      },
      validate: (input) => {
        return config.inputSchema.safeParse(input);
      },
    };
  };

  return {
    entityName: config.entityName,
    route: config.route,
    drizzleTable: config.drizzleTable,
    profile,
    toInput,
    createService,
  };
};
