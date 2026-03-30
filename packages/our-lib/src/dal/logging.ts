import type { AuditLogEntry, AuditLogger, LogSeverity } from "./contracts";

export const buildAuditEntry = (
  partial: Omit<AuditLogEntry, "time" | "severity"> & { severity?: LogSeverity },
): AuditLogEntry => {
  return {
    ...partial,
    severity: partial.severity ?? "info",
    time: new Date().toISOString(),
  };
};

export class InMemoryAuditLogger implements AuditLogger {
  public readonly entries: AuditLogEntry[] = [];

  write = async (entry: AuditLogEntry): Promise<void> => {
    this.entries.push(entry);
  };
}
