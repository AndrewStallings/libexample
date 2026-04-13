import type { SafeParseReturnType, ZodType } from "zod";
import type { AuditLogger, RecordRepository, ResourceService } from "../dal/contracts";
import { createRecordResource } from "../dal/createRecordResource";
import type { EntityId, UpdatedAtValue } from "../types/index";
import { defineResourceProfile, type ResourceCardField, type ResourceFormField, type ResourceProfile } from "./defineResourceProfile";

const humanizeWords = (value: string) => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const humanizeRoute = (route: string) => {
  const segment = route.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).at(-1) ?? route;
  return humanizeWords(segment);
};

export type ValidatedResourceService<TRecord, TInput> = ResourceService<TRecord, TInput, TInput> & {
  validate: (input: TInput) => SafeParseReturnType<TInput, TInput>;
};

export type ResourceBuilderConfig<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown> = {
  entityName: string;
  route: string;
  inputSchema: ZodType<TInput>;
  drizzleTable?: TDrizzleTable;
  source?: string | undefined;
  displayName?: string | undefined;
  entityLabel?: string | undefined;
  collectionName?: string | undefined;
  backHref?: string | undefined;
  backLabel?: string | undefined;
  getRecordId: (record: TRecord) => EntityId;
  getRecordLabel?: ((record: TRecord) => string | undefined) | undefined;
  getUpdatedAt?: ((record: TRecord) => UpdatedAtValue | undefined) | undefined;
  getUpdatedBy?: ((record: TRecord) => string | undefined) | undefined;
  getFormTitle?: ResourceProfile<TRecord, TInput>["getFormTitle"] | undefined;
  getSubmitLabel?: ResourceProfile<TRecord, TInput>["getSubmitLabel"] | undefined;
  createEmptyInput: () => TInput;
  mapRecordToInput?: ((record: TRecord) => TInput) | undefined;
  cardFields: ResourceCardField<TRecord>[];
  formFields: ResourceFormField<TInput>[];
};

export type ResourceBuilderResult<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown> = {
  entityName: string;
  route: string;
  drizzleTable?: TDrizzleTable | undefined;
  displayName: string;
  entityLabel: string;
  collectionName: string;
  navigation: {
    backHref: string;
    backLabel: string;
  };
  profile: ResourceProfile<TRecord, TInput>;
  toInput: (record?: TRecord) => TInput;
  createService: (
    repository: RecordRepository<TRecord, TInput, TInput>,
    logger: AuditLogger,
  ) => ValidatedResourceService<TRecord, TInput>;
};

type ResourceIdentityConfig<TRecord> = Pick<
  ResourceBuilderConfig<TRecord, Record<string, unknown>>,
  "getRecordId" | "getRecordLabel" | "getUpdatedAt" | "getUpdatedBy"
>;

type ResourceDisplayConfig<TRecord, TInput extends Record<string, unknown>> = Pick<
  ResourceBuilderConfig<TRecord, TInput>,
  "displayName" | "entityLabel" | "collectionName" | "backHref" | "backLabel" | "getFormTitle" | "getSubmitLabel"
>;

type ResourceDefaultsConfig<TRecord, TInput extends Record<string, unknown>> = Pick<
  ResourceBuilderConfig<TRecord, TInput>,
  "createEmptyInput" | "mapRecordToInput"
>;

type ResourceFieldsConfig<TRecord, TInput extends Record<string, unknown>> = Pick<
  ResourceBuilderConfig<TRecord, TInput>,
  "cardFields" | "formFields"
>;

const buildResourceResult = <TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown>(
  config: ResourceBuilderConfig<TRecord, TInput, TDrizzleTable>,
): ResourceBuilderResult<TRecord, TInput, TDrizzleTable> => {
  const displayName = config.displayName ?? humanizeWords(config.entityName);
  const entityLabel = config.entityLabel ?? displayName.toLowerCase();
  const collectionName = config.collectionName ?? humanizeRoute(config.route);

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
    displayName,
    entityLabel,
    collectionName,
    navigation: {
      backHref: config.backHref ?? config.route,
      backLabel: config.backLabel ?? `Back to ${collectionName.toLowerCase()}`,
    },
    profile,
    toInput,
    createService,
  };
};

export class ResourceBuilder<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown> {
  constructor(private readonly config: Partial<ResourceBuilderConfig<TRecord, TInput, TDrizzleTable>> = {}) {}

  private next(updates: Partial<ResourceBuilderConfig<TRecord, TInput, TDrizzleTable>>) {
    return new ResourceBuilder<TRecord, TInput, TDrizzleTable>({
      ...this.config,
      ...updates,
    });
  }

  resource(
    value: Pick<ResourceBuilderConfig<TRecord, TInput, TDrizzleTable>, "entityName" | "route" | "inputSchema" | "drizzleTable" | "source">,
  ) {
    return this.next(value);
  }

  record(value: ResourceIdentityConfig<TRecord>) {
    return this.next(value);
  }

  display(value: ResourceDisplayConfig<TRecord, TInput>) {
    return this.next(value);
  }

  defaults(value: ResourceDefaultsConfig<TRecord, TInput>) {
    return this.next(value);
  }

  fields(value: ResourceFieldsConfig<TRecord, TInput>) {
    return this.next(value);
  }

  build(): ResourceBuilderResult<TRecord, TInput, TDrizzleTable> {
    const {
      entityName,
      route,
      inputSchema,
      getRecordId,
      createEmptyInput,
      cardFields,
      formFields,
    } = this.config;

    if (!entityName || !route || !inputSchema || !getRecordId || !createEmptyInput || !cardFields || !formFields) {
      throw new Error("createResourceBuilder.build() is missing required resource configuration.");
    }

    return buildResourceResult({
      ...this.config,
      entityName,
      route,
      inputSchema,
      getRecordId,
      createEmptyInput,
      cardFields,
      formFields,
    });
  }
}

export function createResourceBuilder<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown>(): ResourceBuilder<
  TRecord,
  TInput,
  TDrizzleTable
>;
export function createResourceBuilder<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown>(
  config: ResourceBuilderConfig<TRecord, TInput, TDrizzleTable>,
): ResourceBuilderResult<TRecord, TInput, TDrizzleTable>;
export function createResourceBuilder<TRecord, TInput extends Record<string, unknown>, TDrizzleTable = unknown>(
  config?: ResourceBuilderConfig<TRecord, TInput, TDrizzleTable>,
) {
  if (config) {
    return buildResourceResult(config);
  }

  return new ResourceBuilder<TRecord, TInput, TDrizzleTable>();
}
