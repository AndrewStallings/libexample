import { describe, expect, it } from "vitest";
import { createInMemoryTableRepository } from "../createInMemoryTableRepository";

type SnackInput = {
  name: string;
  supplierName: string;
  stockCount: number;
};

type SnackRecord = SnackInput & {
  snackId: string;
  updatedAt: string;
  updatedBy: string;
};

describe("createInMemoryTableRepository", () => {
  it("creates and updates a simple table-shaped record with default stamping", async () => {
    const repository = createInMemoryTableRepository<SnackRecord, SnackInput, "snackId">({
      initialItems: [
        {
          snackId: "SN-1001",
          name: "Sea Salt Popcorn",
          supplierName: "Northwind Snacks",
          stockCount: 12,
          updatedAt: "2026-04-01T12:00:00.000Z",
          updatedBy: "Northwind Snacks",
        },
      ],
      idKey: "snackId",
      createId: (currentItems) => `SN-${1000 + currentItems.length + 1}`,
      getUpdatedBy: (input) => input.supplierName,
    });

    const created = await repository.create({
      name: "Chili Lime Chips",
      supplierName: "Fresh Cart",
      stockCount: 8,
    });

    expect(created.snackId).toBe("SN-1002");
    expect(created.updatedBy).toBe("Fresh Cart");

    const list = await repository.list();
    expect(list.items[0]?.snackId).toBe("SN-1002");

    const updated = await repository.update("SN-1001", {
      name: "Sea Salt Popcorn Large",
      supplierName: "Northwind Snacks",
      stockCount: 15,
    });

    expect(updated.name).toBe("Sea Salt Popcorn Large");
    expect(updated.updatedBy).toBe("Northwind Snacks");
  });
});
