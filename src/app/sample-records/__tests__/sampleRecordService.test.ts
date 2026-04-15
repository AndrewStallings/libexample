import { beforeEach, describe, expect, it } from "vitest";
import { createSampleRecordService, resetSampleRecordService } from "@/app/sample-records/services/sampleRecordService";

describe("createSampleRecordService", () => {
  beforeEach(() => {
    resetSampleRecordService();
  });

  it("creates a record and writes an audit log entry", async () => {
    const service = createSampleRecordService();

    const created = await service.resource.create(
      {
        title: "Escalation List",
        groupName: "Support",
        ownerName: "Jamie Hall",
        status: "active",
        notes: "Active follow-up item for the more advanced example.",
      },
      "sample-user",
    );

    const latestEntry = service.logging.getEntries().at(-1);

    expect(created.sampleRecordId).toBe("SR-300");
    expect(latestEntry?.shortNote).toBe("sampleRecord created");
    expect(latestEntry?.userId).toBe("sample-user");
  });

  it("returns only active records that are ready for attention", async () => {
    const service = createSampleRecordService();

    await expect(service.getAttentionReadyRecordIds()).resolves.toEqual(["SR-100"]);
  });
});
