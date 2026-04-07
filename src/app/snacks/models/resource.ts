import { createResourceBuilder } from "our-lib";
import { loadSnackSupplierOptions } from "@/snacks/models/lookupData";
import { snackCategoryOptions, snackInputSchema, snackStatusOptions, type SnackInput, type SnackRecord } from "@/snacks/models/schemas";

const formatCurrency = (value: number) => {
  return `$${(value / 100).toFixed(2)}`;
};

export const snackResource = createResourceBuilder<SnackRecord, SnackInput>()
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
      shelfLocation: "",
      status: "draft",
      supplierName: "",
      notes: "",
    }),
  })
  .fields({
    cardFields: [
      { section: "Identity", label: "Snack", prominent: true, value: (record) => record.name },
      { section: "Identity", label: "Snack ID", value: (record) => record.snackId },
      { section: "Merchandising", label: "Category", value: (record) => record.category },
      { section: "Merchandising", label: "Shelf", value: (record) => record.shelfLocation },
      { section: "Inventory", label: "Price", value: (record) => formatCurrency(record.priceCents) },
      { section: "Inventory", label: "Stock", value: (record) => `${record.stockCount} units` },
      { section: "Inventory", label: "Status", value: (record) => record.status },
      { section: "Support", label: "Supplier", value: (record) => record.supplierName },
      { section: "Support", label: "Notes", value: (record) => record.notes },
    ],
    formFields: [
      { key: "name", label: "Snack Name", kind: "text" },
      { key: "category", label: "Category", kind: "select", options: [...snackCategoryOptions] },
      {
        key: "supplierName",
        label: "Supplier",
        kind: "async-combobox",
        loadOptions: loadSnackSupplierOptions,
        placeholder: "Search suppliers",
        description: "Shared lookup pattern for supplier-style fields.",
      },
      { key: "shelfLocation", label: "Shelf Location", kind: "text" },
      { key: "priceCents", label: "Price (Cents)", kind: "number" },
      { key: "stockCount", label: "Stock Count", kind: "number" },
      { key: "status", label: "Status", kind: "select", options: [...snackStatusOptions] },
      { key: "notes", label: "Notes", kind: "textarea", colSpan: 2 },
    ],
  })
  .build();
