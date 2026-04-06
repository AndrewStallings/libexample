import type { EntityId, ListResult, RecordRepository } from "our-lib";
import type { BookPageInput, BookPageRecord } from "@/book-pages/models/schemas";

export const initialBookPages: BookPageRecord[] = [
  {
    pageId: "PG-4001",
    bookId: "BK-1001",
    pageTitle: "Authentication Overview",
    pageNumber: 12,
    chapterTitle: "Platform Foundations",
    sectionName: "Identity",
    status: "published",
    audience: "Engineers",
    editorId: "e-01",
    editorName: "Taylor Brooks",
    reviewerName: "Alex Carter",
    wordCount: 1420,
    readingTimeMinutes: 6,
    illustrationCount: 2,
    componentCount: 4,
    locale: "en-US",
    seoTitle: "Authentication Overview for Platform Standards",
    slug: "authentication-overview",
    lastReviewedAt: "2026-03-12",
    notes: "Primary intro page for authentication guidance and platform expectations.",
    updatedAt: "2026-03-21T14:20:00.000Z",
    updatedBy: "Taylor Brooks",
  },
  {
    pageId: "PG-4002",
    bookId: "BK-1001",
    pageTitle: "Token Rotation Checklist",
    pageNumber: 28,
    chapterTitle: "Security Operations",
    sectionName: "Tokens",
    status: "ready",
    audience: "Platform Ops",
    editorId: "e-04",
    editorName: "Sally Grant",
    reviewerName: "Morgan Lee",
    wordCount: 980,
    readingTimeMinutes: 4,
    illustrationCount: 1,
    componentCount: 3,
    locale: "en-US",
    seoTitle: "Token Rotation Checklist",
    slug: "token-rotation-checklist",
    lastReviewedAt: "2026-03-25",
    notes: "Operational checklist for rotating tokens in shared environments.",
    updatedAt: "2026-03-26T09:15:00.000Z",
    updatedBy: "Sally Grant",
  },
  {
    pageId: "PG-4003",
    bookId: "BK-1002",
    pageTitle: "Archive Cutover Plan",
    pageNumber: 7,
    chapterTitle: "Rollout",
    sectionName: "Cutover",
    status: "draft",
    audience: "Project Leads",
    editorId: "e-03",
    editorName: "Priya Shah",
    reviewerName: "Jamie Patel",
    wordCount: 1675,
    readingTimeMinutes: 7,
    illustrationCount: 3,
    componentCount: 6,
    locale: "en-US",
    seoTitle: "Archive Cutover Plan",
    slug: "archive-cutover-plan",
    lastReviewedAt: "2026-03-18",
    notes: "Draft page describing rollout sequencing and rollback expectations.",
    updatedAt: "2026-03-29T11:45:00.000Z",
    updatedBy: "Priya Shah",
  },
];

export interface BookPageRepository extends RecordRepository<BookPageRecord, BookPageInput, BookPageInput> {
  listByBookId(bookId: EntityId): Promise<ListResult<BookPageRecord>>;
}

export class InMemoryBookPageRepository implements BookPageRepository {
  private items = [...initialBookPages];

  list = async (): Promise<ListResult<BookPageRecord>> => {
    return {
      items: [...this.items],
      total: this.items.length,
    };
  };

  listByBookId = async (bookId: EntityId): Promise<ListResult<BookPageRecord>> => {
    const items = this.items.filter((item) => item.bookId === bookId);
    return {
      items,
      total: items.length,
    };
  };

  getById = async (id: EntityId): Promise<BookPageRecord | null> => {
    return this.items.find((item) => item.pageId === id) ?? null;
  };

  create = async (input: BookPageInput): Promise<BookPageRecord> => {
    const created: BookPageRecord = {
      pageId: `PG-${4000 + this.items.length + 1}`,
      ...input,
      updatedAt: new Date().toISOString(),
      updatedBy: input.editorName,
    };

    this.items.unshift(created);
    return created;
  };

  update = async (id: EntityId, input: BookPageInput): Promise<BookPageRecord> => {
    const existing = this.items.find((item) => item.pageId === id);
    if (!existing) {
      throw new Error(`Book page ${id} was not found`);
    }

    const updated: BookPageRecord = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
      updatedBy: input.editorName,
    };

    this.items = this.items.map((item) => (item.pageId === id ? updated : item));
    return updated;
  };
}
