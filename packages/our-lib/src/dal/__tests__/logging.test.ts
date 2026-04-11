import { describe, expect, it } from "vitest";
import { buildAuditEntry, buildLogEntry, createLogger, createMappedLogger, InMemoryLogger } from "../logging";

type WorkflowLogEntry = {
  workflowId: string;
  message: string;
  time: string;
  severity: "trace" | "info" | "warn" | "error";
  context?: string;
};

describe("logging helpers", () => {
  it("builds generic log entries with default metadata", () => {
    const entry = buildLogEntry<WorkflowLogEntry>({
      workflowId: "WF-1001",
      message: "workflow started",
    });

    expect(entry.workflowId).toBe("WF-1001");
    expect(entry.message).toBe("workflow started");
    expect(entry.severity).toBe("info");
    expect(entry.time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("stores generic entries in memory", async () => {
    const logger = new InMemoryLogger<WorkflowLogEntry>();
    const entry = buildLogEntry<WorkflowLogEntry>({
      workflowId: "WF-1002",
      message: "workflow queued",
      severity: "warn",
    });

    await logger.write(entry);

    expect(logger.entries).toEqual([entry]);
  });

  it("maps app-level log entries into table rows", async () => {
    const insertedRows: Array<{
      workflowId: string;
      shortNote: string;
      severity: string;
      createdAt: string;
    }> = [];

    const logger = createMappedLogger<WorkflowLogEntry, (typeof insertedRows)[number]>(
      (entry) => ({
        workflowId: entry.workflowId,
        shortNote: entry.message,
        severity: entry.severity,
        createdAt: entry.time,
      }),
      (row) => {
        insertedRows.push(row);
      },
    );

    await logger.write(
      buildLogEntry<WorkflowLogEntry>({
        workflowId: "WF-1003",
        message: "workflow completed",
      }),
    );

    expect(insertedRows).toEqual([
      expect.objectContaining({
        workflowId: "WF-1003",
        shortNote: "workflow completed",
        severity: "info",
      }),
    ]);
  });

  it("supports direct writer functions for simple logging tables", async () => {
    const messages: string[] = [];
    const logger = createLogger<WorkflowLogEntry>((entry) => {
      messages.push(`${entry.workflowId}:${entry.message}`);
    });

    await logger.write(
      buildLogEntry<WorkflowLogEntry>({
        workflowId: "WF-1004",
        message: "workflow retried",
        severity: "error",
      }),
    );

    expect(messages).toEqual(["WF-1004:workflow retried"]);
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
