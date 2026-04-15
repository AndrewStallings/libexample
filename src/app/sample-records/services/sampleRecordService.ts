import "server-only";

import { createWorkflowService, InMemoryAuditLogger, type AuditLogEntry } from "our-lib";
import { createSampleRecordRepository } from "@/app/sample-records/data/sampleRecordRepository";
import { sampleRecordInputSchema } from "@/app/sample-records/models/schemas";
import type { SampleRecord, SampleRecordInput } from "@/app/sample-records/models/schemas";
import { createAppAuditLogger } from "@/config/auditLogger";

const isAttentionReadyRecord = (record: SampleRecord) => {
  return record.status === "active" && record.notes.toLowerCase().includes("active");
};

type SampleRecordServiceDependencies = {
  repository: ReturnType<typeof createSampleRecordRepository>;
  logger: ReturnType<typeof createAppAuditLogger>;
};

const createSampleRecordServiceDependencies = (): SampleRecordServiceDependencies => {
  return {
    repository: createSampleRecordRepository(),
    logger: createAppAuditLogger(),
  };
};

export const createSampleRecordService = (dependencies: SampleRecordServiceDependencies = createSampleRecordServiceDependencies()) => {
  const { repository, logger } = dependencies;
  const resource = createWorkflowService({
    entityName: "sampleRecord",
    repository,
    logger,
    route: "/sample-records",
    source: "sampleRecordService",
    getEntityId: (record) => record.sampleRecordId,
    inputSchema: sampleRecordInputSchema,
  });

  return {
    repository,
    resource,
    list: async () => (await repository.list()).items,
    getById: (sampleRecordId: string) => repository.getById(sampleRecordId),
    create: (input: SampleRecordInput) => resource.create(input, input.ownerName),
    update: (sampleRecordId: string, input: SampleRecordInput) => resource.update(sampleRecordId, input, input.ownerName),
    logging: {
      getEntries: (): AuditLogEntry[] => {
        if (logger instanceof InMemoryAuditLogger) {
          return [...logger.entries];
        }

        return [];
      },
    },
    getAttentionReadyRecordIds: async () => {
      return (await repository.list()).items.filter(isAttentionReadyRecord).map((record) => record.sampleRecordId);
    },
    toInput: (record?: SampleRecord): SampleRecordInput => {
      return {
        title: record?.title ?? "",
        groupName: record?.groupName ?? "",
        ownerName: record?.ownerName ?? "",
        status: record?.status ?? "active",
        notes: record?.notes ?? "",
      };
    },
  };
};

export type SampleRecordService = ReturnType<typeof createSampleRecordService>;

let sampleRecordService = createSampleRecordService();

export const listSampleRecords = async () => {
  return sampleRecordService.list();
};

export const getSampleRecordById = async (sampleRecordId: string) => {
  return sampleRecordService.getById(sampleRecordId);
};

export const createSampleRecord = async (input: SampleRecordInput) => {
  return sampleRecordService.create(input);
};

export const updateSampleRecord = async (sampleRecordId: string, input: SampleRecordInput) => {
  return sampleRecordService.update(sampleRecordId, input);
};

export const resetSampleRecordService = () => {
  sampleRecordService = createSampleRecordService();
};
