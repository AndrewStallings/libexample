import "server-only";

import { DbAuditLogger, type AuditLogger } from "our-lib";
import { getAppDb } from "@/config/appDb";
import { createInMemoryAuditLogger } from "@/config/inMemoryAuditLogger";

const shouldUseDbAuditLogger = () => {
  return process.env.NODE_ENV === "production";
};

export const createAppAuditLogger = (): AuditLogger => {
  if (!shouldUseDbAuditLogger()) {
    return createInMemoryAuditLogger();
  }

  return new DbAuditLogger(getAppDb().auditLogs);
};
