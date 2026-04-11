import { InMemoryAuditLogger, type AuditLogger } from "our-lib";

const isUnitTestEnvironment = () => {
  return process.env.NODE_ENV === "test" || process.env.VITEST === "true";
};

export const createAppAuditLogger = (): AuditLogger => {
  if (isUnitTestEnvironment()) {
    return new InMemoryAuditLogger();
  }

  // Keep runtime logging behind a single app-level seam.
  // This can later switch to a DB-backed logger without touching service code.
  return new InMemoryAuditLogger();
};
