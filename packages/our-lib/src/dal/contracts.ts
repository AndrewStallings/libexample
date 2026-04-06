import type { EntityId } from "../types/index";

export type ListResult<TRecord> = {
  items: TRecord[];
  total: number;
};

export interface ResourceQueryService<TRecord> {
  list(): Promise<ListResult<TRecord>>;
  getById(id: EntityId): Promise<TRecord | null>;
}

export interface ResourceMutationService<TRecord, TCreateInput, TUpdateInput = TCreateInput> {
  create(input: TCreateInput, userId: string): Promise<TRecord>;
  update(id: EntityId, input: TUpdateInput, userId: string): Promise<TRecord>;
}

export interface ResourceService<TRecord, TCreateInput, TUpdateInput = TCreateInput>
  extends ResourceQueryService<TRecord>,
    ResourceMutationService<TRecord, TCreateInput, TUpdateInput> {}

export interface RecordRepository<TRecord, TCreateInput, TUpdateInput> {
  list(): Promise<ListResult<TRecord>>;
  getById(id: EntityId): Promise<TRecord | null>;
  create(input: TCreateInput): Promise<TRecord>;
  update(id: EntityId, input: TUpdateInput): Promise<TRecord>;
}

export type LogSeverity = "trace" | "info" | "warn" | "error";

export type AuditLogEntry = {
  server: string;
  shortNote: string;
  longNote?: string;
  time: string;
  source: string;
  category: string;
  severity: LogSeverity;
  route: string;
  userId: string;
};

export interface AuditLogger {
  write(entry: AuditLogEntry): Promise<void>;
}
