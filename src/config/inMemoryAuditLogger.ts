import { InMemoryAuditLogger, type AuditLogger } from "our-lib";

export const createInMemoryAuditLogger = (): AuditLogger => {
  return new InMemoryAuditLogger();
};
