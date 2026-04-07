import { InMemoryAuditLogger } from "our-lib";
import { createSnackRepository, initialSnacks } from "@/snacks/data/snackRepository";
import { snackResource } from "@/snacks/models/resource";
import type { SnackRecord } from "@/snacks/models/schemas";

export const createSnackDemoService = () => {
  return snackResource.createService(createSnackRepository(), new InMemoryAuditLogger());
};

export const getSnackById = (snackId: string): SnackRecord | undefined => {
  return initialSnacks.find((record) => record.snackId === snackId);
};
