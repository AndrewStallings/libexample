import { eq } from "drizzle-orm";
import { auditLogTable } from "./schema/auditLog";

type AuditLogDbRow = {
  auditLogId: number;
  server: string;
  shortNote: string;
  longNote?: string | null | undefined;
  time: Date;
  source: string;
  category: string;
  severity: string;
  route: string;
  userId: string;
};

type AuditLogInsertRow = Omit<AuditLogDbRow, "auditLogId">;
export type AuditLogRow = AuditLogDbRow;

export type AuditLogDb = {
  insert: (table: any) => any;
  update: (table: any) => any;
};

export type InMemoryAuditLogDb = AuditLogDb & {
  getRows: () => AuditLogRow[];
  reset: () => void;
};

export type AuditLogWriteInput = Omit<AuditLogInsertRow, "auditLogId" | "time"> & {
  time?: string | Date;
};

export type AuditLogUpdateInput = Partial<Omit<AuditLogInsertRow, "auditLogId" | "time">> & {
  time?: string | Date;
};

const toAuditLogRow = (input: AuditLogWriteInput): AuditLogInsertRow => {
  return {
    ...input,
    time: input.time ? new Date(input.time) : new Date(),
  };
};

const toAuditLogUpdateRow = (input: AuditLogUpdateInput): Partial<AuditLogInsertRow> => {
  const { time, ...rest } = input;

  return {
    ...rest,
    ...(time ? { time: new Date(time) } : {}),
  };
};

export const insertAuditLog = async (db: AuditLogDb, input: AuditLogWriteInput): Promise<number> => {
  const row = toAuditLogRow(input);
  const [created] = await db.insert(auditLogTable).output({ auditLogId: auditLogTable.auditLogId }).values(row);

  if (!created) {
    throw new Error("Failed to insert audit log.");
  }

  return created.auditLogId;
};

export const updateAuditLog = async (db: AuditLogDb, auditLogId: number, input: AuditLogUpdateInput): Promise<number> => {
  const [updated] = await db
    .update(auditLogTable)
    .set(toAuditLogUpdateRow(input))
    .where(eq(auditLogTable.auditLogId, auditLogId))
    .output({ auditLogId: auditLogTable.auditLogId });

  if (!updated) {
    throw new Error(`Audit log ${auditLogId} was not found.`);
  }

  return updated.auditLogId;
};

export const createInMemoryAuditLogDb = (): InMemoryAuditLogDb => {
  const rows: AuditLogRow[] = [];
  let nextAuditLogId = 1;

  return {
    insert: () => ({
      output: () => ({
        values: async (values: AuditLogInsertRow) => {
          const row: AuditLogRow = {
            auditLogId: nextAuditLogId++,
            server: values.server,
            shortNote: values.shortNote,
            longNote: values.longNote ?? null,
            time: values.time,
            source: values.source,
            category: values.category,
            severity: values.severity,
            route: values.route,
            userId: values.userId,
          };

          rows.push(row);
          return [{ auditLogId: row.auditLogId }];
        },
      }),
    }),
    update: () => ({
      set: (values: Partial<AuditLogInsertRow>) => ({
        where: () => ({
          output: async () => {
            const currentRow = rows.at(-1);

            if (!currentRow) {
              return [];
            }

            Object.assign(currentRow, values);
            return [{ auditLogId: currentRow.auditLogId }];
          },
        }),
      }),
    }),
    getRows: () => [...rows],
    reset: () => {
      rows.length = 0;
      nextAuditLogId = 1;
    },
  };
};
