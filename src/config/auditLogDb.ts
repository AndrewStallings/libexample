import type { AuditLogDb } from "our-lib";

type AuditLogRow = {
  auditLogId: number;
  server: string;
  shortNote: string;
  longNote?: string | null;
  time: Date;
  source: string;
  category: string;
  severity: string;
  route: string;
  userId: string;
};

const rows: AuditLogRow[] = [];
let nextAuditLogId = 1;

const appAuditLogDb: AuditLogDb = {
  insert: () => ({
    values: (values) => ({
      output: async () => {
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
    set: (values) => ({
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
};

export const getAppAuditLogDb = (): AuditLogDb => {
  return appAuditLogDb;
};

export const getAppAuditLogRows = (): AuditLogRow[] => {
  return [...rows];
};

export const resetAppAuditLogDb = () => {
  rows.length = 0;
  nextAuditLogId = 1;
};
