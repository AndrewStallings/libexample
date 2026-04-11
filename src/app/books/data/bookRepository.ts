import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { EntityId, ListResult, RecordRepository } from "our-lib";
import type { BookInput, BookRecord } from "@/books/models/schemas";
import { booksTable } from "@/books/data/booksTable";

export type BookRepository = RecordRepository<BookRecord, BookInput, BookInput>;

type BookRow = InferSelectModel<typeof booksTable>;
type BookInsertRow = InferInsertModel<typeof booksTable>;

type BookDb = {
  select: () => {
    from: (table: typeof booksTable) => Promise<BookRow[]>;
  };
  insert: (table: typeof booksTable) => {
    values: (values: BookInsertRow) => {
      returning: () => Promise<BookRow[]>;
    };
  };
  update: (table: typeof booksTable) => {
    set: (values: Partial<BookInsertRow>) => {
      where: (condition: ReturnType<typeof eq>) => {
        returning: () => Promise<BookRow[]>;
      };
    };
  };
};

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

const toBookRecord = (row: BookRow): BookRecord => {
  return {
    bookId: row.bookId,
    title: row.title,
    status: row.status as BookRecord["status"],
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    notes: row.notes,
    updatedAt: row.updatedAt.toISOString(),
    updatedBy: row.updatedBy,
  };
};

const toBookInsertRow = (input: BookInput, bookId: string): BookInsertRow => {
  return {
    bookId,
    ...input,
    updatedAt: new Date(),
    updatedBy: input.ownerName,
  };
};

const toBookUpdateRow = (input: BookInput): Partial<BookInsertRow> => {
  return {
    ...input,
    updatedAt: new Date(),
    updatedBy: input.ownerName,
  };
};

export class InMemoryBookRepository implements BookRepository {
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

export class DbBookRepository implements BookRepository {
  constructor(private readonly db: BookDb) {}

  list = async (): Promise<ListResult<BookRecord>> => {
    const rows = await this.db.select().from(booksTable);

    return {
      items: rows.map(toBookRecord),
      total: rows.length,
    };
  };

  getById = async (id: EntityId): Promise<BookRecord | null> => {
    const rows = await this.db.select().from(booksTable);
    const row = rows.find((item) => item.bookId === id);

    return row ? toBookRecord(row) : null;
  };

  create = async (input: BookInput): Promise<BookRecord> => {
    const rows = await this.db.select().from(booksTable);
    const bookId = `BK-${1000 + rows.length + 1}`;
    const [created] = await this.db.insert(booksTable).values(toBookInsertRow(input, bookId)).returning();

    if (!created) {
      throw new Error("Failed to create book.");
    }

    return toBookRecord(created);
  };

  update = async (id: EntityId, input: BookInput): Promise<BookRecord> => {
    const [updated] = await this.db.update(booksTable).set(toBookUpdateRow(input)).where(eq(booksTable.bookId, String(id))).returning();

    if (!updated) {
      throw new Error(`Book ${id} was not found`);
    }

    return toBookRecord(updated);
  };
}
