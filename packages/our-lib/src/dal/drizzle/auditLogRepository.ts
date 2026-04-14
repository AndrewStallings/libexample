import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";
import { auditLogTable } from "./schema/auditLog";

type AuditLogInsertRow = InferInsertModel<typeof auditLogTable>;

export type AuditLogDb = {
  insert: (table: typeof auditLogTable) => {
    values: (values: AuditLogInsertRow) => {
      output: (selection: unknown) => Promise<Array<{ auditLogId: number }>>;
    };
  };
  update: (table: typeof auditLogTable) => {
    set: (values: Partial<AuditLogInsertRow>) => {
      where: (condition: ReturnType<typeof eq>) => {
        output: (selection: unknown) => Promise<Array<{ auditLogId: number }>>;
      };
    };
  };
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
  const [created] = await db.insert(auditLogTable).values(row).output({ auditLogId: auditLogTable.auditLogId });

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
