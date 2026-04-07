import { z } from "zod";
import { auditStampSchema } from "our-lib";

export const snackCategoryOptions = [
  { label: "Chips", value: "chips" },
  { label: "Fruit", value: "fruit" },
  { label: "Candy", value: "candy" },
  { label: "Protein", value: "protein" },
] as const;

export const snackStatusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Seasonal", value: "seasonal" },
  { label: "Paused", value: "paused" },
] as const;

export const snackRecordSchema = z.object({
  snackId: z.string(),
  name: z.string(),
  category: z.enum(["chips", "fruit", "candy", "protein"]),
  priceCents: z.number().int().min(50),
  stockCount: z.number().int().min(0),
  shelfLocation: z.string(),
  status: z.enum(["draft", "active", "seasonal", "paused"]),
  supplierName: z.string(),
  notes: z.string(),
  ...auditStampSchema.shape,
});

export const snackInputSchema = z
  .object({
    name: z.string().min(2, "Snack name is required"),
    category: z.enum(["chips", "fruit", "candy", "protein"]),
    priceCents: z.coerce.number().int().min(50, "Price should be at least 50 cents"),
    stockCount: z.coerce.number().int().min(0, "Stock count cannot be negative"),
    shelfLocation: z.string().min(2, "Shelf location is required"),
    status: z.enum(["draft", "active", "seasonal", "paused"]),
    supplierName: z.string().min(2, "Supplier is required"),
    notes: z.string().min(8, "Notes should explain the snack"),
  })
  .superRefine((value, ctx) => {
    if (value.status === "seasonal" && !value.notes.toLowerCase().includes("season")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["notes"],
        message: "Seasonal snacks should explain the season or promotion.",
      });
    }
  });

export type SnackRecord = z.infer<typeof snackRecordSchema>;
export type SnackInput = z.infer<typeof snackInputSchema>;
