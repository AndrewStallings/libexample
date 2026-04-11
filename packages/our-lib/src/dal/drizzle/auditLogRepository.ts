import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";
import { auditLogTable } from "./schema/auditLog";

type AuditLogInsertRow = InferInsertModel<typeof auditLogTable>;

type AuditLogDb = {
  insert: (table: typeof auditLogTable) => {
    values: (values: AuditLogInsertRow) => {
      returning: (selection: unknown) => Promise<Array<{ auditLogId: string }>>;
    };
  };
  update: (table: typeof auditLogTable) => {
    set: (values: Partial<AuditLogInsertRow>) => {
      where: (condition: ReturnType<typeof eq>) => {
        returning: (selection: unknown) => Promise<Array<{ auditLogId: string }>>;
      };
    };
  };
};

export type AuditLogWriteInput = Omit<AuditLogInsertRow, "auditLogId" | "time"> & {
  auditLogId?: string;
  time?: string | Date;
};

export type AuditLogUpdateInput = Partial<Omit<AuditLogInsertRow, "auditLogId" | "time">> & {
  time?: string | Date;
};

const toAuditLogRow = (input: AuditLogWriteInput): AuditLogInsertRow => {
  return {
    ...input,
    auditLogId: input.auditLogId ?? crypto.randomUUID(),
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

export const insertAuditLog = async (db: AuditLogDb, input: AuditLogWriteInput): Promise<string> => {
  const row = toAuditLogRow(input);
  const [created] = await db.insert(auditLogTable).values(row).returning({ auditLogId: auditLogTable.auditLogId });

  if (!created) {
    throw new Error("Failed to insert audit log.");
  }

  return created.auditLogId;
};

export const updateAuditLog = async (db: AuditLogDb, auditLogId: string, input: AuditLogUpdateInput): Promise<string> => {
  const [updated] = await db
    .update(auditLogTable)
    .set(toAuditLogUpdateRow(input))
    .where(eq(auditLogTable.auditLogId, auditLogId))
    .returning({ auditLogId: auditLogTable.auditLogId });

  if (!updated) {
    throw new Error(`Audit log ${auditLogId} was not found.`);
  }

  return updated.auditLogId;
};
