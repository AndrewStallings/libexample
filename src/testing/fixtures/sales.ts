import type { SaleInput } from "@/sales/models/schemas";

export const createSaleInput = (overrides: Partial<SaleInput> = {}): SaleInput => {
  return {
    bookId: "sb-01",
    reviewerId: "rv-01",
    channelId: "ch-01",
    saleType: "online",
    quantity: 2,
    totalAmount: 49.98,
    saleDate: "2026-03-20",
    marketplace: "Website",
    orderId: "ORD-5000",
    storeLocation: "",
    ...overrides,
  };
};
