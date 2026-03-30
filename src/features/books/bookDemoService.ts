import { InMemoryAuditLogger } from "our-lib";
import { InMemoryBookRepository, initialBooks } from "@/features/books/bookRepository";
import { createBookService } from "@/features/books/bookService";
import type { BookInput, BookRecord } from "@/features/books/bookSchemas";

export const createBookDemoService = () => {
  return createBookService(new InMemoryBookRepository(), new InMemoryAuditLogger());
};

export const getBookById = (bookId: string): BookRecord | undefined => {
  return initialBooks.find((record) => record.bookId === bookId);
};

export const toBookInput = (record?: BookRecord): BookInput => {
  return {
    title: record?.title ?? "",
    status: record?.status ?? "draft",
    ownerId: record?.ownerId ?? "u-01",
    ownerName: record?.ownerName ?? "Alex Carter",
    notes: record?.notes ?? "",
  };
};
