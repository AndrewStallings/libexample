import { z } from "zod";
import { auditStampSchema } from "our-lib";

export const bookStatusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
] as const;

export const bookRecordSchema = z.object({
  bookId: z.string(),
  title: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  ownerId: z.string(),
  ownerName: z.string(),
  notes: z.string(),
  ...auditStampSchema.shape,
});

export const bookInputSchema = z
  .object({
    title: z.string().min(2, "Title is required"),
    status: z.enum(["draft", "published", "archived"]),
    ownerId: z.string().min(1, "Owner is required"),
    ownerName: z.string().min(1, "Owner name is required"),
    notes: z.string().min(5, "Notes should explain the record"),
  })
  .superRefine((value, ctx) => {
    if (value.status === "archived" && !value.notes.toLowerCase().includes("archive")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["notes"],
        message: "Archived items should explain why they were archived.",
      });
    }
  });

export type BookRecord = z.infer<typeof bookRecordSchema>;
export type BookInput = z.infer<typeof bookInputSchema>;
