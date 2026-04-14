import type { AuditLogEntry, AuditLogger, Logger, LogSeverity } from "./contracts";

export const buildAuditEntry = (
  partial: Omit<AuditLogEntry, "time" | "severity"> & { severity?: LogSeverity },
): AuditLogEntry => {
  return {
    ...partial,
    severity: partial.severity ?? "info",
    time: new Date().toISOString(),
  };
};

export class InMemoryLogger<TEntry> implements Logger<TEntry> {
  public readonly entries: TEntry[] = [];

  write = async (entry: TEntry): Promise<void> => {
    this.entries.push(entry);
  };
}

export class InMemoryAuditLogger extends InMemoryLogger<AuditLogEntry> implements AuditLogger {}
