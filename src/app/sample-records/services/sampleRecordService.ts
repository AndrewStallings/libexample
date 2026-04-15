import { createWorkflowService, InMemoryAuditLogger, type AuditLogEntry } from "our-lib";
import { createSampleRecordRepository } from "@/app/sample-records/data/sampleRecordRepository";
import { sampleRecordInputSchema } from "@/app/sample-records/models/schemas";
import type { SampleRecord, SampleRecordInput } from "@/app/sample-records/models/schemas";

const isAttentionReadyRecord = (record: SampleRecord) => {
  return record.status === "active" && record.notes.toLowerCase().includes("active");
};

let repository = createSampleRecordRepository();
let logger = new InMemoryAuditLogger();

export const createSampleRecordService = () => {
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
    logging: {
      getEntries: (): AuditLogEntry[] => [...logger.entries],
    },
    getAttentionReadyRecordIds: async () => {
      const result = await repository.list();

      return result.items.filter(isAttentionReadyRecord).map((record) => record.sampleRecordId);
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

export const getSampleRecordById = async (sampleRecordId: string) => {
  return repository.getById(sampleRecordId);
};

export const resetSampleRecordService = () => {
  repository = createSampleRecordRepository();
  logger = new InMemoryAuditLogger();
};
