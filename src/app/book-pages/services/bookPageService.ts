import { InMemoryBookPageRepository, initialBookPages, type BookPageRepository } from "@/book-pages/data/bookPageRepository";
import type { BookPageInput, BookPageRecord } from "@/book-pages/models/schemas";

const repository: BookPageRepository = new InMemoryBookPageRepository();

export type BookPageService = {
  repository: BookPageRepository;
};

export const createBookPageService = () => {
  return {
    repository,
  } satisfies BookPageService;
};

export const getBookPageById = (pageId: string): BookPageRecord | undefined => {
  return initialBookPages.find((record) => record.pageId === pageId);
};

export const getBookPagesByBookId = (bookId: string): BookPageRecord[] => {
  return initialBookPages.filter((record) => record.bookId === bookId);
};

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
