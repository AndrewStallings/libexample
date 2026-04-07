import { createInMemoryTableRepository, InMemoryAuditLogger } from "our-lib";
import { initialSnacks } from "@/snacks/data/snackSeedData";
import { snackResource } from "@/snacks/models/resource";
import type { SnackInput, SnackRecord } from "@/snacks/models/schemas";

export const createSnackRepository = () => {
  return createInMemoryTableRepository<SnackRecord, SnackInput, "snackId">({
    initialItems: initialSnacks,
    idKey: "snackId",
    createId: (currentItems) => `SN-${7000 + currentItems.length + 1}`,
    getUpdatedBy: (input) => input.supplierName,
  });
};

export const createSnackDemoService = () => {
  return snackResource.createService(createSnackRepository(), new InMemoryAuditLogger());
};

export const getSnackById = (snackId: string): SnackRecord | undefined => {
  return initialSnacks.find((record) => record.snackId === snackId);
};
