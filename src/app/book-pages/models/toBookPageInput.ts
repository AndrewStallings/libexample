import type { BookPageInput, BookPageRecord } from "@/book-pages/models/schemas";

export const toBookPageInput = (bookId: string, record?: BookPageRecord): BookPageInput => {
  return {
    bookId,
    pageTitle: record?.pageTitle ?? "",
    pageNumber: record?.pageNumber ?? 1,
    chapterTitle: record?.chapterTitle ?? "",
    sectionName: record?.sectionName ?? "",
    status: record?.status ?? "draft",
    audience: record?.audience ?? "",
    editorId: record?.editorId ?? "e-01",
    editorName: record?.editorName ?? "Taylor Brooks",
    reviewerName: record?.reviewerName ?? "",
    wordCount: record?.wordCount ?? 0,
    readingTimeMinutes: record?.readingTimeMinutes ?? 0,
    illustrationCount: record?.illustrationCount ?? 0,
    componentCount: record?.componentCount ?? 0,
    locale: record?.locale ?? "en-US",
    seoTitle: record?.seoTitle ?? "",
    slug: record?.slug ?? "",
    lastReviewedAt: record?.lastReviewedAt ?? "2026-03-30",
    notes: record?.notes ?? "",
  };
};
