import { describe, expect, it } from "vitest";
import { insertAuditLog, updateAuditLog } from "../auditLogRepository";
import { auditLogTable } from "../schema/auditLog";

describe("auditLogRepository", () => {
  it("inserts an audit log and returns the generated id", async () => {
    let insertedTable: unknown;
    let insertedRow: unknown;

    const db = {
      insert: (table: typeof auditLogTable) => {
        insertedTable = table;

        return {
          values: (row: unknown) => {
            insertedRow = row;

            return {
              output: async () => [{ auditLogId: 1001 }],
            };
          },
        };
      },
      update: () => {
        throw new Error("update should not be called in this test");
      },
    };

    const auditLogId = await insertAuditLog(db, {
      server: "local",
      shortNote: "book created",
      longNote: "Book B-1001 was created",
      source: "bookService",
      category: "book",
      severity: "info",
      route: "/books",
      userId: "demo-user",
      time: "2026-04-09T12:00:00.000Z",
    });

    expect(auditLogId).toBe(1001);
    expect(insertedTable).toBe(auditLogTable);
    expect(insertedRow).toEqual(
      expect.objectContaining({
        shortNote: "book created",
        time: new Date("2026-04-09T12:00:00.000Z"),
      }),
    );
  });

  it("updates an audit log and returns the id", async () => {
    let updatedValues: unknown;

    const db = {
      insert: () => {
        throw new Error("insert should not be called in this test");
      },
      update: (table: typeof auditLogTable) => {
        expect(table).toBe(auditLogTable);

        return {
          set: (values: unknown) => {
            updatedValues = values;

            return {
              where: () => ({
                output: async () => [{ auditLogId: 1002 }],
              }),
            };
          },
        };
      },
    };

    const auditLogId = await updateAuditLog(db, 1002, {
      shortNote: "book updated",
      severity: "warn",
      time: "2026-04-09T12:15:00.000Z",
    });

    expect(auditLogId).toBe(1002);
    expect(updatedValues).toEqual({
      shortNote: "book updated",
      severity: "warn",
      time: new Date("2026-04-09T12:15:00.000Z"),
    });
  });
});
