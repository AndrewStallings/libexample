import type { ZodObject, ZodSafeParseResult } from "zod";
import type { AuditLogger, RecordRepository } from "./contracts";
import { buildAuditEntry } from "./logging";
import type { EntityId } from "../types/index";

type WorkflowServiceConfig<TRecord, TCreateInput extends Record<string, unknown>, TUpdateInput extends Record<string, unknown>> = {
  entityName: string;
  repository: RecordRepository<TRecord, TCreateInput, TUpdateInput>;
  logger: AuditLogger;
  route: string;
  source: string;
  getEntityId(record: TRecord): EntityId;
  inputSchema?: ZodObject | undefined;
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error);
};

export const createWorkflowService = <
  TRecord,
  TCreateInput extends Record<string, unknown>,
  TUpdateInput extends Record<string, unknown>,
>(
  config: WorkflowServiceConfig<TRecord, TCreateInput, TUpdateInput>,
) => {
  const { entityName, repository, logger, route, source, getEntityId, inputSchema } = config;

  const writeFailureLog = async (operation: "create" | "update", userId: string, error: unknown) => {
    await logger.write(
      buildAuditEntry({
        server: "local",
        severity: "error",
        shortNote: `${entityName} ${operation} failed`,
        longNote: `${entityName} ${operation} failed: ${getErrorMessage(error)}`,
        source,
        category: entityName,
        route,
        userId,
      }),
    );
  };

  const validate = (input: TCreateInput | TUpdateInput): ZodSafeParseResult<TCreateInput | TUpdateInput> => {
    if (!inputSchema) {
      return {
        success: true,
        data: input,
      } as ZodSafeParseResult<TCreateInput | TUpdateInput>;
    }

    return inputSchema.safeParse(input) as ZodSafeParseResult<TCreateInput | TUpdateInput>;
  };

  return {
    list: async () => {
      return repository.list();
    },

    getById: async (id: EntityId) => {
      return repository.getById(id);
    },

    validate,

    create: async (input: TCreateInput, userId: string) => {
      if (inputSchema) {
        const validated = validate(input) as ZodSafeParseResult<TCreateInput>;

        if (!validated.success) {
          await writeFailureLog("create", userId, validated.error);
          throw validated.error;
        }

        input = validated.data;
      }

      let created: TRecord;
      try {
        created = await repository.create(input);
      } catch (error) {
        await writeFailureLog("create", userId, error);
        throw error;
      }

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
      if (inputSchema) {
        const validated = validate(input) as ZodSafeParseResult<TUpdateInput>;

        if (!validated.success) {
          await writeFailureLog("update", userId, validated.error);
          throw validated.error;
        }

        input = validated.data;
      }

      let updated: TRecord;
      try {
        updated = await repository.update(id, input);
      } catch (error) {
        await writeFailureLog("update", userId, error);
        throw error;
      }

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
