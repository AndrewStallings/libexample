import type { AuditLogEntry, AuditLogger, LogEntryBase, Logger, LogSeverity } from "./contracts";

export const buildAuditEntry = (
  partial: Omit<AuditLogEntry, "time" | "severity"> & { severity?: LogSeverity },
): AuditLogEntry => {
  return {
    ...partial,
    severity: partial.severity ?? "info",
    time: new Date().toISOString(),
  };
};

export const buildLogEntry = <TEntry extends LogEntryBase>(
  partial: Omit<TEntry, keyof LogEntryBase> & Partial<Pick<LogEntryBase, "time" | "severity">>,
): TEntry => {
  return {
    ...partial,
    severity: partial.severity ?? "info",
    time: partial.time ?? new Date().toISOString(),
  } as TEntry;
};

export class InMemoryLogger<TEntry> implements Logger<TEntry> {
  public readonly entries: TEntry[] = [];

  write = async (entry: TEntry): Promise<void> => {
    this.entries.push(entry);
  };
}

export const createLogger = <TEntry>(writeEntry: (entry: TEntry) => Promise<void> | void): Logger<TEntry> => {
  return {
    write: async (entry: TEntry) => {
      await writeEntry(entry);
    },
  };
};

export const createMappedLogger = <TEntry, TMappedEntry>(
  mapEntry: (entry: TEntry) => TMappedEntry,
  writeEntry: (entry: TMappedEntry) => Promise<void> | void,
): Logger<TEntry> => {
  return createLogger(async (entry) => {
    await writeEntry(mapEntry(entry));
  });
};

export class InMemoryAuditLogger extends InMemoryLogger<AuditLogEntry> implements AuditLogger {}

export class MappedAuditLogger implements AuditLogger {
  constructor(private readonly logger: Logger<AuditLogEntry>) {}

  write = async (entry: AuditLogEntry): Promise<void> => {
    await this.logger.write(entry);
  };
}
