import { describe, expect, it } from "vitest";
import { buildAuditEntry, InMemoryAuditLogger, InMemoryLogger } from "../logging";

describe("logging helpers", () => {
  it("stores generic entries in memory", async () => {
    const logger = new InMemoryLogger<{ message: string }>();
    const entry = { message: "workflow queued" };

    await logger.write(entry);

    expect(logger.entries).toEqual([entry]);
  });

  it("stores audit entries in memory", async () => {
    const logger = new InMemoryAuditLogger();

    await logger.write(
      buildAuditEntry({
        server: "local",
        shortNote: "audit written",
        source: "logging.test",
        category: "audit",
        route: "/audit",
        userId: "test-user",
      }),
    );

    expect(logger.entries).toHaveLength(1);
    expect(logger.entries[0]?.shortNote).toBe("audit written");
  });

  it("keeps the audit helper behavior intact", () => {
    const entry = buildAuditEntry({
      server: "local",
      shortNote: "audit created",
      source: "logging.test",
      category: "audit",
      route: "/audit",
      userId: "test-user",
    });

    expect(entry.severity).toBe("info");
    expect(entry.time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
