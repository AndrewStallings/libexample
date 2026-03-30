import { z } from "zod";

export const reviewStatusOptions = [
  { label: "Open", value: "open" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

export const reviewRatingOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
] as const;

export const reviewRecordSchema = z.object({
  reviewId: z.string(),
  subject: z.string(),
  reviewerId: z.string(),
  reviewerName: z.string(),
  reviewTypeId: z.string(),
  reviewTypeName: z.string(),
  rating: z.number().min(1).max(5),
  status: z.enum(["open", "approved", "rejected"]),
  summary: z.string(),
  updatedAt: z.string(),
});

export const reviewInputSchema = z
  .object({
    subject: z.string().min(3, "Subject is required"),
    reviewerId: z.string().min(1, "Reviewer is required"),
    reviewTypeId: z.string().min(1, "Review type is required"),
    rating: z.coerce.number().min(1).max(5),
    status: z.enum(["open", "approved", "rejected"]),
    summary: z.string().min(8, "Summary should explain the review"),
  })
  .superRefine((value, ctx) => {
    if (value.status === "approved" && value.rating < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "Approved reviews should have a rating of at least 3.",
      });
    }
  });

export type ReviewRecord = z.infer<typeof reviewRecordSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
