import { z } from "zod";
import { auditStampSchema } from "our-lib";

export const bookPageStatusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Ready", value: "ready" },
  { label: "Published", value: "published" },
] as const;

export const bookPageRecordSchema = z.object({
  pageId: z.string(),
  bookId: z.string(),
  pageTitle: z.string(),
  pageNumber: z.number().int().min(1),
  chapterTitle: z.string(),
  sectionName: z.string(),
  status: z.enum(["draft", "ready", "published"]),
  audience: z.string(),
  editorId: z.string(),
  editorName: z.string(),
  reviewerName: z.string(),
  wordCount: z.number().int().min(0),
  readingTimeMinutes: z.number().int().min(0),
  illustrationCount: z.number().int().min(0),
  componentCount: z.number().int().min(0),
  locale: z.string(),
  seoTitle: z.string(),
  slug: z.string(),
  lastReviewedAt: z.string(),
  notes: z.string(),
  ...auditStampSchema.shape,
});

export const bookPageInputSchema = z.object({
  bookId: z.string().min(1),
  pageTitle: z.string().min(3, "Page title is required"),
  pageNumber: z.coerce.number().int().min(1, "Page number must be at least 1"),
  chapterTitle: z.string().min(2, "Chapter title is required"),
  sectionName: z.string().min(2, "Section name is required"),
  status: z.enum(["draft", "ready", "published"]),
  audience: z.string().min(2, "Audience is required"),
  editorId: z.string().min(1, "Editor is required"),
  editorName: z.string().min(1, "Editor name is required"),
  reviewerName: z.string().min(2, "Reviewer name is required"),
  wordCount: z.coerce.number().int().min(0),
  readingTimeMinutes: z.coerce.number().int().min(0),
  illustrationCount: z.coerce.number().int().min(0),
  componentCount: z.coerce.number().int().min(0),
  locale: z.string().min(2, "Locale is required"),
  seoTitle: z.string().min(3, "SEO title is required"),
  slug: z.string().min(3, "Slug is required"),
  lastReviewedAt: z.string().min(1, "Last reviewed date is required"),
  notes: z.string().min(8, "Notes should explain the page"),
});

export type BookPageRecord = z.infer<typeof bookPageRecordSchema>;
export type BookPageInput = z.infer<typeof bookPageInputSchema>;
