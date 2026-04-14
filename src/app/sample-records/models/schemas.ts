import { z } from "zod";
import { auditStampSchema } from "our-lib";

export const sampleRecordStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
] as const;

export const sampleRecordInputSchema = z.object({
  title: z.string().min(3, "Title is required"),
  groupName: z.string().min(2, "Group is required"),
  ownerName: z.string().min(2, "Owner is required"),
  status: z.enum(["active", "paused", "archived"]),
  notes: z.string().min(8, "Notes should give a little more context"),
});

export const sampleRecordSchema = z.object({
  sampleRecordId: z.string(),
  ...sampleRecordInputSchema.shape,
  ...auditStampSchema.shape,
});

export type SampleRecordInput = z.infer<typeof sampleRecordInputSchema>;
export type SampleRecord = z.infer<typeof sampleRecordSchema>;
