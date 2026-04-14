import { describe, expect, it } from "vitest";
import { InMemoryAuditLogger } from "our-lib";
import { initialSnacks } from "@/snacks/data/snackSeedData";
import { snackResource } from "@/snacks/models/resource";
import { createSnackRepository } from "@/snacks/services/snackService";

describe("snackResource", () => {
  it("maps seeded records into form input values", () => {
    expect(snackResource.toInput(initialSnacks[0])).toEqual({
      name: "Sea Salt Popcorn",
      category: "chips",
      priceCents: 425,
      stockCount: 18,
      shelfLocation: "Front Rail",
      status: "active",
      supplierName: "Northwind Snacks",
      notes: "Fresh restock for the late-afternoon student rush.",
    });
  });

  it("creates a validated service from the shared builder", async () => {
    const logger = new InMemoryAuditLogger();
    const service = snackResource.createService(createSnackRepository(), logger);

    const created = await service.create(
      {
        name: "Chili Citrus Trail Mix",
        category: "protein",
        priceCents: 525,
        stockCount: 14,
        shelfLocation: "Center Endcap",
        status: "active",
        supplierName: "Peak Protein Co.",
        notes: "Protein-heavy mix for commuter traffic near the front register.",
      },
      "snack-test-user",
    );

    expect(created.snackId).toBeTruthy();
    expect(logger.entries[0]?.shortNote).toBe("snack created");
    expect(logger.entries[0]?.userId).toBe("snack-test-user");
  });
});
