import { z } from "zod";

export const auditStampSchema = z.object({
  updatedAt: z.string(),
  updatedBy: z.string(),
});
