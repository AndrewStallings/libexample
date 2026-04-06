import { describe, expect, it } from "vitest";
import { InMemoryAuditLogger } from "our-lib";
import { InMemorySalesRepository } from "@/sales/data/salesRepository";
import { createSalesService } from "@/sales/services/salesService";
import { createSaleInput } from "@/testing/fixtures/sales";

const baseInput = createSaleInput();

describe("salesService", () => {
  it("creates and imports sales without a real database", async () => {
    const repository = new InMemorySalesRepository();
    const logger = new InMemoryAuditLogger();
    const service = createSalesService(repository, logger);

    const created = await service.create(baseInput, "Sally");
    const imported = await service.importBatch([baseInput], "Sally");

    expect(created.saleId).toBeTruthy();
    expect(imported).toHaveLength(1);
    expect(logger.entries[0]?.shortNote).toBe("sale created");
  });

  it("creates revisions on edit and restore", async () => {
    const repository = new InMemorySalesRepository();
    const logger = new InMemoryAuditLogger();
    const service = createSalesService(repository, logger);

    await service.update("SL-3001", { ...baseInput, quantity: 5 }, "Sally");
    let revisions = await service.listRevisions("SL-3001");
    expect(revisions[0]?.action).toBe("edit");

    await service.restoreRevision("SL-3001", revisions[0]!.revisionId, "Sally");
    revisions = await service.listRevisions("SL-3001");
    expect(revisions[0]?.action).toBe("restore");
  });

  it("deletes the last reviewer sale and cascades reviewer removal", async () => {
    const repository = new InMemorySalesRepository();
    const logger = new InMemoryAuditLogger();
    const service = createSalesService(repository, logger);

    await service.delete("SL-3009", "cleanup one", "Sally");
    const result = await service.delete("SL-3010", "cleanup two", "Sally");
    const reviewers = await service.listReviewers();

    expect(result.deletedReviewerId).toBe("rv-04");
    expect(reviewers.some((item) => item.reviewerId === "rv-04")).toBe(false);
  });

  it("stores delete reasons", async () => {
    const repository = new InMemorySalesRepository();
    const logger = new InMemoryAuditLogger();
    const service = createSalesService(repository, logger);

    await service.delete("SL-3001", "bad active row design", "Sally");
    const deleteReasons = await service.listDeleteReasons();

    expect(deleteReasons[0]?.reason).toBe("bad active row design");
  });
});
