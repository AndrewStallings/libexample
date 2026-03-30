import { InMemoryAuditLogger } from "../dal/logging";

export const createCrudTestHarness = () => {
  return {
    logger: new InMemoryAuditLogger(),
  };
};
