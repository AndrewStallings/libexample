import type { EntityId, ListResult, RecordRepository } from "our-lib";
import type { BookInput, BookRecord } from "@/books/models/schemas";

export const initialBooks: BookRecord[] = [
  {
    bookId: "BK-1001",
    title: "API Standards Handbook",
    status: "published",
    ownerId: "u-01",
    ownerName: "Alex Carter",
    notes: "Main reference for internal standards.",
    updatedAt: "2026-03-28T10:00:00.000Z",
    updatedBy: "Alex Carter",
  },
  {
    bookId: "BK-1002",
    title: "Migration Runbook",
    status: "draft",
    ownerId: "u-02",
    ownerName: "Morgan Lee",
    notes: "Draft steps for archive cleanup and rollout.",
    updatedAt: "2026-03-29T15:30:00.000Z",
    updatedBy: "Morgan Lee",
  },
];

export class InMemoryBookRepository implements RecordRepository<BookRecord, BookInput, BookInput> {
  private items = [...initialBooks];

  list = async (): Promise<ListResult<BookRecord>> => {
    return {
      items: [...this.items],
      total: this.items.length,
    };
  };

  getById = async (id: EntityId): Promise<BookRecord | null> => {
    return this.items.find((item) => item.bookId === id) ?? null;
  };

  create = async (input: BookInput): Promise<BookRecord> => {
    const book: BookRecord = {
      bookId: `BK-${1000 + this.items.length + 1}`,
      ...input,
      updatedAt: new Date().toISOString(),
      updatedBy: input.ownerName,
    };

    this.items.unshift(book);
    return book;
  };

  update = async (id: EntityId, input: BookInput): Promise<BookRecord> => {
    const index = this.items.findIndex((item) => item.bookId === id);

    if (index < 0) {
      throw new Error(`Book ${id} was not found`);
    }

    const updated: BookRecord = {
      ...this.items[index],
      ...input,
      updatedAt: new Date().toISOString(),
      updatedBy: input.ownerName,
    };

    this.items[index] = updated;
    return updated;
  };
}
