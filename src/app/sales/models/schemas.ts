import { z } from "zod";

export const saleRecordSchema = z.object({
  saleId: z.string(),
  bookId: z.string(),
  bookTitle: z.string(),
  reviewerId: z.string(),
  reviewerName: z.string(),
  channelId: z.string(),
  channelName: z.string(),
  saleType: z.enum(["instore", "online"]),
  quantity: z.number().int().min(1),
  totalAmount: z.number().min(0),
  saleDate: z.string(),
  storeLocation: z.string().optional(),
  marketplace: z.string().optional(),
  orderId: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedBy: z.string(),
  updatedAt: z.string(),
});

export const saleInputSchema = z.object({
  bookId: z.string().min(1, "Book is required"),
  reviewerId: z.string().min(1, "Reviewer is required"),
  channelId: z.string().min(1, "Channel is required"),
  saleType: z.enum(["instore", "online"]),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  totalAmount: z.coerce.number().min(0, "Amount must be 0 or greater"),
  saleDate: z.string().min(1, "Sale date is required"),
  storeLocation: z.string().optional(),
  marketplace: z.string().optional(),
  orderId: z.string().optional(),
});

export type SaleRecord = z.infer<typeof saleRecordSchema>;
export type SaleInput = z.infer<typeof saleInputSchema>;

export type SaleRevision = {
  revisionId: string;
  saleId: string;
  action: "edit" | "restore";
  changedAt: string;
  changedBy: string;
  snapshot: SaleRecord;
};

export type SaleDeleteReason = {
  deleteReasonId: string;
  oldSaleId: string;
  reason: string;
  deletedAt: string;
  deletedBy: string;
};

export type SalesUser = {
  userId: string;
  name: string;
};
