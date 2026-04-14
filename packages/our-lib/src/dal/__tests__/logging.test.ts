import { describe, expect, it } from "vitest";
import { DbAuditLogger, InMemoryAuditLogger, InMemoryLogger } from "../logging";

describe("logging helpers", () => {
  it("stores generic entries in memory", async () => {
    const logger = new InMemoryLogger<{ message: string }>();
    const entry = { message: "workflow queued" };

    await logger.write(entry);

    expect(logger.entries).toEqual([entry]);
  });

  it("stores audit entries in memory", async () => {
    const logger = new InMemoryAuditLogger();

    await logger.write({
      server: "local",
      shortNote: "audit written",
      source: "logging.test",
      category: "audit",
      route: "/audit",
      userId: "test-user",
      severity: "info",
      time: "2026-04-14T12:00:00.000Z",
    });

    expect(logger.entries).toHaveLength(1);
    expect(logger.entries[0]?.shortNote).toBe("audit written");
  });

  it("writes audit entries through the drizzle audit log repository", async () => {
    let insertedValues: unknown;

    const repository = {
      insert: async (values: unknown) => {
        insertedValues = values;
        return 101;
      },
      update: async () => 101,
    };

    const logger = new DbAuditLogger(repository);

    await logger.write({
      server: "sql-01",
      shortNote: "audit created",
      longNote: "Workflow WF-1001 completed",
      source: "logging.test",
      category: "audit",
      route: "/audit",
      userId: "test-user",
      severity: "info",
      time: "2026-04-14T12:30:00.000Z",
    });

    expect(insertedValues).toEqual(
      expect.objectContaining({
        server: "sql-01",
        shortNote: "audit created",
        time: "2026-04-14T12:30:00.000Z",
      }),
    );
  });
});
