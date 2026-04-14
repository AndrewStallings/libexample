import { createInMemoryTableRepository } from "our-lib";
import { initialSnacks } from "@/snacks/data/snackSeedData";
import type { SnackInput, SnackRecord } from "@/snacks/models/schemas";

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
};

export const createSnackService = () => {
  return {
    repository,
  } satisfies SnackService;
};

export const getSnackById = (snackId: string): SnackRecord | undefined => {
  return initialSnacks.find((record) => record.snackId === snackId);
};
