import { ZodIssueCode, type RefinementCtx } from "zod";
import { saleInputSchema, type SaleInput, type SalesUser } from "@/sales/models/schemas";

export type SalesValidationOverride = (input: SaleInput, ctx: RefinementCtx) => void;

export const normalizeSaleInputForType = (input: SaleInput): SaleInput => {
  if (input.saleType === "instore") {
    return {
      ...input,
      marketplace: "",
      orderId: "",
    };
  }

  return {
    ...input,
    storeLocation: "",
  };
};

export const getSaleFieldVisibility = (saleType: SaleInput["saleType"]) => {
  return {
    showStoreLocation: saleType === "instore",
    showMarketplace: saleType === "online",
    showOrderId: saleType === "online",
  };
};

export const createSalesValidator = (overrides: SalesValidationOverride[] = []) => {
  return (input: SaleInput) => {
    const normalized = normalizeSaleInputForType(input);

    return saleInputSchema.superRefine((value, ctx) => {
      if (value.saleType === "instore" && !value.storeLocation?.trim()) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["storeLocation"],
          message: "In-store sales require a store location.",
        });
      }

      if (value.saleType === "online" && !value.marketplace?.trim() && !value.orderId?.trim()) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["marketplace"],
          message: "Online sales require a marketplace or order ID.",
        });
      }

      overrides.forEach((override) => override(value, ctx));
    }).safeParse(normalized);
  };
};

export const defaultSalesValidator = createSalesValidator();

export const canViewSalesTracker = (user: SalesUser) => {
  return user.name === "Sally";
};
