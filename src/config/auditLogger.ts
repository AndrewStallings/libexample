import { DbAuditLogger, InMemoryAuditLogger, type AuditLogger } from "our-lib";
import { getAppAuditLogDb } from "@/config/auditLogDb";

const isUnitTestEnvironment = () => {
  return process.env.NODE_ENV === "test" || process.env.VITEST === "true";
};

export const createAppAuditLogger = (): AuditLogger => {
  if (isUnitTestEnvironment()) {
    return new InMemoryAuditLogger();
  }

  return new DbAuditLogger(getAppAuditLogDb());
};
