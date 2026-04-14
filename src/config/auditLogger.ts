import { DbAuditLogger, InMemoryAuditLogger, type AuditLogger, type AuditLogEntry } from "our-lib";

const isUnitTestEnvironment = () => {
  return process.env.NODE_ENV === "test" || process.env.VITEST === "true";
};

const isBrowserEnvironment = () => {
  return typeof window !== "undefined";
};

class ServerDbAuditLogger implements AuditLogger {
  private loggerPromise: Promise<AuditLogger> | null = null;

  private getLogger = async () => {
    this.loggerPromise ??= import("./appDb").then(({ getAppDb }) => {
      return new DbAuditLogger(getAppDb().auditLogs);
    });

    return this.loggerPromise;
  };

  write = async (entry: AuditLogEntry) => {
    const logger = await this.getLogger();
    await logger.write(entry);
  };
}

export const createAppAuditLogger = (): AuditLogger => {
  if (isUnitTestEnvironment() || isBrowserEnvironment()) {
    return new InMemoryAuditLogger();
  }

  return new ServerDbAuditLogger();
};
