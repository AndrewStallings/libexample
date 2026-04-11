import { createInMemoryTableRepository } from "our-lib";
import { initialSnacks } from "@/snacks/data/snackSeedData";
import { snackResource } from "@/snacks/models/resource";
import type { SnackInput, SnackRecord } from "@/snacks/models/schemas";
import { createAppAuditLogger } from "@/config/auditLogger";

export const createSnackRepository = () => {
  return createInMemoryTableRepository<SnackRecord, SnackInput, "snackId">({
    initialItems: initialSnacks,
    idKey: "snackId",
    createId: (currentItems) => `SN-${7000 + currentItems.length + 1}`,
    getUpdatedBy: (input) => input.supplierName,
  });
};

const createSnackDemoStore = () => {
  const repository = createSnackRepository();

  return {
    repository,
    service: snackResource.createService(repository, createAppAuditLogger()),
  };
};

let snackDemoStore = createSnackDemoStore();

export const createSnackDemoService = () => {
  return snackDemoStore.service;
};

export const listSnacks = async (): Promise<SnackRecord[]> => {
  const result = await snackDemoStore.service.list();
  return result.items;
};

export const getSnackRecordById = async (snackId: string): Promise<SnackRecord | undefined> => {
  return (await snackDemoStore.service.getById(snackId)) ?? undefined;
};

export const resetSnackDemoStore = () => {
  snackDemoStore = createSnackDemoStore();
};

export const getSnackById = (snackId: string): SnackRecord | undefined => {
  return initialSnacks.find((record) => record.snackId === snackId);
};
