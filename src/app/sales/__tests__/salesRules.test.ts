import { describe, expect, it } from "vitest";
import { canViewSalesTracker, createSalesValidator, getSaleFieldVisibility, normalizeSaleInputForType } from "@/sales/logic/rules";

const baseSale = {
  bookId: "sb-01",
  reviewerId: "rv-01",
  channelId: "ch-01",
  saleType: "online" as const,
  quantity: 1,
  totalAmount: 10,
  saleDate: "2026-03-01",
  marketplace: "Website",
  orderId: "",
  storeLocation: "Should clear",
};

describe("salesRules", () => {
  it("clears hidden values when switching to online", () => {
    const normalized = normalizeSaleInputForType(baseSale);
    expect(normalized.storeLocation).toBe("Amazon");
  });

  it("returns correct field visibility", () => {
    expect(getSaleFieldVisibility("instore")).toEqual({
      showStoreLocation: true,
      showMarketplace: false,
      showOrderId: false,
    });
  });

  it("validates in-store vs online requirements", () => {
    const validate = createSalesValidator();
    const result = validate({
      ...baseSale,
      saleType: "instore",
      storeLocation: "",
      marketplace: "",
      orderId: "",
    });

    expect(result.success).toBe(false);
  });

  it("allows consumers to override validation rules", () => {
    const validate = createSalesValidator([
      (input, ctx) => {
        if (input.quantity > 5) {
          ctx.addIssue({
            code: "custom",
            path: ["quantity"],
            message: "Override quantity cap reached.",
          });
        }
      },
    ]);

    const result = validate({
      ...baseSale,
      quantity: 6,
    });

    expect(result.success).toBe(false);
  });

  it("only allows Sally to view the screen", () => {
    expect(canViewSalesTracker({ userId: "1", name: "Sally" })).toBe(true);
    expect(canViewSalesTracker({ userId: "2", name: "Morgan" })).toBe(false);
  });
});
