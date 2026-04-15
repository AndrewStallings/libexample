import "server-only";

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

const repository = createSnackRepository();

export type SnackService = {
  repository: ReturnType<typeof createSnackRepository>;
  resource: ReturnType<typeof createSnackResourceService>;
  list: () => Promise<SnackRecord[]>;
  getById: (snackId: string) => Promise<SnackRecord | null>;
  create: (input: SnackInput) => Promise<SnackRecord>;
  update: (snackId: string, input: SnackInput) => Promise<SnackRecord>;
  validate: ReturnType<typeof createSnackResourceService>["validate"];
};

export const createSnackService = () => {
  const resource = createSnackResourceService();

  return {
    repository,
    resource,
    list: async () => (await repository.list()).items,
    getById: (snackId: string) => repository.getById(snackId),
    create: (input: SnackInput) => resource.create(input, input.supplierName || "snack-user"),
    update: (snackId: string, input: SnackInput) => resource.update(snackId, input, input.supplierName || "snack-user"),
    validate: resource.validate,
  } satisfies SnackService;
};

export const createSnackResourceService = () => {
  return snackResource.createService(repository, createAppAuditLogger());
};

const snackService = createSnackService();

export const listSnacks = async () => {
  return snackService.list();
};

export const getSnackById = async (snackId: string) => {
  return snackService.getById(snackId);
};

export const createSnack = async (input: SnackInput) => {
  return snackService.create(input);
};

export const updateSnack = async (snackId: string, input: SnackInput) => {
  return snackService.update(snackId, input);
};
