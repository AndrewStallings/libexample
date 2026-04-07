import type { SnackRecord } from "@/snacks/models/schemas";

export const initialSnacks: SnackRecord[] = [
  {
    snackId: "SN-7001",
    name: "Sea Salt Popcorn",
    category: "chips",
    priceCents: 425,
    stockCount: 18,
    shelfLocation: "Front Rail",
    status: "active",
    supplierName: "Northwind Snacks",
    notes: "Fresh restock for the late-afternoon student rush.",
    updatedAt: "2026-04-02T09:30:00.000Z",
    updatedBy: "Northwind Snacks",
  },
  {
    snackId: "SN-7002",
    name: "Honey Citrus Trail Mix",
    category: "protein",
    priceCents: 575,
    stockCount: 9,
    shelfLocation: "Cooler Endcap",
    status: "seasonal",
    supplierName: "Peak Protein Co.",
    notes: "Spring season mix with citrus clusters for the cooler display.",
    updatedAt: "2026-04-04T15:10:00.000Z",
    updatedBy: "Peak Protein Co.",
  },
];
