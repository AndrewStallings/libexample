import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createInMemoryRecordRepository } from "../../testing/createInMemoryRecordRepository";
import { InMemoryAuditLogger } from "../../dal/logging";
import { createResourceBuilder } from "../createResourceBuilder";

const snackInputSchema = z
  .object({
    name: z.string().min(2, "Snack name is required"),
    category: z.enum(["chips", "fruit", "candy"]),
    priceCents: z.coerce.number().int().min(50),
    stockCount: z.coerce.number().int().min(0),
    supplierName: z.string().min(2),
    notes: z.string().min(8),
  })
  .superRefine((value, ctx) => {
    if (value.category === "fruit" && !value.notes.toLowerCase().includes("fresh")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["notes"],
        message: "Fruit snacks should mention freshness notes.",
      });
    }
  });

type SnackInput = z.infer<typeof snackInputSchema>;
type SnackRecord = SnackInput & {
  snackId: string;
  updatedAt: string;
  updatedBy: string;
};

const seededSnack: SnackRecord = {
  snackId: "SN-1001",
  name: "Sea Salt Popcorn",
  category: "chips",
  priceCents: 425,
  stockCount: 18,
  supplierName: "Northwind Snacks",
  notes: "Fresh restock for the late-afternoon rush.",
  updatedAt: "2026-04-01T12:00:00.000Z",
  updatedBy: "Northwind Snacks",
};

const snackResource = createResourceBuilder<SnackRecord, SnackInput>()
  .resource({
    entityName: "snack",
    route: "/snacks",
    inputSchema: snackInputSchema,
  })
  .record({
    getRecordId: (record) => record.snackId,
    getRecordLabel: (record) => record.name,
    getUpdatedAt: (record) => record.updatedAt,
    getUpdatedBy: (record) => record.updatedBy,
  })
  .defaults({
    createEmptyInput: () => ({
      name: "",
      category: "chips",
      priceCents: 250,
      stockCount: 0,
      supplierName: "",
      notes: "",
    }),
  })
  .fields({
    cardFields: [
      { section: "Identity", label: "Snack", prominent: true, value: (record) => record.name },
      { section: "Inventory", label: "Stock", value: (record) => String(record.stockCount) },
    ],
    formFields: [
      { key: "name", label: "Snack Name", kind: "text" },
      {
        key: "category",
        label: "Category",
        kind: "select",
        options: [
          { label: "Chips", value: "chips" },
          { label: "Fruit", value: "fruit" },
          { label: "Candy", value: "candy" },
        ],
      },
      { key: "priceCents", label: "Price", kind: "number" },
      { key: "stockCount", label: "Stock Count", kind: "number" },
      { key: "supplierName", label: "Supplier", kind: "text" },
      { key: "notes", label: "Notes", kind: "textarea" },
    ],
  })
  .build();

describe("createResourceBuilder", () => {
  it("creates a generated profile with default titles and automatic record-to-input mapping", () => {
    expect(snackResource.profile.getFormTitle("create")).toBe("Create Snack");
    expect(snackResource.profile.getFormTitle("edit", seededSnack)).toBe("Edit Sea Salt Popcorn");
    expect(snackResource.profile.getSubmitLabel("edit")).toBe("Save snack");
    expect(snackResource.navigation).toEqual({
      backHref: "/snacks",
      backLabel: "Back to snacks",
    });

    expect(snackResource.toInput()).toEqual({
      name: "",
      category: "chips",
      priceCents: 250,
      stockCount: 0,
      supplierName: "",
      notes: "",
    });

    expect(snackResource.toInput(seededSnack)).toEqual({
      name: "Sea Salt Popcorn",
      category: "chips",
      priceCents: 425,
      stockCount: 18,
      supplierName: "Northwind Snacks",
      notes: "Fresh restock for the late-afternoon rush.",
    });
  });

  it("creates a validated service with the default audit-log template", async () => {
    const repository = createInMemoryRecordRepository<SnackRecord, SnackInput, SnackInput>({
      initialItems: [seededSnack],
      getId: (record) => record.snackId,
      createRecord: (input, currentItems) => ({
        snackId: `SN-${1001 + currentItems.length}`,
        ...input,
        updatedAt: "2026-04-07T15:00:00.000Z",
        updatedBy: input.supplierName,
      }),
      updateRecord: (existing, input) => ({
        ...existing,
        ...input,
        updatedAt: "2026-04-07T16:00:00.000Z",
        updatedBy: input.supplierName,
      }),
    });
    const logger = new InMemoryAuditLogger();
    const service = snackResource.createService(repository, logger);

    const created = await service.create(
      {
        name: "Chili Lime Mango",
        category: "fruit",
        priceCents: 550,
        stockCount: 9,
        supplierName: "Fresh Cart",
        notes: "Fresh seasonal mango cups for spring pickup.",
      },
      "snack-user",
    );

    expect(created.snackId).toBe("SN-1002");
    expect(logger.entries[0]?.shortNote).toBe("snack created");
    expect(logger.entries[0]?.route).toBe("/snacks");
    expect(
      service.validate({
        name: "Chili Lime Mango",
        category: "fruit",
        priceCents: 550,
        stockCount: 9,
        supplierName: "Fresh Cart",
        notes: "Fresh seasonal mango cups for spring pickup.",
      }).success,
    ).toBe(true);

    await expect(
      service.create(
        {
          name: "X",
          category: "fruit",
          priceCents: 10,
          stockCount: 2,
          supplierName: "Fresh Cart",
          notes: "Needs work",
        },
        "snack-user",
      ),
    ).rejects.toThrowError();

    expect(
      service.validate({
        name: "X",
        category: "fruit",
        priceCents: 10,
        stockCount: 2,
        supplierName: "Fresh Cart",
        notes: "Needs work",
      }).success,
    ).toBe(false);
  });
});
