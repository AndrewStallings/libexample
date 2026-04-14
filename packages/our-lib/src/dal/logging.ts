import type { AuditLogEntry, AuditLogger, Logger } from "./contracts";
import type { AuditLogRepository } from "./drizzle/auditLogRepository";

export class InMemoryLogger<TEntry> implements Logger<TEntry> {
  public readonly entries: TEntry[] = [];

  write = async (entry: TEntry): Promise<void> => {
    this.entries.push(entry);
  };
}

export class InMemoryAuditLogger extends InMemoryLogger<AuditLogEntry> implements AuditLogger {}

export class DbAuditLogger implements AuditLogger {
  constructor(private readonly repository: AuditLogRepository) {}

  write = async (entry: AuditLogEntry): Promise<void> => {
    await this.repository.insert({
      server: entry.server,
      shortNote: entry.shortNote,
      longNote: entry.longNote,
      time: entry.time,
      source: entry.source,
      category: entry.category,
      severity: entry.severity,
      route: entry.route,
      userId: entry.userId,
    });
  };
}
